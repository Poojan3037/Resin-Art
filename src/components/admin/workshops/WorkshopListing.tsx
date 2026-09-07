import Link from "next/link";
import Button from "@/components/Button";
import {
  formatWorkshopDate,
  formatWorkshopTime,
} from "@/lib/workshop-time-formatter";
import type { Workshop } from "@/types/workshop";
import type { WorkshopStatus } from "../../../../prisma/generated/prisma/client";

const statusColorMap: Record<WorkshopStatus, string> = {
  UPCOMING: "text-green-600",
  ONGOING: "text-teal",
  COMPLETED: "text-gray",
  CANCELLED: "text-red-500",
};

const statusLabelMap: Record<WorkshopStatus, string> = {
  UPCOMING: "Upcoming",
  ONGOING: "Ongoing",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

const getStatusColor = (status: WorkshopStatus) =>
  statusColorMap[status] ?? "text-gray";

const formatWorkshopStatus = (status: WorkshopStatus) =>
  statusLabelMap[status] ?? status;

type WorkshopListingPropsType = {
  workshops: Workshop[];
  search: string;
  onSearchChange: (value: string) => void;
  onAdd: () => void;
  onEdit: (workshop: Workshop) => void;
  onDeleteRequest: (workshop: Workshop) => void;
  onNotifyRequest: (workshop: Workshop) => void;
};

const WorkshopListing = ({
  workshops,
  search,
  onSearchChange,
  onAdd,
  onEdit,
  onDeleteRequest,
  onNotifyRequest,
}: WorkshopListingPropsType) => {
  return (
    <div className="bg-white border border-light-gray p-5 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
        <Button type="button" onClick={onAdd} className="sm:w-auto w-full">
          Add Workshop
        </Button>

        <input
          type="text"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search workshops..."
          className="px-4 py-2 border border-light-gray bg-cream text-[14px] w-full sm:w-70"
        />
      </div>

      <div>
        <div className="flex justify-between items-center mb-4 gap-3">
          <h2 className="text-[20px] font-semibold text-charcoal">
            Workshop List
          </h2>
        </div>

        {workshops.length === 0 ? (
          <p className="text-gray text-[14px] py-8 text-center">
            No workshops found.
          </p>
        ) : (
          <div className="space-y-3">
            {workshops.map((workshop) => {
              const timeLabel = formatWorkshopTime({
                startTime: workshop.startTime,
                startPeriod: workshop.startPeriod,
                endTime: workshop.endTime,
                endPeriod: workshop.endPeriod,
              });
              const dateLabel = formatWorkshopDate(workshop.date);
              const canNotify =
                workshop.showToUsers && workshop.status === "UPCOMING";

              return (
                <div
                  key={workshop.id}
                  className="border border-light-gray p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
                >
                  <div>
                    <p className="text-[16px] font-semibold text-charcoal">
                      {workshop.title}
                    </p>
                    <p className="text-[12px] text-gray">
                      {dateLabel} · {timeLabel} · {workshop.location} ·{" "}
                      <span
                        className={`font-medium ${getStatusColor(workshop.status)}`}
                      >
                        {formatWorkshopStatus(workshop.status)}
                      </span>
                    </p>
                    <p className="text-[14px] text-gold font-semibold mt-1">
                      ${Number(workshop.price)} ·{" "}
                      <span className="text-charcoal font-normal">
                        {workshop.availableSeats} seats left
                      </span>
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Link
                      href={`/admin/workshops/${workshop.id}`}
                      className="inline-flex items-center px-4 py-2 text-[12px] tracking-[0.08em] uppercase font-semibold bg-navy/10 text-navy border border-navy/20 hover:bg-navy hover:text-white transition-all duration-300"
                    >
                      Registrations
                    </Link>
                    {canNotify && (
                      <Button
                        variant="outline"
                        onClick={() => onNotifyRequest(workshop)}
                      >
                        {workshop.lastNotifiedAt ? "Notify Again" : "Notify"}
                      </Button>
                    )}
                    <Button variant="soft" onClick={() => onEdit(workshop)}>
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => onDeleteRequest(workshop)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkshopListing;
