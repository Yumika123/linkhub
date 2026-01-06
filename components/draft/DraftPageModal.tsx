import { DraftPageForm } from "./DraftPageForm";
import { Button } from "../ui";
import { Page } from "@prisma/client";

export function DraftPageModal({
  onClose,
  page,
  setPage,
}: {
  onClose?: () => void;
  page?: Pick<Page, "title" | "description" | "alias">;
  setPage?: (page: Pick<Page, "title" | "description" | "alias">) => void;
}) {
  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in"
        onClick={onClose}
      >
        <div
          className="bg-linear-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl w-full max-w-md p-8 relative animate-in zoom-in-95"
          onClick={(e) => e.stopPropagation()}
        >
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

          <h2 className="text-2xl font-bold mb-2 text-white">Edit Page</h2>
          <p className="text-white/60 text-sm mb-6">
            Update your page details below
          </p>
          <DraftPageForm page={page} setPage={setPage} onSuccess={onClose} />
        </div>
      </div>
    </>
  );
}
