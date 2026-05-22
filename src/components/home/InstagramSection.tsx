"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import InstagramIcon from "@/components/icons/InstagramIcon";

gsap.registerPlugin(ScrollTrigger);

// ─── Data ────────────────────────────────────────────────────────────────────

const POSTS = [
  {
    src: "/images/art/art-1.jpg",
    tag: "#ResinArt",
    caption: "Golden Pour",
    desc: "Hand-poured with 24k gold flakes — no two pieces are ever the same.",
  },
  {
    src: "/images/art/art-2.jpg",
    tag: "#FluidArt",
    caption: "Fluid Dreams",
    desc: "Layers of translucent pigment captured mid-flow in liquid glass.",
  },
  {
    src: "/images/art/art-3.jpg",
    tag: "#OceanResin",
    caption: "Ocean Waves",
    desc: "The raw energy of the sea, preserved in crystal-clear epoxy forever.",
  },
  {
    src: "/images/art/art-4.jpg",
    tag: "#ArtStudio",
    caption: "Colour Bloom",
    desc: "Pigments bloom outward like flowers — a dance of chemistry and art.",
  },
  {
    src: "/images/art/art-5.jpg",
    tag: "#Handcrafted",
    caption: "Light & Depth",
    desc: "Beveled edges catch the light, revealing a new hue at every angle.",
  },
  {
    src: "/images/art/art-6.jpg",
    tag: "#ResinMagic",
    caption: "Liquid Gold",
    desc: "One slow pour, hours of patience — and a lifetime of warmth.",
  },
];

const STATS = [
  { value: "12K+", label: "Followers" },
  { value: "240+", label: "Posts" },
  { value: "98%", label: "Happy Clients" },
];

// ─── Component ───────────────────────────────────────────────────────────────

