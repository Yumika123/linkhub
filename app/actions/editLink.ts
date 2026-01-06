"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function editLink(linkId: string, formData: FormData) {
  const session = await auth();
  const cookieStore = await cookies();
  const editToken = cookieStore.get("linkhub_edit_token")?.value;

  const title = formData.get("title") as string;
  const url = formData.get("url") as string;

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

  await prisma.link.update({
    where: { id: linkId },
    data: { title, url },
  });

  revalidatePath("/dashboard");
  revalidatePath(`/${link.page.alias}`);
}
