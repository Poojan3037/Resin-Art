"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger, SplitText);

const ShopHero = () => {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const splitTitle = new SplitText(".shop-heading", { type: "chars" });

      gsap
        .timeline({ once: true })
        .from(".shop-eyebrow", {
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
        )
        .from(
          ".shop-subtitle",
          { opacity: 0, y: 20, duration: 0.5, ease: "expo.out" },
          "-=0.3",
        );

      return () => splitTitle.revert();
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className="bg-cream py-14 sm:py-18 px-4 sm:px-8 text-center">
      <span className="shop-eyebrow text-gold text-[12px] tracking-[0.2em] uppercase">
        Handcrafted with Love
      </span>
      <h1 className="shop-heading text-[clamp(36px,5vw,72px)] font-semibold text-charcoal mt-3">
        The Art Shop
      </h1>
      <p className="shop-subtitle text-gray text-[15px] sm:text-[16px] mt-4 max-w-110 mx-auto">
        Original resin artworks and handcrafted pieces, each one unique.
      </p>
    </div>
  );
};

export default ShopHero;
