import ProductCardSkeleton from "./ProductCardSkeleton";

const ProductGridSkeleton = () => {
  const placeholderIds = [
    "product-skeleton-1",
    "product-skeleton-2",
    "product-skeleton-3",
    "product-skeleton-4",
    "product-skeleton-5",
    "product-skeleton-6",
    "product-skeleton-7",
    "product-skeleton-8",
  ];

  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {placeholderIds.map((placeholderId) => (
        <ProductCardSkeleton key={placeholderId} />
      ))}
    </div>
  );
};

export default ProductGridSkeleton;
