"use client";

import { createContext, useContext } from "react";
import type { ReactNode } from "react";
import { useCart } from "@/hooks/useCart";

type CartContextType = ReturnType<typeof useCart>;

const CartContext = createContext<CartContextType | null>(null);

type CartProviderPropsType = {
  children: ReactNode;
};

export function CartProvider({ children }: CartProviderPropsType) {
  const cart = useCart();

  return <CartContext.Provider value={cart}>{children}</CartContext.Provider>;
}

export function useCartContext() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCartContext must be used within CartProvider");
  }

  return context;
}
