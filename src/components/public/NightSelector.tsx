"use client";

import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/utils";

interface NightSelectorProps {
  pricePerNight: number;
  selected: number;
  onChange: (nights: number) => void;
}

const NIGHT_OPTIONS = [1, 2, 3] as const;

export default function NightSelector({
  pricePerNight,
  selected,
  onChange,
}: NightSelectorProps) {
  return (
    <div className="flex gap-3">
      {NIGHT_OPTIONS.map((nights) => {
        const total = pricePerNight * nights;
        const isSelected = selected === nights;
        return (
          <button
            key={nights}
            type="button"
            onClick={() => onChange(nights)}
            className={cn(
              "flex flex-1 flex-col items-center rounded-xl border-2 px-4 py-3 transition-all",
              isSelected
                ? "border-vermillion bg-vermillion text-white"
                : "border-cream-300 bg-white text-ink hover:border-vermillion-200"
            )}
          >
            <span className="text-lg font-bold">
              {nights} {nights === 1 ? "night" : "nights"}
            </span>
            <span
              className={cn(
                "mt-0.5 text-sm font-medium",
                isSelected ? "text-vermillion-100" : "text-ink-300"
              )}
            >
              {formatCurrency(total)}
            </span>
          </button>
        );
      })}
    </div>
  );
}
