"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { slugify } from "@/lib/utils";
import type { Hotel } from "@/types";

interface HotelFormData {
  name: string;
  slug: string;
  address: string;
  city: string;
  country: string;
  stars: number;
  description: string;
  phone: string;
  email: string;
  coverImage: string;
  images: string[];
  isActive: boolean;
}

interface HotelFormProps {
  hotel?: Hotel;
  onSubmit: (data: HotelFormData) => void;
  onDelete?: () => void;
}

export function HotelForm({ hotel, onSubmit, onDelete }: HotelFormProps) {
  const [name, setName] = useState(hotel?.name ?? "");
  const [slug, setSlug] = useState(hotel?.slug ?? "");
  const [address, setAddress] = useState(hotel?.address ?? "");
  const [city, setCity] = useState(hotel?.city ?? "");
  const [country, setCountry] = useState(hotel?.country ?? "");
  const [stars, setStars] = useState(hotel?.stars ?? 5);
  const [description, setDescription] = useState(hotel?.description ?? "");
  const [phone, setPhone] = useState(hotel?.phone ?? "");
  const [email, setEmail] = useState(hotel?.email ?? "");
  const [coverImage, setCoverImage] = useState(hotel?.coverImage ?? "");
  const [images, setImages] = useState<string[]>(hotel?.images ?? []);
  const [isActive, setIsActive] = useState(hotel?.isActive ?? true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (!hotel) {
      setSlug(slugify(name));
    }
  }, [name, hotel]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};

    if (!name.trim()) errs.name = "Name is required";
    if (!slug.trim()) errs.slug = "Slug is required";
    if (!address.trim()) errs.address = "Address is required";
    if (!city.trim()) errs.city = "City is required";
    if (!country.trim()) errs.country = "Country is required";
    if (stars < 1 || stars > 5) errs.stars = "Stars must be 1-5";

    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setErrors({});
    setSubmitting(true);
    onSubmit({ name, slug, address, city, country, stars, description, phone, email, coverImage, images, isActive });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <Input
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={errors.name}
          placeholder="Hotel Parisvasy Champs-Elysees"
        />
        <Input
          label="Slug"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          error={errors.slug}
          helperText="Auto-generated from name"
        />
      </div>

      <Input
        label="Address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        error={errors.address}
        placeholder="25 Avenue des Champs-Elysees"
      />

      <div className="grid gap-4 md:grid-cols-3">
        <Input
          label="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          error={errors.city}
          placeholder="Paris"
        />
        <Input
          label="Country"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          error={errors.country}
          placeholder="France"
        />
        <Input
          label="Stars"
          type="number"
          value={stars}
          onChange={(e) => setStars(parseInt(e.target.value) || 1)}
          error={errors.stars}
          min={1}
          max={5}
        />
      </div>

      <div>
        <label className="text-sm font-light text-white/80">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="mt-1.5 w-full rounded border border-white/[0.06] bg-pv-black-80 px-3 py-2 text-sm font-light text-white/80 placeholder:text-white/30 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30"
          placeholder="Describe the hotel..."
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Input
          label="Phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+33 1 23 45 67 89"
        />
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="contact@parisvasy.com"
        />
      </div>

      {/* Cover Image & Gallery */}
      <div>
        <label className="text-sm font-light text-white/80">Cover Image & Gallery</label>
        <div className="mt-1.5">
          <ImageUploader
            bucket="hotel-images"
            entityId={hotel?.id ?? "new"}
            existingImages={images}
            coverImage={coverImage}
            onImagesChange={setImages}
            onCoverChange={setCoverImage}
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
        {hotel && onDelete && (
          <div>
            {!confirmDelete ? (
              <Button
                type="button"
                variant="destructive"
                onClick={() => setConfirmDelete(true)}
              >
                Delete Hotel
              </Button>
            ) : (
              <div className="flex items-center gap-2 rounded border border-red-500/30 bg-red-900/30 px-4 py-2">
                <span className="text-sm font-light text-red-400">
                  This will delete all related data. Are you sure?
                </span>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={onDelete}
                >
                  Yes, delete
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setConfirmDelete(false)}
                >
                  No
                </Button>
              </div>
            )}
          </div>
        )}
        <div className="ml-auto">
          <Button type="submit" loading={submitting}>
            {hotel ? "Update Hotel" : "Create Hotel"}
          </Button>
        </div>
      </div>
    </form>
  );
}
