"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import InstagramIcon from "@/components/icons/InstagramIcon";

gsap.registerPlugin(ScrollTrigger, SplitText);

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

const InstagramSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const track = trackRef.current;
      const strip = stripRef.current;
      if (!track || !strip) return;

      // ── Header reveal ────────────────────────────────────────────────
      const splitHeading = new SplitText(".ig-heading", { type: "chars" });

      gsap
        .timeline({
          scrollTrigger: {
            trigger: ".ig-header",
            start: "top 78%",
            once: true,
          },
        })
        .from(".ig-eyebrow", {
          opacity: 0,
          y: 18,
          duration: 0.5,
          ease: "expo.out",
        })
        .from(
          splitHeading.chars,
          {
            opacity: 0,
            y: 55,
            rotateX: -85,
            duration: 0.65,
            stagger: 0.014,
            ease: "back.out(1.4)",
          },
          "-=0.1",
        )
        .from(
          ".ig-gradient-word",
          { opacity: 0, y: 55, duration: 0.65, ease: "back.out(1.4)" },
          "-=0.45",
        )
        .from(
          ".ig-handle",
          { opacity: 0, scale: 0.88, duration: 0.45, ease: "back.out(2)" },
          "-=0.2",
        );

      // ── Horizontal pin + scrub ───────────────────────────────────────
      const totalScroll = strip.offsetWidth - window.innerWidth;

      gsap.to(strip, {
        x: () => -totalScroll,
        ease: "none",
        scrollTrigger: {
          trigger: track,
          start: "top top",
          end: () => `+=${totalScroll}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // ── Cards entrance ───────────────────────────────────────────────
      gsap.from(".ig-card", {
        opacity: 0,
        y: 40,
        scale: 0.93,
        duration: 0.75,
        stagger: 0.08,
        ease: "expo.out",
        scrollTrigger: { trigger: track, start: "top 90%", once: true },
      });

      return () => {
        splitHeading.revert();
      };
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} className="relative bg-[#0d0d0d]">
      {/* ── Header ──────────────────────────────────────────────────── */}
      <div className="ig-header max-w-6xl mx-auto px-6 pt-24 sm:pt-32 pb-16 text-center">
        <p className="ig-eyebrow text-[11px] tracking-[0.32em] uppercase text-gold font-medium mb-5">
          Creative Community
        </p>
        <h2 className="text-[clamp(40px,6vw,88px)] font-semibold leading-none tracking-tight text-white">
          <span className="ig-heading">Follow Our</span>{" "}
          <em
            className="ig-gradient-word not-italic"
            style={{
              background:
                "linear-gradient(135deg, #C9A84C 0%, #f0d878 50%, #C9A84C 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Journey
          </em>
        </h2>
        <Link
          href="https://www.instagram.com/resinbytanvi"
          target="_blank"
          rel="noreferrer"
          className="ig-handle inline-flex items-center gap-2.5 mt-8 px-6 py-3 rounded-full border border-[rgba(201,168,76,0.3)] text-[rgba(255,255,255,0.55)] text-[13px] tracking-[0.18em] hover:border-gold hover:text-gold transition-all duration-300 hover:shadow-[0_0_20px_rgba(201,168,76,0.15)]"
        >
          <InstagramIcon />
          @resinbytanvi
        </Link>
      </div>

      {/* ── Horizontal scroll track ──────────────────────────────────── */}
      <div ref={trackRef} className="overflow-hidden">
        <div
          ref={stripRef}
          className="flex items-stretch gap-5 px-[max(32px,calc((100vw-1280px)/2))] pb-20"
          style={{ width: "max-content" }}
        >
          {POSTS.map((post) => (
            <Link
              key={post.src}
              href="https://www.instagram.com/resinbytanvi"
              target="_blank"
              rel="noreferrer"
              className="ig-card group relative shrink-0 overflow-hidden"
              style={{
                width: "clamp(260px,26vw,380px)",
                height: "clamp(380px,40vw,520px)",
                borderRadius: "3px",
              }}
            >
              {/* Photo */}
              <Image
                src={post.src}
                alt={post.caption}
                fill
                sizes="(max-width: 768px) 80vw, 26vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />

              {/* Dark vignette */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.45) 50%, rgba(0,0,0,0.05) 100%)",
                }}
              />

              {/* ── Shimmer light sweep on hover ────────────────────── */}
              <div className="absolute inset-y-0 left-0 w-2/3 -skew-x-12 -translate-x-full group-hover:translate-x-[220%] transition-transform duration-700 ease-in-out pointer-events-none bg-linear-to-r from-transparent via-white/[0.07] to-transparent" />

              {/* Gold border shimmer on hover */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                  borderRadius: "3px",
                  border: "1px solid rgba(201,168,76,0.6)",
                }}
              />

              {/* Tag badge */}
              <span className="absolute top-4 left-4 text-[10px] tracking-[0.24em] uppercase text-gold font-medium bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-full">
                {post.tag}
              </span>

              {/* Bottom content */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <p className="text-[clamp(18px,2vw,22px)] font-semibold text-white leading-tight">
                  {post.caption}
                </p>
                <p className="mt-2 text-[13px] text-[rgba(255,255,255,0.42)] leading-relaxed line-clamp-2">
                  {post.desc}
                </p>

                {/* View on Instagram — hover reveal */}
                <div className="flex items-center gap-2 mt-4 opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-out">
                  <span className="text-gold">
                    <InstagramIcon />
                  </span>
                  <span className="text-[12px] text-[rgba(255,255,255,0.6)] tracking-[0.12em]">
                    View on Instagram
                  </span>
                </div>
              </div>
            </Link>
          ))}

          {/* ── CTA card ──────────────────────────────────────────────── */}
          <Link
            href="https://www.instagram.com/resinbytanvi"
            target="_blank"
            rel="noreferrer"
            className="ig-card group relative shrink-0 flex flex-col items-center justify-center gap-5 border border-[rgba(201,168,76,0.18)] hover:border-[rgba(201,168,76,0.6)] transition-all duration-500"
            style={{
              width: "clamp(200px,18vw,280px)",
              height: "clamp(380px,40vw,520px)",
              borderRadius: "3px",
              background:
                "linear-gradient(160deg, rgba(201,168,76,0.06) 0%, rgba(42,124,116,0.06) 100%)",
            }}
          >
            <span className="text-gold group-hover:scale-110 transition-transform duration-300">
              <InstagramIcon />
            </span>
            <div className="text-center px-6">
              <p className="text-white text-[15px] font-semibold tracking-wide leading-snug">
                See more on
                <br />
                Instagram
              </p>
              <p className="text-gold text-[12px] tracking-[0.16em] mt-1.5">
                @resinbytanvi
              </p>
            </div>
            <div className="px-5 py-2 rounded-full border border-[rgba(201,168,76,0.35)] text-[11px] text-[rgba(255,255,255,0.5)] tracking-[0.22em] uppercase group-hover:bg-gold group-hover:text-[#0d0d0d] group-hover:border-gold transition-all duration-300">
              Follow
            </div>
          </Link>
        </div>
      </div>

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none z-10"
        style={{
          background: "linear-gradient(to top, #0d0d0d 0%, transparent 100%)",
        }}
      />
    </section>
  );
};

export default InstagramSection;
