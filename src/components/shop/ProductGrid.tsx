import type { ProductWithImagesType } from "@/types/product";
import NotifyMeForm from "@/components/NotifyMeForm";
import ProductCard from "./ProductCard";
import Link from "next/link";

type ProductGridPropsType = {
  products: ProductWithImagesType[];
  /** Active search term, so an empty result can explain which case it is. */
  search?: string;
};

const ProductGrid = ({ products, search = "" }: ProductGridPropsType) => {
  if (products.length === 0) {
    // A filtered-out result is not an empty shop: products do exist, so asking
    // for an email here would be misleading. Offer a way back to the full list.
    if (search) {
      return (
        <div className="bg-white border border-light-gray p-10 sm:p-12 text-center">
          <h3 className="text-[20px] sm:text-[24px] text-charcoal mb-2.5">
            No products match &ldquo;{search}&rdquo;
          </h3>
          <p className="text-[14px] text-gray mb-6">
            Try a different search, or browse everything in the shop.
          </p>
          <Link
            href="/shop"
            className="inline-block bg-charcoal text-gold-light px-6 py-3.5 text-[14px] tracking-[0.12em] uppercase font-semibold hover:bg-gold hover:text-white transition-all duration-300"
          >
            Clear Search
          </Link>
        </div>
      );
    }

    return (
      <div className="bg-white border border-light-gray p-10 sm:p-12 text-center">
        <h3 className="text-[20px] sm:text-[24px] text-charcoal mb-2.5">
          No pieces available right now
        </h3>
        <p className="text-[14px] text-gray mb-8 max-w-lg mx-auto">
          Every piece is handcrafted, so the shop restocks in small batches.
          Leave your email and we&apos;ll tell you when new work is listed.
        </p>
        <NotifyMeForm source="shop" />
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
