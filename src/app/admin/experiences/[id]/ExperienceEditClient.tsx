"use client";

import { useRouter } from "next/navigation";
import { ExperienceForm } from "@/components/admin/ExperienceForm";
import type { Experience, UserRole } from "@/types";

interface ExperienceEditClientProps {
  experience: Experience;
  userRole?: UserRole;
  assignedHotelId?: string;
  hotels?: { id: string; name: string }[];
}

export function ExperienceEditClient({
  experience,
  userRole,
  assignedHotelId,
  hotels,
}: ExperienceEditClientProps) {
  const router = useRouter();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = async (data: any) => {
    const res = await fetch(`/api/experiences/${experience.slug}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      router.push("/admin/experiences");
      router.refresh();
    }
  };

  const handleDelete = async () => {
    const res = await fetch(`/api/experiences/${experience.slug}`, {
      method: "DELETE",
    });

    if (res.ok) {
      router.push("/admin/experiences");
      router.refresh();
    }
  };

  return (
    <ExperienceForm
      experience={experience}
      onSubmit={handleSubmit}
      onDelete={handleDelete}
      userRole={userRole}
      assignedHotelId={assignedHotelId}
      hotels={hotels}
    />
  );
}
