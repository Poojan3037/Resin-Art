"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { GALLERY_SECTION_DATA } from "@/constants/home";
import Button from "@/components/Button";

gsap.registerPlugin(ScrollTrigger, SplitText);

type EventType = (typeof GALLERY_SECTION_DATA)[number];

type PropsType = {
  event: EventType;
  relatedEvents: EventType[];
};

const EventDetailPage = ({ event, relatedEvents }: PropsType) => {
  const pageRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // ── Hero text ──────────────────────────────────────────────────────────
      const splitTitle = new SplitText(".ed-title", { type: "chars" });

      gsap
        .timeline()
        .from(".ed-back-link", {
          opacity: 0,
          x: -24,
          duration: 0.5,
          ease: "power3.out",
        })
        .from(
          ".ed-tag",
          { opacity: 0, scale: 0.85, duration: 0.4, ease: "back.out(1.7)" },
          "-=0.15",
        )
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
          "-=0.25",
        );

      // ── Hero image parallax ────────────────────────────────────────────────
      gsap.to(".ed-hero-img", {
        y: 90,
        ease: "none",
        scrollTrigger: {
          trigger: ".ed-hero",
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });

      // ── Info columns slide in ──────────────────────────────────────────────
      gsap.from(".ed-info-left", {
        opacity: 0,
        x: -60,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: ".ed-info", start: "top 82%", once: true },
      });

      gsap.from(".ed-info-right", {
        opacity: 0,
        x: 60,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: ".ed-info", start: "top 82%", once: true },
      });

      // ── Gallery heading SplitText ──────────────────────────────────────────
      const splitGallTitle = new SplitText(".ed-gall-title", { type: "chars" });

      gsap.from(splitGallTitle.chars, {
        opacity: 0,
        y: 30,
        rotateX: -60,
        duration: 0.5,
        stagger: 0.018,
        ease: "back.out(1.4)",
        scrollTrigger: {
          trigger: ".ed-gallery",
          start: "top 88%",
          once: true,
        },
      });

      // ── Gallery images clip-path reveal ───────────────────────────────────
      gsap.from(".ed-gall-img", {
        opacity: 0,
        scale: 0.9,
        clipPath: "inset(15% 15% 15% 15%)",
        duration: 0.85,
        ease: "expo.out",
        stagger: { amount: 0.5, from: "start" },
        scrollTrigger: {
          trigger: ".ed-gallery",
          start: "top 82%",
          once: true,
        },
      });

      // ── Related cards ─────────────────────────────────────────────────────
      gsap.fromTo(
        ".ed-related-card",
        { autoAlpha: 0, y: 50 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.75,
          ease: "expo.out",
          stagger: { amount: 0.3 },
          scrollTrigger: {
            trigger: ".ed-related",
            start: "top bottom",
            once: true,
          },
        },
      );

      return () => {
        splitTitle.revert();
        splitGallTitle.revert();
      };
    },
    { scope: pageRef },
  );

  return (
    <div ref={pageRef}>
      {/* ── A. Hero ─────────────────────────────────────────────────────── */}
      <section className="ed-hero relative min-h-[62vh] sm:min-h-[72vh] overflow-hidden flex items-end bg-charcoal">
        {/* Parallax image */}
        <div className="ed-hero-img absolute inset-0 scale-[1.14]">
          <Image
            src={event.img}
            alt={event.title}
            fill
            priority
            className="object-cover opacity-55"
          />
        </div>
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-charcoal/90 via-charcoal/40 to-transparent z-1" />

        <div className="relative z-10 px-6 py-14 sm:px-12 sm:py-18 lg:px-20 lg:py-20">
          <Link
            href="/#events"
            className="ed-back-link text-gold/70 hover:text-gold text-[12px] tracking-[0.18em] uppercase mb-7 inline-flex items-center gap-2 transition-colors duration-200"
          >
            ← All Events
          </Link>

          <div className="mt-2 mb-5">
            <span className="ed-tag inline-block bg-charcoal/60 border border-gold/40 backdrop-blur-sm text-gold text-[11px] tracking-[0.18em] uppercase px-4 py-1.5">
              {event.tag}
            </span>
          </div>

          <h1 className="ed-title text-[clamp(34px,5vw,72px)] font-semibold text-white leading-[1.15] text-wrap">
            {event.title}
          </h1>
        </div>
      </section>

      {/* ── B. Event Info ───────────────────────────────────────────────── */}
      <section className="ed-info py-16 sm:py-22 px-6 sm:px-12 lg:px-20 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start">
          {/* Left: metadata */}
          <div className="ed-info-left">
            <span className="text-[11px] tracking-[0.2em] uppercase text-gold">
              Event Details
            </span>

            <div className="mt-6 flex flex-col">
              {[
                { icon: "📅", label: "Date", value: event.date },
                { icon: "📍", label: "Location", value: event.location },
                { icon: "🏷️", label: "Category", value: event.tag },
              ].map(({ icon, label, value }) => (
                <div
                  key={label}
                  className="flex gap-5 items-start border-b border-light-gray py-6 first:pt-0 last:border-b-0"
                >
                  <span className="text-[22px] mt-0.5 shrink-0">{icon}</span>
                  <div>
                    <p className="text-[11px] tracking-[0.16em] uppercase text-gold mb-1.5">
                      {label}
                    </p>
                    <p className="text-[16px] text-charcoal font-medium leading-[1.4]">
                      {value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: long description + CTA */}
          <div className="ed-info-right flex flex-col justify-center lg:pt-2">
            <span className="text-[11px] tracking-[0.2em] uppercase text-gold mb-5">
              About This Event
            </span>
            <p className="text-[16px] text-gray leading-[1.9] mb-10">
              {event.longDesc}
            </p>
            <div>
              <Link href="/workshops">
                <Button variant="primary" className="font-extrabold">
                  Browse Upcoming Workshops →
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── C. Gallery ──────────────────────────────────────────────────── */}
      <section className="ed-gallery py-16 sm:py-22 px-6 sm:px-12 lg:px-20 bg-cream">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10 sm:mb-14">
            <span className="text-[11px] tracking-[0.2em] uppercase text-gold">
              Photo Highlights
            </span>
            <h2 className="ed-gall-title text-[clamp(28px,3.5vw,48px)] font-semibold text-charcoal mt-3 leading-[1.2]">
              Event Gallery
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {event.images.map((src) => (
              <div
                key={src}
                className="ed-gall-img relative overflow-hidden h-64 sm:h-72 bg-light-gray group"
              >
                <Image
                  src={src}
                  alt={`${event.title} gallery photo`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width:640px) 100vw,(max-width:1024px) 50vw,25vw"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── D. Related Events ───────────────────────────────────────────── */}
      <section className="ed-related py-16 sm:py-22 px-6 sm:px-12 lg:px-20 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10 sm:mb-14">
            <span className="text-[11px] tracking-[0.2em] uppercase text-gold">
              More From Us
            </span>
            <h2 className="text-[clamp(28px,3.5vw,48px)] font-semibold text-charcoal mt-3 leading-[1.2]">
              Related Events
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {relatedEvents.map((rel) => (
              <Link
                key={rel.slug}
                href={`/events/${rel.slug}`}
                className="ed-related-card group block border border-light-gray bg-white overflow-hidden hover:-translate-y-1 hover:shadow-[0_20px_48px_rgba(0,0,0,0.1)] transition-all duration-300"
              >
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={rel.img}
                    alt={rel.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width:640px) 100vw,50vw"
                  />
                  <span className="absolute top-4 left-4 bg-charcoal text-gold-light text-[11px] tracking-[0.14em] uppercase px-4 py-1.5">
                    {rel.tag}
                  </span>
                </div>

                <div className="p-7">
                  <h3 className="text-[21px] font-semibold text-charcoal mb-2.5 leading-[1.3] group-hover:text-teal transition-colors duration-200">
                    {rel.title}
                  </h3>
                  <p className="text-gray text-[14px] leading-[1.75] mb-5">
                    {rel.desc}
                  </p>
                  <span className="font-extrabold text-[13px] text-charcoal group-hover:text-gold transition-colors duration-200 uppercase tracking-[0.08em]">
                    View Event →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default EventDetailPage;
