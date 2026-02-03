"use client";

import { useState, useEffect } from "react";
import * as React from "react";
import { Link as LinkModel, Page as PageModel } from "@prisma/client";
import { Session } from "next-auth";
import { PageHeader } from "@/components/PageHeader";
import { AddLinkForm } from "@/components/AddLinkForm";
import { LinkGrid } from "@/components/LinkGrid";
import { AttachPageModal } from "@/components/AttachPageModal";
import { Button, StyleSidebar } from "@/components/ui";
import { Palette } from "lucide-react";
import { usePageStyles } from "@/hooks/usePageStyles";
import { useView } from "@/hooks/useView";
import { PageStyles } from "@/types/PageStyles";
import { useUIStore } from "@/store/UIStore";

export type PageWithLinks = PageModel & {
  links: LinkModel[];
};

interface DashboardClientProps {
  page: PageWithLinks;
  session: Session | null;
  readOnly?: boolean;
  isOrphan?: boolean;
}

export function DashboardClient({
  page,
  session,
  readOnly,
  isOrphan,
}: DashboardClientProps) {
  const { view, ViewToggle } = useView({ defaultView: "list" });
  const [showAddForm, setShowAddForm] = useState(false);
  const [showAttachModal, setShowAttachModal] = useState(false);

  const pageStyles = page.pageStyle as PageStyles;

  const {
    showStyleSidebar,
    isSaving,
    background,
    openStyleSidebar,
    closeStyleSidebar,
    handleBackgroundChange,
    handleSave,
    handleReset,
  } = usePageStyles({
    pageId: page.id,
    initialStyles: pageStyles,
  });

  const { setCustomBackground } = useUIStore();

  React.useLayoutEffect(() => {
    setCustomBackground(background || null);
  }, [background, setCustomBackground, page.alias]);

  useEffect(() => {
    // TODO: remove the modal and just show a notification
    // If we are logged in and view an orphan page, prompt to claim
    if (session?.user && isOrphan) {
      setShowAttachModal(true);
    }
  }, [session, isOrphan]);

  return (
    <div className="w-full relative transition-all duration-300 ease-in-out">
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
          <div className="fixed top-8 right-8 z-30">
            <Button
              onClick={openStyleSidebar}
              variant="glass"
              buttonSize="icon"
              className="flex items-center gap-2 shadow-lg"
            >
              <Palette className="w-5 h-5" />
            </Button>
          </div>
        )}
        <div className="flex justify-between items-start">
          {!readOnly && (
            <div className="hidden lg:flex flex-1 justify-end mb-4">
              {!session?.user && (
                <div className="text-sm text-white/50 italic">
                  Anonymous Mode
                </div>
              )}
            </div>
          )}
        </div>
        <PageHeader
          page={{
            ...page,
            owner: session?.user
              ? {
                  name: session.user.name || null,
                  image: session.user.image || null,
                }
              : null,
          }}
        >
          {!readOnly && (
            <>
              <Button
                onClick={() => setShowAddForm(!showAddForm)}
                variant="glass"
                className="gap-2 px-6"
                rounded="full"
              >
                Add Link
              </Button>
              <ViewToggle />
            </>
          )}
        </PageHeader>
        {!readOnly && showAddForm && <AddLinkForm pageId={page.id} />}
        {page.links.length === 0 ? (
          <div className="text-center py-20 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl">
            <div className="text-6xl mb-4">🔗</div>
            <p className="text-white/40 text-lg mb-2">No links yet</p>
            {!readOnly && (
              <p className="text-white/30 text-sm">
                Click the "Add Link" button to create your first link!
              </p>
            )}
          </div>
        ) : (
          <LinkGrid
            initialLinks={page.links}
            view={view}
            readOnly={readOnly}
            allowDnD={!readOnly}
          />
        )}
      </div>

      {showAttachModal && (
        <AttachPageModal
          isOpen={showAttachModal}
          onClose={() => setShowAttachModal(false)}
          page={page}
        />
      )}

      <StyleSidebar
        isOpen={showStyleSidebar}
        onClose={() => {
          closeStyleSidebar();
        }}
        background={background}
        onBackgroundChange={handleBackgroundChange}
        onSave={handleSave}
        onReset={handleReset}
        isSaving={isSaving}
      />
    </div>
  );
}
