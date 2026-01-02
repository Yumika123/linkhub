import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { GradientBackground } from "@/components/GradientBackground";
import { LinkCard } from "@/components/LinkCard";
import Image from "next/image";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

interface PublicPageProps {
  params: Promise<{ alias: string }>;
}

export default async function PublicPage({ params }: PublicPageProps) {
  const { alias } = await params;

  const page = await prisma.page.findUnique({
    where: { alias },
    include: {
      owner: true,
      links: {
        orderBy: { order: "asc" },
      },
    },
  });

  if (!page || !page.isPublic) {
    notFound();
  }

  return (
    <div className="min-h-screen w-full relative font-sans text-white selection:bg-purple-500 selection:text-white">
      <GradientBackground />

      <main className="relative z-10 container mx-auto px-4 py-16 md:py-24 max-w-6xl">
        <div className="flex flex-col items-center text-center mb-20 animate-float">
          <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-md p-1 mb-8 shadow-2xl ring-4 ring-white/10 relative">
            {page.owner?.image ? (
              <Image
                src={page.owner.image}
                alt={page.owner.name || alias}
                fill
                className="rounded-full object-cover"
              />
            ) : (
              <div className="w-full h-full rounded-full bg-white/10 flex items-center justify-center text-3xl font-bold">
                {(page.owner?.name?.[0] || alias[0]).toUpperCase()}
              </div>
            )}
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight drop-shadow-lg">
            {page.title || alias}
          </h1>

          <p className="text-lg md:text-xl text-blue-100/80 max-w-2xl leading-relaxed mb-10 font-light">
            {page.description || "Check out my links and resources."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {page.links.map((link, index) => (
            <LinkCard
              key={link.id}
              title={link.title}
              description="" // TODO: Add link description
              image={link.image}
              href={link.url}
              delay={index * 100}
            />
          ))}
        </div>

        <footer className="mt-24 text-center text-white/40 text-sm">
          <p>© {new Date().getFullYear()} LinkHub</p>
        </footer>
      </main>
    </div>
  );
}
