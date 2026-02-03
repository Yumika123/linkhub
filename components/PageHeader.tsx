"use client";

import { Page, User } from "@prisma/client";
import { Button } from "./ui";
import { Copy, Check } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";

interface PageHeaderProps {
  page: Pick<Page, "title" | "description" | "alias"> & {
    owner?: Pick<User, "name" | "image"> | null;
  };
  children?: React.ReactNode;
}

export function PageHeader({ page, children }: PageHeaderProps) {
  const [origin, setOrigin] = useState("");
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(`${origin}/${page.alias}`);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="flex flex-col items-center text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-md p-1 mb-6 shadow-2xl ring-4 ring-white/10 relative">
        {page.owner?.image ? (
          <Image
            src={page.owner.image}
            alt={page.owner.name || page.alias}
            fill
            className="rounded-full object-cover"
          />
        ) : (
          <div className="w-full h-full rounded-full bg-white/10 flex items-center justify-center text-3xl font-bold text-white">
            {(page.owner?.name?.[0] || page.alias[0]).toUpperCase()}
          </div>
        )}
      </div>

      <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight drop-shadow-lg bg-clip-text text-transparent bg-linear-to-r from-white via-blue-100 to-purple-200">
        {page.title}
      </h1>

      <p className="text-lg text-blue-100/80 max-w-2xl leading-relaxed mb-6 font-light">
        {page.description ||
          "Manage and organize your links for this page. Share this collection with the world."}
      </p>

      <div className="flex items-center gap-2 text-sm text-white/40 mb-8 bg-white/5 px-4 py-2 rounded-full border border-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors">
        <a
          href={`${origin}/${page.alias}`}
          target="_blank"
          className="hover:text-white transition-colors flex items-center gap-1.5"
        >
          <span>{`${origin}/${page.alias}`}</span>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="opacity-60"
          >
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" />
          </svg>
        </a>
        <div className="w-px h-4 bg-white/10 mx-1" />
        <button
          onClick={handleCopy}
          className="p-1 hover:bg-white/20 rounded-md text-white/60 hover:text-white transition-all"
          title="Copy link"
        >
          {isCopied ? (
            <Check className="w-3.5 h-3.5 text-green-400" />
          ) : (
            <Copy className="w-3.5 h-3.5" />
          )}
        </button>
      </div>

      {children && (
        <div className="flex flex-wrap items-center justify-center gap-3 w-full">
          {children}
        </div>
      )}
    </div>
  );
}
