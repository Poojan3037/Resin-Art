"use client";

import Button from "@/components/Button";
import { useCartStore, useCartTotal } from "@/store/cartStore";
import Link from "next/link";
import { useMemo } from "react";
import CartItem from "./CartItem";

type CartDrawerPropsType = {
  open: boolean;
  onClose: () => void;
};

const currencyFormatter = new Intl.NumberFormat("en-CA", {
  style: "currency",
  currency: "CAD",
});

const CartDrawer = ({ open, onClose }: CartDrawerPropsType) => {
  const cartItems = useCartStore((state) => state.cartItems);
  const hydrated = useCartStore((state) => state.hydrated);
  const updateCartQuantity = useCartStore((state) => state.updateCartQuantity);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const clearCart = useCartStore((state) => state.clearCart);
  const cartTotal = useCartTotal();

  const cartHasItems = useMemo(() => cartItems.length > 0, [cartItems]);

  return (
    <>
      <div
        className={`fixed inset-0 bg-charcoal/45 z-60 transition-opacity ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
      />
      <aside
        className={`fixed right-0 top-0 h-full w-full sm:w-107.5 bg-cream z-61 border-l border-light-gray transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="h-full flex flex-col">
          <div className="p-5 border-b border-light-gray flex items-center justify-between">
            <h3 className="text-[22px] font-semibold text-charcoal">
              Your Cart
            </h3>
            <button
              onClick={onClose}
              className="text-[22px] text-charcoal leading-none"
            >
              ×
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-3">
            {!hydrated ? (
              <p className="text-gray text-[14px]">Loading cart...</p>
            ) : cartHasItems ? (
              cartItems.map((item) => (
                <CartItem
                  key={item.productId}
                  item={item}
                  onQuantityChange={updateCartQuantity}
                  onRemove={removeFromCart}
                />
              ))
            ) : (
              <div className="text-center py-16 text-gray">
                Your cart is empty.
              </div>
            )}
          </div>

          <div className="p-5 border-t border-light-gray bg-white space-y-3">
            {cartItems.some((item) => item.availableStock === 0) ? (
              <p className="text-[12px] text-red-500">
                Some items are out of stock and will be skipped at checkout.
              </p>
            ) : null}
            <div className="flex justify-between text-[15px] text-charcoal">
              <span>Subtotal</span>
              <span className="font-semibold text-gold">
                {currencyFormatter.format(cartTotal)}
              </span>
            </div>
            <p className="text-[12px] text-gray">
              Shipping calculated at checkout.
            </p>
            <div className="flex gap-2">
              <Button
                variant="soft"
                className="flex-1"
                onClick={clearCart}
                disabled={!cartHasItems}
              >
                Clear
              </Button>
              <Link href="/checkout" className="flex-1" onClick={onClose}>
                <Button className="w-full" disabled={!cartHasItems}>
                  Checkout
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default CartDrawer;
