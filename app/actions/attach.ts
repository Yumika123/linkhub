"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function attachAnonymousPage(pageId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const page = await prisma.page.findUnique({
    where: { id: pageId }
  });

  if (!page) throw new Error("Page not found");

  if (page.ownerId) {
      throw new Error("Page is already owned");
  }

  await prisma.page.update({
    where: { id: pageId },
    data: { ownerId: session.user.id }
  });

  revalidatePath("/dashboard");
  revalidatePath(`/${page.alias}`);
  return { success: true };
}
