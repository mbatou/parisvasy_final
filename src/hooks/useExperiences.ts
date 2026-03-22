"use client";

import { useState, useEffect, useCallback } from "react";
import type { Experience, ExperienceCategory } from "@/types";

interface UseExperiencesOptions {
  hotelId?: string;
  category?: ExperienceCategory;
  flashOnly?: boolean;
}

interface UseExperiencesReturn {
  experiences: Experience[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useExperiences(
  options?: UseExperiencesOptions
): UseExperiencesReturn {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchExperiences = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (options?.hotelId) params.set("hotelId", options.hotelId);
      if (options?.category) params.set("category", options.category);
      if (options?.flashOnly) params.set("flashOnly", "true");

      const query = params.toString();
      const url = `/api/experiences${query ? `?${query}` : ""}`;

      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`Failed to fetch experiences: ${res.statusText}`);
      }

      const data = await res.json();
      setExperiences(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [options?.hotelId, options?.category, options?.flashOnly]);

  useEffect(() => {
    fetchExperiences();
  }, [fetchExperiences]);

  return { experiences, loading, error, refetch: fetchExperiences };
}
