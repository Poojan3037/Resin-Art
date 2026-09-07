"use client";

import Button from "@/components/Button";
import { useCartStore } from "@/store/cartStore";
import type { ProductWithImagesType } from "@/types/product";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Link from "next/link";
import { useRef } from "react";
import { toast } from "sonner";

gsap.registerPlugin(ScrollTrigger);

type ProductCardPropsType = {
  product: ProductWithImagesType;
  index?: number;
};

const currencyFormatter = new Intl.NumberFormat("en-CA", {
  style: "currency",
  currency: "CAD",
});

const ProductCard = ({ product, index = 0 }: ProductCardPropsType) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const addToCart = useCartStore((state) => state.addToCart);
  const primaryImage =
    product.images.find((image) => image.isPrimary) ?? product.images[0];
  const unitPrice = Number(product.discountPrice ?? product.price);

  useGSAP(
    () => {
      gsap.from(".pcard", {
        opacity: 0,
        y: 60,
        duration: 0.75,
        delay: index * 0.1,
        ease: "expo.out",
        scrollTrigger: {
          trigger: ".pcard",
          start: "top 90%",
          once: true,
        },
      });
    },
    { scope: cardRef },
  );

  const handleAddToCart = () => {
    if (product.quantity <= 0) {
      toast.error("This item is out of stock.");
      return;
    }

    addToCart({
      productId: product.id,
      slug: product.slug,
      title: product.title,
      artistName: product.artistName,
      imageUrl: primaryImage?.url ?? "/images/art/resin-art-1.jpg",
      unitPrice,
      quantity: 1,
      availableStock: product.quantity,
    });
    toast.success("Added to cart.");
  };

  return (
    <div ref={cardRef}>
      <div className="pcard group relative border border-light-gray bg-cream transition-all duration-300 hover:border-gold hover:shadow-xl h-full overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-gold/0 transition-colors duration-300 group-hover:bg-gold/5" />
        <Link
          href={`/shop/${product.slug}`}
          className="relative block border-b border-light-gray overflow-hidden"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={primaryImage?.url ?? "/images/art/resin-art-1.jpg"}
            alt={primaryImage?.altText ?? product.title}
            className="w-full aspect-[4/3] object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </Link>

        <div className="relative p-8">
          <div className="flex justify-between items-center mb-5">
            <span
              className={
                product.quantity <= 3 && product.quantity > 0
                  ? "bg-amber-100 text-amber-700 text-[11px] px-3 py-1 uppercase tracking-widest font-semibold"
                  : "bg-teal-50 text-teal text-[11px] px-3 py-1 uppercase tracking-widest font-semibold"
              }
            >
              {product.quantity > 0
                ? `${product.quantity} in stock`
                : "Unavailable"}
            </span>

            <div className="flex items-center gap-2">
              <span className="text-gold text-[24px] font-extrabold">
                {currencyFormatter.format(unitPrice)}
              </span>
              {product.discountPrice ? (
                <span className="text-[14px] text-gray line-through">
                  {currencyFormatter.format(Number(product.price))}
                </span>
              ) : null}
            </div>
          </div>

          <p className="text-[11px] tracking-[0.16em] uppercase text-gray mb-2">
            {product.artistName}
          </p>
          <h3 className="text-[22px] font-semibold text-charcoal mb-7 leading-[1.3]">
            {product.title}
          </h3>

          {product.quantity === 0 && (
            <div className="flex items-center gap-2 border border-red-200 bg-red-50 px-4 py-2.5 mb-4">
              <span className="text-red-500 text-sm">⛔</span>
              <span className="text-red-600 text-[12px] uppercase tracking-widest font-semibold">
                Out of Stock
              </span>
            </div>
          )}

          <Button
            variant="primary"
            fullWidth
            onClick={handleAddToCart}
            className="font-extrabold"
            disabled={product.quantity <= 0}
          >
            {product.quantity <= 0 ? "Out of Stock" : "Add to Cart"}
          </Button>

          <Link href={`/shop/${product.slug}`} className="block mt-3">
            <Button variant="outline" fullWidth className="font-extrabold">
              View Details
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
