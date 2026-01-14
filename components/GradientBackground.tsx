"use client";

import { useUIStore } from "@/store/UIStore";

export function GradientBackground() {
  const { customBackground } = useUIStore();

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none select-none">
      <div
        className="absolute inset-0 bg-linear-to-br from-violet-600 via-blue-500 to-purple-600 animate-gradient-xy transform-gpu"
        style={{
          backgroundSize: "400% 400%",
          // Override default gradient if custom background is set
          background: customBackground || undefined,
        }}
      />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.15] brightness-100 contrast-120 mix-blend-soft-light"></div>
    </div>
  );
}
