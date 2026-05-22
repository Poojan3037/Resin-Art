const ProductDetailLoadingPage = () => {
  return (
    <div className="max-w-7xl mx-auto py-14 sm:py-18 px-4 sm:px-6 lg:px-8 animate-pulse">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Product Image Skeleton */}
        <div className="w-full h-[400px] sm:h-[500px] bg-light-gray rounded-2xl" />

        {/* Product Details Skeleton */}
        <div className="space-y-6">
          <div className="h-5 bg-light-gray rounded w-32" />

          <div className="space-y-3">
            <div className="h-10 bg-light-gray rounded w-full" />
            <div className="h-10 bg-light-gray rounded w-4/5" />
          </div>

          <div className="h-8 bg-light-gray rounded w-40" />

          <div className="space-y-3">
            <div className="h-4 bg-light-gray rounded w-full" />
            <div className="h-4 bg-light-gray rounded w-full" />
            <div className="h-4 bg-light-gray rounded w-5/6" />
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-4">
            <div className="h-12 bg-light-gray rounded-lg w-40" />
            <div className="h-12 bg-light-gray rounded-lg w-32" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailLoadingPage;
