import Skeleton from "./Skeleton";

/**
 * Stand-in for the coloured hero band every public page opens with. Rendering
 * the real band colour would be a lie about which page is loading, so it stays
 * neutral and only holds the space.
 */
const PageHeroSkeleton = () => (
  <div className="bg-cream py-14 sm:py-18 px-4 sm:px-8 flex flex-col items-center gap-4">
    <Skeleton className="h-3 w-40" />
    <Skeleton className="h-12 w-72 max-w-full" />
    <Skeleton className="h-4 w-96 max-w-full" />
  </div>
);

export default PageHeroSkeleton;
