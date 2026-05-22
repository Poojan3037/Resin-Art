"use client";

import CheckoutForm from "@/components/checkout/CheckoutForm";
import OrderSummary from "@/components/checkout/OrderSummary";
import { useCartStore } from "@/store/cartStore";
import Link from "next/link";

const CheckoutPage = () => {
  const cartItems = useCartStore((state) => state.cartItems);
  const hydrated = useCartStore((state) => state.hydrated);

  if (!hydrated) {
    return (
      <div className="max-w-7xl mx-auto py-18 px-4 text-center text-gray">
        Loading checkout...
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="max-w-3xl mx-auto py-18 px-4 text-center">
        <h1 className="text-[30px] font-semibold text-charcoal">
          Your cart is empty
        </h1>
        <p className="text-gray mt-3">Add products before checkout.</p>
        <Link
          href="/shop"
          className="text-gold uppercase tracking-[0.14em] text-[12px] mt-6 inline-block"
        >
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-14 sm:py-18 px-4 sm:px-6 lg:px-8">
      <h1 className="text-[clamp(30px,4vw,46px)] font-semibold text-charcoal mb-6">
        Checkout
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 ">
        <div className="lg:col-span-3">
          <CheckoutForm />
        </div>
        <div className="lg:col-span-2">
          <OrderSummary />
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
