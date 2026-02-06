"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import crypto from "crypto";
import { rateLimit, getClientIdentifier } from "@/lib/rate-limit";
import { RATE_LIMITS, RateLimitError } from "@/lib/rate-limit-shared";
import z from "zod";

export type CreatePageData = {
  alias?: string;
  title?: string;
  description?: string | null;
  links?: { title: string; url: string; image?: string }[];
  linkView?: "list" | "grid";
};

const CreatePageSchema = z.object({
  alias: z
    .string()
    .min(3)
    .max(50)
    .regex(/^[a-zA-Z0-9_-]+$/)
    .optional(),
  title: z.string().min(1).max(200),
  description: z.string().max(1000).nullable().optional(),
  links: z.array(
    z.object({
      title: z.string().min(1).max(200),
      url: z.url(),
      image: z.url().optional(),
    }),
  ),
  linkView: z.enum(["list", "grid"]).optional(),
});

const EditPageSchema = CreatePageSchema.omit({ links: true });

export async function createPage(data: CreatePageData) {
  const validatedData = CreatePageSchema.parse(data);

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
  let alias = validatedData.alias;

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
  if (session?.user && validatedData.alias && validatedData.alias === alias) {
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
        title: validatedData.title || (ownerId ? "New Page" : "Anonymous Page"),
        description: validatedData.description || null,
        ownerId,
        isPublic: true,
        type: "list",
        linkView: validatedData.linkView || "list",
        links: {
          create:
            validatedData.links?.map((link, idx) => ({
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

  const page = await prisma.page.findFirst({
    where: {
      id: pageId,
      ownerId: session.user.id,
    },
  });

  if (!page) throw new Error("Page not found");

  const isOwner = page.ownerId === session.user.id;

  if (!isOwner) {
    throw new Error("Unauthorized");
  }

  await prisma.page.delete({
    where: {
      id: pageId,
      ownerId: session.user.id,
    },
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
      }),
    ),
  );
}

export async function updatePage(
  pageId: string,
  data: {
    type?: string;
    isPublic?: boolean;
    title?: string;
    description?: string;
  },
) {
  const validatedData = EditPageSchema.parse(data);
  const session = await auth();

  const page = await prisma.page.findUnique({
    where: { id: pageId },
    include: { owner: true },
  });

  if (!page) throw new Error("Page not found");

  const isOwner = session?.user?.id && page.owner?.id === session.user.id;

  if (!isOwner) {
    throw new Error("Unauthorized");
  }

  await prisma.page.update({
    where: { id: pageId },
    data: validatedData,
  });

  revalidatePath("/dashboard");
  revalidatePath(`/${page.alias}`);
}

export async function attachAnonymousPage(pageId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const page = await prisma.page.findUnique({
    where: {
      id: pageId,
    },
  });

  if (!page) throw new Error("Page not found");

  if (page.ownerId) {
    throw new Error("Page is already owned");
  }

  await prisma.page.update({
    where: { id: pageId },
    data: { ownerId: session.user.id },
  });

  revalidatePath("/dashboard");
  revalidatePath(`/${page.alias}`);
  return { success: true };
}

export async function togglePagePublic(pageId: string, isPublic: boolean) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const page = await prisma.page.findFirst({
    where: {
      id: pageId,
      ownerId: session.user.id,
    },
  });

  if (!page) {
    throw new Error("Page not found or unauthorized");
  }

  await prisma.page.update({
    where: {
      id: pageId,
    },
    data: {
      isPublic: isPublic,
    },
  });

  // Note: We intentionally skip revalidatePath here to avoid interfering with
  // optimistic DnD reordering. The SidebarItem handles the UI update optimistically.
  return { success: true };
}

export async function updateLinkView(
  pageId: string,
  linkView: "list" | "grid",
) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const page = await prisma.page.findFirst({
    where: {
      id: pageId,
      ownerId: session.user.id,
    },
  });

  if (!page) {
    throw new Error("Page not found or unauthorized");
  }

  await prisma.page.update({
    where: {
      id: pageId,
    },
    data: {
      linkView,
    },
  });

  // Skip revalidatePath to avoid UI flicker during optimistic updates
  return { success: true };
}
