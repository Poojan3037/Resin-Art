import HeroContent from "./HeroContent";
import WorkshopCardCarousel from "./WorkshopCardCarousel";
import { getWorkshops } from "@/actions/workshop";
import { cacheLife, cacheTag } from "next/cache";
import { CACHE } from "@/constants/cache";

const HeroSection = async () => {
  "use cache";
  cacheLife("hours");
  cacheTag(CACHE.WORKSHOP);

  const workshops = await getWorkshops();

  return (
    <section className="relative flex items-center overflow-hidden pb-24 sm:pb-32 lg:pb-40 bg-navy min-h-170">
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

      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 lg:pt-28 w-full">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16 xl:gap-24">
          {/* ── LEFT: text content ────────────────────────────────────── */}
          <HeroContent />

          {/* ── RIGHT: 3-D workshop card carousel ─────────────────────── */}
          <WorkshopCardCarousel data={workshops} />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
