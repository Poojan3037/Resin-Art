"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger, SplitText);

const WorkshopsHero = () => {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const splitTitle = new SplitText(".workshops-heading", { type: "chars" });

      gsap
        .timeline({ once: true })
        .from(".workshops-eyebrow", {
          opacity: 0,
          y: 18,
          duration: 0.5,
          ease: "expo.out",
        })
        .from(
          splitTitle.chars,
          {
            opacity: 0,
            y: 55,
            rotateX: -85,
            duration: 0.65,
            stagger: 0.014,
            ease: "back.out(1.4)",
          },
          "-=0.1",
        );

      return () => splitTitle.revert();
    },
    { scope: ref },
  );

  return (
    <div
      ref={ref}
      className="bg-charcoal py-14 sm:py-18 px-4 sm:px-8 text-center"
    >
      <span className="workshops-eyebrow text-[12px] tracking-[0.2em] uppercase text-gold">
        Upcoming Sessions
      </span>
      <h1 className="workshops-heading text-[clamp(36px,5vw,72px)] font-semibold text-white mt-3">
        Workshops &amp; Booking
      </h1>
    </div>
  );
};

export default WorkshopsHero;
