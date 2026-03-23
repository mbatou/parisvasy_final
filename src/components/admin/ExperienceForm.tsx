"use client";

import { useState, useEffect } from "react";
import { z } from "zod";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { slugify } from "@/lib/utils";
import { X } from "lucide-react";
import type { Experience, ExperienceCategory, UserRole } from "@/types";
import { CATEGORY_LABELS } from "@/types";

const experienceSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  slug: z.string().min(2, "Slug is required"),
  category: z.enum([
    "cruise",
    "gastronomy",
    "culture",
    "wellness",
    "adventure",
    "nightlife",
  ]),
  description: z.string().min(10, "Description must be at least 10 characters"),
  location: z.string().min(2, "Location is required"),
  duration: z.string().min(1, "Duration is required"),
  maxGroup: z.number().min(1, "Must allow at least 1 guest"),
  inclusions: z.array(z.string()),
  isFlash: z.boolean(),
  flashStart: z.string().optional(),
  flashEnd: z.string().optional(),
  isActive: z.boolean(),
});

type ExperienceFormData = z.infer<typeof experienceSchema> & {
  images: string[];
  coverImage: string;
  hotelId?: string;
};

interface ExperienceFormProps {
  experience?: Experience;
  onSubmit: (data: ExperienceFormData) => void;
  onDelete?: () => void;
  userRole?: UserRole;
  assignedHotelId?: string;
  hotels?: { id: string; name: string }[];
}

