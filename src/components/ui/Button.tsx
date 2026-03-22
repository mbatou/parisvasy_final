"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const variants = {
  primary:
    "bg-gold text-pv-black hover:bg-gold-light active:bg-gold-pale focus-visible:ring-gold/50",
  secondary:
    "bg-pv-black-70 text-white hover:bg-pv-black-60 active:bg-pv-black-80 focus-visible:ring-white/20",
  outline:
    "border border-gold/25 bg-transparent text-gold hover:bg-gold hover:text-pv-black active:bg-gold-light focus-visible:ring-gold/30",
  ghost:
    "bg-transparent text-white/60 hover:bg-white/[0.06] hover:text-white active:bg-white/10 focus-visible:ring-white/20",
  destructive:
    "bg-red-600 text-white hover:bg-red-700 active:bg-red-800 focus-visible:ring-red-400/50",
} as const;

const sizes = {
  sm: "h-8 px-3 text-[11px] uppercase tracking-wide gap-1.5",
  md: "h-10 px-4 text-[11px] uppercase tracking-wide gap-2",
  lg: "h-12 px-6 text-[12px] uppercase tracking-wide gap-2.5",
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
          "inline-flex items-center justify-center font-sans font-medium transition-all duration-200",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-pv-black",
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
