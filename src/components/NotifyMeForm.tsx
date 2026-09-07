"use client";

import Button from "@/components/Button";
import { subscribe } from "@/actions/subscriber";
import { SubscribeSchema, type SubscribeFormValues } from "@/schema/subscriber";
import type { SubscriberSourceType } from "@/types/subscriber";
import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type PropsType = {
  /** Which empty state this form is sitting in. */
  source: SubscriberSourceType;
  /**
   * `stacked` — labelled field above a row of input + button (empty states).
   * `joined`  — label hidden, input and button butted together as one control
   *             (the home subscribe band, which sits on a coloured panel).
   */
  layout?: "stacked" | "joined";
};

const NotifyMeForm = ({ source, layout = "stacked" }: PropsType) => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const isJoined = layout === "joined";

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SubscribeFormValues>({
    resolver: zodResolver(SubscribeSchema),
    defaultValues: { email: "", source },
  });

  const onSubmit = async (data: SubscribeFormValues) => {
    try {
      const result = await subscribe({ ...data, source });

      if (result.success) {
        toast.success(result.message);
        reset({ email: "", source });
        setIsSubscribed(true);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      // A rejected server action must not fail silently — without this the
      // button just spins down and the visitor has no idea it did not send.
      console.error("[subscribe] request failed:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  // Swap the form out on success so there is nothing left to submit twice.
  if (isSubscribed) {
    return (
      <p className="text-[14px] text-charcoal">
        Thanks — we&apos;ll email you as soon as there&apos;s something new.
      </p>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className={clsx("w-full mx-auto", isJoined ? "max-w-110" : "max-w-md")}
    >
      <label
        htmlFor={`notify-email-${source}`}
        className={clsx(
          "text-[11px] tracking-[0.14em] uppercase text-gray",
          isJoined
            ? "sr-only"
            : "block mb-2 text-left",
        )}
      >
        Email Address
      </label>

      <div
        className={clsx(
          "flex flex-col sm:flex-row",
          isJoined ? "gap-0" : "gap-3",
        )}
      >
        <input
          id={`notify-email-${source}`}
          type="email"
          placeholder={isJoined ? "Your email address" : "you@example.com"}
          {...register("email")}
          className={clsx(
            "flex-1 text-[15px] border border-light-gray outline-none box-border",
            isJoined
              ? "px-5 py-3 bg-white text-charcoal sm:border-r-0"
              : "py-3.5 px-4.5",
          )}
        />
        <Button
          type="submit"
          variant="primary"
          isLoading={isSubmitting}
          className={clsx(isJoined && "whitespace-nowrap font-extrabold")}
        >
          Notify Me
        </Button>
      </div>

      {errors.email && (
        <p className="text-red-500 text-[12px] mt-1.5 text-left">
          {errors.email.message}
        </p>
      )}
    </form>
  );
};

export default NotifyMeForm;
