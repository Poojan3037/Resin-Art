"use client";

import Button from "@/components/Button";
import { HERO_SECTION_DATA } from "@/constants/home";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import Link from "next/link";
import { useRef } from "react";

gsap.registerPlugin(SplitText);

const HeroContent = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const split = new SplitText(".hero-heading", { type: "lines,words" });

      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });

      // Badge line-reveal
      tl.from(".hero-line", {
        scaleX: 0,
        duration: 0.6,
        transformOrigin: "left",
      })
        .from(
          ".hero-badge-text",
          { x: -20, opacity: 0, duration: 0.5 },
          "-=0.2",
        )
        // Heading: each word slides up from a clip
        .from(
          split.words,
          {
            y: "110%",
            opacity: 0,
            duration: 1.0,
            stagger: 0.055,
            ease: "expo.out",
          },
          "-=0.1",
        )
        // Para fades + slight rise
        .from(
          ".hero-para",
          { y: 28, opacity: 0, duration: 0.75, ease: "power3.out" },
          "-=0.45",
        )
        // Buttons scale-in from slight below
        .from(
          ".hero-btn",
          {
            y: 20,
            opacity: 0,
            scale: 0.94,
            duration: 0.55,
            stagger: 0.1,
            ease: "back.out(1.7)",
          },
          "-=0.35",
        )
        // Stats: count up + slide in
        .from(
          ".hero-stat",
          {
            y: 30,
            opacity: 0,
            duration: 0.5,
            stagger: 0.15,
            ease: "power3.out",
          },
          "-=0.25",
        )
        // Divider lines between stats grow in
        .from(
          ".hero-stat-divider",
          {
            scaleY: 0,
            duration: 0.4,
            stagger: 0.1,
            transformOrigin: "top",
            ease: "power2.out",
          },
          "<",
        );
    },
    { scope: containerRef },
  );

  return (
    <div ref={containerRef} className="flex-1 min-w-0">
      <div className="hero-badge flex items-center gap-3 mb-5 sm:mb-6">
        <div className="hero-line h-px w-12 bg-gold origin-left" />
        <span className="hero-badge-text text-[11px] sm:text-[12px] tracking-widest-[0.2em] uppercase text-gold-light">
          Calgary&apos;s Premier Resin Studio
        </span>
      </div>

      <h1 className="hero-heading overflow-hidden text-[clamp(36px,5.5vw,78px)] font-semibold text-white leading-[1.1] mb-5 sm:mb-6 tracking-widest-[-0.01em]">
        Create Your Own
        <br />
        <em className="text-gold-light italic">Resin Art Masterpiece</em>
      </h1>

      <p className="hero-para text-[15px] sm:text-[17px] lg:text-[18px] leading-[1.8] mb-8 sm:mb-10 text-[rgba(255,255,255,0.75)] max-w-130">
        Join our hands-on resin art workshops and create stunning, one-of-a-kind
        pieces you&apos;ll be proud to take home. No experience needed — just
        creativity.
      </p>

      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <Link href="/workshops" className="hero-btn">
          <Button
            variant="gold"
            size="md"
            className="w-full sm:w-auto font-extrabold border border-transparent hover:bg-gold-light hover:text-charcoal! hover:border-white/40"
          >
            Book Your Seat
          </Button>
        </Link>
        <Link href="/shop" className="hero-btn">
          <Button
            variant="outline"
            size="md"
            className="w-full sm:w-auto text-white border-white/40"
          >
            Explore Gallery
          </Button>
        </Link>
      </div>

      <div className="flex flex-nowrap overflow-x-auto gap-4 sm:gap-10 mt-10 sm:mt-14">
        {HERO_SECTION_DATA.map(([n, l], idx) => (
          <div
            key={l}
            className="flex items-stretch gap-4 sm:gap-10 whitespace-nowrap"
          >
            {idx > 0 && (
              <div className="hero-stat-divider w-px bg-[rgba(255,255,255,0.12)] self-stretch" />
            )}
            <div className="hero-stat">
              <div className="text-[18px] sm:text-[32px] font-extrabold text-gold-light">
                {n}
              </div>
              <div className="text-[10px] sm:text-[13px] tracking-[0.08em] uppercase text-[rgba(255,255,255,0.55)]">
                {l}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HeroContent;
