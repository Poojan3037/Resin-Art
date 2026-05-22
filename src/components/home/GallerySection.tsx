"use client";

import Button from "@/components/Button";
import { GALLERY_SECTION_DATA } from "@/constants/home";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import Image from "next/image";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger, SplitText);

const GallerySection = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const splitTitle = new SplitText(".gs-title", { type: "chars,words" });

      // Header: chars stagger in
      const headerTl = gsap.timeline({
        scrollTrigger: { trigger: ".gs-header", start: "top 83%" },
      });
      headerTl
        .from(".gs-eyebrow", {
          opacity: 0,
          x: -24,
          duration: 0.5,
          ease: "power3.out",
        })
        .from(
          splitTitle.chars,
          {
            opacity: 0,
            y: 40,
            rotateX: -90,
            duration: 0.6,
            stagger: 0.018,
            ease: "back.out(1.4)",
          },
          "-=0.1",
        )
        .from(
          ".gs-header-btn",
          { opacity: 0, x: 30, duration: 0.5, ease: "power3.out" },
          "-=0.4",
        );

      // Cards: reveal with clip + scale from micro
      gsap.from(".gs-card", {
        scale: 0.88,
        opacity: 0,
        y: 50,
        duration: 0.9,
        ease: "expo.out",
        stagger: { amount: 0.45, from: "start" },
        scrollTrigger: { trigger: ".gs-card", start: "top 88%" },
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="w-full py-14 sm:py-20 lg:py-25 px-4 sm:px-6 lg:px-8 bg-cream"
    >
      <div className="max-w-7xl mx-auto">
        <div className="gs-header flex justify-between items-end mb-10 sm:mb-16 flex-wrap gap-4 sm:gap-6">
          <div>
            <span className="gs-eyebrow text-[12px] tracking-[0.2em] uppercase text-gold">
              Recent Events
            </span>
            <h2 className="gs-title text-[clamp(30px,4vw,56px)] font-semibold text-charcoal mt-3 leading-[1.2]">
              Creative Workshop
              <br />
              <em className="text-teal">Highlights</em>
            </h2>
          </div>
          <div className="gs-header-btn">
            <Button variant="outline" size="sm">
              View All Events
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {GALLERY_SECTION_DATA.map((e, i) => (
            <div key={e.title} className="gs-card">
              <div className="group bg-white border border-light-gray overflow-hidden transition-transform duration-300 ease-in-out hover:-translate-y-1 hover:shadow-[0_20px_48px_rgba(0,0,0,0.1)] h-full">
                <div className="relative overflow-hidden h-80">
                  <Image
                    src={e.img}
                    alt={e.title}
                    fill
                    sizes="(max-width: 768px) 100vw,(max-width: 1200px) 50vw,33vw"
                    className="w-full h-55  block transition-transform duration-500 ease-in-out group-hover:scale-105"
                  />

                  <span className="absolute top-4 left-4 bg-charcoal text-gold-light text-sm tracking-[0.14em] uppercase px-4 py-1.5 ">
                    {e.tag}
                  </span>
                </div>
                <div className="p-7 pb-8">
                  <h3 className=" text-[22px] font-semibold text-charcoal mb-3 leading-[1.3]">
                    {e.title}
                  </h3>
                  <p className="text-gray text-[14px] leading-[1.7] mb-6 ">
                    {e.desc}
                  </p>
                  <Button
                    variant="ghost"
                    className="flex items-center gap-2 font-extrabold text-[13px]"
                  >
                    View Event <span className="text-[18px]">→</span>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GallerySection;
