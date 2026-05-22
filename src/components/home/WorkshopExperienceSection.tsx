"use client";

import Button from "@/components/Button";
import { WORK_EXPERIENCE_DATA } from "@/constants/home";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import Link from "next/link";
import Image from "next/image";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger, SplitText);

const WorkshopExperienceSection = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      // Header split-word reveal
      const split = new SplitText(".wes-title", { type: "words" });
      const headerTl = gsap.timeline({
        scrollTrigger: { trigger: ".wes-header", start: "top 82%" },
      });
      headerTl
        .from(".wes-eyebrow", {
          opacity: 0,
          y: 16,
          duration: 0.5,
          ease: "expo.out",
        })
        .from(
          split.words,
          { y: 70, opacity: 0, duration: 0.8, stagger: 0.06, ease: "expo.out" },
          "-=0.15",
        )
        .from(
          ".wes-divider",
          {
            scaleX: 0,
            duration: 0.5,
            transformOrigin: "left",
            ease: "expo.out",
          },
          "-=0.2",
        );

      // Cards: image clip-reveal from bottom + text fades
      gsap.from(".wes-card", {
        clipPath: "inset(100% 0% 0% 0%)",
        y: 40,
        opacity: 0,
        duration: 1.0,
        ease: "expo.inOut",
        stagger: { amount: 0.5 },
        scrollTrigger: { trigger: ".wes-card", start: "top 88%" },
      });

      gsap.from(".wes-cta", {
        scale: 0.92,
        opacity: 0,
        duration: 0.65,
        ease: "back.out(1.6)",
        scrollTrigger: { trigger: ".wes-cta", start: "top 92%" },
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="w-full py-14 sm:py-20 lg:py-25 px-4 sm:px-6 lg:px-8 bg-white"
    >
      <div className="max-w-7xl mx-auto">
        <div className="wes-header text-center mb-12 sm:mb-18">
          <span className="wes-eyebrow inline-block text-[12px] tracking-[0.2em] uppercase text-gold">
            Three Pillars
          </span>
          <h2 className="wes-title text-[clamp(30px,4vw,56px)] font-semibold text-charcoal mt-3 leading-[1.2]">
            The Workshop Experience
          </h2>
          <div className="wes-divider w-12 h-px bg-gold mx-auto mt-5 origin-left" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {WORK_EXPERIENCE_DATA.map((c, i) => (
            <div key={c.title} className="wes-card">
              <div>
                <div className="overflow-hidden mb-6 relative h-70">
                  <Image
                    src={c.img}
                    alt={c.title}
                    fill
                    sizes="(max-width: 768px) 100vw,(max-width: 1200px) 50vw,33vw"
                    className="w-full  block transition-transform duration-600 ease-out hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-[rgba(26,39,68,0.6)] to-transparent" />
                  <div className="absolute bottom-5 left-6">
                    <span className=" text-[36px] font-extrabold text-white tracking-[-0.02em]">
                      {c.title}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-px bg-gold" />
                  <span className="text-gold text-xl tracking-widest uppercase ">
                    Step {i + 1}
                  </span>
                </div>
                <p className="text-[15px] leading-[1.8]  text-gray">{c.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="wes-cta mt-10 text-center">
          <Link href="/workshops">
            <Button
              variant="primary"
              size="lg"
              className="sm:px-13 sm:py-4.5 sm:text-[16px] font-extrabold"
            >
              Book This Experience
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default WorkshopExperienceSection;
