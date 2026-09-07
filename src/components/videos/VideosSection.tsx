"use client";

import NotifyMeForm from "@/components/NotifyMeForm";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger, SplitText);

/** What the library will offer once it launches. */
const PLANNED = [
  {
    icon: "🎬",
    title: "Step-by-step tutorials",
    desc: "Full-length lessons on pours, cells, and finishing — filmed from the studio bench.",
  },
  {
    icon: "🔒",
    title: "Buy once, stream forever",
    desc: "Your link arrives by email after purchase. No account, no subscription.",
  },
  {
    icon: "🎨",
    title: "Beginner to advanced",
    desc: "Start with a first coaster and work up to resin geodes and large pieces.",
  },
];

const VideosSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // ── Hero header ─────────────────────────────────────────────────
      const splitHeading = new SplitText(".videos-heading", { type: "chars" });

      gsap
        .timeline({
          scrollTrigger: {
            trigger: ".videos-hero",
            start: "top 85%",
            once: true,
          },
        })
        .from(".videos-eyebrow", {
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
          ".videos-subtext",
          { opacity: 0, y: 20, duration: 0.5, ease: "expo.out" },
          "-=0.3",
        );

      // ── Coming-soon panel ────────────────────────────────────────────
      gsap
        .timeline({
          scrollTrigger: {
            trigger: ".videos-soon",
            start: "top 88%",
            once: true,
          },
        })
        .from(".videos-soon", {
          opacity: 0,
          y: 40,
          duration: 0.75,
          ease: "expo.out",
        })
        .from(
          ".videos-soon-item",
          {
            opacity: 0,
            y: 24,
            duration: 0.5,
            stagger: 0.09,
            ease: "power3.out",
          },
          "-=0.35",
        );
    },
    { scope: sectionRef },
  );

  return (
    <div ref={sectionRef}>
      <div className="videos-hero bg-navy py-14 sm:py-18 px-4 sm:px-8 text-center">
        <span className="videos-eyebrow text-gold text-xs tracking-[0.2em] uppercase">
          Learn at Your Own Pace
        </span>
        <h1 className="videos-heading text-[clamp(36px,5vw,72px)] font-semibold text-white mt-3">
          Tutorial Videos
        </h1>
        <p className="videos-subtext text-white/65 text-base mx-auto mt-4 max-w-110">
          We&apos;re filming a library of resin tutorials you can stream at home.
        </p>
      </div>

      <div className="max-w-7xl mx-auto py-14 sm:py-18 px-4 sm:px-6 lg:px-8">
        <div className="videos-soon bg-white border border-light-gray p-8 sm:p-12 text-center max-w-4xl mx-auto">
          <span className="block text-[11px] tracking-[0.2em] uppercase text-gold mb-3">
            Coming Soon
          </span>
          <h2 className="text-[26px] sm:text-[32px] font-semibold text-charcoal mb-3">
            The video library is in the works
          </h2>
          <p className="text-gray text-[15px] leading-[1.8] max-w-140 mx-auto mb-10">
            Tanvi is filming the first set of lessons in the Calgary studio.
            Leave your email and we&apos;ll tell you the moment the first
            tutorial goes live — no spam, just the launch.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 text-left mb-10 pb-10 border-b border-light-gray">
            {PLANNED.map((item) => (
              <div key={item.title} className="videos-soon-item">
                <div className="text-2xl mb-3">{item.icon}</div>
                <h3 className="text-[17px] font-semibold text-charcoal mb-1.5">
                  {item.title}
                </h3>
                <p className="text-gray text-[14px] leading-[1.7]">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          <NotifyMeForm source="videos" />
        </div>
      </div>
    </div>
  );
};

export default VideosSection;
