"use client";

import { HERO_SECTION_DATA } from "@/constants/home";
import { WORKSHOPS_DATA } from "@/constants/workshops";
import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

/* ─── Per-card accent palette ────────────────────────────────────────────── */
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

/* ─── 3-D position map for each offset from the active card ─────────────── */
function resolveCardTransform(rawOffset: number, total: number) {
  let o = rawOffset % total;
  if (o > total / 2) o -= total;
  if (o < -total / 2) o += total;

  switch (o) {
    case 0:
      return { x: 0, y: 0, z: 0, rotateY: 0, scale: 1, opacity: 1, zIndex: 20 };
    case 1:
      return {
        x: 76,
        y: 24,
        z: -70,
        rotateY: -22,
        scale: 0.84,
        opacity: 0.65,
        zIndex: 14,
      };
    case 2:
      return {
        x: 120,
        y: 44,
        z: -130,
        rotateY: -34,
        scale: 0.67,
        opacity: 0.3,
        zIndex: 8,
      };
    case -1:
      return {
        x: -76,
        y: 24,
        z: -70,
        rotateY: 22,
        scale: 0.84,
        opacity: 0.65,
        zIndex: 14,
      };
    case -2:
      return {
        x: -120,
        y: 44,
        z: -130,
        rotateY: 34,
        scale: 0.67,
        opacity: 0.3,
        zIndex: 8,
      };
    default:
      return {
        x: 0,
        y: 0,
        z: -220,
        rotateY: 0,
        scale: 0.5,
        opacity: 0,
        zIndex: 0,
      };
  }
}

/* ─── Single workshop card ───────────────────────────────────────────────── */
type WorkshopDatum = (typeof WORKSHOPS_DATA)[number];

function getWorkshopSummary(title: string) {
  if (title.includes("Advanced")) {
    return "Layer color, depth, and finishing techniques in a more refined studio session designed for makers ready to level up.";
  }

  if (title.includes("Sip")) {
    return "A relaxed evening format with guided resin pouring, expressive color play, and a social atmosphere that stays beginner friendly.";
  }

  if (title.includes("Tray") || title.includes("Coaster")) {
    return "Create a polished functional piece with guided composition, metallic accents, and take-home finishing details built into the session.";
  }

  return "A guided hands-on resin experience where you learn the essentials, experiment with flowing color, and leave with a finished piece.";
}

function getWorkshopHighlights(title: string) {
  if (title.includes("Advanced")) {
    return ["Layered effects", "Finishing techniques"];
  }

  if (title.includes("Sip")) {
    return ["Social setting", "Beginner friendly"];
  }

  if (title.includes("Tray") || title.includes("Coaster")) {
    return ["Functional art", "Take-home set"];
  }

  return ["Guided session", "All materials included"];
}

/* Normalize rawOffset to the range [-total/2 .. total/2] */
function normalizeOffset(raw: number, total: number) {
  let o = raw % total;
  if (o > total / 2) o -= total;
  if (o < -total / 2) o += total;
  return o;
}

