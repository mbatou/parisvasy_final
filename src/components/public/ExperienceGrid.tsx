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
      <div className="mb-8 flex flex-wrap gap-2">
        {ALL_CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActiveCategory(cat)}
            className={cn(
              "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
              activeCategory === cat
                ? "border-vermillion bg-vermillion text-white"
                : "border-cream-300 bg-white text-ink-400 hover:border-vermillion-200 hover:text-vermillion"
            )}
          >
            {cat === "all" ? "All" : CATEGORY_LABELS[cat]}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((experience) => (
            <ExperienceCard key={experience.id} experience={experience} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl bg-cream py-20 text-center">
          <p className="text-lg font-medium text-ink-300">
            No experiences found
          </p>
          <p className="mt-1 text-sm text-ink-200">
            Try selecting a different category or check back later.
          </p>
        </div>
      )}
    </div>
  );
}
