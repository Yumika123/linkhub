"use client";

import { PageWithLinks } from "@/lib/auth-helpers";
import { Button, SidebarItem, Logo, UserProfile } from "../ui";
import { SortableItem } from "@/components/dashboard/SortableItem";
import { reorderPages } from "@/app/actions/pages";
import { useEffect, useRef, useState } from "react";
import { Page } from "@prisma/client";
import {
  useSensors,
  useSensor,
  PointerSensor,
  KeyboardSensor,
  DragEndEvent,
  DndContext,
  closestCenter,
} from "@dnd-kit/core";
import {
  sortableKeyboardCoordinates,
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

interface SidebarProps {
  pages: PageWithLinks[];
  currentPageAlias: string;
  isOpen: boolean;
  onClose: () => void;
  userInfo?: {
    name?: string | null;
    image?: string | null;
  } | null;
  onCreatePage?: () => void;
}

export function Sidebar({
  pages,
  currentPageAlias,
  isOpen,
  onClose,
  userInfo,
  onCreatePage,
}: SidebarProps) {
  // Local state for pages to support optimistic updates
  const [reorderedPages, setReorderedPages] = useState<Page[]>(pages);

  useEffect(() => {
    setReorderedPages(pages);
  }, [pages]);

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
      const previousPages = reorderedPages;

      setReorderedPages((items) => {
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
            reorderPages(updatesToSend).catch((err) => {
              console.error("Failed to reorder pages:", err);
              // error("Failed to save new order");
              setReorderedPages(previousPages);
            });
            pendingReorderRef.current = null;
          }
        }, 500);

        reorderTimeoutRef.current = timeoutId;

        return newItems;
      });
    }
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
                    fixed top-0 left-0 h-full w-64 bg-linear-to-b from-blue-900/40 to-purple-900/40 backdrop-blur-xl border-r border-white/10 z-50
                    transform transition-transform duration-300 ease-in-out
                    ${isOpen ? "translate-x-0" : "-translate-x-full"}
                    lg:translate-x-0
                `}
      >
        <div className="flex flex-col h-full p-6">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <Logo />
            {/* Close button for mobile */}
            <Button
              onClick={onClose}
              variant="ghost"
              buttonSize="icon"
              className="lg:hidden ml-auto"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </Button>
          </div>

          {/* Create New Page Button */}
          {onCreatePage && (
            <Button
              variant="glass"
              onClick={onCreatePage}
              className="w-full mb-6"
            >
              Create New Page
            </Button>
          )}

          {/* Pages List */}
          <div className="grow overflow-y-auto custom-scrollbar">
            <div className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">
              Your Pages
            </div>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={pages.map((page) => page.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-2">
                  {pages.map((page) => (
                    <SortableItem key={page.id} id={page.id}>
                      <SidebarItem
                        key={page.id}
                        label={page.title}
                        sublabel={`/${page.alias}`}
                        badge={page.links.length}
                        isActive={page.alias === currentPageAlias}
                        href={`/dashboard/${page.alias}`}
                      />
                    </SortableItem>
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </div>

          {/* User Profile */}
          {userInfo && (
            <div className="mt-6 pt-6 border-t border-white/10">
              <UserProfile
                name={userInfo.name || "User"}
                image={userInfo.image}
                subtitle="Linkhub"
              />
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
