"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/utils";
import {
  BedDouble,
  Maximize2,
  Users,
  Wifi,
  AirVent,
  Tv,
  Coffee,
  Bath,
  Check,
} from "lucide-react";
import type { Room } from "@/types";

interface RoomSelectorProps {
  rooms: Room[];
  selected: string | null;
  onChange: (roomId: string) => void;
}

const AMENITY_ICONS: Record<string, React.ReactNode> = {
  wifi: <Wifi className="h-4 w-4" />,
  "air conditioning": <AirVent className="h-4 w-4" />,
  tv: <Tv className="h-4 w-4" />,
  minibar: <Coffee className="h-4 w-4" />,
  bathtub: <Bath className="h-4 w-4" />,
};

function getAmenityIcon(amenity: string): React.ReactNode {
  const key = amenity.toLowerCase();
  for (const [match, icon] of Object.entries(AMENITY_ICONS)) {
    if (key.includes(match)) return icon;
  }
  return <Check className="h-4 w-4" />;
}

export default function RoomSelector({
  rooms,
  selected,
  onChange,
}: RoomSelectorProps) {
  return (
    <div className="flex flex-col gap-4">
      {rooms.map((room) => {
        const isSelected = selected === room.id;
        const price =
          typeof room.pricePerNight === "string"
            ? parseFloat(room.pricePerNight)
            : typeof room.pricePerNight === "number"
              ? room.pricePerNight
              : Number(room.pricePerNight);

        return (
          <button
            key={room.id}
            type="button"
            onClick={() => onChange(room.id)}
            className={cn(
              "flex flex-col overflow-hidden rounded-2xl border-2 bg-white text-left transition-all sm:flex-row",
              isSelected
                ? "border-vermillion shadow-md"
                : "border-cream-300 hover:border-vermillion-200"
            )}
          >
            {/* Room Image */}
            <div className="relative aspect-[16/10] w-full shrink-0 bg-cream-200 sm:aspect-auto sm:h-auto sm:w-48">
              {room.images[0] ? (
                <Image
                  src={room.images[0]}
                  alt={room.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 192px"
                />
              ) : (
                <div className="flex h-full min-h-[120px] items-center justify-center text-ink-200">
                  <BedDouble className="h-8 w-8" />
                </div>
              )}
              {isSelected && (
                <div className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-vermillion text-white">
                  <Check className="h-4 w-4" />
                </div>
              )}
            </div>

            {/* Room Info */}
            <div className="flex flex-1 flex-col justify-between p-4">
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-serif text-lg text-navy">
                      {room.name}
                    </h4>
                    <span className="text-xs font-medium uppercase tracking-wider text-ink-300">
                      {room.type}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-vermillion">
                      {formatCurrency(price)}
                    </p>
                    <span className="text-xs text-ink-300">/night</span>
                  </div>
                </div>

                <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-ink-300">
                  <span className="flex items-center gap-1">
                    <Maximize2 className="h-3.5 w-3.5" />
                    {room.size} m&sup2;
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="h-3.5 w-3.5" />
                    Up to {room.maxGuests}
                  </span>
                </div>
              </div>

              {/* Amenities */}
              {room.amenities.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {room.amenities.slice(0, 5).map((amenity) => (
                    <span
                      key={amenity}
                      className="flex items-center gap-1 rounded-full bg-cream px-2 py-0.5 text-xs text-ink-400"
                    >
                      {getAmenityIcon(amenity)}
                      {amenity}
                    </span>
                  ))}
                  {room.amenities.length > 5 && (
                    <span className="rounded-full bg-cream px-2 py-0.5 text-xs text-ink-300">
                      +{room.amenities.length - 5} more
                    </span>
                  )}
                </div>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}
