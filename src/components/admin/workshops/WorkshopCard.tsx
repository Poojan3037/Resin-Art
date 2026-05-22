import Button from "@/components/Button";
import {
  formatWorkshopDate,
  formatWorkshopTime,
} from "@/lib/workshop-time-formatter";
import { Workshop } from "@/types/workshop";
import Link from "next/link";

type PropsType = {
  workshop: Workshop;
  onEdit: () => void;
  onDelete: () => void;
};

const WorkshopCard = ({ workshop, onEdit, onDelete }: PropsType) => {
  const timeLabel = formatWorkshopTime({
    startTime: workshop.startTime,
    startPeriod: workshop.startPeriod,
    endTime: workshop.endTime,
    endPeriod: workshop.endPeriod,
  });
  const dateLabel = formatWorkshopDate(workshop.date);

  return (
    <div className="bg-white border border-light-gray hover:border-gold transition-all duration-300 p-7 flex flex-col">
      {/* Seats badge + price */}
      <div className="flex justify-between items-center mb-5">
        <span
          className={
            workshop.availableSeats <= 3
              ? "bg-amber-100 text-amber-700 text-[11px] px-3 py-1 uppercase tracking-widest font-semibold"
              : "bg-teal-50 text-teal text-[11px] px-3 py-1 uppercase tracking-widest font-semibold"
          }
        >
          {workshop.availableSeats} seats
        </span>
        <span className="text-gold text-[22px] font-extrabold">
          ${Number(workshop.price)}
        </span>
      </div>

      <h3 className="text-[19px] font-semibold text-charcoal mb-4 leading-[1.3]">
        {workshop.title}
      </h3>

      <p className="text-charcoal mb-4 leading-[1.2]">{workshop.description}</p>

      <div className="flex flex-col gap-2 mb-7 flex-1">
        {(
          [
            ["📅", dateLabel],
            ["🕐", timeLabel],
            ["📍", workshop.location],
          ] as [string, string][]
        ).map(([icon, value]) => (
          <div key={icon} className="flex gap-2.5 items-center">
            <span className="text-[13px]">{icon}</span>
            <span className="text-[13px] text-gray">{value}</span>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-2">
        <Link
          href={`/admin/workshops/${workshop.id}`}
          className="text-center bg-navy/10 text-navy border border-navy/20 py-2.5 text-[12px] tracking-[0.12em] uppercase font-semibold hover:bg-navy hover:text-white transition-all duration-300"
        >
          View Registrations
        </Link>
        <div className="flex gap-2">
          <Button
            variant="primary"
            size="sm"
            className="flex-1"
            onClick={onEdit}
          >
            Edit
          </Button>
          <Button
            variant="soft"
            size="sm"
            className="flex-1 text-pink border-blush hover:bg-blush-light"
            onClick={onDelete}
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WorkshopCard;