const InstagramGallery = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      // Force refresh (important for mobile)
      ScrollTrigger.refresh();

      // ── HEADER ─────────────────────────────
      gsap
        .timeline({
          scrollTrigger: {
            trigger: ".ig-header",
            start: "top 85%", // 🔥 earlier trigger
            once: true,
            invalidateOnRefresh: true,
          },
        })
        .from(".ig-badge", {
          opacity: 0,
          scale: 0.7,
          y: -10,
          duration: 0.55,
          ease: "back.out(2.8)",
          immediateRender: false,
        })
        .from(
          ".ig-title",
          {
            opacity: 0,
            y: 32,
            duration: 0.7,
            ease: "expo.out",
            immediateRender: false,
          },
          "-=0.15",
        )
        .from(
          ".ig-subtitle",
          {
            opacity: 0,
            y: 20,
            duration: 0.55,
            ease: "expo.out",
            immediateRender: false,
          },
          "-=0.38",
        )
        .from(
          ".ig-divider-left",
          {
            scaleX: 0,
            transformOrigin: "right center",
            duration: 0.55,
            ease: "expo.out",
          },
          "-=0.45",
        )
        .from(
          ".ig-divider-right",
          {
            scaleX: 0,
            transformOrigin: "left center",
            duration: 0.55,
            ease: "expo.out",
          },
          "<",
        )
        .from(
          ".ig-divider-dot",
          {
            opacity: 0,
            scale: 0,
            duration: 0.3,
            ease: "back.out(3)",
          },
          "-=0.3",
        )
        .from(
          ".ig-stat",
          {
            opacity: 0,
            y: 26,
            duration: 0.55,
            stagger: 0.1,
            ease: "back.out(1.8)",
          },
          "-=0.35",
        )
        .from(
          ".ig-bottom-cta",
          {
            opacity: 0,
            scale: 0.88,
            duration: 0.5,
            ease: "back.out(2)",
          },
          "-=0.25",
        );

      // ── CARDS ─────────────────────────────
      ScrollTrigger.batch(".ig-card", {
        start: "top 90%",
        once: true,
        onEnter: (els) => {
          gsap.from(els, {
            opacity: 0, // 🔥 important fallback
            clipPath: "inset(100% 0 0 0 round 3px)",
            y: 18,
            duration: 0.88,
            ease: "expo.out",
            stagger: { each: 0.08 },
            clearProps: "all",
          });
        },
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="relative bg-[#0d0d0d] py-20 overflow-hidden"
    >
      {/* ── Subtle gold dot grid texture ────────────────────────────── */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.022] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(201,168,76,1) 1px, transparent 0)",
          backgroundSize: "44px 44px",
        }}
      />

      {/* ── Ambient corner glows ────────────────────────────────────── */}
      <div
        aria-hidden
        className="absolute top-0 left-0 w-72 h-72 rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2"
        style={{
          background:
            "radial-gradient(circle, rgba(201,168,76,0.07) 0%, transparent 70%)",
        }}
      />
      <div
        aria-hidden
        className="absolute bottom-0 right-0 w-96 h-96 rounded-full pointer-events-none translate-x-1/3 translate-y-1/3"
        style={{
          background:
            "radial-gradient(circle, rgba(42,124,116,0.07) 0%, transparent 70%)",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ══════════════════════════════════════════════════════════════
            HEADER
        ══════════════════════════════════════════════════════════════ */}
        <div className="ig-header text-center mb-12 sm:mb-16 lg:mb-20">
          {/* Badge ── Instagram handle pill */}
          <Link
            href="https://www.instagram.com/resinbytanvi"
            target="_blank"
            rel="noreferrer"
            className="ig-badge inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[rgba(201,168,76,0.28)] text-gold text-[11px] tracking-[0.28em] uppercase font-medium mb-6 sm:mb-7 hover:border-gold hover:bg-[rgba(201,168,76,0.06)] transition-all duration-300"
          >
            <InstagramIcon />
            @resinbytanvi
          </Link>

          {/* Title */}
          <h2 className="ig-title text-[clamp(34px,6vw,92px)] font-semibold leading-[0.9] tracking-tight text-white mb-4 sm:mb-5">
            Follow Our Journey
          </h2>

          {/* Subtitle */}
          <p className="ig-subtitle text-[rgba(255,255,255,0.36)] text-[13px] sm:text-[14px] tracking-[0.1em] max-w-[22rem] mx-auto leading-relaxed">
            Every pour is unique. Every piece tells a story.
          </p>

          {/* Gold divider */}
          <div className="flex items-center justify-center gap-3 mt-7 sm:mt-8 mb-7 sm:mb-8">
            <div
              className="ig-divider-left h-px w-20 sm:w-28"
              style={{
                background:
                  "linear-gradient(to right, transparent, rgba(201,168,76,0.45))",
              }}
            />
            <div className="ig-divider-dot w-1.5 h-1.5 rounded-full bg-gold/50" />
            <div
              className="ig-divider-right h-px w-20 sm:w-28"
              style={{
                background:
                  "linear-gradient(to left, transparent, rgba(201,168,76,0.45))",
              }}
            />
          </div>

          {/* Stats */}
          <div className="flex items-center justify-center gap-8 sm:gap-14">
            {STATS.map((s) => (
              <div key={s.label} className="ig-stat text-center">
                <p className="text-[clamp(20px,3.5vw,38px)] font-semibold text-white leading-none tabular-nums">
                  {s.value}
                </p>
                <p className="text-[10px] sm:text-[11px] text-[rgba(255,255,255,0.28)] tracking-[0.24em] uppercase mt-1.5">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════
            GALLERY GRID
            • Mobile  — 2 cols
            • md      — 3 cols
            • lg      — 4 cols
            All cards use aspect-[3/4] — fully fluid, no fixed heights.
        ══════════════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-3 lg:gap-4">
          {/* Photo cards */}
          {POSTS.map((post) => (
            <Link
              key={post.src}
              href="https://www.instagram.com/resinbytanvi"
              target="_blank"
              rel="noreferrer"
              className="ig-card group relative aspect-[3/4] overflow-hidden rounded-[3px]"
            >
              {/* Photo */}
              <Image
                src={post.src}
                alt={post.caption}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />

              {/* Dark vignette */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.42) 48%, rgba(0,0,0,0.04) 100%)",
                }}
              />

              {/* ── Shimmer light sweep on hover — same as original ── */}
              <div className="absolute inset-y-0 left-0 w-2/3 -skew-x-12 -translate-x-full group-hover:translate-x-[220%] transition-transform duration-700 ease-in-out pointer-events-none bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />

              {/* Gold border glow on hover */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-[3px]"
                style={{ border: "1px solid rgba(201,168,76,0.55)" }}
              />

              {/* Tag badge */}
              <span className="absolute top-3 left-3 text-[9px] sm:text-[10px] tracking-[0.22em] uppercase text-gold font-medium bg-black/45 backdrop-blur-sm px-2 sm:px-2.5 py-1 rounded-full">
                {post.tag}
              </span>

              {/* Bottom content — slides up slightly on hover */}
              <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 translate-y-1 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                <p className="text-[13px] sm:text-[15px] font-semibold text-white leading-tight">
                  {post.caption}
                </p>
                {/* "View on Instagram" fades in on hover */}
                <div className="flex items-center gap-1.5 mt-2 sm:mt-2.5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-75">
                  <span className="text-gold">
                    <InstagramIcon />
                  </span>
                  <span className="text-[10px] sm:text-[11px] text-[rgba(255,255,255,0.55)] tracking-[0.12em]">
                    View on Instagram
                  </span>
                </div>
              </div>
            </Link>
          ))}

          {/* ── CTA tile ──────────────────────────────────────────── */}
          <Link
            href="https://www.instagram.com/resinbytanvi"
            target="_blank"
            rel="noreferrer"
            className="ig-card group relative aspect-[3/4] flex flex-col items-center justify-center gap-3 sm:gap-4 rounded-[3px] border border-[rgba(201,168,76,0.15)] hover:border-[rgba(201,168,76,0.5)] transition-all duration-500 overflow-hidden"
            style={{
              background:
                "linear-gradient(160deg, rgba(201,168,76,0.05) 0%, rgba(42,124,116,0.05) 100%)",
            }}
          >
            {/* Pulsing ring around icon */}
            <div className="relative flex items-center justify-center">
              <span className="absolute w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-[rgba(201,168,76,0.3)] animate-ping" />
              <span className="text-gold group-hover:scale-110 transition-transform duration-300 relative z-10">
                <InstagramIcon />
              </span>
            </div>

            <div className="text-center px-4">
              <p className="text-white text-[12px] sm:text-[14px] font-semibold tracking-wide leading-snug">
                See more on
                <br />
                Instagram
              </p>
              <p className="text-gold text-[10px] sm:text-[11px] tracking-[0.18em] mt-1.5">
                @resinbytanvi
              </p>
            </div>

            <div className="px-3.5 sm:px-5 py-1.5 sm:py-2 rounded-full border border-[rgba(201,168,76,0.32)] text-[9px] sm:text-[11px] text-[rgba(255,255,255,0.42)] tracking-[0.22em] uppercase group-hover:bg-gold group-hover:text-[#0d0d0d] group-hover:border-gold transition-all duration-300">
              Follow
            </div>
          </Link>
        </div>

        {/* ── Bottom CTA button ──────────────────────────────────── */}
        <div className="ig-bottom-cta text-center mt-10 sm:mt-14">
          <Link
            href="https://www.instagram.com/resinbytanvi"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2.5 px-6 sm:px-8 py-3 sm:py-3.5 rounded-full border border-[rgba(201,168,76,0.32)] text-[rgba(255,255,255,0.5)] text-[11px] sm:text-[12px] tracking-[0.22em] uppercase hover:bg-gold hover:text-[#0d0d0d] hover:border-gold transition-all duration-300"
          >
            <InstagramIcon />
            See all posts on Instagram
          </Link>
        </div>
      </div>
    </section>
  );
};

export default InstagramGallery;
