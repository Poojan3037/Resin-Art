"use client";

import Button from "@/components/Button";
import { VIDEOS_DATA } from "@/constants/videos";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger, SplitText);

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

      // ── Cards ────────────────────────────────────────────────────────
      gsap.utils.toArray<HTMLElement>(".videos-card").forEach((card) => {
        gsap.from(card, {
          y: 60,
          opacity: 0,
          scale: 0.93,
          duration: 0.8,
          ease: "expo.out",
          scrollTrigger: {
            trigger: card,
            start: "top 88%",
            once: true,
          },
        });
      });

      // ── Secure access box ────────────────────────────────────────────
      gsap.from(".videos-secure-box", {
        opacity: 0,
        y: 40,
        duration: 0.75,
        ease: "expo.out",
        scrollTrigger: {
          trigger: ".videos-secure-box",
          start: "top 88%",
          once: true,
        },
      });

      return () => {
        splitHeading.revert();
      };
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
          Purchase once, stream securely forever. No login required.
        </p>
      </div>

      <div className="max-w-7xl mx-auto py-14 sm:py-18 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-10">
          {VIDEOS_DATA.map((v) => (
            <div
              key={v.title}
              className="videos-card border border-light-gray overflow-hidden bg-white transition-all duration-300 hover:shadow-[0_12px_40px_rgba(0,0,0,0.1)]"
            >
              <div className="relative">
                <img
                  src={v.thumb}
                  alt={v.title}
                  className="w-full h-55 object-cover block"
                />
                <div className="absolute inset-0 bg-navy/40 flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center text-xl cursor-pointer">
                    ▶
                  </div>
                </div>
                <span className="absolute bottom-3 right-3 bg-black/70 text-white text-sm py-1 px-2.5">
                  {v.duration}
                </span>
              </div>
              <div className="px-6 pt-6 pb-7">
                <h3 className="text-xl font-semibold text-charcoal mb-2.5 leading-[1.3]">
                  {v.title}
                </h3>
                <p className="text-gray text-sm leading-[1.7] mb-5">{v.desc}</p>
                <div className="flex justify-between items-center">
                  <span className="text-[22px] font-bold text-gold">
                    {v.price}
                  </span>
                  <Button
                    variant="primary"
                    size="sm"
                    className="font-bold tracking-widest"
                  >
                    Buy Now
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="videos-secure-box mt-14 sm:mt-18 bg-cream p-8 sm:p-12 text-center border border-light-gray">
          <div className="text-[28px] mb-4">🔒</div>
          <h3 className="text-[26px] font-semibold text-charcoal mb-3">
            Secure &amp; Instant Access
          </h3>
          <p className="text-gray text-[15px] leading-[1.8] max-w-120 mx-auto">
            After purchase, your video link is sent directly to your email. No
            account needed — just click and create.
          </p>
        </div>
      </div>
    </div>
  );
};

export default VideosSection;
