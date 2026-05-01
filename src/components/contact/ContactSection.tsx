"use client";

import { useState } from "react";
import FadeIn from "../FadeIn";

const ContactSection = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  return (
    <div>
      <div className="bg-teal py-14 sm:py-18 px-4 sm:px-8 text-center">
        <span className="text-white/70 text-xs tracking-[0.2em] uppercase">
          We&apos;d Love to Hear from You
        </span>
        <h1 className="text-[clamp(36px,5vw,72px)] font-semibold text-white mt-3">
          Get in Touch
        </h1>
      </div>

      <div className="max-w-7xl mx-auto py-14 sm:py-20 px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-20">
        <FadeIn>
          <div>
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
                  onChange={(e) =>
                    setForm({ ...form, [field]: e.target.value })
                  }
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
            <button className="bg-charcoal text-gold-light border-none py-4 px-11 text-[15px] tracking-[0.12em] uppercase cursor-pointer font-bold hover:bg-gold hover:text-white">
              Send Message
            </button>
          </div>
        </FadeIn>

        <FadeIn delay={0.2}>
          <div>
            <h2 className="text-4xl font-semibold text-charcoal mb-9">
              Contact Info
            </h2>
            {[
              ["📍", "Location", "Calgary, Alberta & surrounding area"],
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
                Join our creative community on Instagram to see
                behind-the-scenes, student artwork, and upcoming events.
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
        </FadeIn>
      </div>
    </div>
  );
};

export default ContactSection;
