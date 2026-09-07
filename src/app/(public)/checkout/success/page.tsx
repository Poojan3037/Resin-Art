"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";

const CheckoutSuccessPage = () => {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("orderNumber");

  return (
    <div className="max-w-3xl mx-auto px-4 py-20 text-center">
      <h1 className="text-[34px] font-semibold text-charcoal">
        Order Confirmed
      </h1>
      <p className="text-gray mt-3">
        Thank you for your order. We&apos;ll update you as it ships.
      </p>
      {orderNumber ? (
        <p className="mt-4 text-[13px] tracking-[0.14em] uppercase text-gold">
          Order Number: {orderNumber}
        </p>
      ) : null}

      <div className="mt-8 flex justify-center gap-4">
        <Link
          href="/shop"
          className="text-[12px] tracking-[0.14em] uppercase text-gold"
        >
          Continue Shopping
        </Link>
        <Link
          href="/orders"
          className="text-[12px] tracking-[0.14em] uppercase text-charcoal"
        >
          Track Order
        </Link>
      </div>
    </div>
  );
};

export default CheckoutSuccessPage;
