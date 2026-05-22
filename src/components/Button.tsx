"use client";

import clsx from "clsx";
import { ButtonHTMLAttributes } from "react";

export type ButtonVariant =
  | "primary"
  | "gold"
  | "outline"
  | "outline-gold"
  | "soft"
  | "danger"
  | "ghost";

export type ButtonSize = "sm" | "md" | "lg";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  fullWidth?: boolean;
};

const variantClasses: Record<ButtonVariant, string> = {
  // Charcoal background — main CTA on light backgrounds
  primary:
    "bg-charcoal text-gold-light border-none hover:bg-gold hover:text-white",

  // Gold background — accent CTA
  gold: "bg-gold text-white border-none hover:bg-charcoal hover:text-gold-light",

  // Transparent with strong charcoal border — secondary CTA on light backgrounds
  outline:
    "bg-transparent text-charcoal border border-charcoal hover:bg-charcoal hover:text-gold-light",

  // Transparent with subtle light-gray border — admin cancel / secondary actions
  soft: "bg-transparent text-charcoal border border-light-gray hover:border-charcoal",

  // Gold-tinted border — actions on dark (charcoal) backgrounds (e.g. admin nav)
  "outline-gold":
    "bg-transparent text-gold-light border border-gold/40 hover:bg-gold hover:text-charcoal hover:border-gold",

  // Destructive red
  danger:
    "bg-red-500 text-white border-none hover:opacity-80 transition-opacity duration-200",

  // Text-only gold — inline / icon-like buttons; no padding
  ghost: "bg-transparent border-none text-gold hover:text-gold-dark",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "py-3.5 px-6 text-[14px]",
  md: "py-3.5 px-6 text-[14px]",
  lg: "py-3.5 px-6 text-[14px]",
};

const Spinner = () => (
  <svg
    className="animate-spin h-4 w-4 shrink-0"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 22 6.477 22 12h-4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
);

/**
 * Reusable Button component.
 *
 * Props:
 * - variant  — "primary" | "gold" | "outline" | "outline-gold" | "soft" | "danger" | "ghost"
 * - size     — "sm" | "md" (default) | "lg"
 * - isLoading — shows a spinner and disables the button
 * - fullWidth — adds w-full
 * - className — merged after all variant/size classes
 * - All native <button> attributes are forwarded (type, onClick, disabled, …)
 */
const Button = ({
  variant = "primary",
  size = "md",
  isLoading = false,
  fullWidth = false,
  disabled,
  className,
  children,
  ...props
}: ButtonProps) => {
  return (
    <button
      {...props}
      disabled={disabled || isLoading}
      className={clsx(
        "inline-flex items-center justify-center gap-2 tracking-[0.12em]  uppercase cursor-pointer font-semibold disabled:cursor-not-allowed disabled:opacity-60",
        variantClasses[variant],
        variant !== "ghost" && sizeClasses[size],
        fullWidth && "w-full",
        className,
      )}
    >
      {isLoading && <Spinner />}
      {children}
    </button>
  );
};

export default Button;
