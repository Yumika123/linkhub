"use client";

import { Page, User, Link as LinkModel } from "@prisma/client";
import { PageHeader } from "@/components/PageHeader";
import { LinkGrid } from "@/components/LinkGrid";

interface PublicPageClientProps {
  page: Page & {
    owner: User | null;
    links: LinkModel[];
  };
  isOwner: boolean;
  linkView: "list" | "grid";
}

export function PublicPageClient({
  page,
  isOwner,
  linkView,
}: PublicPageClientProps) {
  return (
    <main className="relative z-10 container mx-auto px-4 py-16 md:py-24 max-w-6xl">
      <PageHeader page={page} />

      <LinkGrid initialLinks={page.links} view={linkView} readOnly={true} />

      <footer className="mt-24 text-center text-white/40 text-sm">
        <p>© {new Date().getFullYear()} LinkHub</p>
      </footer>
    </main>
  );
}
