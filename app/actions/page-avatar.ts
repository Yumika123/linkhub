"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function updatePageAvatar(
  pageId: string,
  imageUrl: string,
  publicId?: string | null,
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    const page = await prisma.page.findUnique({
      where: { id: pageId },
      select: { ownerId: true, image: true, imagePublicId: true, alias: true },
    });

    if (!page || page.ownerId !== session.user.id) {
      return { success: false, error: "Not authorized" };
    }

    await prisma.page.update({
      where: { id: pageId },
      data: {
        image: imageUrl,
        imagePublicId: publicId,
      },
    });

    if (page.image && page.image.includes("cloudinary")) {
      const oldPublicId = page.imagePublicId;

      if (oldPublicId) {
        await cloudinary.uploader.destroy(oldPublicId);
      }
    }

    revalidatePath(`/dashboard/${page.alias}`);
    revalidatePath(`/${page.alias}`);

    return { success: true };
  } catch (error: any) {
    console.error("Update page avatar error:", error);
    return {
      success: false,
      error: error.message || "Failed to update page avatar",
    };
  }
}

export async function deletePageAvatar(pageId: string) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    const page = await prisma.page.findUnique({
      where: { id: pageId },
      select: { ownerId: true, alias: true, image: true, imagePublicId: true },
    });

    if (!page || page.ownerId !== session.user.id) {
      return { success: false, error: "Not authorized" };
    }

    await prisma.page.update({
      where: { id: pageId },
      data: {
        image: null,
        imagePublicId: null,
      },
    });

    if (page.imagePublicId) {
      await cloudinary.uploader.destroy(page.imagePublicId);
    }

    revalidatePath(`/dashboard/${page.alias}`);
    revalidatePath(`/${page.alias}`);

    return { success: true };
  } catch (error: any) {
    console.error("Delete page avatar error:", error);
    return {
      success: false,
      error: error.message || "Failed to delete page avatar",
    };
  }
}
