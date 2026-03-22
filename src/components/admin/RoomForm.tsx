"use client";

import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { X } from "lucide-react";
import type { Room, RoomType } from "@/types";

const ROOM_TYPES: { value: RoomType; label: string }[] = [
  { value: "classic", label: "Classic" },
  { value: "superior", label: "Superior" },
  { value: "deluxe", label: "Deluxe" },
  { value: "suite", label: "Suite" },
  { value: "penthouse", label: "Penthouse" },
];

const COMMON_AMENITIES = [
  "Wi-Fi",
  "Air Conditioning",
  "Mini Bar",
  "Safe",
  "Room Service",
  "TV",
  "Balcony",
  "Bathrobe",
  "Coffee Machine",
  "Jacuzzi",
  "City View",
  "King Bed",
];

interface RoomFormProps {
  room?: Room;
  onSubmit: (data: {
    name: string;
    type: RoomType;
    description: string;
    size: number;
    maxGuests: number;
    pricePerNight: number;
    totalRooms: number;
    amenities: string[];
    isActive: boolean;
  }) => void;
}

export function RoomForm({ room, onSubmit }: RoomFormProps) {
  const [name, setName] = useState(room?.name ?? "");
  const [type, setType] = useState<RoomType>(room?.type ?? "classic");
  const [description, setDescription] = useState(room?.description ?? "");
  const [size, setSize] = useState(room?.size ?? 25);
  const [maxGuests, setMaxGuests] = useState(room?.maxGuests ?? 2);
  const [pricePerNight, setPricePerNight] = useState(
    room ? Number(room.pricePerNight) : 200
  );
  const [totalRooms, setTotalRooms] = useState(room?.totalRooms ?? 1);
  const [amenities, setAmenities] = useState<string[]>(room?.amenities ?? []);
  const [isActive, setIsActive] = useState(room?.isActive ?? true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const toggleAmenity = (amenity: string) => {
    setAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((a) => a !== amenity)
        : [...prev, amenity]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};

    if (!name.trim()) errs.name = "Name is required";
    if (size < 1) errs.size = "Size must be positive";
    if (maxGuests < 1) errs.maxGuests = "At least 1 guest";
    if (pricePerNight <= 0) errs.pricePerNight = "Price must be positive";
    if (totalRooms < 1) errs.totalRooms = "At least 1 room";

    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setErrors({});
    setSubmitting(true);
    onSubmit({
      name,
      type,
      description,
      size,
      maxGuests,
      pricePerNight,
      totalRooms,
      amenities,
      isActive,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <Input
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={errors.name}
          placeholder="Deluxe Eiffel View"
        />
        <Select
          label="Type"
          value={type}
          onChange={(e) => setType(e.target.value as RoomType)}
        >
          {ROOM_TYPES.map((rt) => (
            <option key={rt.value} value={rt.value}>
              {rt.label}
            </option>
          ))}
        </Select>
      </div>

      <div>
        <label className="text-sm font-medium text-navy-500">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="mt-1.5 w-full rounded-lg border border-navy-100 bg-white px-3 py-2 text-sm text-navy-500 placeholder:text-navy-200 focus:border-vermillion-500 focus:outline-none focus:ring-2 focus:ring-vermillion-300"
          placeholder="Describe the room..."
        />
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Input
          label="Size (m2)"
          type="number"
          value={size}
          onChange={(e) => setSize(parseInt(e.target.value) || 0)}
          error={errors.size}
          min={1}
        />
        <Input
          label="Max Guests"
          type="number"
          value={maxGuests}
          onChange={(e) => setMaxGuests(parseInt(e.target.value) || 1)}
          error={errors.maxGuests}
          min={1}
        />
        <Input
          label="Price / Night (EUR)"
          type="number"
          value={pricePerNight}
          onChange={(e) => setPricePerNight(parseFloat(e.target.value) || 0)}
          error={errors.pricePerNight}
          min={0}
          step={0.01}
        />
        <Input
          label="Total Rooms"
          type="number"
          value={totalRooms}
          onChange={(e) => setTotalRooms(parseInt(e.target.value) || 1)}
          error={errors.totalRooms}
          min={1}
        />
      </div>

      {/* Amenities */}
      <div>
        <label className="text-sm font-medium text-navy-500">Amenities</label>
        <div className="mt-2 flex flex-wrap gap-2">
          {COMMON_AMENITIES.map((amenity) => (
            <button
              key={amenity}
              type="button"
              onClick={() => toggleAmenity(amenity)}
              className={
                amenities.includes(amenity)
                  ? "inline-flex items-center gap-1 rounded-full bg-vermillion-500 px-3 py-1.5 text-xs font-medium text-white transition-colors"
                  : "inline-flex items-center gap-1 rounded-full border border-navy-100 bg-white px-3 py-1.5 text-xs font-medium text-navy-400 transition-colors hover:border-navy-200"
              }
            >
              {amenity}
              {amenities.includes(amenity) && <X className="h-3 w-3" />}
            </button>
          ))}
        </div>
      </div>

      {/* Image upload placeholder */}
      <div>
        <label className="text-sm font-medium text-navy-500">Images</label>
        <div className="mt-1.5 flex h-32 items-center justify-center rounded-lg border-2 border-dashed border-navy-100 bg-cream-50 text-sm text-navy-300">
          Image uploader placeholder
        </div>
      </div>

      {/* Active toggle */}
      <label className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={isActive}
          onChange={(e) => setIsActive(e.target.checked)}
          className="h-4 w-4 rounded border-navy-200 text-vermillion-500 focus:ring-vermillion-300"
        />
        <span className="text-sm font-medium text-navy-500">Active</span>
      </label>

      <div className="flex justify-end">
        <Button type="submit" loading={submitting}>
          {room ? "Update Room" : "Create Room"}
        </Button>
      </div>
    </form>
  );
}
