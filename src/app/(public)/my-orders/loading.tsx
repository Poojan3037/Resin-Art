import Skeleton from "@/components/skeleton/Skeleton";
import OrderTableSkeleton from "@/components/skeleton/OrderTableSkeleton";

const MyOrdersLoadingPage = () => (
  <div className="max-w-5xl mx-auto py-14 sm:py-18 px-4 sm:px-6 lg:px-8">
    <Skeleton className="h-11 w-56 mb-8" />
    <OrderTableSkeleton />
  </div>
);

export default MyOrdersLoadingPage;
