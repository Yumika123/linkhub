"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createLink(formData: FormData) {
  const session = await auth();

  const title = formData.get("title") as string;
  const url = formData.get("url") as string;
  const pageId = formData.get("pageId") as string;

  // Verify that page owner is the same as the session user
  const page = await prisma.page.findUnique({
    where: { id: pageId },
    include: { owner: true },
  });

  if (!page) throw new Error("Page not found");

  const isOwner =
    session?.user?.email && page.owner?.email === session.user.email;

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

  const link = await prisma.link.findUnique({
    where: { id: linkId },
    include: { page: { include: { owner: true } } },
  });

  if (!link) throw new Error("Link not found");

  const isOwner =
    session?.user?.email && link.page.owner?.email === session.user.email;

  if (!isOwner) {
    throw new Error("Unauthorized");
  }

  await prisma.link.delete({
    where: { id: link.id },
  });

  revalidatePath("/dashboard");
  revalidatePath(`/${link.page.alias}`);
}
