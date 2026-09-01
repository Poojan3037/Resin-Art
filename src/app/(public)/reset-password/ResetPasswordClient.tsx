"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import Button from "@/components/Button";
import { resetPasswordAction } from "@/actions/user-auth";
import { ResetPasswordFormValues, resetPasswordSchema } from "@/schema/auth";

const ResetPasswordClient = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const onSubmit = async (data: ResetPasswordFormValues) => {
    const result = await resetPasswordAction(token, data);
    if (result.success) {
      toast.success(result.message);
      router.push("/login");
    } else {
      toast.error(result.message);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-cream flex flex-col items-center justify-center px-4 py-14">
        <div className="w-full max-w-md bg-white border border-light-gray p-8 sm:p-10 text-center">
          <h1 className="text-[22px] font-semibold text-charcoal mb-2">
            Invalid Reset Link
          </h1>
          <p className="text-[14px] text-gray mb-6">
            This password reset link is missing or invalid.
          </p>
          <Link href="/forgot-password" className="text-gold hover:underline text-[13px]">
            Request a new link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center px-4 py-14">
      <div className="w-full max-w-md bg-white border border-light-gray p-8 sm:p-10">
        <h1 className="text-[26px] font-semibold text-charcoal mb-1">
          Reset Password
        </h1>
        <p className="text-[13px] text-gray tracking-wide mb-8">
          Choose a new password for your account.
        </p>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-5"
          noValidate
        >
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="password"
              className="text-[11px] tracking-[0.18em] uppercase text-charcoal font-semibold"
            >
              New Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="new-password"
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? "password-error" : undefined}
              {...register("password")}
              className="w-full px-4 py-3 border border-light-gray text-[14px] outline-none focus:border-gold transition-colors duration-200 bg-cream"
            />
            {errors.password && (
              <p id="password-error" className="text-[12px] text-pink mt-0.5">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="confirmPassword"
              className="text-[11px] tracking-[0.18em] uppercase text-charcoal font-semibold"
            >
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              aria-invalid={!!errors.confirmPassword}
              aria-describedby={
                errors.confirmPassword ? "confirmPassword-error" : undefined
              }
              {...register("confirmPassword")}
              className="w-full px-4 py-3 border border-light-gray text-[14px] outline-none focus:border-gold transition-colors duration-200 bg-cream"
            />
            {errors.confirmPassword && (
              <p id="confirmPassword-error" className="text-[12px] text-pink mt-0.5">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <Button type="submit" isLoading={isSubmitting} fullWidth className="mt-2">
            Reset Password
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordClient;
