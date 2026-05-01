import { HERO_SECTION_DATA } from "@/constants/home";
import Link from "next/link";

const HeroSection = () => {
  return (
    <section className="relative flex items-center overflow-hidden pb-24 sm:pb-32 lg:pb-40 bg-navy">
      {/* Abstract resin background */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.85]"
        viewBox="0 0 1400 900"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <radialGradient id="g1" cx="20%" cy="30%">
            <stop offset="0%" stopColor="#2A7C74" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#1A2744" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="g2" cx="80%" cy="60%">
            <stop offset="0%" stopColor="#C9A84C" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#8B6914" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="g3" cx="60%" cy="10%">
            <stop offset="0%" stopColor="#D4829A" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#D4829A" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="g4" cx="10%" cy="80%">
            <stop offset="0%" stopColor="#5BA8A0" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#5BA8A0" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="1400" height="900" fill="#1A2744" />
        <ellipse cx="280" cy="270" rx="420" ry="320" fill="url(#g1)" />
        <ellipse cx="1120" cy="540" rx="380" ry="300" fill="url(#g2)" />
        <ellipse cx="840" cy="90" rx="300" ry="240" fill="url(#g3)" />
        <ellipse cx="140" cy="720" rx="260" ry="200" fill="url(#g4)" />
        <ellipse
          cx="900"
          cy="700"
          rx="200"
          ry="160"
          fill="url(#g1)"
          opacity="0.4"
        />
        <path
          d="M0,400 Q350,200 700,450 Q1050,700 1400,350 L1400,900 L0,900 Z"
          fill="#0F1E3A"
          opacity="0.5"
        />
      </svg>

      {/* Unsplash resin image overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-[0.18]"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1615486511262-c7b536a4db8e?w=1400&q=80)",
        }}
      />

      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 lg:pt-30">
        <div className="max-w-170">
          <div className="flex items-center gap-3 mb-5 sm:mb-6">
            <div className="h-px w-12 bg-gold" />
            <span className="text-[11px] sm:text-[12px] tracking-widest-[0.2em] uppercase text-gold-light">
              Calgary&apos;s Premier Resin Studio
            </span>
          </div>
          <h1 className="text-[clamp(36px,7vw,90px)] font-semibold text-white leading-[1.1] mb-5 sm:mb-6 tracking-widest-[-0.01em]">
            Create Your Own
            <br />
            <em className="text-gold-light italic">Resin Masterpiece</em>
          </h1>
          <p className="text-[15px] sm:text-[17px] lg:text-[18px] leading-[1.8] mb-8 sm:mb-10 text-[rgba(255,255,255,0.75)] max-w-130">
            Join our hands-on resin art workshops and create stunning,
            one-of-a-kind pieces you&apos;ll be proud to take home. No
            experience needed — just creativity.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Link href="/workshops">
              <button className="w-full sm:w-auto text-white px-8 sm:px-10 py-3.5 sm:py-4 text-[14px] sm:text-[15px] border border-transparent tracking-widest-[0.12em] uppercase font-extrabold cursor-pointer bg-gold hover:bg-transparent hover:border-white/40">
                Book Your Seat
              </button>
            </Link>
            <Link href="/shop">
              <button className="w-full sm:w-auto bg-transparent text-white border border-white/40 px-8 sm:px-9 py-3.5 sm:py-4 text-[14px] sm:text-[15px] tracking-widest uppercase cursor-pointer hover:bg-charcoal hover:text-gold-light">
                Explore Gallery
              </button>
            </Link>
          </div>

          <div className="flex flex-wrap justify-center  gap-8 sm:gap-10 mt-10 sm:mt-14">
            {HERO_SECTION_DATA.map(([n, l]) => (
              <div key={l}>
                <div className="text-[26px] sm:text-[32px] font-extrabold text-gold-light">
                  {n}
                </div>
                <div className="text-[12px] sm:text-[13px] tracking-widest-[0.08em] uppercase text-[rgba(255,255,255,0.55)]">
                  {l}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="text-[11px] tracking-widest-[0.2em] uppercase text-[rgba(255,255,255,0.4)]">
          Scroll
        </span>
        <div className="w-px h-12 bg-linear-to-b from-gold to-transparent" />
      </div>
    </section>
  );
};

export default HeroSection;
