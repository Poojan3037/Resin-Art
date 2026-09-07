"use client";

import Button from "@/components/Button";
import type { CartItemType } from "@/types/product";
import PlusIcon from "../icons/PlusIcon";
import MinusIcon from "../icons/MinusIcon";

type CartItemPropsType = {
  item: CartItemType;
  onQuantityChange: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
};

const currencyFormatter = new Intl.NumberFormat("en-CA", {
  style: "currency",
  currency: "CAD",
});

const CartItem = ({ item, onQuantityChange, onRemove }: CartItemPropsType) => {
  const isOutOfStock = item.availableStock === 0;
  return (
    <div className="border border-light-gray p-3 bg-white">
      <div className="flex gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.imageUrl}
          alt={item.title}
          className="h-20 w-20 object-cover bg-cream"
        />
        <div className="flex-1">
          <p className="text-[11px] tracking-[0.16em] uppercase text-gray">
            {item.artistName}
          </p>
          <h4 className="text-[16px] font-semibold text-charcoal leading-tight">
            {item.title}
          </h4>
          <p className="text-[14px] text-gold font-semibold mt-1">
            {currencyFormatter.format(item.unitPrice)}
          </p>
          {isOutOfStock ? (
            <p className="text-[11px] uppercase tracking-[0.14em] text-red-500 font-semibold mt-1">
              Out of Stock — remove to continue
            </p>
          ) : null}

          <div className="mt-3 flex items-center justify-between">
            <div
              className={`flex items-center border border-light-gray ${
                isOutOfStock ? "opacity-40 pointer-events-none" : ""
              }`}
            >
              <button
                type="button"
                className="px-3 py-1 text-charcoal"
                onClick={() =>
                  onQuantityChange(item.productId, item.quantity - 1)
                }
                disabled={item.quantity <= 1}
              >
                <MinusIcon />
              </button>
              <span className="px-3 py-1 text-[13px]">{item.quantity}</span>
              <button
                type="button"
                className="px-3 py-1 text-charcoal"
                onClick={() =>
                  onQuantityChange(item.productId, item.quantity + 1)
                }
                disabled={item.quantity >= item.availableStock}
              >
                <PlusIcon />
              </button>
            </div>

            <Button variant="ghost" onClick={() => onRemove(item.productId)}>
              Remove
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
