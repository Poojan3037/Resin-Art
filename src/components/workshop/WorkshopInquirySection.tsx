"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import { INQUIRY_DATA } from "@/constants/workshops";

gsap.registerPlugin(ScrollTrigger);

const WorkshopInquirySection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from(".inquiry-card", {
        y: 80,
        opacity: 0,
        skewY: 3,
        duration: 0.85,
        ease: "expo.out",
        stagger: { amount: 0.35 },
        scrollTrigger: {
          trigger: ".inquiry-card",
          start: "top 88%",
          once: true,
        },
      });
    },
    { scope: sectionRef },
  );

  return (
    <div
      ref={sectionRef}
      className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-12"
    >
      {INQUIRY_DATA.map((item, i) => (
        <div
          key={i}
          className="inquiry-card bg-cream p-12 border border-light-gray h-full"
        >
          <span className="text-[11px] tracking-[0.18em] uppercase text-gold">
            {item.tag}
          </span>
          <h3 className="text-[28px] font-semibold text-charcoal mt-3 mb-4">
            {item.title}
          </h3>
          <p className="text-gray leading-[1.8] text-[15px] mb-7">
            {item.desc}
          </p>
          <button className="border border-charcoal bg-transparent px-6 py-3.5 text-[14px] tracking-[0.12em] uppercase cursor-pointer font-semibold hover:bg-charcoal hover:text-gold-light">
            Send Inquiry
          </button>
        </div>
      ))}
    </div>
  );
};

export default WorkshopInquirySection;
