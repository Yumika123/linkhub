"use client";

import { useState } from "react";
import { Link as LinkModel, Page as PageModel } from "@prisma/client";
import { Session } from "next-auth";
import { GradientBackground } from "@/components/GradientBackground";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardLinkCard } from "@/components/dashboard/DashboardLinkCard";
import { AddLinkForm } from "@/components/AddLinkForm";
import { SignOutButton } from "@/components/SignOutButton";
import { CreatePageModal } from "@/components/CreatePageModal";

type PageWithLinks = PageModel & {
  links: LinkModel[];
  _count?: {
    links: number;
  };
};

interface DashboardClientProps {
  page: PageWithLinks;
  userPages: PageWithLinks[];
  session: Session | null;
}

import { Button } from "@/components/ui";

export function DashboardClient({
  page,
  userPages,
  session,
}: DashboardClientProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [view, setView] = useState<"list" | "grid">("list");
  const [showAddForm, setShowAddForm] = useState(false);
  const [showCreatePageModal, setShowCreatePageModal] = useState(false);

  return (
    <div className="min-h-screen w-full relative font-sans text-white selection:bg-purple-500 selection:text-white">
      <GradientBackground />

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

      <div className="lg:pl-64 min-h-screen">
        <div className="relative z-10 p-4 md:p-8">
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

          <a
            href={`/${page.alias}`}
            target="_blank"
            className="text-sm text-blue-300 hover:text-blue-200 flex items-center gap-1"
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

          <div className="hidden lg:flex justify-end mb-4">
            {session?.user ? (
              // TODO: Move sign out button into a dropdown menu
              <SignOutButton />
            ) : (
              // TODO: Move text into user area
              <div className="text-sm text-white/50 italic">Anonymous Mode</div>
            )}
          </div>

          <DashboardHeader
            pageTitle="Personal Links"
            pageAlias={page.alias}
            pageUrl={`linkhub.com/${page.alias}`}
            view={view}
            onViewChange={setView}
            onAddLink={() => setShowAddForm(!showAddForm)}
          />

          {showAddForm && <AddLinkForm pageId={page.id} />}

          {page.links.length === 0 ? (
            <div className="text-center py-20 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl">
              <div className="text-6xl mb-4">🔗</div>
              <p className="text-white/40 text-lg mb-2">No links yet</p>
              <p className="text-white/30 text-sm">
                Click the "+ Add Link" button to create your first link!
              </p>
            </div>
          ) : (
            <div
              className={
                view === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  : "space-y-4"
              }
            >
              {page.links.map((link) => (
                <div key={link.id} className="relative group">
                  <DashboardLinkCard link={link} view={view} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showCreatePageModal && session?.user && (
        <CreatePageModal onClose={() => setShowCreatePageModal(false)} />
      )}
    </div>
  );
}
