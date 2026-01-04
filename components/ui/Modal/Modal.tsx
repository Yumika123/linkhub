"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "../Button/button";
import { cva } from "class-variance-authority";

const ModalVariants = cva("", {
  variants: {
    variant: {
      glass:
        "bg-linear-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl w-full max-w-md p-8 relative animate-in zoom-in-95 leading-normal",
    },
  },
});

interface ModalProps {
  isOpen: boolean;
  onClose?: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  showCloseButton?: boolean;
  variant?: "glass";
}

export function Modal({
  isOpen,
  variant = "glass",
  onClose,
  title,
  description,
  children,
  showCloseButton = true,
}: ModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in"
      onClick={onClose}
    >
      <div
        className={ModalVariants({ variant: variant ?? "glass" })}
        onClick={(e) => e.stopPropagation()}
      >
        {showCloseButton && onClose && (
          <Button
            onClick={onClose}
            variant="ghost"
            buttonSize="icon"
            className="absolute top-6 right-6"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </Button>
        )}

        {title && (
          <h2 className="text-2xl font-bold mb-2 text-white">{title}</h2>
        )}
        {description && (
          <p className="text-white/60 text-sm mb-6">{description}</p>
        )}
        {children}
      </div>
    </div>,
    document.body
  );
}
