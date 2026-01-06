import { DraftPageForm } from "./DraftPageForm";
import { Modal } from "../ui/Modal/Modal";
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
    <Modal
      isOpen={true}
      onClose={onClose}
      title="Edit Page"
      description="Update your page details below"
    >
      <DraftPageForm page={page} setPage={setPage} onSuccess={onClose} />
    </Modal>
  );
}
