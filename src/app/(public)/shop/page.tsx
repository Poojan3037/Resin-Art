import { getProducts } from "@/actions/product";
import ProductGrid from "@/components/shop/ProductGrid";
import ShopHero from "@/components/shop/ShopHero";
import ProductGridSkeleton from "@/components/skeleton/ProductGridSkeleton";
import { CACHE } from "@/constants/cache";
import { cacheLife, cacheTag } from "next/cache";
import { Suspense } from "react";

type PagePropsType = {
  searchParams: Promise<{ search?: string }>;
};

const ProductsContent = async ({ search }: { search: string }) => {
  "use cache";
  cacheLife("hours");
  cacheTag(CACHE.PRODUCT);

  const products = await getProducts({ search, status: "PUBLISHED" });
  return <ProductGrid products={products} />;
};

const Page = async ({ searchParams }: PagePropsType) => {
  const { search = "" } = await searchParams;

  return (
    <div>
      <ShopHero />

      <div className="max-w-7xl mx-auto py-14 sm:py-18 px-4 sm:px-6 lg:px-8">
        <Suspense fallback={<ProductGridSkeleton />}>
          <ProductsContent search={search} />
        </Suspense>
      </div>
    </div>
  );
};

export default Page;
