"use client";

import { useState, useEffect, useRef } from "react";
import { Link as LinkModel, Page as PageModel } from "@prisma/client";
import { Session } from "next-auth";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardLinkCard } from "@/components/dashboard/DashboardLinkCard";
import { AddLinkForm } from "@/components/AddLinkForm";
import { PageModal } from "@/components/CreatePageModal";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableItem } from "@/components/dashboard/SortableItem";

export type PageWithLinks = PageModel & {
  links: LinkModel[];
};

import { AttachPageModal } from "@/components/AttachPageModal";
import { deletePage } from "@/app/actions/pages";
import { useNotificationStore } from "@/components/ui/Notification/useNotification";
import { DeletePageModal } from "@/components/DeletePageModal";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui";
import { reorderLinks } from "@/app/actions/links";

interface DashboardClientProps {
  page: PageWithLinks;
  userPages: PageWithLinks[];
  session: Session | null;
  readOnly?: boolean;
  isOrphan?: boolean;
}

export function DashboardClient({
  page,
  userPages,
  session,
  readOnly,
  isOrphan,
}: DashboardClientProps) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [view, setView] = useState<"list" | "grid">("list");
  const [showAddForm, setShowAddForm] = useState(false);
  const [showCreatePageModal, setShowCreatePageModal] = useState(false);
  const [showEditPageModal, setShowEditPageModal] = useState(false);
  const [showAttachModal, setShowAttachModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Local state for links to support optimistic updates
  const [links, setLinks] = useState<LinkModel[]>(page.links);

  useEffect(() => {
    setLinks(page.links);
  }, [page.links]);

  useEffect(() => {
    // If we are logged in and view an orphan page, prompt to claim
    if (session?.user && isOrphan) {
      setShowAttachModal(true);
    }
  }, [session, isOrphan]);

  const { success, error } = useNotificationStore();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Require 8px movement before drag starts - prevents accidental drags on click
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Debounce timer ref for batching multiple reorders
  const reorderTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pendingReorderRef = useRef<{ id: string; order: number }[] | null>(
    null
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      // Store previous state for potential rollback
      const previousLinks = links;

      setLinks((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        const newItems = arrayMove(items, oldIndex, newIndex);

        const updates = newItems.map((item, index) => ({
          id: item.id,
          order: index,
        }));

        if (reorderTimeoutRef.current) {
          clearTimeout(reorderTimeoutRef.current);
        }

        pendingReorderRef.current = updates;

        const timeoutId = setTimeout(() => {
          const updatesToSend = pendingReorderRef.current;
          if (updatesToSend) {
            reorderLinks(updatesToSend).catch((err) => {
              console.error("Failed to reorder links:", err);
              error("Failed to save new order");
              setLinks(previousLinks);
            });
            pendingReorderRef.current = null;
          }
        }, 500);

        reorderTimeoutRef.current = timeoutId;

        return newItems;
      });
    }
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);

    // 1. Optimistic Redirect
    const remainingPages = userPages.filter((p) => p.id !== page.id);
    let targetUrl = "/"; // Default to home/landing

    if (remainingPages.length > 0) {
      // Go to the first available page
      targetUrl = `/dashboard/${remainingPages[0].alias}`;
    } else if (session?.user) {
      // If logged in but no pages left, maybe go to create or dashboard root (which handles redirection)
      // For now, home is safe
      targetUrl = "/";
    }

    // Navigate immediately
    router.push(targetUrl);

    // 2. Perform Deletion in Background
    try {
      await deletePage(page.id);
      success("Page deleted successfully", "Success");
      // Since we already navigated, we don't need to do anything else.
      // The old page component is likely unmounting.
    } catch (e: any) {
      // In the rare case navigation didn't happen fast enough or something failed drastically
      // and we are still here:
      console.error("Deletion failed", e);
      setIsDeleting(false);
      setShowDeleteModal(false);
      error(e.message || "Failed to delete page", "Error");
    }
  };

  return (
    <div className="min-h-screen w-full relative font-sans text-white selection:bg-purple-500 selection:text-white">
      {!readOnly && (
        <Sidebar
          pages={userPages}
          currentPageAlias={page.alias}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          userInfo={session?.user}
          onCreatePage={
            session?.user ? () => setShowCreatePageModal(true) : undefined
          }
        />
      )}

      <div className={`${!readOnly ? "lg:pl-64" : ""} min-h-screen`}>
        <div className="relative z-10 p-4 md:p-8">
          {readOnly && (
            <div className="bg-blue-600/20 border border-blue-400/30 text-blue-100 px-6 py-4 rounded-xl mb-8 flex items-center justify-between backdrop-blur-sm shadow-lg">
              <span className="font-medium">
                You are viewing this page in read-only mode. Sign in to claim or
                edit this page.
              </span>
              <Button
                variant="brand"
                href={`/api/auth/signin?callbackUrl=/dashboard/${page.alias}`}
                as="a"
              >
                Login / Sign Up
              </Button>
            </div>
          )}

          {!readOnly && (
            <div className="lg:hidden mb-6 flex items-center justify-between">
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

          <div className="flex justify-between items-start">
            <a
              href={`/${page.alias}`}
              target="_blank"
              className="text-sm text-blue-300 hover:text-blue-200 flex items-center gap-1 mb-6"
            >
              View Live
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" />
              </svg>
            </a>

            {!readOnly && !session?.user && (
              <div className="hidden lg:flex justify-end mb-4">
                <div className="text-sm text-white/50 italic">
                  Anonymous Mode
                </div>
              </div>
            )}
          </div>

          <DashboardHeader
            page={page}
            view={view}
            onViewChange={setView}
            onAddLink={() => setShowAddForm(!showAddForm)}
            onEditPage={() => setShowEditPageModal(true)}
            onDeletePage={
              session?.user ? () => setShowDeleteModal(true) : undefined
            }
            readOnly={readOnly}
          />

          {!readOnly && showAddForm && <AddLinkForm pageId={page.id} />}

          {links.length === 0 ? (
            <div className="text-center py-20 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl">
              <div className="text-6xl mb-4">🔗</div>
              <p className="text-white/40 text-lg mb-2">No links yet</p>
              {!readOnly && (
                <p className="text-white/30 text-sm">
                  Click the "+ Add Link" button to create your first link!
                </p>
              )}
            </div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={links.map((l) => l.id)}
                strategy={
                  view === "grid"
                    ? rectSortingStrategy
                    : verticalListSortingStrategy
                }
              >
                <div
                  className={
                    view === "grid"
                      ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                      : "space-y-4"
                  }
                >
                  {links.map((link) => (
                    <SortableItem key={link.id} id={link.id}>
                      <DashboardLinkCard link={link} view={view} />
                    </SortableItem>
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </div>
      </div>

      {!readOnly && showCreatePageModal && (
        <PageModal onClose={() => setShowCreatePageModal(false)} page={page} />
      )}

      {showAttachModal && (
        <AttachPageModal
          isOpen={showAttachModal}
          onClose={() => setShowAttachModal(false)}
          page={page}
        />
      )}

      {showEditPageModal && (
        <PageModal
          onClose={() => setShowEditPageModal(false)}
          page={page}
          isEditing
        />
      )}

      {showDeleteModal && (
        <DeletePageModal
          isOpen={showDeleteModal}
          isDeleting={isDeleting}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleConfirmDelete}
        />
      )}
    </div>
  );
}
