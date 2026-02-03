"use client";

import { Page, User, Link as LinkModel } from "@prisma/client";
import { PageHeader } from "@/components/PageHeader";
import { LinkGrid } from "@/components/LinkGrid";
import { useView } from "@/hooks/useView";

interface PublicPageClientProps {
  page: Page & {
    owner: User | null;
    links: LinkModel[];
  };
  isOwner: boolean;
}

export function PublicPageClient({ page, isOwner }: PublicPageClientProps) {
  const { view, ViewToggle } = useView({ defaultView: "grid" });

  return (
    <main className="relative z-10 container mx-auto px-4 py-16 md:py-24 max-w-6xl">
      <PageHeader page={page}>
        <ViewToggle />
      </PageHeader>

      <LinkGrid initialLinks={page.links} view={view} readOnly={true} />

      <footer className="mt-24 text-center text-white/40 text-sm">
        <p>© {new Date().getFullYear()} LinkHub</p>
      </footer>
    </main>
  );
}
