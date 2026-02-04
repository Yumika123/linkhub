import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { auth } from "@/auth";

import { PageStylesSchema } from "@/types/PageStyles";
import { PublicPageClient } from "./PublicPageClient";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

interface PublicPageProps {
  params: Promise<{ alias: string }>;
}

export default async function PublicPage({ params }: PublicPageProps) {
  const { alias } = await params;
  const session = await auth();

  const page = await prisma.page.findUnique({
    where: { alias },
    include: {
      owner: true,
      links: {
        where: { active: true },
        orderBy: { order: "asc" },
      },
    },
  });

  if (!page || !page.isPublic) {
    notFound();
  }

  const isOwner =
    !!session?.user?.email && session.user.email === page.owner?.email;

  const pageStyle = page.pageStyle
    ? PageStylesSchema.parse(page.pageStyle)
    : null;

  return (
    <div
      className="min-h-screen w-full relative font-sans text-white selection:bg-purple-500 selection:text-white"
      style={{ background: pageStyle?.background.color ?? undefined }}
    >
      <PublicPageClient page={page} isOwner={isOwner} />
    </div>
  );
}
