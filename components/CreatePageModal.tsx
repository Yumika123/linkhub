import { CreatePageForm } from "./page/CreatePageForm";
import { EditPageForm } from "./page/EditPageForm";
import { Modal } from "./ui/Modal/Modal";
import { Page } from "@prisma/client";

export function PageModal({
  onClose,
  page,
  isEditing,
}: {
  onClose?: () => void;
  page?: Pick<Page, "id" | "title" | "description" | "alias">;
  isEditing?: boolean;
}) {
  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={isEditing ? "Edit Page" : "Create New Page"}
      description={
        isEditing
          ? "Update your page details below"
          : "Choose a custom alias for your new page"
      }
    >
      {isEditing ? (
        <EditPageForm isAuthenticated={true} page={page} onSuccess={onClose} />
      ) : (
        <CreatePageForm
          isAuthenticated={true}
          page={page}
          onSuccess={onClose}
        />
      )}
    </Modal>
  );
}
