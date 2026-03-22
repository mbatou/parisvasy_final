"use client";

import { useRouter } from "next/navigation";
import { RoomForm } from "@/components/admin/RoomForm";

export default function NewRoomPage() {
  const router = useRouter();

  const handleSubmit = async (data: Record<string, unknown>) => {
    const res = await fetch("/api/rooms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      router.push("/admin/rooms");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-light text-white font-serif">
          New Room
        </h1>
        <p className="mt-1 text-sm text-white/40 font-sans">
          Add a new room to your inventory.
        </p>
      </div>

      <div className="border border-white/[0.06] bg-pv-black-80 p-6">
        <RoomForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
