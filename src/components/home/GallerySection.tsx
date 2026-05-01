import { GALLERY_SECTION_DATA } from "@/constants/home";
import FadeIn from "../FadeIn";

const GallerySection = () => {
  return (
    <section className="w-full py-14 sm:py-20 lg:py-25 px-4 sm:px-6 lg:px-8 bg-cream">
      <div className="max-w-7xl mx-auto">
        <FadeIn>
          <div className="flex justify-between items-end mb-10 sm:mb-16 flex-wrap gap-4 sm:gap-6">
            <div>
              <span className="text-[12px] tracking-[0.2em] uppercase text-gold">
                Recent Events
              </span>
              <h2 className="text-[clamp(30px,4vw,56px)] font-semibold text-charcoal mt-3 leading-[1.2]">
                Creative Workshop
                <br />
                <em className="text-teal">Highlights</em>
              </h2>
            </div>
            <button className="border border-charcoal bg-transparent px-6 sm:px-7 py-3 text-[13px] sm:text-[14px] tracking-[0.12em] uppercase cursor-pointer font-semibold hover:bg-charcoal hover:text-gold-light">
              View All Events
            </button>
          </div>
        </FadeIn>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {GALLERY_SECTION_DATA.map((e, i) => (
            <FadeIn key={e.title} delay={i * 0.12}>
              <div className="group bg-white border border-light-gray overflow-hidden transition-transform duration-300 ease-in-out hover:-translate-y-1 hover:shadow-[0_20px_48px_rgba(0,0,0,0.1)] h-full">
                <div className="relative overflow-hidden">
                  <img
                    src={e.img}
                    alt={e.title}
                    className="w-full h-55 object-cover block transition-transform duration-500 ease-in-out group-hover:scale-105"
                  />
                  <span className="absolute top-4 left-4 bg-charcoal text-gold-light text-sm tracking-[0.14em] uppercase px-4 py-1.5 ">
                    {e.tag}
                  </span>
                </div>
                <div className="p-7 pb-8">
                  <h3 className=" text-[22px] font-semibold text-charcoal mb-3 leading-[1.3]">
                    {e.title}
                  </h3>
                  <p className="text-gray text-[14px] leading-[1.7] mb-6 ">
                    {e.desc}
                  </p>
                  <button className="bg-none border-none p-0 text-gold text-[13px] tracking-[0.14em] uppercase  font-extrabold cursor-pointer flex items-center gap-2">
                    View Event <span className="text-[18px]">→</span>
                  </button>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GallerySection;
