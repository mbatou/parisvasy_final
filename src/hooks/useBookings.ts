"use client";

import { useState, useEffect, useCallback } from "react";
import type { Booking } from "@/types";

interface UseBookingsOptions {
  hotelId?: string;
  status?: string;
}

interface UseBookingsReturn {
  bookings: Booking[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useBookings(options?: UseBookingsOptions): UseBookingsReturn {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (options?.hotelId) params.set("hotelId", options.hotelId);
      if (options?.status) params.set("status", options.status);

      const query = params.toString();
      const url = `/api/bookings${query ? `?${query}` : ""}`;

      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`Failed to fetch bookings: ${res.statusText}`);
      }

      const data = await res.json();
      setBookings(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [options?.hotelId, options?.status]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  return { bookings, loading, error, refetch: fetchBookings };
}
