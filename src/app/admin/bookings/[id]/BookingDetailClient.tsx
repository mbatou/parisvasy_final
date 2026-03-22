"use client";

import { useRouter } from "next/navigation";
import { CheckInOutActions } from "@/components/admin/CheckInOutActions";
import { canAccess } from "@/lib/permissions";
import type { Booking, UserRole } from "@/types";

interface BookingDetailClientProps {
  booking: Booking;
  userRole: UserRole;
}

export function BookingDetailClient({
  booking,
  userRole,
}: BookingDetailClientProps) {
  const router = useRouter();

  const handleAction = async (action: "check_in" | "check_out" | "cancel") => {
    const res = await fetch(`/api/bookings/${booking.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });

    if (res.ok) {
      router.refresh();
    }
  };

  if (!canAccess(userRole, "check_in_out")) {
    return (
      <p className="text-sm text-white/40">
        You do not have permission to perform check-in/out actions.
      </p>
    );
  }

  return <CheckInOutActions booking={booking} onAction={handleAction} />;
}
