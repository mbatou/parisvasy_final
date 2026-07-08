"use client";

import { useRouter } from "next/navigation";
import { ExperienceForm } from "@/components/admin/ExperienceForm";
import type { UserRole } from "@/types";

interface NewExperienceClientProps {
  userRole: UserRole;
  assignedHotelId: string;
  hotels: { id: string; name: string }[];
}

export function NewExperienceClient({
  userRole,
  assignedHotelId,
  hotels,
}: NewExperienceClientProps) {
  const router = useRouter();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = async (data: any) => {
    // If hotel_manager, set hotelId automatically
    const body = {
      ...data,
      hotelId: data.hotelId || assignedHotelId,
    };

    const res = await fetch("/api/experiences", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      router.push("/admin/experiences");
      router.refresh();
    }
  };

  return (
    <ExperienceForm
      onSubmit={handleSubmit}
      userRole={userRole}
      assignedHotelId={assignedHotelId}
      hotels={hotels}
    />
  );
}
