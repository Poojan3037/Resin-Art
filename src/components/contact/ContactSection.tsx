"use client";

import Button from "@/components/Button";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { useState, useRef } from "react";

gsap.registerPlugin(ScrollTrigger, SplitText);

const ContactSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  useGSAP(
    () => {
      // ── Hero banner ─────────────────────────────────────────────────
      const splitHero = new SplitText(".contact-hero-heading", {
        type: "chars",
      });

      gsap
        .timeline({
          scrollTrigger: {
            trigger: ".contact-hero",
            start: "top 85%",
            once: true,
          },
        })
        .from(".contact-hero-eyebrow", {
          opacity: 0,
          y: 18,
          duration: 0.5,
          ease: "expo.out",
        })
        .from(
          splitHero.chars,
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

      // ── Form column ──────────────────────────────────────────────────
      gsap.from(".contact-form-col", {
        opacity: 0,
        x: -60,
        duration: 0.85,
        ease: "expo.out",
        scrollTrigger: {
          trigger: ".contact-columns",
          start: "top 82%",
          once: true,
        },
      });

      // ── Info column ──────────────────────────────────────────────────
      gsap.from(".contact-info-col", {
        opacity: 0,
        x: 60,
        duration: 0.85,
        ease: "expo.out",
        scrollTrigger: {
          trigger: ".contact-columns",
          start: "top 82%",
          once: true,
        },
      });

      return () => {
        splitHero.revert();
      };
    },
    { scope: sectionRef },
  );

  return (
    <div ref={sectionRef}>
      <div className="contact-hero bg-teal py-14 sm:py-18 px-4 sm:px-8 text-center">
        <span className="contact-hero-eyebrow text-white/70 text-xs tracking-[0.2em] uppercase">
          We&apos;d Love to Hear from You
        </span>
        <h1 className="contact-hero-heading text-[clamp(36px,5vw,72px)] font-semibold text-white mt-3">
          Get in Touch
        </h1>
      </div>

      <div className="contact-columns max-w-7xl mx-auto py-14 sm:py-20 px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-20">
        <div className="contact-form-col">
          <h2 className="text-4xl font-semibold text-charcoal mb-6">
            Send Us a Message
          </h2>
          {[
            ["Full Name", "name", "text"],
            ["Email Address", "email", "email"],
          ].map(([label, field, type]) => (
            <div key={field} className="mb-6">
              <label className="block text-[11px] tracking-[0.14em] uppercase text-gray mb-2">
                {label}
              </label>
              <input
                type={type}
                value={form[field as keyof typeof form]}
                onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                className="w-full py-3.5 px-4.5 border border-light-gray text-[15px] outline-none box-border"
              />
            </div>
          ))}
          <div className="mb-8">
            <label className="block text-[11px] tracking-[0.14em] uppercase text-gray mb-2">
              Message
            </label>
            <textarea
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              rows={6}
              className="w-full py-3.5 px-4.5 border border-light-gray text-[15px] outline-none box-border resize-y"
            />
          </div>
          <Button variant="primary" size="md" className="font-bold">
            Send Message
          </Button>
        </div>

        <div className="contact-info-col">
          <h2 className="text-4xl font-semibold text-charcoal mb-9">
            Contact Info
          </h2>
          {[
            ["📍", "Location", "Calgary, High River & surrounding area"],
            ["📸", "Instagram", "@resinartbytanvi"],
            ["📧", "Email", "hello@resinartbytanvi.com"],
          ].map(([icon, label, val]) => (
            <div
              key={label}
              className="flex gap-5 mb-8 pb-8 border-b border-light-gray"
            >
              <div className="text-2xl w-8 shrink-0">{icon}</div>
              <div>
                <div className="text-[11px] tracking-[0.14em] uppercase text-gold mb-1.5">
                  {label}
                </div>
                <div className="text-lg text-charcoal">{val}</div>
              </div>
            </div>
          ))}

          <div className="bg-cream p-8 mt-4">
            <h3 className="text-[22px] font-semibold text-charcoal mb-3">
              Follow Along
            </h3>
            <p className="text-gray text-sm leading-[1.8] mb-5">
              Join our creative community on Instagram to see behind-the-scenes,
              student artwork, and upcoming events.
            </p>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2.5 bg-charcoal text-gold-light py-3 px-6 text-[13px] tracking-[0.12em] uppercase no-underline font-bold transition-all duration-300 hover:bg-gold hover:text-white"
            >
              📸 Follow on Instagram
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactSection;
