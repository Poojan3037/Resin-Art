"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger, SplitText);

const UNIQUE_FEATURES = [
  [
    "Small Groups",
    "Maximum 10 participants per session so everyone gets personal attention.",
  ],
  [
    "Premium Materials",
    "We use professional-grade epoxy resin and high-pigment dyes — the same materials used by gallery artists.",
  ],
  [
    "Your Vision",
    "No templates or rigid instructions. You're encouraged to follow your instincts and create something truly yours.",
  ],
  [
    "Inclusive Space",
    "Workshops are designed to be welcoming to all ages, backgrounds, and abilities.",
  ],
];

const AboutSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // ── Hero content ────────────────────────────────────────────────
      const splitHeading = new SplitText(".about-heading", { type: "chars" });

      gsap
        .timeline({
          scrollTrigger: {
            trigger: ".about-hero",
            start: "top 78%",
            once: true,
          },
        })
        .from(".about-eyebrow", {
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
          ".about-divider",
          {
            scaleX: 0,
            duration: 0.5,
            transformOrigin: "left",
            ease: "expo.out",
          },
          "-=0.3",
        )
        .from(
          ".about-para",
          {
            opacity: 0,
            y: 25,
            duration: 0.65,
            ease: "expo.out",
            stagger: 0.12,
          },
          "-=0.2",
        );

      // ── Hero image ──────────────────────────────────────────────────
      gsap.from(".about-image-wrap", {
        opacity: 0,
        x: 60,
        duration: 0.9,
        ease: "expo.out",
        scrollTrigger: {
          trigger: ".about-hero",
          start: "top 78%",
          once: true,
        },
      });

      gsap.from(".about-badge", {
        opacity: 0,
        scale: 0.75,
        duration: 0.55,
        delay: 0.55,
        ease: "back.out(2)",
        scrollTrigger: {
          trigger: ".about-hero",
          start: "top 78%",
          once: true,
        },
      });

      // ── Unique section header ───────────────────────────────────────
      const splitUniqueTitle = new SplitText(".about-unique-title", {
        type: "words",
      });

      gsap
        .timeline({
          scrollTrigger: {
            trigger: ".about-unique-header",
            start: "top 82%",
            once: true,
          },
        })
        .from(".about-unique-title", { opacity: 0, duration: 0.01 })
        .from(
          splitUniqueTitle.words,
          {
            opacity: 0,
            y: 50,
            duration: 0.7,
            stagger: 0.06,
            ease: "expo.out",
          },
          0,
        )
        .from(
          ".about-unique-divider",
          {
            scaleX: 0,
            duration: 0.5,
            transformOrigin: "center",
            ease: "expo.out",
          },
          "-=0.3",
        );

      // ── Feature cards ────────────────────────────────────────────────
      gsap.from(".about-feature-card", {
        y: 80,
        opacity: 0,
        skewY: 3,
        duration: 0.85,
        ease: "expo.out",
        stagger: { amount: 0.4 },
        scrollTrigger: {
          trigger: ".about-feature-card",
          start: "top 88%",
          once: true,
        },
      });

      return () => {
        splitHeading.revert();
        splitUniqueTitle.revert();
      };
    },
    { scope: sectionRef },
  );

  return (
    <div ref={sectionRef}>
      {/* Hero */}
      <section className="about-hero bg-cream">
        <div className="max-w-7xl mx-auto py-14 sm:py-20 px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-20 items-center">
          <div>
            <span className="about-eyebrow text-gold text-xs uppercase tracking-[0.2em]">
              About the Artist
            </span>
            <h1 className="about-heading text-[clamp(36px,4.5vw,68px)] font-semibold text-charcoal mt-3 leading-[1.15]">
              Meet Tanvi —<br />
              <em className="text-teal">The Artist Behind</em>
              <br />
              the Resin
            </h1>
            <div className="about-divider w-12 h-px bg-gold my-6 sm:my-7 origin-left" />
            <p className="about-para text-gray text-base leading-[1.9] mb-5">
              Tanvi&apos;s love for resin art began as a hobby during a quiet
              afternoon in her Calgary home. What started as experimentation
              quickly evolved into a passion — and then a mission: to share the
              meditative, joyful process of resin art with everyone.
            </p>
            <p className="about-para text-gray text-base leading-[1.9]">
              With years of practice and hundreds of happy workshop
              participants, Tanvi has created a space where creativity flows
              freely — no judgment, no pressure, just the beautiful alchemy of
              color and resin transforming under your hands.
            </p>
          </div>
          <div className="about-image-wrap relative mt-8 md:mt-0">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&q=80"
              alt="Tanvi"
              className="w-full h-80 sm:h-110 lg:h-135 object-cover block"
            />
            <div className="about-badge absolute -bottom-6 -left-4 sm:-left-6 bg-gold py-4 sm:py-5 px-5 sm:px-7 text-white">
              <div className="text-[24px] sm:text-[28px] font-bold leading-none">
                5+
              </div>
              <div className="text-xs tracking-[0.12em] uppercase opacity-90">
                Years of Art
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What makes it unique */}
      <section className="bg-white py-14 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="about-unique-header text-center mb-12 sm:mb-16">
            <h2 className="about-unique-title text-[clamp(28px,3.5vw,52px)] font-semibold text-charcoal">
              What Makes Our Workshops Unique
            </h2>
            <div className="about-unique-divider w-12 h-px bg-gold mx-auto mt-5" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {UNIQUE_FEATURES.map(([title, desc], i) => (
              <div
                key={title}
                className="about-feature-card py-8 sm:py-10 px-7 sm:px-9 border-l border-b border-light-gray h-full"
              >
                <div className="text-[44px] font-light text-gold-light leading-none mb-4">
                  0{i + 1}
                </div>
                <h3 className="text-[22px] font-semibold text-charcoal mb-3">
                  {title}
                </h3>
                <p className="text-gray text-sm leading-[1.8]">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutSection;
