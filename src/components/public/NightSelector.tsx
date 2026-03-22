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
              "flex flex-1 flex-col items-center border-2 px-4 py-3 transition-all",
              isSelected
                ? "border-gold bg-gold text-pv-black"
                : "border-white/[0.06] bg-pv-black-80 text-white hover:border-gold/40"
            )}
          >
            <span className="text-lg font-bold">
              {nights} {nights === 1 ? "night" : "nights"}
            </span>
            <span
              className={cn(
                "mt-0.5 text-sm font-medium",
                isSelected ? "text-pv-black/60" : "text-white/40"
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
