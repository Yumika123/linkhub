"use client";

import { useState, useEffect } from "react";
import { DashboardSidebar } from "./DashboardSidebar";
import { useParams } from "next/navigation";
import { PageWithLinks } from "@/lib/auth-helpers";
import { Button } from "@/components/ui";
import { PageModal } from "@/components/CreatePageModal";
import { useUIStore } from "@/store/UIStore";

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
    </div>
  );
}
