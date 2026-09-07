"use client";

import { createOrder } from "@/actions/order";
import Button from "@/components/Button";
import { useCartStore } from "@/store/cartStore";
import { CheckoutSchema, type CheckoutFormDataType } from "@/schema/checkout";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { PaymentForm, CreditCard } from "react-square-web-payments-sdk";
import { formatCanadianPhone } from "@/lib/phone-formatter";

const inputClassName =
  "w-full px-4 py-3 border border-light-gray text-[14px] outline-none focus:border-gold transition-colors duration-200 bg-cream";

const fieldLabelClassName =
  "text-[11px] tracking-[0.18em] uppercase text-charcoal font-semibold";

type CheckoutFormPropsType = {
  onProvinceChange?: (province: string | null) => void;
};

const CheckoutForm = ({ onProvinceChange }: CheckoutFormPropsType) => {
  const cartItems = useCartStore((state) => state.cartItems);
  const clearCart = useCartStore((state) => state.clearCart);
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);

  const {
    register,
    handleSubmit,
    getValues,
    watch,
    formState: { errors },
  } = useForm<CheckoutFormDataType>({
    resolver: zodResolver(CheckoutSchema),
    defaultValues: {
      country: "CA",
    },
  });

  // Surface the selected province so the order summary can quote the same
  // tax the server will charge.
  const selectedProvince = watch("state");
  useEffect(() => {
    onProvinceChange?.(selectedProvince ?? null);
  }, [selectedProvince, onProvinceChange]);

  const orderableItems = cartItems.filter((item) => item.availableStock > 0);
  const outOfStockItems = cartItems.filter((item) => item.availableStock === 0);
  const hasOutOfStock = outOfStockItems.length > 0;

  const onStep1Submit = () => {
    setStep(2);
  };

  const handlePayment = async (sourceId: string) => {
    setIsPaymentLoading(true);
    try {
      const formData = getValues();
      const result = await createOrder(null, {
        ...formData,
        items: orderableItems,
        sourceId,
      });

      if (!result?.success) {
        toast.error(result?.message ?? "Checkout failed.");
        return;
      }

      clearCart();
      if (hasOutOfStock) {
        toast.info("Out-of-stock items were skipped from your order.");
      }
      toast.success("Payment confirmed! Your order has been placed.");
      router.push(
        `/checkout/success?orderNumber=${encodeURIComponent(result.orderNumber ?? "")}`,
      );
    } finally {
      setIsPaymentLoading(false);
    }
  };

  const onTokenReceived = (token: { status: string; token?: string }) => {
    if (token.status !== "OK" || !token.token) {
      toast.error("Could not tokenize card. Please try again.");
      return;
    }
    handlePayment(token.token);
  };

  if (orderableItems.length === 0) {
    return (
      <div className="bg-white border border-light-gray p-6">
        <p className="text-[14px] text-gray">
          All items in your cart are out of stock. Please return to the shop.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-light-gray p-6">
      {outOfStockItems.length > 0 ? (
        <div className="mb-4 p-3 border border-red-200 bg-red-50 text-[13px] text-red-700">
          <p className="font-semibold">Some items are out of stock:</p>
          <ul className="mt-1 list-disc list-inside space-y-0.5">
            {outOfStockItems.map((item) => (
              <li key={item.productId}>{item.title}</li>
            ))}
          </ul>
          <p className="mt-1">
            These will be removed from your order automatically.
          </p>
        </div>
      ) : null}

      {/* Step indicator */}
      <div className="flex items-center gap-3 mb-6">
        {([1, 2] as const).map((s) => (
          <div key={s} className="flex items-center gap-3">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-bold border-2 transition-colors ${
                step >= s
                  ? "bg-gold border-gold text-white"
                  : "bg-white border-light-gray text-gray"
              }`}
            >
              {s}
            </div>
            <span
              className={`text-[11px] tracking-widest uppercase ${
                step >= s ? "text-charcoal" : "text-gray"
              }`}
            >
              {s === 1 ? "Shipping" : "Payment"}
            </span>
            {s < 2 && (
              <div
                className={`w-8 h-px ${step > s ? "bg-gold" : "bg-light-gray"}`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step 1 — Shipping Details */}
      {step === 1 && (
        <form onSubmit={handleSubmit(onStep1Submit)} noValidate>
          <h2 className="text-[22px] font-semibold text-charcoal mb-4">
            Shipping Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label htmlFor="customerName" className={fieldLabelClassName}>
                Full Name *
              </label>
              <input
                id="customerName"
                {...register("customerName")}
                className={inputClassName}
              />
              <p className="text-red-500 text-[12px] mt-1">
                {errors.customerName?.message}
              </p>
            </div>

            <div>
              <label htmlFor="customerEmail" className={fieldLabelClassName}>
                Email *
              </label>
              <input
                id="customerEmail"
                {...register("customerEmail")}
                className={inputClassName}
              />
              <p className="text-red-500 text-[12px] mt-1">
                {errors.customerEmail?.message}
              </p>
            </div>

            <div>
              <label htmlFor="customerPhone" className={fieldLabelClassName}>
                Phone
              </label>
              <input
                id="customerPhone"
                {...register("customerPhone")}
                onChange={(e) => {
                  const formatted = formatCanadianPhone(e.target.value);
                  e.target.value = formatted;
                }}
                className={inputClassName}
              />
              <p className="text-red-500 text-[12px] mt-1">
                {errors.customerPhone?.message}
              </p>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="addressLine1" className={fieldLabelClassName}>
                Address Line 1 *
              </label>
              <input
                id="addressLine1"
                {...register("addressLine1")}
                className={inputClassName}
              />
              <p className="text-red-500 text-[12px] mt-1">
                {errors.addressLine1?.message}
              </p>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="addressLine2" className={fieldLabelClassName}>
                Address Line 2
              </label>
              <input
                id="addressLine2"
                {...register("addressLine2")}
                className={inputClassName}
              />
            </div>

            <div>
              <label htmlFor="city" className={fieldLabelClassName}>
                City *
              </label>
              <input
                id="city"
                {...register("city")}
                className={inputClassName}
              />
              <p className="text-red-500 text-[12px] mt-1">
                {errors.city?.message}
              </p>
            </div>

            <div>
              <label htmlFor="state" className={fieldLabelClassName}>
                Province / Territory *
              </label>
              <select
                id="state"
                {...register("state")}
                className={inputClassName}
              >
                <option value="">Select Province / Territory</option>
                <option value="AB">AB — Alberta</option>
                <option value="BC">BC — British Columbia</option>
                <option value="MB">MB — Manitoba</option>
                <option value="NB">NB — New Brunswick</option>
                <option value="NL">NL — Newfoundland and Labrador</option>
                <option value="NS">NS — Nova Scotia</option>
                <option value="NT">NT — Northwest Territories</option>
                <option value="NU">NU — Nunavut</option>
                <option value="ON">ON — Ontario</option>
                <option value="PE">PE — Prince Edward Island</option>
                <option value="QC">QC — Quebec</option>
                <option value="SK">SK — Saskatchewan</option>
                <option value="YT">YT — Yukon</option>
              </select>
              <p className="text-red-500 text-[12px] mt-1">
                {errors.state?.message}
              </p>
            </div>

            <div>
              <label htmlFor="postalCode" className={fieldLabelClassName}>
                Postal Code *
              </label>
              <input
                id="postalCode"
                placeholder="A1A 1A1"
                {...register("postalCode")}
                className={inputClassName}
              />
              <p className="text-red-500 text-[12px] mt-1">
                {errors.postalCode?.message}
              </p>
            </div>

            <input type="hidden" {...register("country")} value="CA" />

            <div className="sm:col-span-2">
              <label htmlFor="customerNotes" className={fieldLabelClassName}>
                Customer Notes
              </label>
              <textarea
                id="customerNotes"
                {...register("customerNotes")}
                rows={4}
                className={inputClassName}
              />
            </div>
          </div>

          <Button type="submit" className="mt-6">
            Continue to Payment
          </Button>
        </form>
      )}

      {/* Step 2 — Payment */}
      {step === 2 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[22px] font-semibold text-charcoal">Payment</h2>
            <button
              type="button"
              onClick={() => setStep(1)}
              className="text-[12px] tracking-[0.12em] uppercase text-gray border-none bg-none cursor-pointer hover:text-charcoal transition-colors"
            >
              ← Edit Shipping
            </button>
          </div>

          <PaymentForm
            applicationId={process.env.NEXT_PUBLIC_SQUARE_APP_ID ?? ""}
            locationId={process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID ?? ""}
            cardTokenizeResponseReceived={async (token) => {
              onTokenReceived(token);
            }}
          >
            <CreditCard
              buttonProps={{
                isLoading: isPaymentLoading,
                css: {
                  backgroundColor: "#2B2B2B",
                  color: "#F5E6C8",
                  fontWeight: "600",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  fontSize: "14px",
                  padding: "14px 24px",
                  borderRadius: "0px",
                  border: "none",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  "&:hover": {
                    backgroundColor: "#C9A84C",
                    color: "#ffffff",
                  },
                },
              }}
            >
              {isPaymentLoading ? "Processing…" : "Place Order"}
            </CreditCard>
          </PaymentForm>

          <p className="text-center text-gray text-[12px] mt-4">
            Secured by Square · Charges in CAD
          </p>
        </div>
      )}
    </div>
  );
};

export default CheckoutForm;
