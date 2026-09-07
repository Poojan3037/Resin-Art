"use client";

import NotifyMeForm from "@/components/NotifyMeForm";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger, SplitText);

const SubscribeSection = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const split = new SplitText(".ss-heading", { type: "words" });

      const tl = gsap.timeline({
        scrollTrigger: { trigger: ".ss-content", start: "top 87%" },
      });

      tl.from(".ss-eyebrow", {
        opacity: 0,
        y: 16,
        duration: 0.45,
        ease: "power3.out",
      })
        .from(
          split.words,
          {
            y: 50,
            opacity: 0,
            duration: 0.75,
            stagger: 0.06,
            ease: "expo.out",
          },
          "-=0.1",
        )
        .from(
          ".ss-list-item",
          {
            x: -30,
            opacity: 0,
            duration: 0.45,
            stagger: 0.08,
            ease: "power3.out",
          },
          "-=0.3",
        )
        .from(
          ".ss-form",
          {
            y: 24,
            opacity: 0,
            scale: 0.97,
            duration: 0.55,
            ease: "back.out(1.5)",
          },
          "-=0.2",
        );
    },
    { scope: sectionRef },
  );
  return (
    <section
      ref={sectionRef}
      className="w-full py-14 sm:py-20 px-4 sm:px-6 lg:px-8 bg-blush-light text-center"
    >
      <div className="max-w-180 mx-auto">
        <div className="ss-content">
          <span className="ss-eyebrow text-[12px] tracking-[0.2em] uppercase text-gold-dark">
            Stay in the Loop
          </span>
          <h2 className="ss-heading text-[clamp(30px,3.5vw,46px)] font-semibold text-charcoal mt-3 mb-6">
            Join The Resin By Tanvi Community
          </h2>
          <ul className="text-gray text-[15px] leading-[1.8] mb-9 inline-flex flex-col items-start gap-2 text-left">
            <li className="ss-list-item">🎟️ Early workshop access</li>
            <li className="ss-list-item">
              🎨 Resin art inspiration &amp; tips
            </li>
            <li className="ss-list-item">💸 Exclusive discounts</li>
            <li className="ss-list-item">
              📍 Calgary &amp; High River event updates
            </li>
          </ul>
          <div className="ss-form">
            <NotifyMeForm source="home" layout="joined" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default SubscribeSection;
