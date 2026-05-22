"use client";

import Button from "@/components/Button";
import { loginAction } from "@/actions/auth";
import { LoginFormValues, loginSchema } from "@/schema/login";
import { LoginActionState } from "@/types/login";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { startTransition, useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";

export const initialLoginActionState: LoginActionState = {
  success: false,
  error: "",
};

const AdminLoginPage = () => {
  const router = useRouter();

  const [state, dispatchLoginAction, isPending] = useActionState(
    loginAction,
    initialLoginActionState,
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    startTransition(() => {
      dispatchLoginAction(data);
    });
  };

  useEffect(() => {
    if (state.success && state.error === "") {
      router.replace("/admin/dashboard");
    }
  }, [state, router]);

  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center px-4">
      {/* Brand */}
      <div className="flex flex-col justify-center items-center mb-10">
        <span className="block text-[12px] tracking-[0.22em] uppercase text-gold mb-3">
          Admin Access
        </span>

        <Image src="/images/logo.png" alt="logo" width={90} height={90} />
      </div>

      {/* Card */}
      <div className="w-full max-w-md bg-white border border-light-gray p-8 sm:p-10">
        <h2 className="text-[22px] font-semibold text-charcoal mb-1">
          Sign in to Dashboard
        </h2>
        <p className="text-[13px] text-gray tracking-wide mb-8">
          Enter your admin credentials to continue.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="email"
              className="text-[12px] tracking-[0.18em] uppercase text-charcoal font-semibold"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              {...register("email")}
              className="w-full px-4 py-3 border border-light-gray text-[15px] outline-none box-border focus:border-gold transition-colors duration-200 bg-cream"
            />
            {errors.email && (
              <p className="text-[13px] text-pink font-medium">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="password"
              className="text-[12px] tracking-[0.18em] uppercase text-charcoal font-semibold"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              {...register("password")}
              className="w-full px-4 py-3 border border-light-gray text-[15px] outline-none box-border focus:border-gold transition-colors duration-200 bg-cream"
            />
            {errors.password && (
              <p className="text-[13px] text-pink font-medium">
                {errors.password.message}
              </p>
            )}
          </div>

          {state.error && (
            <p className="text-[13px] text-pink font-medium">{state.error}</p>
          )}

          <Button
            type="submit"
            variant="primary"
            isLoading={isPending}
            fullWidth
            className="mt-2 py-3.5"
          >
            {isPending ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <p className="mt-6 text-[12px] text-gray text-center">
          ← Return to{" "}
          <Link
            href="/"
            className="text-teal hover:text-gold transition-colors duration-200 underline underline-offset-2"
          >
            public site
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AdminLoginPage;
