"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardLinkCard } from "@/components/dashboard/DashboardLinkCard";
import { AddLinkForm } from "@/components/AddLinkForm";
import { Button } from "@/components/ui";
import { createPage } from "@/app/actions/pages";
import { useNotificationStore } from "@/components/ui/Notification/useNotification";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
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

type ClientPage = Pick<Page, "title" | "description" | "alias">;

type ClientLink = {
  title: string;
  url: string;
  // properties needed for DashboardLinkCard but faked
  id: string;
  image: string | null;
  target: string;
  createdAt: Date;
  updatedAt: Date;
  pageId: string;
  order: number;
  active: boolean;
};

import { Page } from "@prisma/client";
import { DraftPageModal } from "@/components/draft/DraftPageModal";
import { generateId } from "@/lib/generate-uuid";
import { RateLimitError } from "@/lib/rate-limit-shared";

export default function CreatePage() {
  const router = useRouter();
  const { error } = useNotificationStore();

  const [page, setPage] = useState<ClientPage>({
    title: "My Anonymous Page",
    description: "Welcome to my new page!",
    alias: generateId(),
  });
  const [links, setLinks] = useState<ClientLink[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [view, setView] = useState<"list" | "grid">("list");
  const [isPublishing, setIsPublishing] = useState(false);

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
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setLinks((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        const newItems = arrayMove(items, oldIndex, newIndex);

        return newItems.map((item, index) => ({
          ...item,
          order: index,
        }));
      });
    }
  };

  const handleAddLink = (newLink: { title: string; url: string }) => {
    const link: ClientLink = {
      ...newLink,
      id: generateId(),
      image: null,
      target: "_blank",
      createdAt: new Date(),
      updatedAt: new Date(),
      pageId: page.alias,
      order: links.length,
      active: true,
    };
    setLinks([...links, link]);
    setShowAddForm(false);
  };

  const handleEditPage = () => {
    setShowEditForm(true);
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      const result = await createPage({
        title: page.title,
        description: page.description,
        linkView: view,
        links: links.map((l, index) => ({
          title: l.title,
          url: l.url,
          image: l.image ?? undefined,
          order: index,
        })),
      });

      if (result.success && result.alias) {
        router.push(`/dashboard/${result.alias}`);
      } else if (result.isRateLimit) {
        error(
          `Rate limit exceeded. Please try again in ${result.retryAfter} seconds.`,
        );
      } else {
        error("Failed to publish: " + (result.error || "Unknown error"));
      }
    } catch (e) {
      console.error(e);
      error("Error publishing page");
    } finally {
      setIsPublishing(false);
    }
  };

  // TODO: add possibility to change page title and description
  // TODO: remove possibility to activate/deactivate links on /create page

  return (
    <div className="min-h-screen w-full relative font-sans text-white selection:bg-purple-500 selection:text-white">
      <div className="container mx-auto px-4 py-8 max-w-5xl relative z-10">
        <div className="flex justify-between items-center mb-8 bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10">
          <div>
            <h1 className="text-2xl font-bold mb-1">Create Anonymous Page</h1>
            <p className="text-white/60 text-sm">
              Design your page. It won't be saved until you publish.
            </p>
          </div>
          <div className="flex gap-4">
            <Button variant="ghost" href="/">
              Cancel
            </Button>
            <Button
              variant="brand"
              onClick={handlePublish}
              disabled={isPublishing}
            >
              {isPublishing ? "Publishing..." : "Save & Publish"}
            </Button>
          </div>
        </div>

        <div className="bg-black/20 rounded-3xl p-8 border border-white/5 min-h-[600px]">
          <div className="uppercase tracking-widest text-xs font-bold text-white/30 mb-6 text-center">
            Preview Mode
          </div>

          <div className="max-w-3xl mx-auto">
            <DashboardHeader
              page={page}
              view={view}
              onViewChange={setView}
              onAddLink={() => setShowAddForm(true)}
            />

            {showAddForm && (
              <AddLinkForm
                onAdd={handleAddLink}
                onClose={() => setShowAddForm(false)}
              />
            )}

            {showEditForm && (
              <DraftPageModal
                onClose={() => setShowEditForm(false)}
                page={page}
                setPage={setPage}
              />
            )}

            {links.length === 0 ? (
              <div className="text-center py-10 text-white/30 italic">
                No links added yet.
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
                        <DashboardLinkCard
                          link={link}
                          view={view}
                          onDelete={(id) =>
                            setLinks(links.filter((l) => l.id !== id))
                          }
                          onEdit={(id, formData) => {
                            const updatedLink = {
                              ...link,
                              title: formData.get("title") as string,
                              url: formData.get("url") as string,
                              image: formData.get("image") as string,
                            };
                            setLinks(
                              links.map((l) => (l.id === id ? updatedLink : l)),
                            );
                          }}
                        />
                      </SortableItem>
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
