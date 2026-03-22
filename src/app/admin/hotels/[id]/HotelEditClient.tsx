"use client";

import { useRouter } from "next/navigation";
import { HotelForm } from "@/components/admin/HotelForm";
import type { Hotel } from "@/types";

interface HotelEditClientProps {
  hotel: Hotel;
}

export function HotelEditClient({ hotel }: HotelEditClientProps) {
  const router = useRouter();

  const handleSubmit = async (data: Record<string, unknown>) => {
    const res = await fetch(`/api/hotels/${hotel.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      router.push("/admin/hotels");
    }
  };

  return <HotelForm hotel={hotel} onSubmit={handleSubmit} />;
}
