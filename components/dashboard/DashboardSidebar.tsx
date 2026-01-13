"use client";

import { PageWithLinks } from "@/lib/auth-helpers";
import { Button, SidebarItem, Logo, Sidebar } from "../ui";
import { SortableItem } from "@/components/dashboard/SortableItem";
import { UserMenu } from "./UserMenu";
import { reorderPages } from "@/app/actions/pages";
import { useEffect, useRef, useState } from "react";
import {
  useSensors,
  useSensor,
  MouseSensor,
  TouchSensor,
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
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { X } from "lucide-react";

interface DashboardSidebarProps {
  pages: PageWithLinks[];
  currentPageAlias: string;
  isOpen: boolean;
  onClose: () => void;
  userInfo?: {
    name?: string | null;
    image?: string | null;
  } | null;
  onCreatePage?: () => void;
  className?: string;
}

export function DashboardSidebar({
  pages,
  currentPageAlias,
  isOpen,
  onClose,
  userInfo,
  onCreatePage,
  className,
}: DashboardSidebarProps) {
  const [reorderedPages, setReorderedPages] = useState<PageWithLinks[]>(pages);

  useEffect(() => {
    const sortedPages = [...pages].sort(
      (a, b) => (a.order ?? 0) - (b.order ?? 0)
    );
    setReorderedPages(sortedPages);
  }, [pages]);

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const reorderTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pendingReorderRef = useRef<{ id: string; order: number }[] | null>(
    null
  );

  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    // A small delay before allowing clicks again
    setTimeout(() => {
      setIsDragging(false);
    }, 100);

    if (over && active.id !== over.id) {
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

  const Header = (
    <div className="p-6 pb-0">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Logo />
        </div>
        {/* Close button for mobile */}
        <Button
          onClick={onClose}
          variant="ghost"
          buttonSize="icon"
          className="lg:hidden text-white/70 hover:text-white"
        >
          <X className="w-6 h-6" />
        </Button>
      </div>

      {onCreatePage && (
        <Button variant="glass" onClick={onCreatePage} className="w-full mb-6">
          Create New Page
        </Button>
      )}
    </div>
  );

  const Footer = userInfo ? (
    <div className="p-6 pt-0 mt-auto">
      <div className="pt-6 border-t border-white/10">
        <UserMenu user={userInfo} />
      </div>
    </div>
  ) : null;

  return (
    <Sidebar
      isOpen={isOpen}
      onClose={onClose}
      position="left"
      mode="slide"
      className={className}
      header={Header}
      footer={Footer}
    >
      <div className="p-6 pt-0">
        <div className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">
          Your Pages
        </div>
        <DndContext
          id="sidebar-dnd-context"
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          onDragStart={handleDragStart}
          modifiers={[restrictToVerticalAxis]}
        >
          <SortableContext
            items={reorderedPages.map((page) => page.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-2">
              {reorderedPages.map((page) => (
                <SortableItem key={page.id} id={page.id}>
                  <SidebarItem
                    key={page.id}
                    label={page.title}
                    sublabel={`/${page.alias}`}
                    badge={page.links.length}
                    isActive={page.alias === currentPageAlias}
                    href={`/dashboard/${page.alias}`}
                    isDragging={isDragging}
                  />
                </SortableItem>
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>
    </Sidebar>
  );
}
