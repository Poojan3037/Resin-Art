"use client";

import { useEffect, useState } from "react";
import { useCartStore } from "@/store/cartStore";
import { getCheckoutQuote } from "@/actions/order";
import type { TaxLineType } from "@/lib/tax/canada";

const currencyFormatter = new Intl.NumberFormat("en-CA", {
  style: "currency",
  currency: "CAD",
});

type QuoteType = {
  subtotalCents: number;
  shippingCents: number;
  taxCents: number;
  totalCents: number;
  taxLines: TaxLineType[];
  taxEnabled: boolean;
};

type OrderSummaryPropsType = {
  province?: string | null;
};

const OrderSummary = ({ province = null }: OrderSummaryPropsType) => {
  const cartItems = useCartStore((state) => state.cartItems);
  const [quote, setQuote] = useState<QuoteType | null>(null);

  // Totals come from the server so what is displayed matches what is charged.
  useEffect(() => {
    let cancelled = false;
    const items = cartItems
      .filter((item) => item.availableStock > 0)
      .map((item) => ({ productId: item.productId, quantity: item.quantity }));

    getCheckoutQuote({ items, province })
      .then((result) => {
        if (!cancelled) setQuote(result);
      })
      .catch(() => {
        if (!cancelled) setQuote(null);
      });

    return () => {
      cancelled = true;
    };
  }, [cartItems, province]);

  const fromCents = (cents: number) => currencyFormatter.format(cents / 100);

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
          <span>{quote ? fromCents(quote.subtotalCents) : "—"}</span>
        </div>
        <div className="flex justify-between text-charcoal">
          <span>Shipping</span>
          <span>{quote ? fromCents(quote.shippingCents) : "—"}</span>
        </div>
        {quote?.taxLines.map((line) => (
          <div key={line.type} className="flex justify-between text-charcoal">
            <span>
              {line.type} ({(line.rateMicros / 10_000).toString()}%)
            </span>
            <span>{fromCents(line.amountCents)}</span>
          </div>
        ))}
        {quote?.taxEnabled && quote.taxLines.length === 0 ? (
          <div className="flex justify-between text-gray text-[12px]">
            <span>Tax</span>
            <span>Calculated once province is selected</span>
          </div>
        ) : null}
        <div className="flex justify-between text-[16px] font-semibold text-gold pt-1">
          <span>Total</span>
          <span>{quote ? fromCents(quote.totalCents) : "—"}</span>
        </div>
      </div>
    </section>
  );
};

export default OrderSummary;
