"use client";

import { useState, useRef, useEffect } from "react";
import { Link as LinkModel } from "@prisma/client";
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
import { DashboardLinkCard } from "@/components/dashboard/DashboardLinkCard";
import { reorderLinks } from "@/app/actions/links";
import { useNotificationStore } from "@/components/ui/Notification/useNotification";

interface LinkGridProps {
  initialLinks: LinkModel[];
  view: "list" | "grid";
  readOnly?: boolean;
  allowDnD?: boolean;
  onEdit?: (id: string, formData: FormData) => void;
  onDelete?: (id: string) => void;
}

export function LinkGrid({
  initialLinks,
  view,
  readOnly = false,
  allowDnD = false,
  onEdit,
  onDelete,
}: LinkGridProps) {
  const [links, setLinks] = useState<LinkModel[]>(initialLinks);
  const { error } = useNotificationStore();

  useEffect(() => {
    setLinks(initialLinks);
  }, [initialLinks]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const reorderTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pendingReorderRef = useRef<{ id: string; order: number }[] | null>(
    null,
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
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

  const content = (
    <div
      className={
        view === "grid"
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          : "space-y-4"
      }
    >
      {links.map((link) =>
        allowDnD ? (
          <SortableItem key={link.id} id={link.id}>
            <DashboardLinkCard
              link={link}
              view={view}
              readOnly={readOnly}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          </SortableItem>
        ) : (
          <DashboardLinkCard
            key={link.id}
            link={link}
            view={view}
            readOnly={readOnly}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ),
      )}
    </div>
  );

  if (!allowDnD) {
    return content;
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={links.map((l) => l.id)}
        strategy={
          view === "grid" ? rectSortingStrategy : verticalListSortingStrategy
        }
      >
        {content}
      </SortableContext>
    </DndContext>
  );
}
