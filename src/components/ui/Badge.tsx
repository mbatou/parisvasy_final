"use client";

import { type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const badgeVariants = {
  default: "bg-navy-100 text-navy-500",
  vermillion: "bg-vermillion-50 text-vermillion-700",
  navy: "bg-navy-100 text-navy-600",
  green: "bg-green-100 text-green-800",
  yellow: "bg-yellow-100 text-yellow-800",
  red: "bg-red-100 text-red-800",
  blue: "bg-blue-100 text-blue-800",
  purple: "bg-purple-100 text-purple-800",
  orange: "bg-orange-100 text-orange-800",
  champagne: "bg-champagne-50 text-champagne-600",
  sage: "bg-sage-50 text-sage-500",
} as const;

export type BadgeVariant = keyof typeof badgeVariants;

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

export function Badge({
  className,
  variant = "default",
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold font-sans transition-colors",
        badgeVariants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
