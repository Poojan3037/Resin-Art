import { REVIEWS } from "@/constants/home";
import FadeIn from "../FadeIn";

const TestimonialsSection = () => {
  return (
    <section className="w-full py-14 sm:py-20 lg:py-25 px-4 sm:px-6 lg:px-8 bg-charcoal">
      <div className="max-w-7xl mx-auto">
        <FadeIn>
          <div className="text-center mb-12 sm:mb-18">
            <span className="text-[12px] tracking-[0.2em] uppercase text-gold">
              Testimonials
            </span>
            <h2 className="text-[clamp(30px,4vw,56px)] font-semibold text-white mt-3 leading-[1.2]">
              What Participants Are Saying
            </h2>
            <div className="w-12 h-px bg-gold mx-auto mt-5" />
          </div>
        </FadeIn>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {REVIEWS.map((r, i) => (
            <FadeIn key={r.name} delay={i * 0.1}>
              <div className="py-8 sm:py-9 px-6 sm:px-8 bg-[rgba(255,255,255,0.03)] border border-[rgba(201,168,76,0.2)] transition-colors duration-300 hover:border-[rgba(201,168,76,0.6)] h-full">
                <div className="text-gold text-[18px] tracking-[4px] mb-5">
                  ★★★★★
                </div>
                <p className="text-[rgba(255,255,255,0.75)] leading-[1.8] text-[15px] mb-6  italic">
                  &quot;{r.text}&quot;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-teal flex items-center justify-center text-white text-[14px] font-semibold ">
                    {r.name[0]}
                  </div>
                  <div>
                    <div className="text-gold-light text-[14px] font-semibold ">
                      {r.name}
                    </div>
                    <div className="text-[rgba(255,255,255,0.4)] text-[12px] tracking-widest uppercase">
                      {r.location}
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
