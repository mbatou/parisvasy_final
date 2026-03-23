"use client";

import { useRouter } from "next/navigation";
import { RoomForm } from "@/components/admin/RoomForm";
import type { Room } from "@/types";

interface RoomEditClientProps {
  room: Room;
}

export function RoomEditClient({ room }: RoomEditClientProps) {
  const router = useRouter();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = async (data: any) => {
    const res = await fetch(`/api/rooms/${room.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      router.push("/admin/rooms");
      router.refresh();
    }
  };

  const handleDelete = async () => {
    const res = await fetch(`/api/rooms/${room.id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      router.push("/admin/rooms");
      router.refresh();
    }
  };

  return <RoomForm room={room} onSubmit={handleSubmit} onDelete={handleDelete} />;
}
