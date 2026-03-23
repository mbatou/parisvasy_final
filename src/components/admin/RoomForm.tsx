"use client";

import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { ImageUploader } from "@/components/admin/ImageUploader";
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
  "Eiffel View",
  "Bathtub",
];

interface RoomFormData {
  name: string;
  type: RoomType;
  description: string;
  size: number;
  maxGuests: number;
  pricePerNight: number;
  totalRooms: number;
  amenities: string[];
  images: string[];
  isActive: boolean;
}

interface RoomFormProps {
  room?: Room;
  onSubmit: (data: RoomFormData) => void;
  onDelete?: () => void;
}

export function RoomForm({ room, onSubmit, onDelete }: RoomFormProps) {
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
  const [images, setImages] = useState<string[]>(room?.images ?? []);
  const [isActive, setIsActive] = useState(room?.isActive ?? true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

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
      images,
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
        <label className="text-sm font-light text-white/80">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="mt-1.5 w-full rounded border border-white/[0.06] bg-pv-black-80 px-3 py-2 text-sm font-light text-white/80 placeholder:text-white/30 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30"
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
        <label className="text-sm font-light text-white/80">Amenities</label>
        <div className="mt-2 flex flex-wrap gap-2">
          {COMMON_AMENITIES.map((amenity) => (
            <button
              key={amenity}
              type="button"
              onClick={() => toggleAmenity(amenity)}
              className={
                amenities.includes(amenity)
                  ? "inline-flex items-center gap-1 rounded-full bg-gold px-3 py-1.5 text-xs font-light text-pv-black transition-colors"
                  : "inline-flex items-center gap-1 rounded-full border border-white/[0.06] bg-pv-black-80 px-3 py-1.5 text-xs font-light text-white/40 transition-colors hover:border-white/[0.12]"
              }
            >
              {amenity}
              {amenities.includes(amenity) && <X className="h-3 w-3" />}
            </button>
          ))}
        </div>
      </div>

      {/* Images */}
      <div>
        <label className="text-sm font-light text-white/80">Images</label>
        <div className="mt-1.5">
          <ImageUploader
            bucket="room-images"
            entityId={room?.id ?? "new"}
            existingImages={images}
            onImagesChange={setImages}
            maxImages={10}
          />
        </div>
      </div>

      {/* Active toggle */}
      <label className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={isActive}
          onChange={(e) => setIsActive(e.target.checked)}
          className="h-4 w-4 rounded border-white/[0.06] text-gold focus:ring-gold/30"
        />
        <span className="text-sm font-light text-white/80">Active</span>
      </label>

      <div className="flex items-center justify-between">
        {room && onDelete && (
          <div>
            {!confirmDelete ? (
              <Button
                type="button"
                variant="destructive"
                onClick={() => setConfirmDelete(true)}
              >
                Delete Room
              </Button>
            ) : (
              <div className="flex items-center gap-2 rounded border border-red-500/30 bg-red-900/30 px-4 py-2">
                <span className="text-sm font-light text-red-400">Are you sure?</span>
                <Button type="button" variant="destructive" size="sm" onClick={onDelete}>
                  Yes, delete
                </Button>
                <Button type="button" variant="ghost" size="sm" onClick={() => setConfirmDelete(false)}>
                  No
                </Button>
              </div>
            )}
          </div>
        )}
        <div className="ml-auto">
          <Button type="submit" loading={submitting}>
            {room ? "Update Room" : "Create Room"}
          </Button>
        </div>
      </div>
    </form>
  );
}
