import { auth } from "@/auth";
import { getUserPages } from "@/lib/auth-helpers";
import { redirect } from "next/navigation";
import { ProfileClient } from "@/components/profile/ProfileClient";
import { DashboardLayoutClient } from "@/components/dashboard/DashboardLayoutClient";

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }

  const { userPages } = await getUserPages();

  return (
    <DashboardLayoutClient userPages={userPages} user={session.user}>
      <ProfileClient user={session.user} />
    </DashboardLayoutClient>
  );
}
