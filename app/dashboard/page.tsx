import { redirect } from "next/navigation";
import { getUserPages, hasAccess } from "@/lib/auth-helpers";
import { CreatePageForm } from "@/components/page/CreatePageForm";
import { SignOutButton } from "@/components/SignOutButton";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui";

export default async function DashboardPage() {
  const { session, userPages } = await getUserPages();

  if (!hasAccess(session)) {
    redirect("/");
  }

  // If logged-in user has no pages, show create form
  if (session?.user && userPages.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
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
            <CreatePageForm isAuthenticated={!!session?.user} />
          </CardContent>
          {session && (
            <CardFooter>
              <SignOutButton />
            </CardFooter>
          )}
        </Card>
      </div>
    );
  }

  // Redirect to first page with alias-based URL
  redirect(`/dashboard/${userPages[0].alias}`);
}
