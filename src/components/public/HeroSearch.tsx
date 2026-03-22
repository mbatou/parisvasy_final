"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Search, Calendar, Users, Sparkles } from "lucide-react";
import type { ExperienceCategory } from "@/types";

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
    icon: <Sparkles className="h-3 w-3" />,
  },
];

export default function HeroSearch() {
  const router = useRouter();
  const [keyword, setKeyword] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [guests, setGuests] = useState("2");
  const [activeChip, setActiveChip] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<Array<{ title: string; category: string; slug: string }>>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLFormElement>(null);

  // Close suggestions on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Fetch suggestions as user types
  useEffect(() => {
    if (keyword.length < 2) {
      setSuggestions([]);
      return;
    }
    const timeout = setTimeout(async () => {
      try {
        const res = await fetch(`/api/experiences?q=${encodeURIComponent(keyword)}&limit=5`);
        if (res.ok) {
          const data = await res.json();
          const items = Array.isArray(data) ? data : data.experiences ?? [];
          setSuggestions(items.slice(0, 5));
          setShowSuggestions(true);
        }
      } catch {
        // ignore
      }
    }, 300);
    return () => clearTimeout(timeout);
  }, [keyword]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuggestions(false);
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

  const CATEGORY_DOTS: Record<string, string> = {
    cruise: "bg-blue-400",
    gastronomy: "bg-orange-400",
    culture: "bg-purple-400",
    wellness: "bg-green-400",
    adventure: "bg-red-400",
    nightlife: "bg-indigo-400",
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-pv-black overflow-hidden px-4 sm:px-6 lg:px-8">
      {/* Radial gold glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 50% 40% at 50% 45%, rgba(198,165,92,0.08) 0%, transparent 70%)",
        }}
      />

      {/* Decorative lines */}
      <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/[0.05] pointer-events-none" />
      <div className="absolute left-0 right-0 bottom-[15%] h-px bg-white/[0.05] pointer-events-none" />

      <div className="relative mx-auto max-w-4xl text-center pt-20">
        {/* Eyebrow */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <span className="h-px w-12 bg-gold/40" />
          <span className="micro-label text-gold/80 tracking-[3px]">
            Paris &middot; H&ocirc;tel 4 &eacute;toiles
          </span>
          <span className="h-px w-12 bg-gold/40" />
        </div>

        {/* H1 */}
        <h1 className="font-serif font-light text-white text-[clamp(2.5rem,5vw,5rem)] leading-[1.1]">
          Book a room, live an{" "}
          <em className="text-gold italic">experience</em>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-base text-white/50 font-light leading-relaxed">
          Curated hotel stays with unique experiences included — from Seine
          cruises to Michelin dinners. No extra cost, just unforgettable
          memories.
        </p>

        {/* Search Form */}
        <form
          onSubmit={handleSubmit}
          className="relative mx-auto mt-12 max-w-3xl"
          ref={searchRef}
        >
          <div className="flex flex-col gap-0 bg-pv-black-80 border border-white/[0.08] sm:flex-row sm:items-center transition-colors focus-within:border-gold/30">
            {/* Keyword */}
            <div className="flex flex-1 items-center gap-3 px-5 py-4 sm:border-r sm:border-white/[0.06]">
              <Search className="h-4 w-4 shrink-0 text-gold/60" />
              <div className="flex-1">
                <span className="micro-label text-gold/60 block mb-1">Search</span>
                <input
                  type="text"
                  placeholder="Experiences, locations..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                  className="w-full bg-transparent text-sm text-white placeholder:text-white/30 focus:outline-none font-light"
                />
              </div>
            </div>

            {/* Check-in Date */}
            <div className="flex items-center gap-3 px-5 py-4 sm:border-r sm:border-white/[0.06]">
              <Calendar className="h-4 w-4 shrink-0 text-gold/60" />
              <div>
                <span className="micro-label text-gold/60 block mb-1">Check-in</span>
                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="w-full bg-transparent text-sm text-white focus:outline-none font-light [color-scheme:dark]"
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>
            </div>

            {/* Guests */}
            <div className="flex items-center gap-3 px-5 py-4">
              <Users className="h-4 w-4 shrink-0 text-gold/60" />
              <div>
                <span className="micro-label text-gold/60 block mb-1">Guests</span>
                <select
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  className="w-full bg-transparent text-sm text-white focus:outline-none font-light appearance-none"
                >
                  {[1, 2, 3, 4, 5, 6].map((n) => (
                    <option key={n} value={n} className="bg-pv-black-80 text-white">
                      {n} {n === 1 ? "guest" : "guests"}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="flex items-center justify-center gap-2 bg-gold px-8 py-4 text-[11px] uppercase tracking-wide font-medium text-pv-black transition-colors hover:bg-gold-light sm:py-0 sm:h-full"
            >
              <Search className="h-4 w-4" />
              Search
            </button>
          </div>

          {/* Autocomplete dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-pv-black-80 border border-white/[0.08] z-10">
              {suggestions.map((s, i) => (
                <button
                  key={i}
                  type="button"
                  className="flex items-center gap-3 w-full px-5 py-3 text-left text-sm text-white/80 hover:bg-white/[0.04] transition-colors"
                  onClick={() => {
                    setShowSuggestions(false);
                    router.push(`/experiences/${s.slug}`);
                  }}
                >
                  <span className={cn("h-2 w-2 rounded-full", CATEGORY_DOTS[s.category] ?? "bg-gold")} />
                  <span className="font-light">{s.title}</span>
                </button>
              ))}
            </div>
          )}
        </form>

        {/* Category Chips */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          {CATEGORY_CHIPS.map((chip) => (
            <button
              key={chip.key}
              type="button"
              onClick={() => handleChipClick(chip.key)}
              className={cn(
                "flex items-center gap-1.5 border px-4 py-2 text-[11px] uppercase tracking-wide font-medium transition-all",
                activeChip === chip.key
                  ? "border-gold bg-gold text-pv-black"
                  : "border-white/10 bg-transparent text-white/50 hover:border-gold/30 hover:text-gold"
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
