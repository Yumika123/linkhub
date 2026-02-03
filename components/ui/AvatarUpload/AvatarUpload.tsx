"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui";
import { Modal } from "@/components/ui/Modal/Modal";
import { useNotificationStore } from "@/components/ui/Notification/useNotification";
import { Upload, X, Loader2, Camera } from "lucide-react";
import { cn } from "@/lib/utils";

interface AvatarUploadProps {
  currentAvatar?: string | null;
  altText: string;
  isEditable: boolean;
  size?: "md" | "lg"; // md = w-24 (96px), lg = w-32 (128px)
  onUpload: (file: File) => Promise<void>;
  onDelete: () => Promise<void>;
  className?: string;
}

export function AvatarUpload({
  currentAvatar,
  altText,
  isEditable,
  size = "lg",
  onUpload,
  onDelete,
  className,
}: AvatarUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    currentAvatar || null,
  );

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { error } = useNotificationStore();

  useEffect(() => {
    setPreviewUrl(currentAvatar || null);
  }, [currentAvatar]);

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      error("File too large. Maximum size is 5MB", "Error");
      return;
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      error("Invalid file type. Use JPEG, PNG, WebP or GIF", "Error");
      return;
    }

    // Local preview (optimistic)
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    setIsUploading(true);
    try {
      await onUpload(file);
    } catch (err: any) {
      console.error("Upload error:", err);
      error(err.message || "Upload failed", "Error");
      // Revert preview
      setPreviewUrl(currentAvatar || null);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete();
      setPreviewUrl(null);
    } catch (err: any) {
      console.error("Delete error:", err);
      // Don't clear preview if failed
      error(err.message || "Delete failed", "Error");
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const handleClick = () => {
    if (isEditable) {
      fileInputRef.current?.click();
    }
  };

  const sizeClasses = size === "lg" ? "w-32 h-32" : "w-24 h-24";
  const iconSize = size === "lg" ? "w-8 h-8" : "w-6 h-6";

  return (
    <>
      <div className={cn("relative group", className)}>
        <div
          className={cn(
            "relative rounded-full bg-white/20 backdrop-blur-md p-1 shadow-2xl ring-4 ring-white/10 overflow-hidden transition-transform duration-300",
            sizeClasses,
            isEditable ? "cursor-pointer hover:scale-105" : "cursor-default",
          )}
          onClick={handleClick}
        >
          {previewUrl ? (
            <Image
              src={previewUrl}
              alt={altText}
              fill
              className="rounded-full object-cover"
              priority
            />
          ) : (
            <div className="w-full h-full rounded-full bg-white/10 flex items-center justify-center font-bold text-white bg-linear-to-br from-purple-500 to-blue-500">
              <span className={size === "lg" ? "text-4xl" : "text-3xl"}>
                {altText.charAt(0).toUpperCase()}
              </span>
            </div>
          )}

          {(isUploading || isDeleting) && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-full z-20">
              <Loader2 className={cn("text-white animate-spin", iconSize)} />
            </div>
          )}

          {isEditable && !isUploading && !isDeleting && (
            <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10 transition-all duration-200">
              <Camera className={cn("text-white/80", iconSize)} />
            </div>
          )}
        </div>

        {isEditable && previewUrl && !isUploading && !isDeleting && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteClick();
            }}
            className="absolute top-0 -right-2 p-1.5 bg-red-500 hover:bg-red-600 rounded-full text-white opacity-0 group-hover:opacity-100 transition-all shadow-lg z-30 transform hover:scale-110"
            title="Remove image"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleFileSelect}
        className="hidden"
      />

      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Remove Image"
        description="Are you sure you want to remove this image? This action cannot be undone."
      >
        <div className="flex justify-end gap-3 mt-4">
          <Button
            variant="ghost"
            onClick={() => setShowDeleteModal(false)}
            className="text-white/60 hover:text-white"
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            onClick={confirmDelete}
            disabled={isDeleting}
            className="bg-red-500 text-white hover:bg-red-600 border-none items-center gap-2"
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Removing...
              </>
            ) : (
              "Remove"
            )}
          </Button>
        </div>
      </Modal>
    </>
  );
}
