"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { Input } from "@/components/ui/Input";
import { LogIn, LogOut, XCircle, CheckCircle, AlertTriangle } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { canAccess } from "@/lib/permissions";
import type { Booking, UserRole, BookingStatus } from "@/types";

interface BookingDetailClientProps {
  booking: Booking;
  userRole: UserRole;
  rooms?: { id: string; name: string; type: string }[];
}

export function BookingDetailClient({
  booking,
  userRole,
  rooms,
}: BookingDetailClientProps) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [guestCount, setGuestCount] = useState(booking.guestCount);
  const [roomId, setRoomId] = useState(booking.roomId);
  const [checkIn, setCheckIn] = useState(
    new Date(booking.checkIn).toISOString().split("T")[0]
  );
  const [checkOut, setCheckOut] = useState(
    new Date(booking.checkOut).toISOString().split("T")[0]
  );

  const handleAction = async (action: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/bookings/${booking.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });

      if (res.ok) {
        router.refresh();
      }
    } finally {
      setLoading(false);
      setConfirming(false);
    }
  };

  const handleSaveEdits = async () => {
    setLoading(true);
    try {
      const ciDate = new Date(checkIn);
      const coDate = new Date(checkOut);
      const nights = Math.ceil(
        (coDate.getTime() - ciDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      const res = await fetch(`/api/bookings/${booking.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guestCount,
          roomId,
          checkIn,
          checkOut,
          nights,
        }),
      });

      if (res.ok) {
        setEditing(false);
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  };

  const canCheckInOut = canAccess(userRole, "check_in_out");

  return (
    <div className="space-y-4">
      {/* Timestamps */}
      {booking.checkedInAt && (
        <div className="rounded bg-green-900/30 px-4 py-3 text-sm">
          <span className="font-light text-green-400">Checked in:</span>{" "}
          <span className="font-light text-green-300">
            {formatDate(booking.checkedInAt)}
          </span>
        </div>
      )}
      {booking.checkedOutAt && (
        <div className="rounded bg-blue-900/30 px-4 py-3 text-sm">
          <span className="font-light text-blue-400">Checked out:</span>{" "}
          <span className="font-light text-blue-300">
            {formatDate(booking.checkedOutAt)}
          </span>
        </div>
      )}

      {/* Status actions */}
      {canCheckInOut && (
        <div className="flex flex-wrap gap-2">
          {booking.status === "pending" && (
            <Button
              variant="primary"
              onClick={() => handleAction("confirm")}
              loading={loading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <CheckCircle className="h-4 w-4" />
              Confirm
            </Button>
          )}

          {booking.status === "confirmed" && (
            <Button
              variant="primary"
              onClick={() => handleAction("check_in")}
              loading={loading}
              className="bg-green-600 hover:bg-green-700"
            >
              <LogIn className="h-4 w-4" />
              Check In
            </Button>
          )}

          {booking.status === "checked_in" && (
            <Button
              variant="primary"
              onClick={() => handleAction("check_out")}
              loading={loading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <LogOut className="h-4 w-4" />
              Check Out
            </Button>
          )}

          {(booking.status === "pending" || booking.status === "confirmed") && (
            <>
              {!confirming ? (
                <Button
                  variant="destructive"
                  onClick={() => setConfirming(true)}
                >
                  <XCircle className="h-4 w-4" />
                  Cancel
                </Button>
              ) : (
                <div className="flex items-center gap-2 rounded border border-red-500/30 bg-red-900/30 px-4 py-2">
                  <span className="text-sm font-light text-red-400">
                    Are you sure?
                  </span>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleAction("cancel")}
                    loading={loading}
                  >
                    Yes, cancel
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setConfirming(false)}
                  >
                    No
                  </Button>
                </div>
              )}
            </>
          )}

          {booking.status === "confirmed" && (
            <Button
              variant="ghost"
              onClick={() => handleAction("no_show")}
              loading={loading}
              className="text-yellow-400 hover:bg-yellow-900/30"
            >
              <AlertTriangle className="h-4 w-4" />
              No Show
            </Button>
          )}
        </div>
      )}

      {/* Edit booking details */}
      {canCheckInOut && !["checked_out", "cancelled", "no_show"].includes(booking.status) && (
        <div className="border-t border-white/[0.06] pt-4">
          {!editing ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEditing(true)}
            >
              Edit Details
            </Button>
          ) : (
            <div className="space-y-3">
              <div className="grid gap-3 grid-cols-2">
                <Input
                  label="Check-in"
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                />
                <Input
                  label="Check-out"
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                />
              </div>

              <Input
                label="Guest Count"
                type="number"
                value={guestCount}
                onChange={(e) => setGuestCount(parseInt(e.target.value) || 1)}
                min={1}
              />

              {rooms && rooms.length > 0 && (
                <Select
                  label="Room"
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                >
                  {rooms.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name} ({r.type})
                    </option>
                  ))}
                </Select>
              )}

              <div className="flex gap-2">
                <Button size="sm" onClick={handleSaveEdits} loading={loading}>
                  Save Changes
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditing(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
