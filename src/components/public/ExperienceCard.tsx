import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/utils";
import { MapPin, Clock, Users, Sparkles, Gift } from "lucide-react";
import type { Experience, Room } from "@/types";
import { CATEGORY_LABELS } from "@/types";

interface ExperienceCardProps {
  experience: Experience & { hotel?: { rooms?: Room[] }; rooms?: Room[] };
  index?: number;
}

export default function ExperienceCard({ experience, index = 0 }: ExperienceCardProps) {
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
      className="group block overflow-hidden bg-pv-black-80 border border-white/[0.06] transition-all duration-300 hover:border-gold/20 hover:-translate-y-[3px]"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* Cover Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-pv-black-70">
        {experience.coverImage ? (
          <Image
            src={experience.coverImage}
            alt={experience.title}
            fill
            className="object-cover transition-transform duration-[800ms] group-hover:scale-[1.06]"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-white/20">
            No image
          </div>
        )}

        {/* Badges */}
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {/* Category */}
          <span className="inline-flex items-center bg-black/60 backdrop-blur-sm px-2.5 py-1 text-[9px] uppercase tracking-wide font-medium text-white">
            {CATEGORY_LABELS[experience.category]}
          </span>

          {/* Flash deal */}
          {experience.isFlash && (
            <span className="inline-flex items-center gap-1 bg-gold px-2.5 py-1 text-[9px] uppercase tracking-wide font-medium text-pv-black">
              <Sparkles className="h-2.5 w-2.5" />
              Flash
            </span>
          )}
        </div>

        {/* Included free pill */}
        <div className="absolute right-3 top-3">
          <span className="inline-flex items-center gap-1 bg-gold px-2.5 py-1 text-[9px] uppercase tracking-wide font-medium text-pv-black">
            <Gift className="h-2.5 w-2.5" />
            Included
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="font-serif text-lg leading-snug text-white font-light transition-colors group-hover:text-gold">
          {experience.title}
        </h3>

        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-white/40">
          <span className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {experience.location}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {experience.duration}
          </span>
          <span className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            Up to {experience.maxGroup}
          </span>
        </div>

        {/* Price + Reserve */}
        <div className="mt-5 flex items-end justify-between">
          {minPrice !== null ? (
            <p className="text-sm text-white/50 font-light">
              From{" "}
              <span className="font-serif text-[28px] text-gold font-light leading-none">
                {formatCurrency(minPrice)}
              </span>
              <span className="text-white/30">/night</span>
            </p>
          ) : (
            <span />
          )}
          <span className="border border-gold px-4 py-2 text-[10px] uppercase tracking-wide text-gold font-medium transition-all group-hover:bg-gold group-hover:text-pv-black">
            Reserve
          </span>
        </div>
      </div>
    </Link>
  );
}
