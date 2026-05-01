import { HOW_IT_WORKS_DATA } from "@/constants/home";
import FadeIn from "../FadeIn";
import clsx from "clsx";

const HowItWorksSection = () => {
  return (
    <section className="w-full py-14 sm:py-20 lg:py-25 px-4 sm:px-6 lg:px-8 bg-cream">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {HOW_IT_WORKS_DATA.map((c, i) => (
            <FadeIn key={c.title} delay={i * 0.15}>
              <div
                className={clsx(
                  "py-10 px-7 sm:py-12 sm:px-10 h-full box-border border",
                  i === 1 ? "bg-charcoal text-white" : "bg-white text-charcoal",
                  "border-light-gray",
                )}
              >
                <div
                  className={clsx(
                    " text-[64px] font-light leading-none mb-2",
                    i === 1
                      ? "text-[rgba(201,168,76,0.3)]"
                      : "text-[rgba(42,124,116,0.15)]",
                  )}
                >
                  {c.n}
                </div>
                <h3
                  className={clsx(
                    " text-[26px] font-semibold mb-4 leading-[1.2]",
                    i === 1 ? "text-gold-light" : "text-charcoal",
                  )}
                >
                  {c.title}
                </h3>
                <p
                  className={clsx(
                    " text-[15px] leading-[1.8]",
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