function WorkshopCard({
  workshop,
  rawOffset,
  previousRawOffset,
  total,
  accentIdx,
  onClick,
}: Readonly<{
  workshop: WorkshopDatum;
  rawOffset: number;
  previousRawOffset: number;
  total: number;
  accentIdx: number;
  onClick: () => void;
}>) {
  const t = resolveCardTransform(rawOffset, total);
  const accent = ACCENTS[accentIdx % ACCENTS.length];
  const isLow = workshop.seats <= 4;
  const seatPct = Math.min(100, Math.round((workshop.seats / 12) * 100));
  const highlights = getWorkshopHighlights(workshop.title);
  const summary = getWorkshopSummary(workshop.title);

  /* Detect jumps > 1 slot and use instant transition to avoid visible teleport */
  const currentO = normalizeOffset(rawOffset, total);
  const prevO = normalizeOffset(previousRawOffset, total);
  const isJump = Math.abs(currentO - prevO) > 1;

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
        isJump ? {} : { type: "spring", stiffness: 260, damping: 28, mass: 0.9 }
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
            {workshop.price}
          </span>
        </div>

        {/* Title */}
        <h3 className="relative text-white text-[18px] font-semibold leading-snug mb-4">
          {workshop.title}
        </h3>

        <p className="relative text-[13px] leading-[1.75] text-white/68 mb-5">
          {summary}
        </p>
        {/* 
        <div className="relative grid grid-cols-2 gap-2.5 mb-5">
          {highlights.map((highlight) => (
            <div
              key={highlight}
              className="rounded-xl border border-white/8 bg-white/4 px-3 py-2.5"
            >
              <span className="text-[10px] uppercase tracking-[0.22em] text-white/35">
                Includes
              </span>
              <p className="mt-1 text-[12px] font-medium text-white/80 leading-snug">
                {highlight}
              </p>
            </div>
          ))}
        </div> */}

        {/* Info rows */}
        <div className="relative space-y-2.5 mb-5">
          {[
            { icon: "📅", value: workshop.date },
            { icon: "🕐", value: workshop.time },
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
              {workshop.seats} left
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
            className="relative mt-5 w-full text-[13px] font-bold uppercase tracking-widest py-3 rounded-xl transition-all duration-200 hover:opacity-90 active:scale-95"
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
}

/* ─── Main Hero Section ──────────────────────────────────────────────────── */
const HeroSection = () => {
  const [{ active, previousActive }, setCarousel] = useState({
    active: 0,
    previousActive: 0,
  });
  const total = WORKSHOPS_DATA.length;

  const setActiveCard = (nextActive: number) => {
    setCarousel((current) => {
      if (current.active === nextActive) {
        return current;
      }

      return {
        active: nextActive,
        previousActive: current.active,
      };
    });
  };

  /* Auto-advance every 3.8 s */
  useEffect(() => {
    const id = setInterval(() => {
      setCarousel((current) => ({
        active: (current.active + 1) % total,
        previousActive: current.active,
      }));
    }, 3800);

    return () => clearInterval(id);
  }, [total]);

  return (
    <section className="relative flex items-center overflow-hidden pb-24 sm:pb-32 lg:pb-40 bg-navy min-h-170">
      {/* Abstract resin background */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.85]"
        viewBox="0 0 1400 900"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <radialGradient id="g1" cx="20%" cy="30%">
            <stop offset="0%" stopColor="#2A7C74" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#1A2744" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="g2" cx="80%" cy="60%">
            <stop offset="0%" stopColor="#C9A84C" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#8B6914" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="g3" cx="60%" cy="10%">
            <stop offset="0%" stopColor="#D4829A" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#D4829A" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="g4" cx="10%" cy="80%">
            <stop offset="0%" stopColor="#5BA8A0" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#5BA8A0" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="1400" height="900" fill="#1A2744" />
        <ellipse cx="280" cy="270" rx="420" ry="320" fill="url(#g1)" />
        <ellipse cx="1120" cy="540" rx="380" ry="300" fill="url(#g2)" />
        <ellipse cx="840" cy="90" rx="300" ry="240" fill="url(#g3)" />
        <ellipse cx="140" cy="720" rx="260" ry="200" fill="url(#g4)" />
        <ellipse
          cx="900"
          cy="700"
          rx="200"
          ry="160"
          fill="url(#g1)"
          opacity="0.4"
        />
        <path
          d="M0,400 Q350,200 700,450 Q1050,700 1400,350 L1400,900 L0,900 Z"
          fill="#0F1E3A"
          opacity="0.5"
        />
      </svg>

      {/* Unsplash resin image overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-[0.18]"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1615486511262-c7b536a4db8e?w=1400&q=80)",
        }}
      />

      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 lg:pt-28 w-full">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16 xl:gap-24">
          {/* ── LEFT: text content ────────────────────────────────────── */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-5 sm:mb-6">
              <div className="h-px w-12 bg-gold" />
              <span className="text-[11px] sm:text-[12px] tracking-widest-[0.2em] uppercase text-gold-light">
                Calgary&apos;s Premier Resin Studio
              </span>
            </div>

            <h1 className="text-[clamp(36px,5.5vw,78px)] font-semibold text-white leading-[1.1] mb-5 sm:mb-6 tracking-widest-[-0.01em]">
              Create Your Own
              <br />
              <em className="text-gold-light italic">Resin Art Masterpiece</em>
            </h1>

            <p className="text-[15px] sm:text-[17px] lg:text-[18px] leading-[1.8] mb-8 sm:mb-10 text-[rgba(255,255,255,0.75)] max-w-130">
              Join our hands-on resin art workshops and create stunning,
              one-of-a-kind pieces you&apos;ll be proud to take home. No
              experience needed — just creativity.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Link href="/workshops">
                <button className="w-full sm:w-auto text-white px-8 sm:px-10 py-3.5 sm:py-4 text-[14px] sm:text-[15px] border border-transparent tracking-widest-[0.12em] uppercase font-extrabold cursor-pointer bg-gold hover:bg-transparent hover:border-white/40 transition-all duration-200">
                  Book Your Seat
                </button>
              </Link>
              <Link href="/shop">
                <button className="w-full sm:w-auto bg-transparent text-white border border-white/40 px-8 sm:px-9 py-3.5 sm:py-4 text-[14px] sm:text-[15px] tracking-widest uppercase cursor-pointer hover:bg-charcoal hover:text-gold-light transition-all duration-200">
                  Explore Gallery
                </button>
              </Link>
            </div>

            <div className="flex flex-wrap gap-8 sm:gap-10 mt-10 sm:mt-14">
              {HERO_SECTION_DATA.map(([n, l]) => (
                <div key={l}>
                  <div className="text-[26px] sm:text-[32px] font-extrabold text-gold-light">
                    {n}
                  </div>
                  <div className="text-[12px] sm:text-[13px] tracking-widest-[0.08em] uppercase text-[rgba(255,255,255,0.55)]">
                    {l}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT: 3-D workshop card carousel ─────────────────────── */}
          <div className="shrink-0 w-full lg:w-136 flex flex-col items-center">
            {/* Section label */}
            <div className="flex items-center gap-3 mb-6 self-start lg:self-center">
              <div className="h-px w-8 bg-gold-light" />
              <span className="text-[11px] tracking-widest uppercase text-gold-light">
                Upcoming Workshops
              </span>
            </div>

            {/* 3-D carousel viewport */}
            <div
              className="relative w-full h-120"
              style={{ perspective: "1100px", perspectiveOrigin: "50% 35%" }}
            >
              {WORKSHOPS_DATA.map((workshop, index) => {
                const rawOffset = (index - active + total) % total;
                const previousRawOffset =
                  (index - previousActive + total) % total;

                return (
                  <WorkshopCard
                    key={workshop.title}
                    workshop={workshop}
                    rawOffset={rawOffset}
                    previousRawOffset={previousRawOffset}
                    total={total}
                    accentIdx={index}
                    onClick={() => {
                      if (rawOffset !== 0) setActiveCard(index);
                    }}
                  />
                );
              })}
            </div>

            {/* Dot indicators + manual nav */}
            <div className="flex items-center gap-3 mt-6">
              {WORKSHOPS_DATA.map((w, i) => (
                <motion.button
                  key={w.title}
                  onClick={() => setActiveCard(i)}
                  animate={{
                    width: i === active ? 20 : 8,
                    opacity: i === active ? 1 : 0.35,
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  className="h-2 rounded-full bg-gold"
                />
              ))}
            </div>

            <p className="mt-3 text-[10px] tracking-widest uppercase text-white/30">
              Click a card to focus · auto-advances
            </p>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      {/* <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="text-[11px] tracking-widest-[0.2em] uppercase text-[rgba(255,255,255,0.4)]">
          Scroll
        </span>
        <div className="w-px h-12 bg-linear-to-b from-gold to-transparent" />
      </div> */}
    </section>
  );
};

export default HeroSection;