export function ExperienceForm({
  experience,
  onSubmit,
  onDelete,
  userRole,
  assignedHotelId,
  hotels,
}: ExperienceFormProps) {
  const [title, setTitle] = useState(experience?.title ?? "");
  const [slug, setSlug] = useState(experience?.slug ?? "");
  const [category, setCategory] = useState<ExperienceCategory>(
    experience?.category ?? "cruise"
  );
  const [description, setDescription] = useState(
    experience?.description ?? ""
  );
  const [location, setLocation] = useState(experience?.location ?? "");
  const [duration, setDuration] = useState(experience?.duration ?? "");
  const [maxGroup, setMaxGroup] = useState(experience?.maxGroup ?? 1);
  const [inclusions, setInclusions] = useState<string[]>(
    experience?.inclusions ?? []
  );
  const [inclusionInput, setInclusionInput] = useState("");
  const [images, setImages] = useState<string[]>(experience?.images ?? []);
  const [coverImage, setCoverImage] = useState(experience?.coverImage ?? "");
  const [isFlash, setIsFlash] = useState(experience?.isFlash ?? false);
  const [flashStart, setFlashStart] = useState(
    experience?.flashStart
      ? new Date(experience.flashStart).toISOString().split("T")[0]
      : ""
  );
  const [flashEnd, setFlashEnd] = useState(
    experience?.flashEnd
      ? new Date(experience.flashEnd).toISOString().split("T")[0]
      : ""
  );
  const [isActive, setIsActive] = useState(experience?.isActive ?? true);
  const [hotelId, setHotelId] = useState(experience?.hotelId ?? assignedHotelId ?? "");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (!experience) {
      setSlug(slugify(title));
    }
  }, [title, experience]);

  const addInclusion = () => {
    const val = inclusionInput.trim();
    if (val && !inclusions.includes(val)) {
      setInclusions([...inclusions, val]);
    }
    setInclusionInput("");
  };

  const removeInclusion = (item: string) => {
    setInclusions(inclusions.filter((i) => i !== item));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const data = {
      title,
      slug,
      category,
      description,
      location,
      duration,
      maxGroup,
      inclusions,
      isFlash,
      flashStart: isFlash ? flashStart : undefined,
      flashEnd: isFlash ? flashEnd : undefined,
      isActive,
    };

    const result = experienceSchema.safeParse(data);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((err) => {
        const key = err.path[0]?.toString();
        if (key) fieldErrors[key] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    if (!hotelId && userRole === "super_admin") {
      setErrors({ hotelId: "Please select a hotel" });
      return;
    }

    setSubmitting(true);
    onSubmit({ ...result.data, images, coverImage, hotelId });
  };

  const selectedHotelName = hotels?.find((h) => h.id === hotelId)?.name;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Hotel assignment */}
      {userRole === "super_admin" && hotels && hotels.length > 0 && (
        <Select
          label="Hotel"
          value={hotelId}
          onChange={(e) => setHotelId(e.target.value)}
          error={errors.hotelId}
        >
          <option value="">Select a hotel...</option>
          {hotels.map((h) => (
            <option key={h.id} value={h.id}>
              {h.name}
            </option>
          ))}
        </Select>
      )}
      {userRole === "hotel_manager" && selectedHotelName && (
        <div>
          <label className="text-sm font-light text-white/80">Hotel</label>
          <p className="mt-1.5 rounded border border-white/[0.06] bg-pv-black-80 px-3 py-2.5 text-sm font-light text-white/60">
            {selectedHotelName}
          </p>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <Input
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          error={errors.title}
          placeholder="Seine River Dinner Cruise"
        />
        <Input
          label="Slug"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          error={errors.slug}
          helperText="Auto-generated from title"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Select
          label="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value as ExperienceCategory)}
          error={errors.category}
        >
          {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </Select>
        <Input
          label="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          error={errors.location}
          placeholder="Port de la Bourdonnais"
        />
        <Input
          label="Duration"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          error={errors.duration}
          placeholder="3 hours"
        />
      </div>

      <div>
        <label className="text-sm font-light text-white/80">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="mt-1.5 w-full rounded border border-white/[0.06] bg-pv-black-80 px-3 py-2 text-sm font-light text-white/80 placeholder:text-white/30 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30"
          placeholder="Describe the experience..."
        />
        {errors.description && (
          <p className="mt-1 text-xs text-red-400">{errors.description}</p>
        )}
      </div>

      <Input
        label="Max Group Size"
        type="number"
        value={maxGroup}
        onChange={(e) => setMaxGroup(parseInt(e.target.value) || 1)}
        error={errors.maxGroup}
        min={1}
      />

      {/* Inclusions */}
      <div>
        <label className="text-sm font-light text-white/80">Inclusions</label>
        <div className="mt-1.5 flex gap-2">
          <input
            type="text"
            value={inclusionInput}
            onChange={(e) => setInclusionInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addInclusion();
              }
            }}
            placeholder="Add inclusion and press Enter"
            className="h-10 flex-1 rounded border border-white/[0.06] bg-pv-black-80 px-3 text-sm font-light text-white/80 placeholder:text-white/30 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30"
          />
          <Button type="button" variant="outline" size="md" onClick={addInclusion}>
            Add
          </Button>
        </div>
        {inclusions.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {inclusions.map((item) => (
              <span
                key={item}
                className="inline-flex items-center gap-1 rounded-full bg-white/[0.08] px-3 py-1 text-xs font-light text-white/80"
              >
                {item}
                <button
                  type="button"
                  onClick={() => removeInclusion(item)}
                  className="rounded-full p-0.5 hover:bg-white/[0.04]"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Image uploads */}
      <div>
        <label className="text-sm font-light text-white/80">Cover Image & Gallery</label>
        <div className="mt-1.5">
          <ImageUploader
            bucket="experience-images"
            entityId={experience?.id ?? "new"}
            existingImages={images}
            coverImage={coverImage}
            onImagesChange={setImages}
            onCoverChange={setCoverImage}
            maxImages={10}
          />
        </div>
      </div>

      {/* Flash deal */}
      <div className="space-y-3 rounded border border-white/[0.06] p-4">
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={isFlash}
            onChange={(e) => setIsFlash(e.target.checked)}
            className="h-4 w-4 rounded border-white/[0.06] text-gold focus:ring-gold/30"
          />
          <span className="text-sm font-light text-white/80">Flash Deal</span>
        </label>
        {isFlash && (
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              label="Flash Start"
              type="date"
              value={flashStart}
              onChange={(e) => setFlashStart(e.target.value)}
            />
            <Input
              label="Flash End"
              type="date"
              value={flashEnd}
              onChange={(e) => setFlashEnd(e.target.value)}
            />
          </div>
        )}
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
        {experience && onDelete && (
          <div>
            {!confirmDelete ? (
              <Button
                type="button"
                variant="destructive"
                onClick={() => setConfirmDelete(true)}
              >
                Delete Experience
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
            {experience ? "Update Experience" : "Create Experience"}
          </Button>
        </div>
      </div>
    </form>
  );
}
