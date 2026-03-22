"use client";

import { Suspense, useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { BookingsTable } from "@/components/admin/BookingsTable";
import type { Booking } from "@/types";

function BookingsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    try {
      const qs = searchParams.toString();
      const res = await fetch(`/api/bookings${qs ? `?${qs}` : ""}`);
      if (res.ok) {
        const data = await res.json();
        setBookings(data);
      }
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleAction = async (
    action: "view" | "check_in" | "check_out" | "cancel",
    bookingId: string
  ) => {
    if (action === "view") {
      router.push(`/admin/bookings/${bookingId}`);
      return;
    }

    const res = await fetch(`/api/bookings/${bookingId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });

    if (res.ok) {
      fetchBookings();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy-500 font-serif">
          Bookings
        </h1>
        <p className="mt-1 text-sm text-navy-300 font-sans">
          Manage all reservations, check-ins, and check-outs.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-navy-200 border-t-vermillion-500" />
        </div>
      ) : (
        <div className="rounded-xl border border-navy-50 bg-white p-6 shadow-sm">
          <BookingsTable bookings={bookings} onAction={handleAction} />
        </div>
      )}
    </div>
  );
}

export default function BookingsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-navy-200 border-t-vermillion-500" />
        </div>
      }
    >
      <BookingsContent />
    </Suspense>
  );
}
