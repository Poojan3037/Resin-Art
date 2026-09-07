const ProductCardSkeleton = () => {
  return (
    <div className="bg-white border border-light-gray animate-pulse">
      <div className="aspect-4/3 bg-light-gray" />
      <div className="p-5 space-y-3">
        <div className="h-3 w-24 bg-light-gray rounded" />
        <div className="h-5 w-3/4 bg-light-gray rounded" />
        <div className="h-5 w-28 bg-light-gray rounded" />
        <div className="pt-2 flex gap-2">
          <div className="h-11 flex-1 bg-light-gray rounded" />
          <div className="h-11 flex-1 bg-light-gray rounded" />
        </div>
      </div>
    </div>
  );
};

export default ProductCardSkeleton;
