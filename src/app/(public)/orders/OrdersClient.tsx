"use client";

import { getOrderByEmailAndNumber } from "@/actions/order";
import Button from "@/components/Button";
import { useState, useTransition } from "react";

const currencyFormatter = new Intl.NumberFormat("en-CA", {
  style: "currency",
  currency: "CAD",
});

const OrdersClient = () => {
  const [email, setEmail] = useState("");
  const [orderNumber, setOrderNumber] = useState("");
  const [result, setResult] = useState<Awaited<
    ReturnType<typeof getOrderByEmailAndNumber>
  > | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <div className="max-w-4xl mx-auto py-14 sm:py-18 px-4 sm:px-6 lg:px-8">
      <h1 className="text-[clamp(30px,4vw,46px)] font-semibold text-charcoal">
        Track Your Order
      </h1>
      <p className="text-gray mt-2 text-[14px]">
        Enter the same email used during checkout and your order number.
      </p>

      <form
        className="mt-8 bg-white border border-light-gray p-6 grid gap-4 sm:grid-cols-2"
        onSubmit={(event) => {
          event.preventDefault();
          setError(null);
          setResult(null);

          startTransition(async () => {
            const data = await getOrderByEmailAndNumber({
              email: email.trim(),
              orderNumber: orderNumber.trim(),
            });

            if (!data) {
              setError("No order found with the provided details.");
              return;
            }

            setResult(data);
          });
        }}
      >
        <div>
          <label
            htmlFor="track-email"
            className="text-[11px] tracking-[0.18em] uppercase text-charcoal font-semibold"
          >
            Email
          </label>
          <input
            id="track-email"
            className="w-full px-4 py-3 border border-light-gray text-[14px] outline-none focus:border-gold transition-colors duration-200 bg-cream"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>

        <div>
          <label
            htmlFor="track-order-number"
            className="text-[11px] tracking-[0.18em] uppercase text-charcoal font-semibold"
          >
            Order Number
          </label>
          <input
            id="track-order-number"
            className="w-full px-4 py-3 border border-light-gray text-[14px] outline-none focus:border-gold transition-colors duration-200 bg-cream"
            value={orderNumber}
            onChange={(event) => setOrderNumber(event.target.value)}
          />
        </div>

        <div className="sm:col-span-2">
          <Button type="submit" isLoading={isPending}>
            Search Order
          </Button>
        </div>
      </form>

      {error ? <p className="mt-4 text-red-500 text-[14px]">{error}</p> : null}

      {result ? (
        <section className="mt-8 bg-white border border-light-gray p-6">
          <div className="flex flex-wrap gap-3 justify-between items-center">
            <h2 className="text-[24px] font-semibold text-charcoal">
              {result.orderNumber}
            </h2>
            <span className="text-[11px] tracking-[0.15em] uppercase px-3 py-1 border border-gold text-gold">
              {result.status}
            </span>
          </div>

          <p className="text-[13px] text-gray mt-2">
            Ordered on {new Date(result.createdAt).toLocaleDateString()}
          </p>

          <div className="mt-6 space-y-4">
            {result.items.map((item) => (
              <div key={item.id} className="flex justify-between text-[14px]">
                <div>
                  <p className="text-charcoal font-medium">
                    {item.productTitle}
                  </p>
                  <p className="text-gray text-[12px]">
                    {item.quantity} ×{" "}
                    {currencyFormatter.format(Number(item.unitPrice))}
                  </p>
                </div>
                <p className="text-charcoal font-semibold">
                  {currencyFormatter.format(Number(item.lineTotal))}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-light-gray flex justify-between text-[16px] font-semibold">
            <span>Total</span>
            <span className="text-gold">
              {currencyFormatter.format(Number(result.totalAmount))}
            </span>
          </div>
        </section>
      ) : null}
    </div>
  );
};

export default OrdersClient;
