import Skeleton from "@/components/skeleton/Skeleton";
import WorkshopCardSkeleton from "@/components/skeleton/WorkshopCardSkeleton";

const AdminWorkshopsLoadingPage = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
    <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
      <Skeleton className="h-10 w-52" />
      <Skeleton className="h-11 w-40" />
    </div>
    <Skeleton className="h-12 w-full max-w-sm mb-8" />
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {["w1", "w2", "w3", "w4", "w5", "w6"].map((key) => (
        <WorkshopCardSkeleton key={key} />
      ))}
    </div>
  </div>
);

export default AdminWorkshopsLoadingPage;
