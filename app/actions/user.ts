"use server";

import { auth, signOut } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function deleteAccount() {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) {
    throw new Error("User not found");
  }

  await prisma.user.delete({
    where: { id: user.id },
  });

  await signOut({ redirect: true, redirectTo: "/" });
}
