import { redirect } from "next/navigation";
import {
  getUserPages,
  hasAccess,
  hasValidAnonymousPage,
} from "@/lib/auth-helpers";
import { CreatePageForm } from "@/components/CreatePageForm";
import { SignOutButton } from "@/components/SignOutButton";
import { GradientLayout } from "@/components/layouts/GradientLayout";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui";

export default async function DashboardPage() {
  const { session, userPages, editToken } = await getUserPages();

  // Require either session or anon token
  if (!hasAccess(session, editToken)) {
    redirect("/");
  }

  // Anonymous users MUST have a valid page (editToken must match a page in DB)
  if (hasValidAnonymousPage(session, userPages)) {
    redirect("/");
  }

  // If logged-in user has no pages, show create form
  if (session?.user && userPages.length === 0) {
    return (
      <GradientLayout centered>
        <Card
          variant="glass"
          padding="lg"
          rounded="3xl"
          className="max-w-md w-full"
        >
          <CardHeader>
            <CardTitle className="text-3xl">Welcome to Linkhub!</CardTitle>
            <CardDescription className="text-blue-100/80 text-base mt-2">
              Create your first page to get started with your new profile.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CreatePageForm
              isAuthenticated={!!session?.user}
              variant="primary"
            />
          </CardContent>
          {session && (
            <CardFooter>
              <SignOutButton />
            </CardFooter>
          )}
        </Card>
      </GradientLayout>
    );
  }

  // Redirect to first page with alias-based URL
  redirect(`/dashboard/${userPages[0].alias}`);
}
