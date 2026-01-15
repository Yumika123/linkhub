import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export type PageWithLinks = Prisma.PageGetPayload<{
  include: { links: true };
}>;

/**
 * Get user pages for authenticated users
 */
export async function getUserPages() {
  const session = await auth();

  let userPages: PageWithLinks[] = [];
  let user = null;

  if (session?.user?.id) {
    // Logged in user flow
    user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        pages: {
          include: { links: { orderBy: { order: "asc" } } },
          orderBy: [{ order: "asc" }, { createdAt: "asc" }],
        },
      },
    });
    if (user) userPages = user.pages;
  }

  return { session, userPages, user };
}

/**
 * Check if user has access (authenticated)
 */
export function hasAccess(session: any): boolean {
  return !!session?.user;
}
