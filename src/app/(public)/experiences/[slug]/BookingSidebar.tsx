"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import NightSelector from "@/components/public/NightSelector";
import RoomSelector from "@/components/public/RoomSelector";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { formatCurrency } from "@/lib/utils";
import { CalendarDays, Users, Gift, User } from "lucide-react";
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
  const [checkOut, setCheckOut] = useState("");
  const [guestCount, setGuestCount] = useState(2);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Guest info (no auth required)
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");

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

  const today = new Date().toISOString().split("T")[0];

  // When check-in changes, auto-set check-out based on nights
  const handleCheckInChange = (value: string) => {
    setCheckIn(value);
    if (value) {
      const d = new Date(value);
      d.setDate(d.getDate() + nights);
      setCheckOut(d.toISOString().split("T")[0]);
    } else {
      setCheckOut("");
    }
  };

  // When check-out changes, recalculate nights
  const handleCheckOutChange = (value: string) => {
    setCheckOut(value);
    if (checkIn && value) {
      const ci = new Date(checkIn);
      const co = new Date(value);
      const diff = Math.round((co.getTime() - ci.getTime()) / (1000 * 60 * 60 * 24));
      if (diff >= 1 && diff <= 3) {
        setNights(diff);
      } else if (diff < 1) {
        // Reset to check-in + 1
        const d = new Date(checkIn);
        d.setDate(d.getDate() + 1);
        setCheckOut(d.toISOString().split("T")[0]);
        setNights(1);
      } else {
        // Max 3 nights
        const d = new Date(checkIn);
        d.setDate(d.getDate() + 3);
        setCheckOut(d.toISOString().split("T")[0]);
        setNights(3);
      }
    }
  };

  // When nights change (from NightSelector), adjust check-out
  const handleNightsChange = (n: number) => {
    setNights(n);
    if (checkIn) {
      const d = new Date(checkIn);
      d.setDate(d.getDate() + n);
      setCheckOut(d.toISOString().split("T")[0]);
    }
  };

  // Min check-out = checkIn + 1 day
  const minCheckOut = useMemo(() => {
    if (!checkIn) return today;
    const d = new Date(checkIn);
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  }, [checkIn, today]);

  // Max check-out = checkIn + 3 days
  const maxCheckOut = useMemo(() => {
    if (!checkIn) return "";
    const d = new Date(checkIn);
    d.setDate(d.getDate() + 3);
    return d.toISOString().split("T")[0];
  }, [checkIn]);

  // Format date for display
  const formatDisplayDate = (dateStr: string) => {
    if (!dateStr) return "";
    const d = new Date(dateStr + "T12:00:00");
    return d.toLocaleDateString("en-GB", {
      weekday: "short",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleBook = async () => {
    if (!selectedRoomId || !checkIn || !checkOut) {
      setError("Please select a room and dates.");
      return;
    }
    if (!firstName.trim() || !lastName.trim() || !email.trim()) {
      setError("Please fill in your name and email.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hotelId,
          roomId: selectedRoomId,
          experienceId,
          checkIn,
          checkOut,
          guestCount,
          roomTotal,
          guest: {
            email: email.trim(),
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            phone: phone.trim() || null,
          },
          notes: notes.trim() || null,
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
        <div className="mt-4 border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
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
            onChange={handleNightsChange}
          />
        </div>
      )}

      {/* Check-in & Check-out Dates */}
      <div className="mt-6 grid grid-cols-2 gap-3">
        <div>
          <label className="mb-2 flex items-center gap-1.5 text-sm font-medium text-white">
            <CalendarDays className="h-4 w-4" />
            Check-in
          </label>
          <Input
            type="date"
            value={checkIn}
            onChange={(e) => handleCheckInChange(e.target.value)}
            min={today}
            required
          />
        </div>
        <div>
          <label className="mb-2 flex items-center gap-1.5 text-sm font-medium text-white">
            <CalendarDays className="h-4 w-4" />
            Check-out
          </label>
          <Input
            type="date"
            value={checkOut}
            onChange={(e) => handleCheckOutChange(e.target.value)}
            min={minCheckOut}
            max={maxCheckOut}
            required
            disabled={!checkIn}
          />
        </div>
      </div>

      {/* Stay summary */}
      {checkIn && checkOut && (
        <div className="mt-2 space-y-0.5 text-xs text-white/40">
          <p>{formatDisplayDate(checkIn)} &rarr; {formatDisplayDate(checkOut)}</p>
          <p className="text-gold/70 font-medium">{nights} {nights === 1 ? "night" : "nights"}</p>
        </div>
      )}

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

      {/* Guest Information */}
      <div className="mt-6 border-t border-white/[0.06] pt-6">
        <label className="mb-4 flex items-center gap-1.5 text-sm font-medium text-white">
          <User className="h-4 w-4" />
          Your information
        </label>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="First name *"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="John"
              required
            />
            <Input
              label="Last name *"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Doe"
              required
            />
          </div>
          <Input
            label="Email *"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="john@example.com"
            required
          />
          <Input
            label="Phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+33 6 00 00 00 00"
          />
          <div>
            <label className="text-sm font-light text-white/80">Special requests</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="mt-1.5 w-full border border-white/[0.06] bg-pv-black-80 px-3 py-2 text-sm font-light text-white/80 placeholder:text-white/30 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30"
              placeholder="Any special requests..."
            />
          </div>
        </div>
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
        disabled={!selectedRoomId || !checkIn || !checkOut || !firstName || !lastName || !email}
      >
        Book Now
      </Button>

      <p className="mt-3 text-center text-xs text-white/40">
        No payment now — card warranty collected on the next step
      </p>
    </div>
  );
}
