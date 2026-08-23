import Skeleton from "@/components/skeleton/Skeleton";
import PageHeroSkeleton from "@/components/skeleton/PageHeroSkeleton";

const VideosLoadingPage = () => (
  <div>
    <PageHeroSkeleton />
    <div className="max-w-7xl mx-auto py-14 sm:py-18 px-4 sm:px-6 lg:px-8">
      <div className="bg-white border border-light-gray p-8 sm:p-12 max-w-4xl mx-auto flex flex-col items-center gap-4">
        <Skeleton className="h-3 w-28" />
        <Skeleton className="h-8 w-80 max-w-full" />
        <Skeleton className="h-4 w-full max-w-140" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 w-full mt-6">
          {["a", "b", "c"].map((key) => (
            <div key={key} className="space-y-3">
              <Skeleton className="h-7 w-7" />
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-full" />
            </div>
          ))}
        </div>
        <Skeleton className="h-12 w-full max-w-md mt-8" />
      </div>
    </div>
  </div>
);

export default VideosLoadingPage;
