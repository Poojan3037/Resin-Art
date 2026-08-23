"use client";

import Button from "@/components/Button";
import { sendContactInquiry } from "@/actions/email/contact";
import { ContactSchema, type ContactFormValues } from "@/schema/contact";
import { zodResolver } from "@hookform/resolvers/zod";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams } from "next/navigation";
import { INQUIRY_MESSAGES } from "@/constants/workshops";
import { toast } from "sonner";

gsap.registerPlugin(ScrollTrigger, SplitText);

const ContactSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(ContactSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  const messageType = searchParams.get("messageType");

  // Pre-fill the message when arriving from an inquiry redirect.
  //
  // `setValue`, not `reset`: reset replaces the whole form state, so it blanked
  // name/email. And the effect keys off the extracted `messageType` string
  // rather than the `searchParams` object, whose identity can change on any
  // render — that combination used to wipe input the visitor had already typed.
  useEffect(() => {
    if (messageType && INQUIRY_MESSAGES[messageType]) {
      setValue("message", INQUIRY_MESSAGES[messageType].message, {
        shouldDirty: false,
      });
    }
  }, [messageType, setValue]);

  const onSubmit = async (data: ContactFormValues) => {
    const subject = messageType
      ? (INQUIRY_MESSAGES[messageType]?.subject ?? undefined)
      : undefined;

    try {
      const result = await sendContactInquiry({ ...data, subject });
      if (result.success) {
        toast.success(result.message);
        reset();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      // A server action that throws rejects here. Without this the form just
      // stopped, giving the visitor no signal that nothing was sent.
      console.error("[contact] request failed:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

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
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="mb-6">
              <label
                htmlFor="contact-name"
                className="block text-[11px] tracking-[0.14em] uppercase text-gray mb-2"
              >
                Full Name
              </label>
              <input
                id="contact-name"
                type="text"
                {...register("name")}
                className="w-full py-3.5 px-4.5 border border-light-gray text-[15px] outline-none box-border"
              />
              {errors.name && (
                <p className="text-red-500 text-[12px] mt-1.5">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="mb-6">
              <label
                htmlFor="contact-email"
                className="block text-[11px] tracking-[0.14em] uppercase text-gray mb-2"
              >
                Email Address
              </label>
              <input
                id="contact-email"
                type="email"
                {...register("email")}
                className="w-full py-3.5 px-4.5 border border-light-gray text-[15px] outline-none box-border"
              />
              {errors.email && (
                <p className="text-red-500 text-[12px] mt-1.5">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="mb-8">
              <label
                htmlFor="contact-message"
                className="block text-[11px] tracking-[0.14em] uppercase text-gray mb-2"
              >
                Message
              </label>
              <textarea
                id="contact-message"
                {...register("message")}
                rows={6}
                className="w-full py-3.5 px-4.5 border border-light-gray text-[15px] outline-none box-border resize-y"
              />
              {errors.message && (
                <p className="text-red-500 text-[12px] mt-1.5">
                  {errors.message.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              className="font-bold"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Sending…" : "Send Message"}
            </Button>
          </form>
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
