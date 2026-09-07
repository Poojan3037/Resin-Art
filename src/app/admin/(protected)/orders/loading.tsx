import OrderTableSkeleton from "@/components/skeleton/OrderTableSkeleton";

const AdminOrdersLoadingPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      <OrderTableSkeleton />
    </div>
  );
};

export default AdminOrdersLoadingPage;
