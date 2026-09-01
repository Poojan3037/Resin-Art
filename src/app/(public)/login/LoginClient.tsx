"use client";

import Button from "@/components/Button";
import { userLoginAction, type UserAuthActionState } from "@/actions/user-auth";
import { UserLoginFormValues, userLoginSchema } from "@/schema/auth";
import { safeRedirect } from "@/lib/safe-redirect";
import { useAuth } from "@/context/AuthContext";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { startTransition, useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";

const initialState: UserAuthActionState = { success: false, message: "" };

const LoginClient = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = safeRedirect(searchParams.get("redirect"));
  const { refresh } = useAuth();

  const [state, dispatchLoginAction, isPending] = useActionState(
    userLoginAction,
    initialState,
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserLoginFormValues>({
    resolver: zodResolver(userLoginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = (data: UserLoginFormValues) => {
    startTransition(() => {
      dispatchLoginAction(data);
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
          Welcome Back
        </h1>
        <p className="text-[13px] text-gray tracking-wide mb-8">
          Sign in to continue.
        </p>

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

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="text-[11px] tracking-[0.18em] uppercase text-charcoal font-semibold"
              >
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-[12px] text-gold hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
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

          {state.message && !state.success ? (
            <p className="text-[13px] text-pink font-medium">{state.message}</p>
          ) : null}

          <Button type="submit" isLoading={isPending} fullWidth className="mt-2">
            Sign In
          </Button>
        </form>

        <p className="mt-6 text-[13px] text-gray text-center">
          Don&apos;t have an account?{" "}
          <Link
            href={`/signup?redirect=${encodeURIComponent(redirectTo)}`}
            className="text-gold hover:underline"
          >
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginClient;
