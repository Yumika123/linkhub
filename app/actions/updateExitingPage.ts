"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function updatePage(
  pageId: string,
  data: {
    type?: string;
    isPublic?: boolean;
    title?: string;
    description?: string;
  }
) {
  const session = await auth();
  const cookieStore = await cookies();

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
    data,
  });

  revalidatePath("/dashboard");
  revalidatePath(`/${page.alias}`);
}
