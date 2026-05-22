"use client";

import { useCartCount } from "@/store/cartStore";
import { useState } from "react";
import CartDrawer from "./CartDrawer";

const CartButton = () => {
  const cartCount = useCartCount();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-light-gray bg-white text-charcoal hover:border-gold transition-colors cursor-pointer"
        onClick={() => setOpen(true)}
        aria-label="Open cart"
      >
        <span aria-hidden="true">🛒</span>
        {cartCount > 0 ? (
          <span className="absolute -top-1 -right-1 min-w-5 h-5 rounded-full bg-gold text-white text-[10px] font-semibold inline-flex items-center justify-center px-1">
            {cartCount}
          </span>
        ) : null}
      </button>
      <CartDrawer open={open} onClose={() => setOpen(false)} />
    </>
  );
};

export default CartButton;
