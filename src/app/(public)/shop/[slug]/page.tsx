import { getProductBySlug } from "@/actions/product";
import Button from "@/components/Button";
import Link from "next/link";
import ProductDetailsAddToCart from "@/components/shop/ProductDetailsAddToCart";
import { notFound } from "next/navigation";

type ProductDetailPagePropsType = {
  params: Promise<{
    slug: string;
  }>;
};

const currencyFormatter = new Intl.NumberFormat("en-CA", {
  style: "currency",
  currency: "CAD",
});

const ProductDetailPage = async ({ params }: ProductDetailPagePropsType) => {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const primaryImage =
    product.images.find((image) => image.isPrimary) ?? product.images[0];
  const unitPrice = Number(product.discountPrice ?? product.price);

  return (
    <div className="max-w-7xl mx-auto py-14 sm:py-18 px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="space-y-4">
          <div className="border border-light-gray bg-white overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={primaryImage?.url ?? "/images/art/resin-art-1.jpg"}
              alt={primaryImage?.altText ?? product.title}
              className="w-full h-auto object-cover"
            />
          </div>
          {product.images.length > 1 ? (
            <div className="grid grid-cols-4 gap-3">
              {product.images.slice(0, 4).map((image) => (
                <div
                  key={image.id}
                  className="border border-light-gray bg-white overflow-hidden"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={image.url}
                    alt={image.altText ?? product.title}
                    className="w-full h-24 object-cover"
                  />
                </div>
              ))}
            </div>
          ) : null}
        </div>

        <div>
          <p className="text-[11px] tracking-[0.18em] uppercase text-gray">
            {product.artistName}
          </p>
          <h1 className="text-[clamp(28px,4vw,48px)] font-semibold text-charcoal mt-2">
            {product.title}
          </h1>

          <div className="mt-4 flex items-center gap-2">
            <span className="text-[30px] font-semibold text-gold">
              {currencyFormatter.format(unitPrice)}
            </span>
            {product.discountPrice ? (
              <span className="text-[18px] line-through text-gray">
                {currencyFormatter.format(Number(product.price))}
              </span>
            ) : null}
          </div>

          <p className="text-gray mt-6 whitespace-pre-line">
            {product.description}
          </p>

          <div className="mt-8">
            <ProductDetailsAddToCart
              productId={product.id}
              slug={product.slug}
              title={product.title}
              artistName={product.artistName}
              imageUrl={primaryImage?.url ?? "/images/art/resin-art-1.jpg"}
              unitPrice={unitPrice}
              availableStock={product.quantity}
            />
          </div>

          <div className="mt-4">
            <Link href="/shop">
              <Button variant="soft">Back to Shop</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
