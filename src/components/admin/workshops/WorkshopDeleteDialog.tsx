import Button from "@/components/Button";
import { deleteWorkshop } from "@/actions/workshop";
import { useRef, useEffect, useState } from "react";
import { toast } from "sonner";

type PropsType = {
  workshopTitle: string;
  workshopId: string | null;
  onClose: () => void;
};

const WorkshopDeleteDialog = ({
  workshopTitle,
  onClose,
  workshopId,
}: PropsType) => {
  const [loading, setLoading] = useState(false);

  const dialogRef = useRef<HTMLDialogElement>(null);

  const handleDeleteWorkshop = async () => {
    if (!workshopId) return;

    try {
      setLoading(true);

      const response = await deleteWorkshop(workshopId);

      if (response.success) {
        toast.success(response.message);
        onClose();
      }

      if (!response.success) {
        toast.error(response.message);
      }
    } catch {
      toast.error("Something went wrong while delete workshop.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    dialogRef.current?.showModal();
  }, []);

  return (
    <dialog
      ref={dialogRef}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      className="m-auto w-[calc(100%-2rem)] max-w-sm p-0 border-0 bg-transparent backdrop:bg-charcoal/60"
    >
      <div className="bg-white p-8 text-center">
        <h2 className="text-[20px] font-semibold text-charcoal mb-2">
          Delete Workshop?
        </h2>
        <p className="text-[14px] text-gray mb-7">
          &ldquo;{workshopTitle}&rdquo; will be permanently removed.
        </p>
        <div className="flex gap-3">
          <Button
            variant="danger"
            isLoading={loading}
            onClick={handleDeleteWorkshop}
            className="flex-1"
          >
            Delete
          </Button>
          <Button
            variant="soft"
            onClick={onClose}
            disabled={loading}
            className="flex-1"
          >
            Cancel
          </Button>
        </div>
      </div>
    </dialog>
  );
};

export default WorkshopDeleteDialog;
