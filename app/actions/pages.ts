"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import crypto from "crypto";
import { rateLimit, getClientIdentifier } from "@/lib/rate-limit";
import { RATE_LIMITS, RateLimitError } from "@/lib/rate-limit-shared";

export type CreatePageData = {
  alias?: string;
  title?: string;
  description?: string | null;
  links?: { title: string; url: string; image?: string }[];
};

export async function createPage(data: CreatePageData) {
  const session = await auth();
  const identifier = await getClientIdentifier();
  const limitConfig = session?.user
    ? RATE_LIMITS.AUTH_CREATE_PAGE
    : RATE_LIMITS.ANON_CREATE_PAGE;

  try {
    await rateLimit(identifier, limitConfig);
  } catch (e) {
    if (e instanceof RateLimitError) {
      return {
        error: e.message,
        isRateLimit: true,
        retryAfter: e.retryAfter,
      };
    }
    throw e;
  }

  // 1. Alias Generation/Validation
  let alias = data.alias;

  if (!session?.user) {
    // Anonymous: always UUID
    alias = crypto.randomUUID();
  } else {
    // Logged in: use provided or fallback to UUID
    if (!alias || alias.trim() === "") {
      alias = crypto.randomUUID();
    }
  }

  if (!alias) return { error: "Alias generation failed" };

  // Validate custom alias for logged in users
  if (session?.user && data.alias && data.alias === alias) {
    if (alias.length < 3)
      return { error: "Alias must be at least 3 characters" };
    if (alias.length > 50)
      return { error: "Alias must be at most 50 characters" };
    const aliasRegex = /^[a-zA-Z0-9_-]+$/;
    if (!aliasRegex.test(alias)) return { error: "Invalid alias format" };

    const existing = await prisma.page.findUnique({ where: { alias } });
    if (existing) return { error: "Alias already taken" };
  }

  // 2. Owner Resolution
  let ownerId: string | null = null;
  if (session?.user?.id) {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });
    if (user) ownerId = user.id;
  }

  // 3. Create Page & Links Transaction
  // We use a transaction or nested create
  let order = 0;
  if (ownerId) {
    // For authenticated users, get the max order of their pages
    const maxOrderPage = await prisma.page.findFirst({
      where: { ownerId },
      orderBy: { order: "desc" },
      select: { order: true },
    });
    order = (maxOrderPage?.order ?? -1) + 1;
  }

  try {
    const newPage = await prisma.page.create({
      data: {
        alias,
        title: data.title || (ownerId ? "New Page" : "Anonymous Page"),
        description: data.description || null,
        ownerId,
        isPublic: true,
        type: "list",
        links: {
          create:
            data.links?.map((link, idx) => ({
              title: link.title,
              url: link.url,
              image: link.image,
              order: idx,
            })) || [],
        },
        order,
      },
    });

    revalidatePath("/dashboard");
    return { success: true, alias: newPage.alias };
  } catch (error) {
    console.error("Failed to create page:", error);
    return { error: "Failed to create page" };
  }
}

export async function deletePage(pageId: string) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const page = await prisma.page.findUnique({
    where: { id: pageId },
    include: { owner: true },
  });

  if (!page) throw new Error("Page not found");

  const isOwner = page.owner?.email === session.user.email;

  if (!isOwner) {
    throw new Error("Unauthorized");
  }

  await prisma.page.delete({
    where: { id: pageId },
  });

  revalidatePath("/dashboard");
}

export async function reorderPages(items: { id: string; order: number }[]) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  if (items.length === 0) return;

  const firstPage = await prisma.page.findUnique({
    where: { id: items[0].id },
    include: { owner: true },
  });

  if (!firstPage) throw new Error("Page not found");

  const isOwner = firstPage.owner?.email === session.user.email;

  if (!isOwner) {
    throw new Error("Unauthorized");
  }

  await prisma.$transaction(
    items.map((item) =>
      prisma.page.update({
        where: { id: item.id },
        data: { order: item.order },
      })
    )
  );
}
