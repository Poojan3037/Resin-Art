import Skeleton from "@/components/skeleton/Skeleton";
import StatCardListSkeleton from "@/components/admin/dashboard/StatCardListSkeleton";

const AdminDashboardLoadingPage = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
    <Skeleton className="h-10 w-60 mb-8" />
    <StatCardListSkeleton />
  </div>
);

export default AdminDashboardLoadingPage;
