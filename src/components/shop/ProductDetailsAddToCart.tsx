"use client";

import Button from "@/components/Button";
import { useCartStore } from "@/store/cartStore";
import { useState } from "react";
import { toast } from "sonner";
import PlusIcon from "../icons/PlusIcon";
import MinusIcon from "../icons/MinusIcon";

type ProductDetailsAddToCartPropsType = {
  productId: string;
  slug: string;
  title: string;
  artistName: string;
  imageUrl: string;
  unitPrice: number;
  availableStock: number;
};

const ProductDetailsAddToCart = ({
  productId,
  slug,
  title,
  artistName,
  imageUrl,
  unitPrice,
  availableStock,
}: ProductDetailsAddToCartPropsType) => {
  const addToCart = useCartStore((state) => state.addToCart);
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
      <div className="inline-flex justify-center border border-light-gray">
        <button
          type="button"
          className="px-4 py-3 text-3xl"
          onClick={() => setQuantity((value) => Math.max(1, value - 1))}
          disabled={quantity <= 1}
        >
          <MinusIcon />
        </button>
        <span className="px-5 py-3 min-w-12 text-center">{quantity}</span>
        <button
          type="button"
          className="px-4 py-3 text-3xl"
          onClick={() =>
            setQuantity((value) => Math.min(availableStock, value + 1))
          }
          disabled={quantity >= availableStock}
        >
          <PlusIcon />
        </button>
      </div>
      <Button
        onClick={() => {
          if (availableStock <= 0) {
            toast.error("This item is out of stock.");
            return;
          }

          addToCart({
            productId,
            slug,
            title,
            artistName,
            imageUrl,
            unitPrice,
            quantity,
            availableStock,
          });
          toast.success("Added to cart.");
        }}
        disabled={availableStock <= 0}
      >
        {availableStock <= 0 ? "Out of Stock" : "Add to Cart"}
      </Button>
    </div>
  );
};

export default ProductDetailsAddToCart;
