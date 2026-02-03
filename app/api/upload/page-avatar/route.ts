import { auth } from "@/auth";
import { v2 as cloudinary } from "cloudinary";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const pageId = formData.get("pageId") as string | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!pageId) {
      return NextResponse.json(
        { error: "Page ID is required" },
        { status: 400 },
      );
    }

    const page = await prisma.page.findUnique({
      where: { id: pageId },
      select: { ownerId: true },
    });

    if (!page || page.ownerId !== session.user.id) {
      return NextResponse.json(
        { error: "Not authorized to edit this page" },
        { status: 403 },
      );
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Use JPEG, PNG, WebP or GIF" },
        { status: 400 },
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 5MB" },
        { status: 400 },
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result = await new Promise<{
      secure_url: string;
      public_id: string;
    }>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "linkhub/pages",
          public_id: `page_${pageId}_${Date.now()}`,
          resource_type: "image",
          transformation: [
            { width: 400, height: 400, crop: "fill" },
            { quality: "auto:good" },
            { format: "webp" },
          ],
          overwrite: true,
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result as { secure_url: string; public_id: string });
        },
      );

      uploadStream.end(buffer);
    });

    return NextResponse.json({
      url: result.secure_url,
      publicId: result.public_id,
    });
  } catch (error: any) {
    console.error("Page avatar upload error:", error);
    return NextResponse.json(
      { error: error.message || "Upload failed" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const publicId = searchParams.get("publicId");

    if (!publicId) {
      return NextResponse.json(
        { error: "No publicId provided" },
        { status: 400 },
      );
    }

    const parts = publicId.split("/");
    const filename = parts[parts.length - 1];
    const pageId = filename.split("_")[1];

    if (pageId) {
      const page = await prisma.page.findUnique({
        where: { id: pageId },
        select: { ownerId: true },
      });

      if (!page || page.ownerId !== session.user.id) {
        return NextResponse.json(
          { error: "Not authorized to delete this image" },
          { status: 403 },
        );
      }
    }

    await cloudinary.uploader.destroy(publicId);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Page avatar delete error:", error);
    return NextResponse.json(
      { error: error.message || "Delete failed" },
      { status: 500 },
    );
  }
}
