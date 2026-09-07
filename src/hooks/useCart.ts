"use client";

import { useMemo } from "react";
import type { CartItemType } from "@/types/product";
import { useLocalStorage } from "./useLocalStorage";

const CART_STORAGE_KEY = "shop_cart";

const clampQuantity = (quantity: number, availableStock: number) => {
  return Math.max(1, Math.min(quantity, Math.max(1, availableStock)));
};

export function useCart() {
  const [cartItems, setCartItems, hydrated] = useLocalStorage<CartItemType[]>(
    CART_STORAGE_KEY,
    [],
  );

  const addToCart = (item: CartItemType) => {
    setCartItems((prev) => {
      const existing = prev.find((entry) => entry.productId === item.productId);

      if (!existing) {
        return [
          ...prev,
          {
            ...item,
            quantity: clampQuantity(item.quantity, item.availableStock),
          },
        ];
      }

      return prev.map((entry) => {
        if (entry.productId !== item.productId) return entry;

        return {
          ...entry,
          availableStock: item.availableStock,
          quantity: clampQuantity(
            entry.quantity + item.quantity,
            item.availableStock,
          ),
        };
      });
    });
  };

  const removeFromCart = (productId: string) => {
    setCartItems((prev) =>
      prev.filter((entry) => entry.productId !== productId),
    );
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    setCartItems((prev) =>
      prev.map((entry) => {
        if (entry.productId !== productId) return entry;

        return {
          ...entry,
          quantity: clampQuantity(quantity, entry.availableStock),
        };
      }),
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartCount = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems],
  );

  const cartTotal = useMemo(
    () =>
      cartItems.reduce((sum, item) => {
        return sum + item.unitPrice * item.quantity;
      }, 0),
    [cartItems],
  );

  return {
    cartItems,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    cartCount,
    cartTotal,
    hydrated,
  };
}
