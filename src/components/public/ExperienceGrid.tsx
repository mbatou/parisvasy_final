"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import ExperienceCard from "./ExperienceCard";
import type { Experience, ExperienceCategory, Room } from "@/types";
import { CATEGORY_LABELS } from "@/types";

interface ExperienceGridProps {
  experiences: (Experience & { hotel?: { rooms?: Room[] }; rooms?: Room[] })[];
}

const ALL_CATEGORIES: (ExperienceCategory | "all")[] = [
  "all",
  "cruise",
  "gastronomy",
  "culture",
  "wellness",
  "adventure",
  "nightlife",
];

export default function ExperienceGrid({ experiences }: ExperienceGridProps) {
  const [activeCategory, setActiveCategory] = useState<
    ExperienceCategory | "all"
  >("all");

  const filtered =
    activeCategory === "all"
      ? experiences
      : experiences.filter((exp) => exp.category === activeCategory);

  return (
    <div>
      {/* Category Filter Tabs */}
      <div className="mb-10 flex flex-wrap gap-3">
        {ALL_CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActiveCategory(cat)}
            className={cn(
              "border px-5 py-2.5 text-[11px] uppercase tracking-wide font-medium transition-all",
              activeCategory === cat
                ? "border-gold bg-gold text-pv-black"
                : "border-white/10 bg-transparent text-white/50 hover:border-gold/30 hover:text-gold"
            )}
          >
            {cat === "all" ? "All" : CATEGORY_LABELS[cat]}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((experience, i) => (
            <ExperienceCard key={experience.id} experience={experience} index={i} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center border border-white/[0.06] bg-pv-black-80 py-20 text-center">
          <p className="text-lg font-serif text-white/40 font-light">
            No experiences found
          </p>
          <p className="mt-2 text-sm text-white/20 font-light">
            Try selecting a different category or check back later.
          </p>
        </div>
      )}
    </div>
  );
}
