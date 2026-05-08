"use client";

import { REVIEWS } from "@/constants/home";
import FadeIn from "../FadeIn";
import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";

const TestimonialsSection = () => {
  const [current, setCurrent] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(3);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const total = REVIEWS.length;
  const maxIndex = Math.max(0, total - itemsPerView);
  const dotCount = maxIndex + 1;

  useEffect(() => {
    const handleResize = () => {
      setItemsPerView(window.innerWidth >= 1024 ? 3 : 1);
      setCurrent(0);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const startAutoPlay = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setCurrent((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 3000);
  }, [maxIndex]);

  useEffect(() => {
    startAutoPlay();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [startAutoPlay]);

  const goTo = (index: number) => {
    setCurrent(index);
    startAutoPlay();
  };

  return (
    <section className="w-full py-14 sm:py-20 lg:py-25 px-4 sm:px-6 lg:px-8 bg-charcoal">
      <div className="max-w-7xl mx-auto">
        <FadeIn>
          <div className="text-center mb-12 sm:mb-18">
            <span className="text-[12px] tracking-[0.2em] uppercase text-gold">
              Reviews
            </span>
            <h2 className="text-[clamp(30px,4vw,56px)] font-semibold text-white mt-3 leading-[1.2]">
              What Participants Are Saying
            </h2>
            <div className="w-12 h-px bg-gold mx-auto mt-5" />
          </div>
        </FadeIn>

        {/* Carousel */}
        <FadeIn>
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-700 ease-in-out"
              style={{
                transform: `translateX(-${current * (100 / itemsPerView)}%)`,
              }}
            >
              {REVIEWS.map((r) => (
                <div
                  key={r.name}
                  className="shrink-0 px-3"
                  style={{ width: `${100 / itemsPerView}%` }}
                >
                  <div className="group py-8 sm:py-9 px-6 sm:px-8 bg-[rgba(255,255,255,0.03)] border border-[rgba(201,168,76,0.2)] transition-all duration-300 hover:border-[rgba(201,168,76,0.6)] h-full ">
                    <div className="text-gold text-[18px] tracking-[4px] mb-5">
                      ★★★★★
                    </div>
                    <p className="text-[rgba(255,255,255,0.75)] leading-[1.8] text-[15px] mb-6 italic">
                      &quot;{r.text}&quot;
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0 ring-2 ring-[rgba(201,168,76,0.35)]">
                        <Image
                          src={r.avatarImg}
                          alt={r.name}
                          fill
                          className="object-cover"
                          sizes="40px"
                        />
                      </div>
                      <div>
                        <div className="text-gold-light text-[14px] font-semibold">
                          {r.name}
                        </div>
                        <div className="text-[rgba(255,255,255,0.4)] text-[12px] tracking-widest uppercase">
                          {r.location}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation dots */}
          {dotCount > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {REVIEWS.slice(0, dotCount).map((r, i) => (
                <button
                  key={`dot-${r.name}`}
                  onClick={() => goTo(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === current
                      ? "w-6 bg-gold"
                      : "w-2 bg-[rgba(201,168,76,0.3)] hover:bg-[rgba(201,168,76,0.6)]"
                  }`}
                />
              ))}
            </div>
          )}
        </FadeIn>

        {/* CTA Banner */}
        <FadeIn>
          <div className="mt-12 sm:mt-16 pt-12 sm:pt-16 border-t border-[rgba(201,168,76,0.15)] text-center">
            <h3 className="text-[clamp(22px,3vw,40px)] font-semibold text-white leading-[1.2] mb-7">
              Ready To Create Your Own Resin Masterpiece?
            </h3>
            <Link
              href="/workshops"
              className="inline-block px-9 py-3.5 bg-gold text-charcoal text-[13px] font-semibold tracking-[0.15em] uppercase hover:bg-gold-light transition-colors duration-300"
            >
              Reserve Your Spot
            </Link>
          </div>
        </FadeIn>
      </div>
    </section>
  );
};

export default TestimonialsSection;
