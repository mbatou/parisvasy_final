"use client";

import { useRouter } from "next/navigation";
import { RoomForm } from "@/components/admin/RoomForm";
import type { Room } from "@/types";

interface RoomEditClientProps {
  room: Room;
}

export function RoomEditClient({ room }: RoomEditClientProps) {
  const router = useRouter();

  const handleSubmit = async (data: Record<string, unknown>) => {
    const res = await fetch(`/api/rooms/${room.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      router.push("/admin/rooms");
    }
  };

  return <RoomForm room={room} onSubmit={handleSubmit} />;
}
