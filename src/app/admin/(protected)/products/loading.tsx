import ProductGridSkeleton from "@/components/skeleton/ProductGridSkeleton";

const AdminProductsLoadingPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      <ProductGridSkeleton />
    </div>
  );
};

export default AdminProductsLoadingPage;
