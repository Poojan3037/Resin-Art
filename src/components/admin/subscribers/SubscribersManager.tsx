"use client";

import Button from "@/components/Button";
import SubscriberDeleteDialog from "./SubscriberDeleteDialog";
import type { SubscriberType } from "@/types/subscriber";
import { useRouter } from "next/navigation";
import { useQueryState, debounce } from "nuqs";
import { useState } from "react";
import { toast } from "sonner";

type PropsType = {
  subscribers: SubscriberType[];
  /** Total on the list, independent of the active search filter. */
  totalCount: number;
};

const dateFormatter = new Intl.DateTimeFormat("en-CA", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

const sourceLabelMap: Record<string, string> = {
  workshops: "Workshops page",
  shop: "Shop page",
};

const SubscribersManager = ({ subscribers, totalCount }: PropsType) => {
  const router = useRouter();

  const [search, setSearch] = useQueryState("search", {
    defaultValue: "",
    limitUrlUpdates: debounce(500),
    shallow: false,
  });

  const [deleteTarget, setDeleteTarget] = useState<SubscriberType | null>(null);

  const handleCopyAll = async () => {
    if (subscribers.length === 0) return;

    const emails = subscribers.map((subscriber) => subscriber.email).join(", ");

    try {
      await navigator.clipboard.writeText(emails);
      toast.success(
        `Copied ${subscribers.length} email${subscribers.length === 1 ? "" : "s"} to the clipboard.`,
      );
    } catch {
      toast.error("Could not access the clipboard.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      <div className="mb-8">
        <span className="text-[11px] tracking-[0.22em] uppercase text-gold">
          Manage
        </span>
        <h1 className="text-[clamp(28px,4vw,44px)] font-semibold text-charcoal mt-1">
          Subscribers
        </h1>
        <p className="text-[13px] text-gray mt-1">
          {totalCount} subscriber{totalCount === 1 ? "" : "s"} on the notify
          list
        </p>
      </div>

      <div className="bg-white border border-light-gray p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
          <Button
            type="button"
            variant="soft"
            onClick={handleCopyAll}
            disabled={subscribers.length === 0}
            className="sm:w-auto w-full"
          >
            Copy All Emails
          </Button>

          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by email..."
            className="px-4 py-2 border border-light-gray bg-cream text-[14px] w-full sm:w-70"
          />
        </div>

        {subscribers.length === 0 ? (
          <p className="text-gray text-[14px] py-8 text-center">
            {search
              ? `No subscribers match "${search}".`
              : "Nobody has signed up yet. The notify form appears on the workshops and shop pages when there is nothing to show."}
          </p>
        ) : (
          <div className="space-y-3">
            {subscribers.map((subscriber) => (
              <div
                key={subscriber.id}
                className="border border-light-gray p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
              >
                <div>
                  <p className="text-[15px] font-semibold text-charcoal break-all">
                    {subscriber.email}
                  </p>
                  <p className="text-[12px] text-gray mt-0.5">
                    Joined {dateFormatter.format(new Date(subscriber.createdAt))}
                    {subscriber.source
                      ? ` · ${sourceLabelMap[subscriber.source] ?? subscriber.source}`
                      : ""}
                  </p>
                </div>
                <Button
                  variant="danger"
                  onClick={() => setDeleteTarget(subscriber)}
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {deleteTarget ? (
        <SubscriberDeleteDialog
          subscriberId={deleteTarget.id}
          subscriberEmail={deleteTarget.email}
          onClose={() => setDeleteTarget(null)}
          onDeleted={router.refresh}
        />
      ) : null}
    </div>
  );
};

export default SubscribersManager;
