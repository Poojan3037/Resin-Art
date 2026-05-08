import { HOW_IT_WORKS_DATA } from "@/constants/home";
import FadeIn from "../FadeIn";
import clsx from "clsx";
import Image from "next/image";

const HOW_IT_WORKS_ICONS = [
  "/images/art.png",
  "/images/presentation.png",
  "/images/house.png",
];

const HowItWorksSection = () => {
  return (
    <section className="w-full py-14 sm:py-20 lg:py-25 px-4 relative   sm:px-6 lg:px-8 bg-cream antialiased">
      <div className="max-w-7xl mx-auto">
        <FadeIn>
          <div className="text-center mb-12 sm:mb-18">
            <span className="text-[12px] tracking-[0.2em] uppercase text-gold">
              The Experience
            </span>
            <h2 className="text-[clamp(30px,4vw,56px)] font-semibold text-charcoal mt-3 leading-[1.2]">
              How the Workshop Works
            </h2>
            <div className="w-12 h-px bg-gold mx-auto mt-5" />
          </div>
        </FadeIn>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
          {HOW_IT_WORKS_DATA.map((c, i) => (
            <FadeIn key={c.title} delay={i * 0.15}>
              <div
                className={clsx(
                  "group relative isolate overflow-hidden py-10 px-7 sm:py-12 sm:px-9 h-full box-border border transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(26,39,68,0.12)]",
                  i === 1 ? "bg-charcoal text-white" : "bg-white text-charcoal",
                  "border-light-gray",
                )}
              >
                <div
                  className={clsx(
                    "absolute -right-14 -top-14 w-40 h-40 rounded-full blur-3xl pointer-events-none transition-opacity duration-500",
                    i === 1
                      ? "bg-[rgba(201,168,76,0.22)]"
                      : "bg-[rgba(91,168,160,0.2)]",
                  )}
                />
                <div
                  className={clsx(
                    "absolute left-0 right-0 top-0 h-0.5 scale-x-0 origin-left transition-transform duration-500",
                    i === 1
                      ? "bg-gold scale-x-100"
                      : "bg-teal group-hover:scale-x-100",
                  )}
                />
                <div className="relative z-10 flex items-center justify-between mb-7">
                  <div
                    className={clsx(
                      "w-13 h-13 rounded-2xl border flex items-center justify-center transition-all duration-500 group-hover:rotate-[8deg] group-hover:scale-105",
                      i === 1
                        ? "border-[rgba(232,213,160,0.45)] bg-[rgba(255,255,255,0.08)]"
                        : "border-[rgba(42,124,116,0.25)] bg-teal-pale",
                    )}
                  >
                    <Image
                      src={HOW_IT_WORKS_ICONS[i]}
                      alt={`${c.title} icon`}
                      width={28}
                      height={28}
                      className={clsx(
                        "object-contain transition-transform duration-500",
                        i === 1 ? "brightness-0 invert" : "",
                      )}
                    />
                  </div>
                  <span
                    className={clsx(
                      "text-[12px] uppercase tracking-[0.22em]",
                      i === 1 ? "text-[rgba(232,213,160,0.9)]" : "text-teal",
                    )}
                  >
                    Step {i + 1}
                  </span>
                </div>
                <div
                  className={clsx(
                    "absolute opacity-95   right-4 bottom-2 sm:right-5 sm:bottom-3 text-[84px] sm:text-[92px] font-light leading-none pointer-events-none select-none transition-transform duration-500 group-hover:-translate-y-1",
                    i === 1
                      ? "text-[rgba(201,168,76,0.3)]"
                      : "text-[rgba(42,124,116,0.15)]",
                  )}
                >
                  {c.n}
                </div>
                <h3
                  className={clsx(
                    "text-[26px] font-semibold mb-4 leading-[1.2]",
                    i === 1 ? "text-gold-light" : "text-charcoal",
                  )}
                >
                  {c.title}
                </h3>
                <p
                  className={clsx(
                    "text-[15px] leading-[1.8]",
                    i === 1 ? "text-[rgba(255,255,255,0.65)]" : "text-gray",
                  )}
                >
                  {c.desc}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
