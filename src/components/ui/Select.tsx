"use client";

import { forwardRef, type SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, id, children, ...props }, ref) => {
    const selectId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={selectId}
            className="text-sm font-medium text-navy-500 font-sans"
          >
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          className={cn(
            "h-10 w-full appearance-none rounded-lg border bg-white px-3 pr-8 text-sm font-sans text-navy-500",
            "transition-colors duration-150",
            "focus:outline-none focus:ring-2 focus:ring-vermillion-300 focus:border-vermillion-500",
            "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-cream-200",
            error
              ? "border-red-500 focus:ring-red-300 focus:border-red-500"
              : "border-navy-100",
            className
          )}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={error ? `${selectId}-error` : undefined}
          {...props}
        >
          {children}
        </select>
        {error && (
          <p id={`${selectId}-error`} className="text-xs text-red-600 font-sans">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";
