"use client";

import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui";
import { Modal } from "@/components/ui/Modal/Modal";
import { deleteAccount } from "@/app/actions/user";
import { useState } from "react";
import { User, Loader2 } from "lucide-react";

interface ProfileClientProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export function ProfileClient({ user }: ProfileClientProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteAccount();
    } catch (error) {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-linear-to-r from-white to-white/60">
          Profile Settings
        </h1>
        <p className="text-white/60 mt-2">
          Manage your account settings and preferences.
        </p>
      </div>

      <div className="space-y-6">
        {/* User Info Card */}
        <Card variant="glass" className="overflow-hidden">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-white/5 border border-white/10">
                <User className="w-5 h-5 text-purple-400" />
              </div>
              <CardTitle>Personal Information</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-1">
              <label className="text-sm font-medium text-white/40">
                Email Address
              </label>
              <div className="p-3 rounded-xl bg-black/20 border border-white/5 text-white/90 font-medium">
                {user.email}
              </div>
            </div>

            <div className="grid gap-1">
              <label className="text-sm font-medium text-white/40">
                Current Plan
              </label>
              <div className="flex items-center justify-between p-3 rounded-xl bg-linear-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20">
                <span className="text-purple-200 font-semibold">Free Plan</span>
                <span className="text-xs px-2 py-1 rounded-full bg-purple-500/20 text-purple-200 border border-purple-500/20">
                  Active
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card variant="glass" className="border-red-500/20 bg-red-500/5">
          <CardHeader>
            <CardTitle className="text-red-200">Danger Zone</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-red-200/60 mb-4">
              Once you delete your account, there is no going back. Please be
              certain.
            </p>
            <Button
              onClick={handleDeleteClick}
              disabled={isDeleting}
              className="bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border-red-500/20"
            >
              {isDeleting ? "Deleting..." : "Delete Account"}
            </Button>
          </CardContent>
        </Card>

        <Modal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          title="Delete Account"
          description="Are you sure you want to delete your account? This action cannot be undone."
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
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="bg-red-500 text-white hover:bg-red-600 border-none items-center gap-2"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Account"
              )}
            </Button>
          </div>
        </Modal>
      </div>
    </div>
  );
}
