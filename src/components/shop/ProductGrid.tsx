import type { ProductWithImagesType } from "@/types/product";
import ProductCard from "./ProductCard";

type ProductGridPropsType = {
  products: ProductWithImagesType[];
};

const ProductGrid = ({ products }: ProductGridPropsType) => {
  if (products.length === 0) {
    return (
      <div className="bg-white border border-light-gray p-12 text-center text-gray">
        No products found. Please check back soon.
      </div>
    );
  }

  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;
