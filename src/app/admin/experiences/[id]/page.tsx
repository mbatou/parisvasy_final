export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ExperienceEditClient } from "./ExperienceEditClient";

export default async function EditExperiencePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const experience = await prisma.experience.findUnique({
    where: { id },
  });

  if (!experience) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy-500 font-serif">
          Edit Experience
        </h1>
        <p className="mt-1 text-sm text-navy-300 font-sans">
          Update &ldquo;{experience.title}&rdquo;
        </p>
      </div>

      <div className="rounded-xl border border-navy-100 bg-white p-6 shadow-sm">
        <ExperienceEditClient
          experience={JSON.parse(JSON.stringify(experience))}
        />
      </div>
    </div>
  );
}
