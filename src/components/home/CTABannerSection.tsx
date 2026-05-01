import Image from "next/image";
import FadeIn from "../FadeIn";

const CTABannerSection = () => {
  return (
    <section className="w-full py-14 sm:py-20 lg:py-25 px-4 sm:px-6 lg:px-8 bg-teal text-center">
      <div className="max-w-200 mx-auto">
        <FadeIn>
          <div className="flex justify-center gap-12 flex-wrap mb-14">
            {[
              ["/images/paint-palette.png", "Beginner Friendly"],
              ["/images/box.png", "All Materials Included"],
              ["/images/art.png", "Take Home Your Artwork"],
            ].map(([icon, label]) => (
              <div key={label} className="flex flex-col items-center gap-2.5">
                <Image src={icon} alt={label} width={30} height={30} />

                <span className="text-[rgba(255,255,255,0.85)] text-[12px] tracking-[0.14em] uppercase ">
                  {label}
                </span>
              </div>
            ))}
          </div>
          <h2 className=" text-[clamp(36px,4vw,60px)] font-semibold text-white mb-5 leading-[1.15]">
            Create Your Own
            <br />
            <em className="text-gold-light italic">Resin Masterpiece</em>
          </h2>
          <p className="text-[rgba(255,255,255,0.8)] text-[17px] leading-[1.8] mb-10 ">
            Looking for a fun and creative experience? Reserve your spot in our
            resin art workshop and enjoy an unforgettable artistic journey.
          </p>
          <button className="bg-charcoal text-gold-light border-none px-8 sm:px-13 py-4 sm:py-4.5 text-[14px] sm:text-[16px] tracking-[0.14em] uppercase font-extrabold cursor-pointer hover:bg-gold hover:text-white">
            Book Your Seat
          </button>
        </FadeIn>
      </div>
    </section>
  );
};

export default CTABannerSection;
