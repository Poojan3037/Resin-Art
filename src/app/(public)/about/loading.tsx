import Skeleton from "@/components/skeleton/Skeleton";
import PageHeroSkeleton from "@/components/skeleton/PageHeroSkeleton";

const AboutLoadingPage = () => (
  <div>
    <PageHeroSkeleton />
    <div className="max-w-7xl mx-auto py-14 sm:py-20 px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-20">
      <Skeleton className="w-full h-100" />
      <div className="space-y-4">
        <Skeleton className="h-9 w-2/3" />
        {["l1", "l2", "l3", "l4", "l5"].map((key) => (
          <Skeleton key={key} className="h-4 w-full" />
        ))}
        <Skeleton className="h-4 w-3/4" />
      </div>
    </div>
  </div>
);

export default AboutLoadingPage;
