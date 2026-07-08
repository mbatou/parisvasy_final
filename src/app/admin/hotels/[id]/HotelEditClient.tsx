"use client";

import { useRouter } from "next/navigation";
import { HotelForm } from "@/components/admin/HotelForm";
import type { Hotel } from "@/types";

interface HotelEditClientProps {
  hotel: Hotel;
}

export function HotelEditClient({ hotel }: HotelEditClientProps) {
  const router = useRouter();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = async (data: any) => {
    const res = await fetch(`/api/hotels/${hotel.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      router.push("/admin/hotels");
      router.refresh();
    }
  };

  const handleDelete = async () => {
    const res = await fetch(`/api/hotels/${hotel.id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      router.push("/admin/hotels");
      router.refresh();
    }
  };

  return <HotelForm hotel={hotel} onSubmit={handleSubmit} onDelete={handleDelete} />;
}
