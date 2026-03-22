"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import NightSelector from "@/components/public/NightSelector";
import RoomSelector from "@/components/public/RoomSelector";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { formatCurrency } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { CalendarDays, Users, Gift } from "lucide-react";
import type { Room } from "@/types";

interface BookingSidebarProps {
  experienceId: string;
  hotelId: string;
  rooms: Room[];
}

export default function BookingSidebar({
  experienceId,
  hotelId,
  rooms,
}: BookingSidebarProps) {
  const router = useRouter();

  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(
    rooms[0]?.id ?? null
  );
  const [nights, setNights] = useState(1);
  const [checkIn, setCheckIn] = useState("");
  const [guestCount, setGuestCount] = useState(2);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedRoom = useMemo(
    () => rooms.find((r) => r.id === selectedRoomId) ?? null,
    [rooms, selectedRoomId]
  );

  const pricePerNight = selectedRoom
    ? typeof selectedRoom.pricePerNight === "number"
      ? selectedRoom.pricePerNight
      : parseFloat(String(selectedRoom.pricePerNight))
    : 0;

  const roomTotal = pricePerNight * nights;

  const checkOutDate = useMemo(() => {
    if (!checkIn) return "";
    const d = new Date(checkIn);
    d.setDate(d.getDate() + nights);
    return d.toISOString().split("T")[0];
  }, [checkIn, nights]);

  const today = new Date().toISOString().split("T")[0];

  const handleBook = async () => {
    if (!selectedRoomId || !checkIn) {
      setError("Please select a room and check-in date.");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push(`/login?redirect=/experiences/${window.location.pathname.split("/").pop()}`);
        return;
      }

      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hotelId,
          roomId: selectedRoomId,
          experienceId,
          checkIn,
          checkOut: checkOutDate,
          guestCount,
          roomTotal,
          guest: {
            email: user.email,
            firstName: user.user_metadata?.first_name ?? "",
            lastName: user.user_metadata?.last_name ?? "",
          },
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        setError(body?.error ?? "Failed to create booking.");
        setLoading(false);
        return;
      }

      const booking = await res.json();
      router.push(`/booking/${booking.id}`);
    } catch {
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="sticky top-6 border border-white/[0.06] bg-pv-black-80 p-6">
      <h3 className="font-serif text-xl font-light text-white">Book this experience</h3>

      {error && (
        <div className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Room Selection */}
      <div className="mt-6">
        <label className="mb-2 block text-sm font-medium text-white">
          Choose a room
        </label>
        <RoomSelector
          rooms={rooms}
          selected={selectedRoomId}
          onChange={setSelectedRoomId}
        />
      </div>

      {/* Night Selector */}
      {selectedRoom && (
        <div className="mt-6">
          <label className="mb-2 block text-sm font-medium text-white">
            Number of nights
          </label>
          <NightSelector
            pricePerNight={pricePerNight}
            selected={nights}
            onChange={setNights}
          />
        </div>
      )}

      {/* Date Input */}
      <div className="mt-6">
        <label className="mb-2 flex items-center gap-1.5 text-sm font-medium text-white">
          <CalendarDays className="h-4 w-4" />
          Check-in date
        </label>
        <Input
          type="date"
          value={checkIn}
          onChange={(e) => setCheckIn(e.target.value)}
          min={today}
          required
        />
        {checkOutDate && (
          <p className="mt-1 text-xs text-white/40">
            Check-out: {checkOutDate}
          </p>
        )}
      </div>

      {/* Guest Count */}
      <div className="mt-6">
        <label className="mb-2 flex items-center gap-1.5 text-sm font-medium text-white">
          <Users className="h-4 w-4" />
          Guests
        </label>
        <Input
          type="number"
          value={guestCount}
          onChange={(e) => setGuestCount(Math.max(1, parseInt(e.target.value) || 1))}
          min={1}
          max={selectedRoom?.maxGuests ?? 6}
        />
      </div>

      {/* Summary */}
      {selectedRoom && (
        <div className="mt-6 space-y-2 bg-pv-black-90 px-4 py-4">
          <div className="flex justify-between text-sm text-white/50">
            <span>
              {formatCurrency(pricePerNight)} x {nights}{" "}
              {nights === 1 ? "night" : "nights"}
            </span>
            <span className="font-semibold text-white">
              {formatCurrency(roomTotal)}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-1.5 text-sage-500">
              <Gift className="h-4 w-4" />
              Experience
            </span>
            <span className="font-semibold text-sage-500">Included free</span>
          </div>
          <div className="border-t border-white/[0.06] pt-2">
            <div className="flex justify-between text-base font-bold">
              <span className="text-white">Total</span>
              <span className="text-gold">{formatCurrency(roomTotal)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Book Button */}
      <Button
        size="lg"
        className="mt-6 w-full"
        loading={loading}
        onClick={handleBook}
        disabled={!selectedRoomId || !checkIn}
      >
        Book Now
      </Button>

      <p className="mt-3 text-center text-xs text-white/40">
        No payment now — card warranty collected on the next step
      </p>
    </div>
  );
}
