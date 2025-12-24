import Link from "next/link"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { CreatePageForm } from "@/components/CreatePageForm"

export default async function Home() {
  const session = await auth()

  if (session?.user) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-black p-8 text-center">
      <main className="max-w-2xl space-y-8">
        <div className="space-y-4">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-7xl">
            Linkhub
          </h1>
          <p className="text-xl text-gray-500 sm:text-2xl">
            One link for everything. Share your links, social media profiles, and more with a single URL.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <CreatePageForm className="w-full sm:w-auto" isAuthenticated={false} />

          <span className="text-gray-400">or</span>

          <Link
            href="/api/auth/signin"
            className="px-8 py-3 rounded-full border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors text-lg"
          >
            Sign In
          </Link>
        </div>
        <p className="text-sm text-gray-500 max-w-md mx-auto">
          Create an anonymous page instantly, or sign in to manage multiple pages and custom aliases.
        </p>
      </main>

      <footer className="absolute bottom-8 text-gray-400 text-sm">
        © {new Date().getFullYear()} Linkhub. Built with Next.js & Prisma.
      </footer>
    </div>
  )
}
