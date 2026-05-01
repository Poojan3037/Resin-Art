import FadeIn from "../FadeIn";

const AboutSection = () => {
  return (
    <div>
      {/* Hero */}
      <section className="bg-cream">
        <div className="max-w-7xl mx-auto py-14 sm:py-20 px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-20 items-center">
          <FadeIn>
            <div>
              <span className="text-gold text-xs tracking-[0.2em] uppercase">
                About the Artist
              </span>
              <h1 className="text-[clamp(36px,4.5vw,68px)] font-semibold text-charcoal mt-3 leading-[1.15]">
                Meet Tanvi —<br />
                <em className="text-teal">The Artist Behind</em>
                <br />
                the Resin
              </h1>
              <div className="w-12 h-px bg-gold my-6 sm:my-7" />
              <p className="text-gray text-base leading-[1.9] mb-5">
                Tanvi&apos;s love for resin art began as a hobby during a quiet
                afternoon in her Calgary home. What started as experimentation
                quickly evolved into a passion — and then a mission: to share
                the meditative, joyful process of resin art with everyone.
              </p>
              <p className="text-gray text-base leading-[1.9]">
                With years of practice and hundreds of happy workshop
                participants, Tanvi has created a space where creativity flows
                freely — no judgment, no pressure, just the beautiful alchemy of
                color and resin transforming under your hands.
              </p>
            </div>
          </FadeIn>
          <FadeIn delay={0.2}>
            <div className="relative mt-8 md:mt-0">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&q=80"
                alt="Tanvi"
                className="w-full h-80 sm:h-110 lg:h-135 object-cover block"
              />
              <div className="absolute -bottom-6 -left-4 sm:-left-6 bg-gold py-4 sm:py-5 px-5 sm:px-7 text-white">
                <div className="text-[24px] sm:text-[28px] font-bold leading-none">
                  5+
                </div>
                <div className="text-xs tracking-[0.12em] uppercase opacity-90">
                  Years of Art
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* What makes it unique */}
      <section className="bg-white py-14 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <FadeIn>
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-[clamp(28px,3.5vw,52px)] font-semibold text-charcoal">
                What Makes Our Workshops Unique
              </h2>
              <div className="w-12 h-px bg-gold mx-auto mt-5" />
            </div>
          </FadeIn>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {[
              [
                "Small Groups",
                "Maximum 10 participants per session so everyone gets personal attention.",
              ],
              [
                "Premium Materials",
                "We use professional-grade epoxy resin and high-pigment dyes — the same materials used by gallery artists.",
              ],
              [
                "Your Vision",
                "No templates or rigid instructions. You're encouraged to follow your instincts and create something truly yours.",
              ],
              [
                "Inclusive Space",
                "Workshops are designed to be welcoming to all ages, backgrounds, and abilities.",
              ],
            ].map(([title, desc], i) => (
              <FadeIn key={title} delay={i * 0.1}>
                <div className="py-8 sm:py-10 px-7 sm:px-9 border-l border-b border-light-gray h-full">
                  <div className="text-[44px] font-light text-gold-light leading-none mb-4">
                    0{i + 1}
                  </div>
                  <h3 className="text-[22px] font-semibold text-charcoal mb-3">
                    {title}
                  </h3>
                  <p className="text-gray text-sm leading-[1.8]">{desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutSection;
