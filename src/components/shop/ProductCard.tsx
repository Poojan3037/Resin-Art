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
};

const currencyFormatter = new Intl.NumberFormat("en-CA", {
  style: "currency",
  currency: "CAD",
});

const ProductCard = ({ product }: ProductCardPropsType) => {
  const cardRef = useRef<HTMLElement>(null);
  const addToCart = useCartStore((state) => state.addToCart);
  const primaryImage =
    product.images.find((image) => image.isPrimary) ?? product.images[0];
  const unitPrice = Number(product.discountPrice ?? product.price);

  useGSAP(
    () => {
      gsap.from(".pcard", {
        opacity: 0,
        y: 50,
        scale: 0.95,
        duration: 0.75,
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

  return (
    <article
      ref={cardRef}
      className="pcard bg-white border border-light-gray hover:border-gold transition-all duration-300 flex flex-col"
    >
      <Link href={`/shop/${product.slug}`} className="block group">
        <div className="aspect-4/3 bg-cream overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={primaryImage?.url ?? "/images/art/resin-art-1.jpg"}
            alt={primaryImage?.altText ?? product.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      </Link>

      <div className="p-5 flex flex-col flex-1 gap-2">
        <p className="text-[11px] tracking-[0.16em] uppercase text-gray">
          {product.artistName}
        </p>
        <Link href={`/shop/${product.slug}`}>
          <h3 className="text-[18px] font-semibold text-charcoal leading-[1.3]">
            {product.title}
          </h3>
        </Link>

        <div className="flex items-center gap-2">
          <span className="text-[20px] font-semibold text-gold">
            {currencyFormatter.format(unitPrice)}
          </span>
          {product.discountPrice ? (
            <span className="text-[14px] text-gray line-through">
              {currencyFormatter.format(Number(product.price))}
            </span>
          ) : null}
        </div>

        <div className="mt-auto pt-3 flex flex-col gap-2">
          <Link href={`/shop/${product.slug}`} className="flex-1">
            <Button variant="soft" fullWidth>
              View
            </Button>
          </Link>
          <Button
            className="flex-1"
            onClick={() => {
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
            }}
            disabled={product.quantity <= 0}
          >
            {product.quantity <= 0 ? "Out of Stock" : "Add to Cart"}
          </Button>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
