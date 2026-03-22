export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import ExperienceGrid from "@/components/public/ExperienceGrid";
import type { ExperienceCategory } from "@/types";

interface ExperiencesPageProps {
  searchParams: Promise<{
    category?: string;
    q?: string;
  }>;
}

export default async function ExperiencesPage({
  searchParams,
}: ExperiencesPageProps) {
  const params = await searchParams;
  const category = params.category as ExperienceCategory | undefined;
  const search = params.q;

  const where: Record<string, unknown> = { isActive: true };

  if (category) {
    where.category = category;
  }

  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
      { location: { contains: search, mode: "insensitive" } },
    ];
  }

  const experiences = await prisma.experience.findMany({
    where,
    include: {
      hotel: {
        include: { rooms: { where: { isActive: true }, orderBy: { pricePerNight: "asc" } } },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const serialized = experiences.map((exp) => ({
    ...exp,
    hotel: {
      ...exp.hotel,
      rooms: exp.hotel.rooms.map((r) => ({
        ...r,
        pricePerNight: Number(r.pricePerNight),
      })),
    },
  }));

  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h1 className="font-serif text-3xl text-navy sm:text-4xl">
            All Experiences
          </h1>
          {search && (
            <p className="mt-2 text-ink-300">
              Showing results for &ldquo;{search}&rdquo;
            </p>
          )}
        </div>
        <ExperienceGrid experiences={serialized} />
      </div>
    </section>
  );
}
