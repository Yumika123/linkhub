"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { PageStylesSchema, PageStyles } from "@/types/PageStyles";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function getCustomPageStyles(
  pageId?: string
): Promise<PageStyles | null> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return null;
    }

    if (!pageId) {
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: {
          pages: {
            take: 1,
            orderBy: { order: "asc" },
          },
        },
      });

      if (!user || user.pages.length === 0) {
        return null;
      }
      pageId = user.pages[0].id;
    }

    const page = await prisma.page.findUnique({
      where: {
        id: pageId,
        ownerId: session.user.id,
      },
    });

    if (!page || !page.pageStyle) {
      return null;
    }

    const style = PageStylesSchema.parse(page.pageStyle);

    return style;
  } catch (error) {
    return null;
  }
}

export async function getCustomPageStylesByAlias(
  alias: string
): Promise<PageStyles | null> {
  try {
    const page = await prisma.page.findUnique({
      where: { alias },
    });

    if (!page || !page.pageStyle) {
      return null;
    }

    const style = PageStylesSchema.parse(page.pageStyle);

    return style;
  } catch (error) {
    return null;
  }
}

export async function updateCustomPageStyles(
  data: PageStyles,
  pageId?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    const page = await prisma.page.update({
      where: {
        id: pageId,
        ownerId: session.user.id,
      },
      data: { pageStyle: data },
    });

    if (!page) {
      throw new Error("Page not found");
    }

    // Revalidate paths to clear cache
    revalidatePath("/dashboard");
    revalidatePath(`/dashboard/${page.alias}`);
    revalidatePath(`/${page.alias}`);

    return { success: true };
  } catch (error) {
    return { success: false, error: `Failed to update style: ${error}` };
  }
}

export async function deleteCustomPageStyles(
  pageId?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    const page = await prisma.page.update({
      where: {
        id: pageId,
        ownerId: session.user.id,
      },
      data: { pageStyle: Prisma.DbNull },
    });

    // Revalidate paths to clear cache
    revalidatePath("/dashboard");
    revalidatePath(`/dashboard/${page.alias}`);
    revalidatePath(`/${page.alias}`);

    return { success: true };
  } catch (error) {
    return { success: false, error: `Failed to reset style: ${error}` };
  }
}
