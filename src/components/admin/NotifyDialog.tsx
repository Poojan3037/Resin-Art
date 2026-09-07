"use client";

import Button from "@/components/Button";
import { notifySubscribers } from "@/actions/subscriber";
import type { NotifyTargetType } from "@/types/subscriber";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

type PropsType = {
  target: NotifyTargetType;
  itemTitle: string;
  subscriberCount: number;
  /** Set when this item has already been announced, so we can warn. */
  lastNotifiedAt: string | null;
  onClose: () => void;
  onSent: () => void;
};

const formatDate = (iso: string) =>
  new Intl.DateTimeFormat("en-CA", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(iso));

/**
 * Confirmation step for a bulk announcement. Sending mail to the whole list is
 * not undoable, so the admin sees the recipient count and any previous send
 * before committing.
 */
const NotifyDialog = ({
  target,
  itemTitle,
  subscriberCount,
  lastNotifiedAt,
  onClose,
  onSent,
}: PropsType) => {
  const [loading, setLoading] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const handleNotify = async () => {
    try {
      setLoading(true);

      const response = await notifySubscribers(target);

      if (response.success) {
        toast.success(response.message);
        onSent();
        onClose();
      } else {
        toast.error(response.message);
      }
    } catch {
      toast.error("Something went wrong while sending the announcement.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    dialogRef.current?.showModal();
  }, []);

  const hasSubscribers = subscriberCount > 0;

  return (
    <dialog
      ref={dialogRef}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      className="m-auto w-[calc(100%-2rem)] max-w-md p-0 border-0 bg-transparent backdrop:bg-charcoal/60"
    >
      <div className="bg-white p-8">
        <h2 className="text-[20px] font-semibold text-charcoal mb-2">
          Notify subscribers?
        </h2>

        <p className="text-[14px] text-gray mb-4">
          {hasSubscribers ? (
            <>
              An announcement for &ldquo;{itemTitle}&rdquo; will be emailed to{" "}
              <span className="font-semibold text-charcoal">
                {subscriberCount} subscriber{subscriberCount === 1 ? "" : "s"}
              </span>
              . This cannot be undone.
            </>
          ) : (
            <>
              There are no subscribers on the list yet, so there is nobody to
              notify.
            </>
          )}
        </p>

        {lastNotifiedAt && (
          <p className="text-[13px] text-charcoal bg-gold/10 border-l-4 border-gold px-4 py-3 mb-5">
            Already announced on {formatDate(lastNotifiedAt)}. Sending again
            will email everyone a second time.
          </p>
        )}

        <div className="flex gap-3">
          <Button
            variant="primary"
            isLoading={loading}
            disabled={!hasSubscribers}
            onClick={handleNotify}
            className="flex-1"
          >
            Send Announcement
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

export default NotifyDialog;
