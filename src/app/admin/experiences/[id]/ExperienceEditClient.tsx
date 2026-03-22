"use client";

import { useRouter } from "next/navigation";
import { ExperienceForm } from "@/components/admin/ExperienceForm";
import type { Experience } from "@/types";

interface ExperienceEditClientProps {
  experience: Experience;
}

export function ExperienceEditClient({
  experience,
}: ExperienceEditClientProps) {
  const router = useRouter();

  const handleSubmit = async (data: Record<string, unknown>) => {
    const res = await fetch(`/api/experiences/${experience.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      router.push("/admin/experiences");
    }
  };

  return <ExperienceForm experience={experience} onSubmit={handleSubmit} />;
}
