"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { slugify } from "@/lib/utils";
import type { Hotel } from "@/types";

interface HotelFormProps {
  hotel?: Hotel;
  onSubmit: (data: {
    name: string;
    slug: string;
    address: string;
    city: string;
    country: string;
    stars: number;
    description: string;
    phone: string;
    email: string;
  }) => void;
}

export function HotelForm({ hotel, onSubmit }: HotelFormProps) {
  const [name, setName] = useState(hotel?.name ?? "");
  const [slug, setSlug] = useState(hotel?.slug ?? "");
  const [address, setAddress] = useState(hotel?.address ?? "");
  const [city, setCity] = useState(hotel?.city ?? "");
  const [country, setCountry] = useState(hotel?.country ?? "");
  const [stars, setStars] = useState(hotel?.stars ?? 5);
  const [description, setDescription] = useState(hotel?.description ?? "");
  const [phone, setPhone] = useState(hotel?.phone ?? "");
  const [email, setEmail] = useState(hotel?.email ?? "");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

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
    onSubmit({ name, slug, address, city, country, stars, description, phone, email });
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
        <label className="text-sm font-medium text-navy-500">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="mt-1.5 w-full rounded-lg border border-navy-100 bg-white px-3 py-2 text-sm text-navy-500 placeholder:text-navy-200 focus:border-vermillion-500 focus:outline-none focus:ring-2 focus:ring-vermillion-300"
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

      {/* Cover image placeholder */}
      <div>
        <label className="text-sm font-medium text-navy-500">Cover Image</label>
        <div className="mt-1.5 flex h-40 items-center justify-center rounded-lg border-2 border-dashed border-navy-100 bg-cream-50 text-sm text-navy-300">
          Cover image upload placeholder
        </div>
      </div>

      {/* Gallery placeholder */}
      <div>
        <label className="text-sm font-medium text-navy-500">Gallery</label>
        <div className="mt-1.5 flex h-32 items-center justify-center rounded-lg border-2 border-dashed border-navy-100 bg-cream-50 text-sm text-navy-300">
          Gallery upload placeholder
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" loading={submitting}>
          {hotel ? "Update Hotel" : "Create Hotel"}
        </Button>
      </div>
    </form>
  );
}
