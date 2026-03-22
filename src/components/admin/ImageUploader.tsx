"use client";

import { useCallback, useRef, useState } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxFiles?: number;
}

export function ImageUploader({
  images,
  onChange,
  maxFiles = 10,
}: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files) return;
      const remaining = maxFiles - images.length;
      if (remaining <= 0) return;

      const newImages: string[] = [];
      const toProcess = Array.from(files).slice(0, remaining);

      let processed = 0;
      toProcess.forEach((file) => {
        if (!file.type.startsWith("image/")) return;
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            newImages.push(e.target.result as string);
          }
          processed++;
          if (processed === toProcess.length) {
            onChange([...images, ...newImages]);
          }
        };
        reader.readAsDataURL(file);
      });
    },
    [images, maxFiles, onChange]
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

  const removeImage = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      {/* Drop zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-8 transition-colors",
          dragging
            ? "border-vermillion-500 bg-vermillion-50"
            : "border-navy-100 bg-cream-50 hover:border-navy-200"
        )}
      >
        <Upload
          className={cn(
            "h-8 w-8",
            dragging ? "text-vermillion-500" : "text-navy-200"
          )}
        />
        <p className="text-sm text-navy-400">
          Drag and drop images here, or click to browse
        </p>
        <p className="text-xs text-navy-300">
          {images.length}/{maxFiles} images
        </p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {/* Preview thumbnails */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
          {images.map((src, i) => (
            <div
              key={i}
              className="group relative aspect-square overflow-hidden rounded-lg border border-navy-100"
            >
              {src.startsWith("data:") ? (
                <img
                  src={src}
                  alt={`Upload ${i + 1}`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-cream-50">
                  <ImageIcon className="h-6 w-6 text-navy-200" />
                </div>
              )}
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                aria-label={`Remove image ${i + 1}`}
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
