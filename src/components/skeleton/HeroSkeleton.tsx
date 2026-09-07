/**
 * Placeholder for the navy hero band. Keeps the band's colour and height so
 * the page does not jump when the real hero streams in.
 */
const HeroSkeleton = () => (
  <div className="w-full bg-navy min-h-170 flex items-center">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
      <div className="space-y-5 max-w-xl">
        <div className="h-3 w-40 bg-white/10 animate-pulse" />
        <div className="h-14 w-full bg-white/10 animate-pulse" />
        <div className="h-14 w-3/4 bg-white/10 animate-pulse" />
        <div className="h-4 w-full bg-white/10 animate-pulse" />
        <div className="h-12 w-48 bg-white/10 animate-pulse" />
      </div>
    </div>
  </div>
);

export default HeroSkeleton;
