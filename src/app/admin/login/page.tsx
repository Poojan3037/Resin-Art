"use client";

import { ADMIN_CREDENTIALS } from "@/constants/admin";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: { preventDefault(): void }) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Simulate a brief delay for UX
    setTimeout(() => {
      if (
        form.username === ADMIN_CREDENTIALS.username &&
        form.password === ADMIN_CREDENTIALS.password
      ) {
        localStorage.setItem("admin_auth", "true");
        router.replace("/admin/dashboard");
      } else {
        setError("Invalid username or password.");
        setLoading(false);
      }
    }, 400);
  };

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

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="username"
              className="text-[12px] tracking-[0.18em] uppercase text-charcoal font-semibold"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              autoComplete="username"
              value={form.username}
              onChange={(e) =>
                setForm((f) => ({ ...f, username: e.target.value }))
              }
              placeholder="admin"
              required
              className="w-full px-4 py-3 border border-light-gray text-[15px] outline-none box-border focus:border-gold transition-colors duration-200 bg-cream"
            />
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
              value={form.password}
              onChange={(e) =>
                setForm((f) => ({ ...f, password: e.target.value }))
              }
              placeholder="••••••••"
              required
              className="w-full px-4 py-3 border border-light-gray text-[15px] outline-none box-border focus:border-gold transition-colors duration-200 bg-cream"
            />
          </div>

          {error && (
            <p className="text-[13px] text-pink font-medium">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 bg-charcoal text-gold-light py-3.5 border-none text-[14px] tracking-[0.12em] uppercase cursor-pointer font-semibold hover:bg-gold hover:text-white transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
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
}
