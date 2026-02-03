"use client";

import { useState, useEffect } from "react";
import { DashboardSidebar } from "./DashboardSidebar";
import { useParams, useRouter } from "next/navigation";
import { PageWithLinks } from "@/lib/auth-helpers";
import { Button } from "@/components/ui";
import { PageModal } from "@/components/CreatePageModal";
import { useUIStore } from "@/store/UIStore";
import { DeletePageModal } from "@/components/DeletePageModal";
import { deletePage } from "@/app/actions/pages";
import { useNotificationStore } from "@/components/ui/Notification/useNotification";

interface DashboardLayoutClientProps {
  children: React.ReactNode;
  userPages: PageWithLinks[];
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  } | null;
}

export function DashboardLayoutClient({
  children,
  userPages,
  user,
}: DashboardLayoutClientProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showCreatePageModal, setShowCreatePageModal] = useState(false);
  const [editingPage, setEditingPage] = useState<PageWithLinks | null>(null);
  const [deletingPage, setDeletingPage] = useState<PageWithLinks | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const router = useRouter();
  const { success, error } = useNotificationStore();

  const params = useParams();
  const alias = params.alias as string;

  const { isStyleSidebarOpen, setCustomBackground } = useUIStore();
  const isLoggedUser = user !== null && user !== undefined;
  const isSidebarVisible = !isStyleSidebarOpen;

  // Cleanup background when leaving dashboard layout
  useEffect(() => {
    return () => {
      setCustomBackground(null);
    };
  }, [setCustomBackground]);

  return (
    <div className="min-h-screen w-full relative font-sans text-white selection:bg-purple-500 selection:text-white">
      {isLoggedUser && (
        <DashboardSidebar
          pages={userPages}
          currentPageAlias={alias}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          userInfo={user}
          onCreatePage={() => setShowCreatePageModal(true)}
          onEditPage={(page) => setEditingPage(page)}
          onDeletePage={(page) => setDeletingPage(page)}
          className={
            isSidebarVisible ? "lg:translate-x-0" : "lg:-translate-x-full"
          }
        />
      )}

      <div
        className={`${isLoggedUser && isSidebarVisible ? "lg:pl-64" : ""} ${
          isStyleSidebarOpen ? "lg:pr-[420px]" : ""
        } min-h-screen transition-[padding] duration-300 ease-in-out`}
      >
        {isLoggedUser && isSidebarVisible && (
          <div className="lg:hidden p-4 absolute top-0 left-0 z-20">
            <Button
              onClick={() => setSidebarOpen(true)}
              variant="glass"
              buttonSize="icon"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M3 12h18M3 6h18M3 18h18" />
              </svg>
            </Button>
          </div>
        )}
        {children}
      </div>

      {showCreatePageModal && (
        <PageModal onClose={() => setShowCreatePageModal(false)} />
      )}

      {editingPage && (
        <PageModal
          onClose={() => setEditingPage(null)}
          page={editingPage}
          isEditing
        />
      )}

      {deletingPage && (
        <DeletePageModal
          isOpen={true}
          isDeleting={isDeleting}
          onClose={() => setDeletingPage(null)}
          onConfirm={async () => {
            if (!deletingPage) return;
            setIsDeleting(true);

            // Optimistic Redirect if needed
            if (deletingPage.alias === alias) {
              const remainingPages = userPages.filter(
                (p) => p.id !== deletingPage.id
              );
              let targetUrl = "/";
              if (remainingPages.length > 0) {
                targetUrl = `/dashboard/${remainingPages[0].alias}`;
              }
              router.push(targetUrl);
            }

            try {
              await deletePage(deletingPage.id);
              success("Page deleted successfully", "Success");
              setDeletingPage(null);
            } catch (e: any) {
              console.error("Deletion failed", e);
              error(e.message || "Failed to delete page", "Error");
            } finally {
              setIsDeleting(false);
            }
          }}
        />
      )}
    </div>
  );
}
