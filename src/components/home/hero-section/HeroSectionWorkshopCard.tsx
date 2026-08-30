import Link from "next/link";
import { motion } from "framer-motion";

import { Workshop } from "@/types/workshop";
import {
  formatWorkshopDate,
  formatWorkshopTime,
} from "@/lib/workshop-time-formatter";
import {
  normalizeOffset,
  resolveCardTransform,
} from "@/lib/workshop-3d-helper";

const ACCENTS = [
  {
    dot: "#c9a84c",
    tagBg: "rgba(201,168,76,0.18)",
    tagColor: "#e8d5a0",
    glow: "#c9a84c",
  },
  {
    dot: "#2a7c74",
    tagBg: "rgba(42,124,116,0.18)",
    tagColor: "#5ba8a0",
    glow: "#2a7c74",
  },
  {
    dot: "#d4829a",
    tagBg: "rgba(212,130,154,0.18)",
    tagColor: "#f0b8cc",
    glow: "#d4829a",
  },
  {
    dot: "#7e6bbf",
    tagBg: "rgba(126,107,191,0.18)",
    tagColor: "#c7bcf0",
    glow: "#7e6bbf",
  },
];

type PropsType = {
  workshop: Workshop;
  rawOffset: number;
  previousRawOffset: number;
  total: number;
  accentIdx: number;
  onClick: () => void;
};

const HeroSectionWorkshopCard = ({
  workshop,
  rawOffset,
  previousRawOffset,
  total,
  accentIdx,
  onClick,
}: PropsType) => {
  const t = resolveCardTransform(rawOffset, total);
  const accent = ACCENTS[accentIdx % ACCENTS.length];
  const isLow = workshop.availableSeats <= 3;
  const seatPct = Math.min(
    100,
    Math.round((workshop.availableSeats / workshop.totalSeats) * 100),
  );

  /* Detect jumps > 1 slot and use instant transition to avoid visible teleport */
  const currentO = normalizeOffset(rawOffset, total);
  const prevO = normalizeOffset(previousRawOffset, total);
  const isJump = Math.abs(currentO - prevO) > 1;

  const timeLabel = formatWorkshopTime({
    startTime: workshop.startTime,
    startPeriod: workshop.startPeriod,
    endTime: workshop.endTime,
    endPeriod: workshop.endPeriod,
  });
  const dateLabel = formatWorkshopDate(workshop.date);

  return (
    <motion.div
      onClick={onClick}
      animate={{
        x: t.x,
        y: t.y,
        z: t.z,
        rotateY: t.rotateY,
        scale: t.scale,
        // opacity: t.opacity,
      }}
      transition={
        isJump ? {} : { type: "spring", stiffness: 120, damping: 40, mass: 15 }
      }
      style={{
        position: "absolute",
        top: 0,
        left: "50%",
        marginLeft: "-160px", // half of w-80 (320px)
        zIndex: t.zIndex,
        transformStyle: "preserve-3d",
        cursor: t.zIndex === 20 ? "default" : "pointer",
      }}
      className="w-80 h-full"
    >
      {/* Glass card body */}
      <div
        className="relative rounded-2xl p-6 overflow-hidden select-none h-full flex flex-col"
        style={{
          background: "rgba(255,255,255,0.05)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: `1px solid ${accent.dot}44`,
          boxShadow: `0 8px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.06) inset, 0 0 40px ${accent.glow}18`,
        }}
      >
        {/* Ambient glow blob */}
        <div
          className="absolute -top-8 -right-8 w-28 h-28 rounded-full blur-3xl"
          style={{ background: accent.glow, opacity: 0.18 }}
        />

        {/* Badge + Price */}
        <div className="relative flex items-center justify-between mb-4">
          <span
            className="text-[11px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full"
            style={{ background: accent.tagBg, color: accent.tagColor }}
          >
            Workshop
          </span>
          <span
            className="text-[18px] font-extrabold"
            style={{ color: accent.tagColor }}
          >
            ${workshop.price}
          </span>
        </div>

        {/* Title */}
        <h3 className="relative text-white text-[18px] font-semibold leading-snug mb-4">
          {workshop.title}
        </h3>

        <p className="relative text-[13px] leading-[1.75] text-white/68 mb-5">
          {workshop.description.length > 100
            ? workshop.description.slice(0, 100) + "..."
            : workshop.description}
        </p>

        {/* Info rows */}
        <div className="relative space-y-2.5 mb-5">
          {[
            { icon: "📅", value: dateLabel },
            { icon: "🕐", value: timeLabel },
            { icon: "📍", value: workshop.location },
          ].map(({ icon, value }) => (
            <div key={value} className="flex items-center gap-3">
              <span className="text-[14px] leading-none">{icon}</span>
              <span className="text-white/60 text-[13px] leading-snug">
                {value}
              </span>
            </div>
          ))}
        </div>

        {/* Seats progress bar */}
        <div className="relative mt-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white/40 text-[12px]">Seats remaining</span>
            <span
              className="text-[12px] font-bold"
              style={{ color: isLow ? "#f87171" : "#4ade80" }}
            >
              {workshop.availableSeats} left
            </span>
          </div>
          <div
            className="h-1 rounded-full overflow-hidden"
            style={{ background: "rgba(255,255,255,0.08)" }}
          >
            <motion.div
              className="h-full rounded-full"
              style={{ background: isLow ? "#f87171" : accent.dot }}
              initial={{ width: 0 }}
              animate={{ width: `${seatPct}%` }}
              transition={{ delay: 0.35, duration: 0.9, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* CTA */}
        <Link href="/workshops">
          <button
            className="relative mt-5 w-full px-6 py-3.5 text-[14px] font-bold uppercase tracking-widest rounded-xl transition-all duration-200 hover:opacity-90 active:scale-95"
            style={{
              background: `${accent.dot}22`,
              color: accent.tagColor,
              border: `1px solid ${accent.dot}44`,
            }}
          >
            Book a Seat →
          </button>
        </Link>
      </div>
    </motion.div>
  );
};

export default HeroSectionWorkshopCard;
