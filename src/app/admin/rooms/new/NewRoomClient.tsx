"use client";

import { useRouter } from "next/navigation";
import { RoomForm } from "@/components/admin/RoomForm";
import { Select } from "@/components/ui/Select";
import { useState } from "react";
import type { UserRole } from "@/types";

interface NewRoomClientProps {
  userRole: UserRole;
  assignedHotelId: string;
  hotels: { id: string; name: string }[];
}

export function NewRoomClient({
  userRole,
  assignedHotelId,
  hotels,
}: NewRoomClientProps) {
  const router = useRouter();
  const [hotelId, setHotelId] = useState(
    userRole === "super_admin" ? "" : assignedHotelId
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = async (data: any) => {
    const body = {
      ...data,
      hotelId: hotelId || assignedHotelId,
    };

    const res = await fetch("/api/rooms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      router.push("/admin/rooms");
      router.refresh();
    }
  };

  const selectedHotelName = hotels.find((h) => h.id === hotelId)?.name;

  return (
    <div className="space-y-6">
      {/* Hotel assignment */}
      {userRole === "super_admin" && hotels.length > 0 && (
        <Select
          label="Hotel"
          value={hotelId}
          onChange={(e) => setHotelId(e.target.value)}
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

      <RoomForm onSubmit={handleSubmit} />
    </div>
  );
}
