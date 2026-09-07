import { getProductBySlug } from "@/actions/product";
import Link from "next/link";
import ProductDetailsAddToCart from "@/components/shop/ProductDetailsAddToCart";
import ImageGallery from "@/components/media/ImageGallery";
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
      <Link
        href="/shop"
        className="inline-flex items-center gap-2 text-[12px] tracking-[0.12em] uppercase font-semibold text-gray hover:text-charcoal transition-colors mb-8"
      >
        ← Back to Shop
      </Link>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div>
          <ImageGallery
            bannerUrl={primaryImage?.url ?? "/images/art/resin-art-1.jpg"}
            bannerAlt={primaryImage?.altText ?? product.title}
            images={product.images}
          />
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
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
