import { WORK_EXPERIENCE_DATA } from "@/constants/home";
import FadeIn from "../FadeIn";

const WorkshopExperienceSection = () => {
  return (
    <section className="w-full py-14 sm:py-20 lg:py-25 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <FadeIn>
          <div className="text-center mb-12 sm:mb-18">
            <span className="text-[12px] tracking-[0.2em] uppercase text-gold">
              Three Pillars
            </span>
            <h2 className="text-[clamp(30px,4vw,56px)] font-semibold text-charcoal mt-3 leading-[1.2]">
              The Workshop Experience
            </h2>
            <div className="w-12 h-px bg-gold mx-auto mt-5" />
          </div>
        </FadeIn>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {WORK_EXPERIENCE_DATA.map((c, i) => (
            <FadeIn key={c.title} delay={i * 0.15}>
              <div>
                <div className="overflow-hidden mb-6 relative">
                  <img
                    src={c.img}
                    alt={c.title}
                    className="w-full h-[280px] object-cover block transition-transform duration-[600ms] ease-out hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-[rgba(26,39,68,0.6)] to-transparent" />
                  <div className="absolute bottom-5 left-6">
                    <span className=" text-[36px] font-extrabold text-white tracking-[-0.02em]">
                      {c.title}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-px bg-gold" />
                  <span className="text-gold text-xl tracking-widest uppercase ">
                    Step {i + 1}
                  </span>
                </div>
                <p className="text-[15px] leading-[1.8]  text-gray">{c.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WorkshopExperienceSection;
