"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Search, Calendar, Users, Sparkles } from "lucide-react";
import type { ExperienceCategory } from "@/types";
import { CATEGORY_LABELS } from "@/types";

interface CategoryChip {
  key: ExperienceCategory | "flash";
  label: string;
  icon?: React.ReactNode;
}

const CATEGORY_CHIPS: CategoryChip[] = [
  { key: "cruise", label: "Cruises" },
  { key: "gastronomy", label: "Gastronomy" },
  { key: "culture", label: "Culture" },
  { key: "wellness", label: "Wellness" },
  {
    key: "flash",
    label: "Flash deals",
    icon: <Sparkles className="h-3.5 w-3.5" />,
  },
];

export default function HeroSearch() {
  const router = useRouter();
  const [keyword, setKeyword] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [guests, setGuests] = useState("2");
  const [activeChip, setActiveChip] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (keyword) params.set("q", keyword);
    if (checkIn) params.set("checkIn", checkIn);
    if (guests && guests !== "2") params.set("guests", guests);
    if (activeChip) {
      if (activeChip === "flash") {
        params.set("flash", "true");
      } else {
        params.set("category", activeChip);
      }
    }
    router.push(`/experiences?${params.toString()}`);
  };

  const handleChipClick = (key: string) => {
    const selected = activeChip === key ? null : key;
    setActiveChip(selected);
    const params = new URLSearchParams();
    if (selected) {
      if (selected === "flash") {
        params.set("flash", "true");
      } else {
        params.set("category", selected);
      }
    }
    router.push(`/experiences?${params.toString()}`);
  };

  return (
    <section className="bg-cream px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-4xl text-center">
        {/* Heading */}
        <h1 className="font-serif text-4xl leading-tight text-navy sm:text-5xl lg:text-6xl">
          Book a room, live an experience
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-ink-300 sm:mt-6 sm:text-xl">
          Curated hotel stays with unique experiences included — from Seine
          cruises to Michelin dinners. No extra cost, just unforgettable
          memories.
        </p>

        {/* Search Form */}
        <form
          onSubmit={handleSubmit}
          className="mx-auto mt-10 flex max-w-3xl flex-col gap-3 rounded-2xl bg-white p-3 shadow-lg sm:flex-row sm:items-center sm:gap-0 sm:rounded-full sm:p-2"
        >
          {/* Keyword */}
          <div className="flex flex-1 items-center gap-2 px-3 py-2 sm:border-r sm:border-cream-200">
            <Search className="h-5 w-5 shrink-0 text-ink-200" />
            <input
              type="text"
              placeholder="Search experiences..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="w-full bg-transparent text-sm text-ink placeholder:text-ink-200 focus:outline-none"
            />
          </div>

          {/* Check-in Date */}
          <div className="flex items-center gap-2 px-3 py-2 sm:border-r sm:border-cream-200">
            <Calendar className="h-5 w-5 shrink-0 text-ink-200" />
            <input
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="w-full bg-transparent text-sm text-ink placeholder:text-ink-200 focus:outline-none"
              min={new Date().toISOString().split("T")[0]}
            />
          </div>

          {/* Guests */}
          <div className="flex items-center gap-2 px-3 py-2">
            <Users className="h-5 w-5 shrink-0 text-ink-200" />
            <select
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
              className="w-full bg-transparent text-sm text-ink focus:outline-none"
            >
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <option key={n} value={n}>
                  {n} {n === 1 ? "guest" : "guests"}
                </option>
              ))}
            </select>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="flex items-center justify-center gap-2 rounded-full bg-vermillion px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-vermillion-600"
          >
            <Search className="h-4 w-4" />
            Search
          </button>
        </form>

        {/* Category Chips */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
          {CATEGORY_CHIPS.map((chip) => (
            <button
              key={chip.key}
              type="button"
              onClick={() => handleChipClick(chip.key)}
              className={cn(
                "flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                activeChip === chip.key
                  ? "border-vermillion bg-vermillion text-white"
                  : "border-cream-300 bg-white text-ink-400 hover:border-vermillion-200 hover:text-vermillion"
              )}
            >
              {chip.icon}
              {chip.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
