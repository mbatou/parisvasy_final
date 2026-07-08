"use client";

import { useCallback, useRef, useState } from "react";
import { Upload, X, Star, Loader2, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageUploaderProps {
  bucket: "hotel-images" | "room-images" | "experience-images";
  entityId: string;
  existingImages: string[];
  coverImage?: string;
  onImagesChange: (images: string[]) => void;
  onCoverChange?: (url: string) => void;
  maxImages?: number;
}

const BUCKET_TYPE_MAP: Record<string, string> = {
  "hotel-images": "hotel",
  "room-images": "room",
  "experience-images": "experience",
};

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export function ImageUploader({
  bucket,
  entityId,
  existingImages,
  coverImage,
  onImagesChange,
  onCoverChange,
  maxImages = 10,
}: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState<Record<string, number>>({});
  const [error, setError] = useState<string | null>(null);

  const uploadFile = async (file: File): Promise<string | null> => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      setError(`Invalid file type: ${file.name}. Allowed: JPEG, PNG, WebP`);
      return null;
    }
    if (file.size > MAX_FILE_SIZE) {
      setError(`File too large: ${file.name}. Max 5MB.`);
      return null;
    }

    const uploadId = `${file.name}-${Date.now()}`;
    setUploading((prev) => ({ ...prev, [uploadId]: 0 }));

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", BUCKET_TYPE_MAP[bucket]);
      formData.append("entityId", entityId);

      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploading((prev) => {
          const current = prev[uploadId] ?? 0;
          if (current >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return { ...prev, [uploadId]: current + 10 };
        });
      }, 200);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      clearInterval(progressInterval);

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Upload failed");
      }

      const { url } = await res.json();
      setUploading((prev) => ({ ...prev, [uploadId]: 100 }));

      // Clean up progress after a moment
      setTimeout(() => {
        setUploading((prev) => {
          const next = { ...prev };
          delete next[uploadId];
          return next;
        });
      }, 500);

      return url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
      setUploading((prev) => {
        const next = { ...prev };
        delete next[uploadId];
        return next;
      });
      return null;
    }
  };

  const handleFiles = useCallback(
    async (files: FileList | null) => {
      if (!files) return;
      setError(null);

      const remaining = maxImages - existingImages.length;
      if (remaining <= 0) {
        setError(`Maximum ${maxImages} images allowed`);
        return;
      }

      const toProcess = Array.from(files).slice(0, remaining);
      const newUrls: string[] = [];

      for (const file of toProcess) {
        const url = await uploadFile(file);
        if (url) newUrls.push(url);
      }

      if (newUrls.length > 0) {
        const updated = [...existingImages, ...newUrls];
        onImagesChange(updated);

        // If no cover image set and we have onCoverChange, set the first image as cover
        if (!coverImage && onCoverChange && updated.length > 0) {
          onCoverChange(updated[0]);
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [existingImages, maxImages, coverImage, onImagesChange, onCoverChange, bucket, entityId]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const removeImage = async (index: number) => {
    const url = existingImages[index];
    const updated = existingImages.filter((_, i) => i !== index);
    onImagesChange(updated);

    // If removed image was the cover, set first remaining as cover
    if (url === coverImage && onCoverChange) {
      onCoverChange(updated[0] ?? "");
    }

    // Delete from storage
    try {
      const filename = url.split("/").pop();
      if (filename) {
        await fetch("/api/upload/delete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ bucket, filename }),
        });
      }
    } catch {
      // Silent fail on storage delete
    }
  };

  const setCover = (url: string) => {
    if (onCoverChange) {
      onCoverChange(url);
    }
  };

  const isUploading = Object.keys(uploading).length > 0;

  return (
    <div className="space-y-3">
      {/* Drop zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center gap-2 border-2 border-dashed p-8 transition-colors",
          dragging
            ? "border-gold bg-gold/10"
            : "border-white/[0.06] bg-pv-black-90 hover:border-gold/25"
        )}
      >
        {isUploading ? (
          <Loader2 className="h-8 w-8 animate-spin text-gold" />
        ) : (
          <Upload
            className={cn(
              "h-8 w-8",
              dragging ? "text-gold" : "text-white/30"
            )}
          />
        )}
        <p className="text-sm font-light text-white/40">
          {isUploading
            ? "Uploading..."
            : "Drop images here or click to browse"}
        </p>
        <p className="text-xs font-light text-white/30">
          {existingImages.length}/{maxImages} images &middot; JPEG, PNG, WebP &middot; Max 5MB
        </p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        className="hidden"
        onChange={(e) => {
          handleFiles(e.target.files);
          e.target.value = "";
        }}
      />

      {/* Upload progress bars */}
      {Object.entries(uploading).length > 0 && (
        <div className="space-y-2">
          {Object.entries(uploading).map(([id, progress]) => (
            <div key={id} className="flex items-center gap-3">
              <div className="h-1.5 flex-1 bg-white/[0.06] overflow-hidden rounded-full">
                <div
                  className="h-full bg-gold transition-all duration-300 rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-xs text-white/40 w-8">{progress}%</span>
            </div>
          ))}
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="flex items-center justify-between rounded bg-red-900/30 px-4 py-2 text-sm text-red-400">
          <span>{error}</span>
          <button type="button" onClick={() => setError(null)}>
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Preview thumbnails */}
      {existingImages.length > 0 && (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
          {existingImages.map((src, i) => {
            const isCover = src === coverImage;
            return (
              <div
                key={`${src}-${i}`}
                className={cn(
                  "group relative aspect-square overflow-hidden border",
                  isCover
                    ? "border-2 border-gold ring-2 ring-gold/20"
                    : "border-white/[0.06]"
                )}
              >
                {src.startsWith("http") || src.startsWith("data:") ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={src}
                    alt={`Image ${i + 1}`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-pv-black-90">
                    <ImageIcon className="h-6 w-6 text-white/30" />
                  </div>
                )}

                {/* Cover badge */}
                {isCover && (
                  <div className="absolute left-1 top-1 flex items-center gap-1 rounded-full bg-gold px-2 py-0.5">
                    <Star className="h-3 w-3 text-pv-black" />
                    <span className="text-[10px] font-semibold text-pv-black">Cover</span>
                  </div>
                )}

                {/* Action overlay */}
                <div className="absolute inset-0 flex items-center justify-center gap-1 bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
                  {onCoverChange && !isCover && (
                    <button
                      type="button"
                      onClick={() => setCover(src)}
                      className="rounded-full bg-gold/80 p-1.5 text-pv-black hover:bg-gold transition-colors"
                      title="Set as cover"
                    >
                      <Star className="h-3.5 w-3.5" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="rounded-full bg-red-500/80 p-1.5 text-white hover:bg-red-500 transition-colors"
                    title="Delete image"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
