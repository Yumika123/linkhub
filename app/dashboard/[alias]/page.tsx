import { redirect } from "next/navigation";
import { getUserPages } from "@/lib/auth-helpers";
import { DashboardClient } from "./DashboardClient";

interface DashboardPageProps {
  params: Promise<{ alias: string }>;
}

export default async function DashboardAliasPage({
  params,
}: DashboardPageProps) {
  const { alias } = await params;
  const { session, userPages } = await getUserPages();

  let page = userPages.find((p) => p.alias === alias);
  let isOrphan = false;
  let readOnly = false;

  if (!page) {
    const { prisma } = await import("@/lib/prisma");
    const foundPage = await prisma.page.findUnique({
      where: { alias },
      include: {
        links: { orderBy: { order: "asc" } },
        owner: true,
      },
    });

    if (foundPage) {
      page = foundPage;

      if (!foundPage.ownerId) {
        isOrphan = true;
      }

      if (!session?.user?.id || foundPage.owner?.id !== session.user.id) {
        readOnly = true;
      }
    }
  }

  // If still no page, redirect
  if (!page) {
    if (userPages.length > 0) {
      redirect(`/dashboard/${userPages[0].alias}`);
    } else {
      // If we are anonymous and page doesn't exist, go to home page
      redirect("/");
    }
  }

  return (
    <DashboardClient
      key={page.id}
      page={page}
      session={session}
      readOnly={readOnly}
      isOrphan={isOrphan}
    />
  );
}
