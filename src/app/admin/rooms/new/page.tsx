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
        <h1 className="text-2xl font-bold text-navy-500 font-serif">
          New Room
        </h1>
        <p className="mt-1 text-sm text-navy-300 font-sans">
          Add a new room to your inventory.
        </p>
      </div>

      <div className="rounded-xl border border-navy-100 bg-white p-6 shadow-sm">
        <RoomForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
