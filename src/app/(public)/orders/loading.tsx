import Skeleton from "@/components/skeleton/Skeleton";
import PageHeroSkeleton from "@/components/skeleton/PageHeroSkeleton";
import OrderTableSkeleton from "@/components/skeleton/OrderTableSkeleton";

const OrdersLoadingPage = () => (
  <div>
    <PageHeroSkeleton />
    <div className="max-w-4xl mx-auto py-14 sm:py-18 px-4 sm:px-6 lg:px-8">
      <Skeleton className="h-13 w-full max-w-md mb-8" />
      <OrderTableSkeleton />
    </div>
  </div>
);

export default OrdersLoadingPage;
