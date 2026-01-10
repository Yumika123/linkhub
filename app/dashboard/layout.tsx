import { getUserPages } from "@/lib/auth-helpers";
import { DashboardLayoutClient } from "@/components/dashboard/DashboardLayoutClient";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { session, userPages } = await getUserPages();

  return (
    <DashboardLayoutClient userPages={userPages} user={session?.user}>
      {children}
    </DashboardLayoutClient>
  );
}
