"use client";

import { useState } from "react";
import Button from "@/components/Button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Workshop } from "@/types/workshop";
import {
  formatWorkshopDate,
  formatWorkshopTime,
} from "@/lib/workshop-time-formatter";
import { createBookingSchema, BookingFormValues } from "@/schema/booking";
import { bookWorkshop } from "@/actions/workshop";
import { toast } from "sonner";
import { PaymentForm, CreditCard } from "react-square-web-payments-sdk";

type PropsType = {
  workshop: Workshop;
  onClose: () => void;
};

type InputField = {
  label: string;
  field: keyof Omit<BookingFormValues, "seats">;
  type: string;
};

const inputFields: InputField[] = [
  { label: "Full Name", field: "name", type: "text" },
  { label: "Email Address", field: "email", type: "email" },
  { label: "Phone Number", field: "phone", type: "tel" },
];

const WorkshopBookingDialog = ({ workshop, onClose }: PropsType) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);

  const availableSeats = workshop.availableSeats;
  const seatOptionsLength = Math.min(4, availableSeats);
  const seatOptions = Array.from(
    { length: seatOptionsLength },
    (_, i) => i + 1,
  );
  const dateLabel = formatWorkshopDate(workshop.date);
  const timeLabel = formatWorkshopTime(workshop);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    getValues,
  } = useForm<BookingFormValues>({
    resolver: zodResolver(createBookingSchema(availableSeats)),
    defaultValues: { name: "", email: "", phone: "", seats: 1 },
  });

  const selectedSeats = watch("seats");
  const totalPrice = workshop.price * selectedSeats;

  const onStep1Submit = () => {
    setStep(2);
  };

  const handlePayment = async (sourceId: string) => {
    setIsPaymentLoading(true);
    try {
      const formData = getValues();
      const result = await bookWorkshop(workshop.id, formData, sourceId);
      if (result?.success) {
        toast.success(result.message);
        onClose();
      } else {
        toast.error(result?.message ?? "Something went wrong.");
      }
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

  return (
    <div className="fixed inset-0 bg-[rgba(0,0,0,0.6)] z-50 flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white max-w-120 w-full p-8 sm:p-12 sm:px-10 relative max-h-[90vh] overflow-y-auto">
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-6 bg-none border-none text-[24px] cursor-pointer text-gray"
        >
          ×
        </button>

        {/* Header */}
        <h3 className="text-[28px] font-semibold text-charcoal mb-2">
          Reserve Your Seat
        </h3>
        <p className="text-gold text-[14px] mb-6">
          {workshop.title} — {dateLabel}
        </p>

        {/* Step indicator */}
        <div className="flex items-center gap-3 mb-8">
          {[1, 2].map((s) => (
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
                {s === 1 ? "Your Info" : "Payment"}
              </span>
              {s < 2 && (
                <div
                  className={`w-8 h-px ${step > s ? "bg-gold" : "bg-light-gray"}`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step 1 — Contact + Seats */}
        {step === 1 && (
          <form onSubmit={handleSubmit(onStep1Submit)} noValidate>
            {inputFields.map(({ label, field, type }) => (
              <div key={field} className="mb-5">
                <label className="block text-[12px] tracking-widest uppercase text-gray mb-2">
                  {label}
                </label>
                <input
                  type={type}
                  {...register(field)}
                  className="w-full px-4 py-3 border border-light-gray text-[15px] outline-none box-border"
                />
                {errors[field] && (
                  <p className="text-red-500 text-[12px] mt-1">
                    {errors[field]?.message}
                  </p>
                )}
              </div>
            ))}

            <div className="mb-7">
              <label
                htmlFor="seats"
                className="block text-[12px] tracking-widest uppercase text-gray mb-2"
              >
                Number of Seats
              </label>
              <select
                id="seats"
                {...register("seats", { valueAsNumber: true })}
                className="w-full px-4 py-3 border border-light-gray text-[15px] outline-none bg-white"
              >
                {seatOptions.map((n) => (
                  <option key={n} value={n}>
                    {n} seat{n > 1 ? "s" : ""}
                  </option>
                ))}
              </select>
              {errors.seats && (
                <p className="text-red-500 text-[12px] mt-1">
                  {errors.seats.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              variant="gold"
              fullWidth
              isLoading={isSubmitting}
              className="py-4 font-extrabold"
            >
              {`Continue to Payment — $${totalPrice}`}
            </Button>
          </form>
        )}

        {/* Step 2 — Payment */}
        {step === 2 && (
          <div>
            {/* Order summary */}
            <div className="bg-[#f9f7f4] p-5 mb-7 border border-light-gray">
              <p className="text-[11px] tracking-widest uppercase text-gray mb-3">
                Order Summary
              </p>
              <p className="text-[15px] font-semibold text-charcoal">
                {workshop.title}
              </p>
              <p className="text-[13px] text-gray mt-1">
                {dateLabel} · {timeLabel}
              </p>
              <p className="text-[13px] text-gray mt-0.5">
                {workshop.location}
              </p>
              <div className="flex justify-between items-center mt-4 pt-4 border-t border-light-gray">
                <span className="text-[13px] text-gray">
                  {selectedSeats} seat{selectedSeats > 1 ? "s" : ""} × $
                  {workshop.price}
                </span>
                <span className="text-[17px] font-bold text-charcoal">
                  ${totalPrice}
                </span>
              </div>
            </div>

            {/* Square payment form */}
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
                    backgroundColor: "#C9A84C", // bg-gold
                    color: "#ffffff", // text-white
                    fontWeight: "800", // font-semibold (bump to 800 if needed)
                    letterSpacing: "0.12em", // tracking-[0.12em]
                    textTransform: "uppercase", // uppercase
                    fontSize: "14px", // text-[14px]
                    padding: "14px 24px", // py-3.5 px-6
                    borderRadius: "0px", // no rounded
                    border: "none", // border-none
                    cursor: "pointer", // cursor-pointer
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    "&:hover": {
                      backgroundColor: "#2B2B2B", // hover:bg-charcoal
                      color: "#F5E6C8", // hover:text-gold-light
                    },
                  },
                }}
              >
                {isPaymentLoading ? "Processing…" : `Pay $${totalPrice}`}
              </CreditCard>
            </PaymentForm>

            <p className="text-center text-gray text-[12px] mt-4">
              Secure payment powered by Square
            </p>

            {/* Back button */}
            <button
              type="button"
              onClick={() => setStep(1)}
              disabled={isPaymentLoading}
              className="mt-4 w-full text-center text-[12px] tracking-widest uppercase text-gray cursor-pointer hover:text-charcoal transition-colors bg-none border-none"
            >
              ← Back to your info
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkshopBookingDialog;
