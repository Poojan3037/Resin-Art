"use client";

import Button from "@/components/Button";
import { Workshop } from "@/types/workshop";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import {
  formatWorkshopDate,
  formatWorkshopTime,
} from "@/lib/workshop-time-formatter";
import { useState, useRef } from "react";
import { useQueryState } from "nuqs";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import WorkshopBookingDialog from "./WorkshopBookingDialog";

gsap.registerPlugin(ScrollTrigger);

type PropsType = {
  workshop: Workshop;
  index: number;
};

const WorkshopCard = ({ workshop, index }: PropsType) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { user, loading } = useAuth();
  const [selectedWorkshop, setSelectedWorkshop] = useState<Workshop | null>(
    null,
  );
  const [bookParam, setBookParam] = useQueryState("book");

  // Returning from the login detour with `?book=<workshopId>` re-opens the
  // dialog for the workshop the visitor originally tried to book.
  const isAutoOpenTarget = bookParam === workshop.id;
  const dialogWorkshop = selectedWorkshop ?? (isAutoOpenTarget ? workshop : null);

  const closeDialog = () => {
    setSelectedWorkshop(null);
    if (isAutoOpenTarget) setBookParam(null);
  };

  const handleBookNow = () => {
    if (loading) return;
    if (!user) {
      router.push(
        `/login?redirect=${encodeURIComponent(`/workshops?book=${workshop.id}`)}`,
      );
      return;
    }
    setSelectedWorkshop(workshop);
  };

  useGSAP(
    () => {
      gsap.from(".wcard", {
        opacity: 0,
        y: 60,
        duration: 0.75,
        delay: index * 0.1,
        ease: "expo.out",
        scrollTrigger: {
          trigger: ".wcard",
          start: "top 90%",
          once: true,
        },
      });
    },
    { scope: cardRef },
  );

  const timeLabel = formatWorkshopTime({
    startTime: workshop.startTime,
    startPeriod: workshop.startPeriod,
    endTime: workshop.endTime,
    endPeriod: workshop.endPeriod,
  });
  const dateLabel = formatWorkshopDate(workshop.date);

  return (
    <>
      {dialogWorkshop && (
        <WorkshopBookingDialog workshop={dialogWorkshop} onClose={closeDialog} />
      )}
      <div ref={cardRef}>
        <div className="wcard border border-light-gray bg-white p-8 transition-all hover:border-gold h-full">
          <div className="flex justify-between items-center mb-5">
            <span
              className={
                workshop.availableSeats <= 3
                  ? "bg-amber-100 text-amber-700 text-[11px] px-3 py-1 uppercase tracking-widest font-semibold"
                  : "bg-teal-50 text-teal text-[11px] px-3 py-1 uppercase tracking-widest font-semibold"
              }
            >
              {workshop.availableSeats} seats left
            </span>

            <span className="text-gold text-[24px] font-extrabold">
              ${workshop.price}
            </span>
          </div>
          <h3 className=" text-[22px] font-semibold text-charcoal mb-2 leading-[1.3]">
            {workshop.title}
          </h3>
          <p className="text-charcoal mb-4 leading-[1.2]">
            {workshop.description}
          </p>
          <div className="flex flex-col gap-2 mb-7">
            {[
              ["📅", dateLabel],
              ["🕐", timeLabel],
              ["📍", workshop.location],
            ].map(([ic, val]) => (
              <div key={val} className="flex gap-2.5 items-center">
                <span className="text-[13px]">{ic}</span>
                <span className="text-[14px] text-gray ">{val}</span>
              </div>
            ))}
          </div>

          {/* Sold out banner — sits between info and button */}
          {workshop.availableSeats === 0 && (
            <div className="flex items-center gap-2 border border-red-200 bg-red-50 px-4 py-2.5 mb-4">
              <span className="text-red-500 text-sm">⛔</span>
              <span className="text-red-600 text-[12px] uppercase tracking-widest font-semibold">
                Sold Out — No seats available
              </span>
            </div>
          )}

          <Button
            variant="primary"
            fullWidth
            onClick={handleBookNow}
            className="font-extrabold"
            disabled={workshop.availableSeats === 0}
          >
            Book Now
          </Button>
        </div>
      </div>
    </>
  );
};

export default WorkshopCard;
