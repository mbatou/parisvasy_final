"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const variants = {
  primary:
    "bg-vermillion-500 text-white hover:bg-vermillion-600 active:bg-vermillion-700 focus-visible:ring-vermillion-300",
  secondary:
    "bg-navy-500 text-white hover:bg-navy-400 active:bg-navy-600 focus-visible:ring-navy-300",
  outline:
    "border border-navy-200 bg-transparent text-navy-500 hover:bg-navy-50 active:bg-navy-100 focus-visible:ring-navy-200",
  ghost:
    "bg-transparent text-navy-500 hover:bg-navy-50 active:bg-navy-100 focus-visible:ring-navy-200",
  destructive:
    "bg-red-600 text-white hover:bg-red-700 active:bg-red-800 focus-visible:ring-red-300",
} as const;

const sizes = {
  sm: "h-8 px-3 text-sm gap-1.5 rounded-lg",
  md: "h-10 px-4 text-sm gap-2 rounded-lg",
  lg: "h-12 px-6 text-base gap-2.5 rounded-xl",
} as const;

export type ButtonVariant = keyof typeof variants;
export type ButtonSize = keyof typeof sizes;

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      loading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center font-sans font-semibold transition-colors duration-150",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
          "disabled:pointer-events-none disabled:opacity-50",
          variants[variant],
          sizes[size],
          className
        )}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
