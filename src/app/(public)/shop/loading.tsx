import ProductGridSkeleton from "@/components/skeleton/ProductGridSkeleton";

const ShopLoadingPage = () => {
  return (
    <div className="max-w-7xl mx-auto py-14 sm:py-18 px-4 sm:px-6 lg:px-8">
      <ProductGridSkeleton />
    </div>
  );
};

export default ShopLoadingPage;
