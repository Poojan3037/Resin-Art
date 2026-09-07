"use client";

import Button from "@/components/Button";
import { deleteSubscriber } from "@/actions/subscriber";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

type PropsType = {
  subscriberId: string;
  subscriberEmail: string;
  onClose: () => void;
  onDeleted: () => void;
};

const SubscriberDeleteDialog = ({
  subscriberId,
  subscriberEmail,
  onClose,
  onDeleted,
}: PropsType) => {
  const [loading, setLoading] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const handleDelete = async () => {
    try {
      setLoading(true);

      const response = await deleteSubscriber(subscriberId);

      if (response.success) {
        toast.success(response.message);
        onDeleted();
        onClose();
      } else {
        toast.error(response.message);
      }
    } catch {
      toast.error("Something went wrong while removing the subscriber.");
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
          Remove Subscriber?
        </h2>
        <p className="text-[14px] text-gray mb-7 break-all">
          {subscriberEmail} will no longer receive announcements.
        </p>
        <div className="flex gap-3">
          <Button
            variant="danger"
            isLoading={loading}
            onClick={handleDelete}
            className="flex-1"
          >
            Remove
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

export default SubscriberDeleteDialog;
