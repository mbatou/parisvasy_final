import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/utils";
import { MapPin, Clock, Users, Sparkles, Gift } from "lucide-react";
import type { Experience, Room } from "@/types";
import { CATEGORY_COLORS, CATEGORY_LABELS } from "@/types";

interface ExperienceCardProps {
  experience: Experience & { hotel?: { rooms?: Room[] }; rooms?: Room[] };
}

export default function ExperienceCard({ experience }: ExperienceCardProps) {
  const rooms = experience.rooms ?? experience.hotel?.rooms ?? [];
  const minPrice = rooms.length
    ? Math.min(
        ...rooms.map((r) =>
          typeof r.pricePerNight === "string"
            ? parseFloat(r.pricePerNight)
            : typeof r.pricePerNight === "number"
              ? r.pricePerNight
              : Number(r.pricePerNight)
        )
      )
    : null;

  return (
    <Link
      href={`/experiences/${experience.slug}`}
      className="group block overflow-hidden rounded-2xl bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
    >
      {/* Cover Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-cream-200">
        {experience.coverImage ? (
          <Image
            src={experience.coverImage}
            alt={experience.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-ink-200">
            No image
          </div>
        )}

        {/* Badges */}
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {/* Category */}
          <span
            className={cn(
              "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
              CATEGORY_COLORS[experience.category]
            )}
          >
            {CATEGORY_LABELS[experience.category]}
          </span>

          {/* Flash deal */}
          {experience.isFlash && (
            <span className="inline-flex items-center gap-1 rounded-full bg-vermillion px-2.5 py-0.5 text-xs font-semibold text-white">
              <Sparkles className="h-3 w-3" />
              Flash deal
            </span>
          )}
        </div>

        {/* Included free pill */}
        <div className="absolute right-3 top-3">
          <span className="inline-flex items-center gap-1 rounded-full bg-sage px-2.5 py-0.5 text-xs font-semibold text-white">
            <Gift className="h-3 w-3" />
            Included free
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-serif text-lg leading-snug text-navy transition-colors group-hover:text-vermillion">
          {experience.title}
        </h3>

        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-300">
          <span className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" />
            {experience.location}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {experience.duration}
          </span>
          <span className="flex items-center gap-1">
            <Users className="h-3.5 w-3.5" />
            Up to {experience.maxGroup}
          </span>
        </div>

        {/* Price */}
        {minPrice !== null && (
          <p className="mt-3 text-sm font-semibold text-navy">
            From{" "}
            <span className="text-base text-vermillion">
              {formatCurrency(minPrice)}
            </span>
            <span className="font-normal text-ink-300">/night</span>
          </p>
        )}
      </div>
    </Link>
  );
}
