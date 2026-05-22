"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItemType } from "@/types/product";

const clampQuantity = (quantity: number, availableStock: number) =>
  Math.max(1, Math.min(quantity, Math.max(1, availableStock)));

type CartStoreType = {
  cartItems: CartItemType[];
  hydrated: boolean;
  addToCart: (item: CartItemType) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
};

export const useCartStore = create<CartStoreType>()(
  persist(
    (set) => ({
      cartItems: [],
      hydrated: false,

      addToCart: (item) =>
        set((state) => {
          const existing = state.cartItems.find(
            (entry) => entry.productId === item.productId,
          );

          if (!existing) {
            return {
              cartItems: [
                ...state.cartItems,
                {
                  ...item,
                  quantity: clampQuantity(item.quantity, item.availableStock),
                },
              ],
            };
          }

          return {
            cartItems: state.cartItems.map((entry) => {
              if (entry.productId !== item.productId) return entry;
              return {
                ...entry,
                availableStock: item.availableStock,
                quantity: clampQuantity(
                  entry.quantity + item.quantity,
                  item.availableStock,
                ),
              };
            }),
          };
        }),

      removeFromCart: (productId) =>
        set((state) => ({
          cartItems: state.cartItems.filter(
            (entry) => entry.productId !== productId,
          ),
        })),

      updateCartQuantity: (productId, quantity) =>
        set((state) => ({
          cartItems: state.cartItems.map((entry) => {
            if (entry.productId !== productId) return entry;
            return {
              ...entry,
              quantity: clampQuantity(quantity, entry.availableStock),
            };
          }),
        })),

      clearCart: () => set({ cartItems: [] }),
    }),
    {
      name: "shop_cart",
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.hydrated = true;
        }
      },
    },
  ),
);

export const useCartCount = () =>
  useCartStore((state) =>
    state.cartItems.reduce((sum, item) => sum + item.quantity, 0),
  );

export const useCartTotal = () =>
  useCartStore((state) =>
    state.cartItems.reduce(
      (sum, item) => sum + item.unitPrice * item.quantity,
      0,
    ),
  );
