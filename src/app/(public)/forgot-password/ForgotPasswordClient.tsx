"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import Button from "@/components/Button";
import { requestPasswordReset } from "@/actions/user-auth";
import { ForgotPasswordFormValues, forgotPasswordSchema } from "@/schema/auth";

const ForgotPasswordClient = () => {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    // Always show the same neutral confirmation regardless of the result —
    // the server never reveals whether the email has an account.
    await requestPasswordReset(data);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center px-4 py-14">
      <div className="w-full max-w-md bg-white border border-light-gray p-8 sm:p-10">
        <h1 className="text-[26px] font-semibold text-charcoal mb-1">
          Forgot Password
        </h1>
        <p className="text-[13px] text-gray tracking-wide mb-8">
          Enter your email and we&apos;ll send you a reset link.
        </p>

        {submitted ? (
          <p className="text-[14px] text-charcoal">
            If an account exists for that email, we&apos;ve sent a password
            reset link. Please check your inbox.
          </p>
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-5"
            noValidate
          >
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="email"
                className="text-[11px] tracking-[0.18em] uppercase text-charcoal font-semibold"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error" : undefined}
                {...register("email")}
                className="w-full px-4 py-3 border border-light-gray text-[14px] outline-none focus:border-gold transition-colors duration-200 bg-cream"
              />
              {errors.email && (
                <p id="email-error" className="text-[12px] text-pink mt-0.5">
                  {errors.email.message}
                </p>
              )}
            </div>

            <Button type="submit" isLoading={isSubmitting} fullWidth className="mt-2">
              Send Reset Link
            </Button>
          </form>
        )}

        <p className="mt-6 text-[13px] text-gray text-center">
          <Link href="/login" className="text-gold hover:underline">
            Back to sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordClient;
