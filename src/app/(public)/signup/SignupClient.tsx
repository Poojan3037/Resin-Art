"use client";

import Button from "@/components/Button";
import { signupAction, type UserAuthActionState } from "@/actions/user-auth";
import { SignupFormValues, signupSchema } from "@/schema/auth";
import { safeRedirect } from "@/lib/safe-redirect";
import { useAuth } from "@/context/AuthContext";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { startTransition, useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";

const initialState: UserAuthActionState = { success: false, message: "" };

const inputClassName =
  "w-full px-4 py-3 border border-light-gray text-[14px] outline-none focus:border-gold transition-colors duration-200 bg-cream";
const labelClassName =
  "text-[11px] tracking-[0.18em] uppercase text-charcoal font-semibold";
const errorClassName = "text-[12px] text-pink mt-0.5";

const SignupClient = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = safeRedirect(searchParams.get("redirect"));
  const { refresh } = useAuth();

  const [state, dispatchSignupAction, isPending] = useActionState(
    signupAction,
    initialState,
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data: SignupFormValues) => {
    startTransition(() => {
      dispatchSignupAction(data);
    });
  };

  useEffect(() => {
    if (state.success) {
      refresh().then(() => router.push(redirectTo));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center px-4 py-14">
      <div className="w-full max-w-md bg-white border border-light-gray p-8 sm:p-10">
        <h1 className="text-[26px] font-semibold text-charcoal mb-1">
          Create Account
        </h1>
        <p className="text-[13px] text-gray tracking-wide mb-8">
          Sign up to book workshops and check out faster.
        </p>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-5"
          noValidate
        >
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="firstName" className={labelClassName}>
                First Name
              </label>
              <input
                id="firstName"
                autoComplete="given-name"
                aria-invalid={!!errors.firstName}
                aria-describedby={errors.firstName ? "firstName-error" : undefined}
                {...register("firstName")}
                className={inputClassName}
              />
              {errors.firstName && (
                <p id="firstName-error" className={errorClassName}>
                  {errors.firstName.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="lastName" className={labelClassName}>
                Last Name
              </label>
              <input
                id="lastName"
                autoComplete="family-name"
                aria-invalid={!!errors.lastName}
                aria-describedby={errors.lastName ? "lastName-error" : undefined}
                {...register("lastName")}
                className={inputClassName}
              />
              {errors.lastName && (
                <p id="lastName-error" className={errorClassName}>
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className={labelClassName}>
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
              {...register("email")}
              className={inputClassName}
            />
            {errors.email && (
              <p id="email-error" className={errorClassName}>
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className={labelClassName}>
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="new-password"
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? "password-error" : undefined}
              {...register("password")}
              className={inputClassName}
            />
            {errors.password && (
              <p id="password-error" className={errorClassName}>
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="confirmPassword" className={labelClassName}>
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
              className={inputClassName}
            />
            {errors.confirmPassword && (
              <p id="confirmPassword-error" className={errorClassName}>
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {state.message && !state.success ? (
            <p className="text-[13px] text-pink font-medium">{state.message}</p>
          ) : null}

          <Button type="submit" isLoading={isPending} fullWidth className="mt-2">
            Create Account
          </Button>
        </form>

        <p className="mt-6 text-[13px] text-gray text-center">
          Already have an account?{" "}
          <Link
            href={`/login?redirect=${encodeURIComponent(redirectTo)}`}
            className="text-gold hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupClient;
