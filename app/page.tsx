import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { GradientBackground } from "@/components/GradientBackground";
import { Button } from "@/components/ui";

export default async function Home() {
  const session = await auth();

  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen w-full relative font-sans text-white selection:bg-purple-500 selection:text-white flex flex-col items-center justify-center p-8 text-center">
      <GradientBackground />

      <main className="relative z-10 max-w-2xl space-y-8 animate-float">
        <div className="space-y-4">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-7xl drop-shadow-lg">
            Linkhub
          </h1>
          <p className="text-xl text-blue-100/80 sm:text-2xl max-w-2xl mx-auto font-light leading-relaxed">
            One link for everything. Share your links, social media profiles,
            and more with a single URL.
          </p>
        </div>

        <div className="glass-card p-8 rounded-3xl flex flex-col sm:flex-row gap-6 justify-center items-center backdrop-blur-md bg-white/5 border-white/10">
          <Button
            as="link"
            href="/create"
            variant="gradient"
            className="flex gap-2"
          >
            Create Anonymous Page
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Button>

          <span className="text-white/40 font-medium">or</span>

          <Button as="link" href="/api/auth/signin" variant="glass">
            Sign In
          </Button>
        </div>
        <p className="text-sm text-blue-200/60 max-w-md mx-auto">
          Create an anonymous page instantly, or sign in to manage multiple
          pages and custom aliases.
        </p>
      </main>

      <footer className="absolute bottom-8 text-blue-200/40 text-sm">
        © {new Date().getFullYear()} Linkhub.
      </footer>
    </div>
  );
}
