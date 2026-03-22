"use client";

import { useRouter } from "next/navigation";
import { ExperienceForm } from "@/components/admin/ExperienceForm";

export default function NewExperiencePage() {
  const router = useRouter();

  const handleSubmit = async (data: Record<string, unknown>) => {
    const res = await fetch("/api/experiences", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      router.push("/admin/experiences");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy-500 font-serif">
          New Experience
        </h1>
        <p className="mt-1 text-sm text-navy-300 font-sans">
          Create a new curated experience for your guests.
        </p>
      </div>

      <div className="rounded-xl border border-navy-100 bg-white p-6 shadow-sm">
        <ExperienceForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
