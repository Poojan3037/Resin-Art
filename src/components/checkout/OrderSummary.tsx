"use client";

import { useCartStore, useCartTotal } from "@/store/cartStore";

const currencyFormatter = new Intl.NumberFormat("en-CA", {
  style: "currency",
  currency: "CAD",
});

const OrderSummary = () => {
  const cartItems = useCartStore((state) => state.cartItems);
  const cartTotal = useCartTotal();

  return (
    <section className="bg-white border border-light-gray p-6">
      <h2 className="text-[22px] font-semibold text-charcoal mb-4">
        Order Summary
      </h2>

      <div className="space-y-4">
        {cartItems.map((item) => {
          const isOutOfStock = item.availableStock === 0;
          return (
            <div
              key={item.productId}
              className={`flex justify-between text-[14px] ${isOutOfStock ? "opacity-60" : ""}`}
            >
              <div>
                <p className="text-charcoal font-medium">{item.title}</p>
                <p className="text-gray text-[12px]">
                  {item.quantity} × {currencyFormatter.format(item.unitPrice)}
                </p>
                {isOutOfStock ? (
                  <p className="text-[11px] uppercase tracking-[0.12em] text-red-500 font-semibold mt-0.5">
                    Out of Stock
                  </p>
                ) : null}
              </div>
              <p className="text-charcoal font-semibold">
                {isOutOfStock
                  ? "—"
                  : currencyFormatter.format(item.quantity * item.unitPrice)}
              </p>
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-light-gray space-y-2 text-[14px]">
        <div className="flex justify-between text-charcoal">
          <span>Subtotal</span>
          <span>{currencyFormatter.format(cartTotal)}</span>
        </div>
        <div className="flex justify-between text-charcoal">
          <span>Shipping</span>
          <span>{currencyFormatter.format(0)}</span>
        </div>
        <div className="flex justify-between text-[16px] font-semibold text-gold pt-1">
          <span>Total</span>
          <span>{currencyFormatter.format(cartTotal)}</span>
        </div>
      </div>
    </section>
  );
};

export default OrderSummary;
