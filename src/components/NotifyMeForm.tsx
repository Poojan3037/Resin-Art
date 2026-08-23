"use client";

import Button from "@/components/Button";
import { subscribe } from "@/actions/subscriber";
import { SubscribeSchema, type SubscribeFormValues } from "@/schema/subscriber";
import type { SubscriberSourceType } from "@/types/subscriber";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type PropsType = {
  /** Which empty state this form is sitting in. */
  source: SubscriberSourceType;
};

const NotifyMeForm = ({ source }: PropsType) => {
  const [isSubscribed, setIsSubscribed] = useState(false);

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
    const result = await subscribe({ ...data, source });

    if (result.success) {
      toast.success(result.message);
      reset({ email: "", source });
      setIsSubscribed(true);
    } else {
      toast.error(result.message);
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
      className="w-full max-w-md mx-auto"
    >
      <label
        htmlFor={`notify-email-${source}`}
        className="block text-[11px] tracking-[0.14em] uppercase text-gray mb-2 text-left"
      >
        Email Address
      </label>

      <div className="flex flex-col sm:flex-row gap-3">
        <input
          id={`notify-email-${source}`}
          type="email"
          placeholder="you@example.com"
          {...register("email")}
          className="flex-1 py-3.5 px-4.5 border border-light-gray text-[15px] outline-none box-border"
        />
        <Button type="submit" variant="primary" isLoading={isSubmitting}>
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
