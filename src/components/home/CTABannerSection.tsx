"use client";

import Button from "@/components/Button";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger, SplitText);

const CTABannerSection = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const split = new SplitText(".cta-title", { type: "lines,words" });

      const tl = gsap.timeline({
        scrollTrigger: { trigger: ".cta-content", start: "top 84%" },
      });

      // Icons float up one by one
      tl.from(".cta-icon", {
        y: 30,
        opacity: 0,
        scale: 0.7,
        duration: 0.55,
        stagger: 0.12,
        ease: "back.out(2)",
      })
        // Title words slide up
        .from(
          split.words,
          {
            y: 60,
            opacity: 0,
            duration: 0.85,
            stagger: 0.05,
            ease: "expo.out",
          },
          "-=0.2",
        )
        // Subtext fades in
        .from(
          ".cta-sub",
          { opacity: 0, y: 14, duration: 0.5, ease: "power2.out" },
          "-=0.3",
        )
        .from(
          ".cta-para",
          { opacity: 0, y: 14, duration: 0.5, ease: "power2.out" },
          "-=0.2",
        )
        // CTA button bounces
        .from(
          ".cta-btn",
          {
            scale: 0.8,
            opacity: 0,
            duration: 0.6,
            ease: "elastic.out(1, 0.6)",
          },
          "-=0.1",
        );
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="w-full py-14 sm:py-20 lg:py-25 px-4 sm:px-6 lg:px-8 bg-teal text-center"
    >
      <div className="max-w-200 mx-auto">
        <div className="cta-content">
          <div className="flex justify-center gap-12 flex-wrap mb-14">
            {[
              ["/images/paint-palette.png", "Beginner Friendly"],
              ["/images/box.png", "All Materials Included"],
              ["/images/art.png", "Take Home Your Artwork"],
            ].map(([icon, label]) => (
              <div
                key={label}
                className="cta-icon flex flex-col items-center gap-2.5"
              >
                <Image src={icon} alt={label} width={30} height={30} />
                <span className="text-[rgba(255,255,255,0.85)] text-[12px] tracking-[0.14em] uppercase">
                  {label}
                </span>
              </div>
            ))}
          </div>
          <h2 className="cta-title text-[clamp(36px,4vw,60px)] font-semibold text-white mb-5 leading-[1.15]">
            Create Your Own
            <br />
            <em className="text-gold-light italic">Resin Art Masterpiece</em>
          </h2>
          <p className="cta-sub text-[rgba(255,255,255,0.65)] text-[13px] tracking-[0.12em] uppercase mb-8">
            Calgary &amp; High River&nbsp;|&nbsp;Loved by 200+ Happy Artists
          </p>
          <p className="cta-para text-[rgba(255,255,255,0.8)] text-[17px] leading-[1.8] mb-10">
            Looking for a fun and creative experience? Reserve your spot in our
            resin art workshop and enjoy an unforgettable artistic journey.
          </p>
          <div className="cta-btn inline-block">
            <Button
              variant="primary"
              size="lg"
              className="sm:px-13 sm:py-4.5 sm:text-[16px] font-extrabold"
            >
              Book Your Workshop
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTABannerSection;
