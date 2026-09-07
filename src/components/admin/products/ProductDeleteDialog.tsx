import Button from "@/components/Button";
import { deleteProduct } from "@/actions/product";
import { useRef, useEffect, useState } from "react";
import { toast } from "sonner";

type PropsType = {
  productTitle: string;
  productId: string | null;
  onClose: () => void;
  onDeleted: () => void;
};

const ProductDeleteDialog = ({
  productTitle,
  productId,
  onClose,
  onDeleted,
}: PropsType) => {
  const [loading, setLoading] = useState(false);

  const dialogRef = useRef<HTMLDialogElement>(null);

  const handleDeleteProduct = async () => {
    if (!productId) return;

    try {
      setLoading(true);

      const response = await deleteProduct(productId);

      if (response.success) {
        toast.success(response.message);
        onDeleted();
        onClose();
      }

      if (!response.success) {
        toast.error(response.message);
      }
    } catch {
      toast.error("Something went wrong while deleting product.");
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
          Delete Product?
        </h2>
        <p className="text-[14px] text-gray mb-7">
          &ldquo;{productTitle}&rdquo; will be permanently removed.
        </p>
        <div className="flex gap-3">
          <Button
            variant="danger"
            isLoading={loading}
            onClick={handleDeleteProduct}
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

export default ProductDeleteDialog;
