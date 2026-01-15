"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { rateLimit, getClientIdentifier } from "@/lib/rate-limit";
import { RATE_LIMITS } from "@/lib/rate-limit-shared";
import { z } from "zod";

const LinkSchema = z.object({
  pageId: z.string(),
  title: z.string().min(1).max(200),
  url: z.url(),
});

const EditLinkSchema = LinkSchema.omit({ pageId: true });

export async function createLink(formData: FormData) {
  const stringData = Object.fromEntries(formData.entries());
  const validatedData = LinkSchema.parse(stringData);
  const session = await auth();

  const identifier = await getClientIdentifier();
  await rateLimit(identifier, RATE_LIMITS.AUTH_CREATE_LINK);

  const title = validatedData.title;
  const url = validatedData.url;
  const pageId = validatedData.pageId;

  const page = await prisma.page.findUnique({
    where: {
      id: pageId,
      ownerId: session?.user?.id,
    },
  });

  if (!page) {
    throw new Error("Page not found");
  }

  const isOwner = session?.user?.id && page.ownerId === session.user.id;
  if (!isOwner) {
    throw new Error("Unauthorized");
  }

  await prisma.link.create({
    data: {
      title,
      url,
      pageId: page.id,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath(`/${page.alias}`);
}

export async function deleteLink(linkId: string) {
  const session = await auth();

  const link = await prisma.link.findFirst({
    where: {
      id: linkId,
      page: {
        owner: {
          id: session?.user?.id,
        },
      },
    },
    include: { page: { include: { owner: true } } },
  });
  if (!link) throw new Error("Unauthorized or not found");

  await prisma.link.delete({
    where: { id: link.id },
  });

  revalidatePath("/dashboard");
  revalidatePath(`/${link.page.alias}`);
}

export async function reorderLinks(items: { id: string; order: number }[]) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  if (items.length === 0) return;

  const firstLink = await prisma.link.findUnique({
    where: { id: items[0].id },
    include: { page: { include: { owner: true } } },
  });

  if (!firstLink) throw new Error("Link not found");

  const isOwner = firstLink.page.owner?.email === session.user.email;

  if (!isOwner) {
    throw new Error("Unauthorized");
  }

  await prisma.$transaction(
    items.map((item) =>
      prisma.link.update({
        where: { id: item.id },
        data: { order: item.order },
      })
    )
  );
}

export async function editLink(linkId: string, formData: FormData) {
  const stringData = Object.fromEntries(formData.entries());
  const validatedData = EditLinkSchema.parse(stringData);
  const session = await auth();

  const title = validatedData.title;
  const url = validatedData.url;

  const link = await prisma.link.findFirst({
    where: {
      id: linkId,
      page: {
        owner: {
          id: session?.user?.id,
        },
      },
    },
    include: { page: { include: { owner: true } } },
  });
  if (!link) throw new Error("Unauthorized or not found");

  await prisma.link.update({
    where: { id: linkId },
    data: { title, url },
  });

  revalidatePath("/dashboard");
  revalidatePath(`/${link.page.alias}`);
}
