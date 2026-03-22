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

  let serialized: Array<Record<string, unknown>> = [];

  try {
    const experiences = await prisma.experience.findMany({
      where,
      include: {
        hotel: {
          include: { rooms: { where: { isActive: true }, orderBy: { pricePerNight: "asc" } } },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    serialized = experiences.map((exp) => ({
      ...exp,
      hotel: {
        ...exp.hotel,
        rooms: exp.hotel.rooms.map((r) => ({
          ...r,
          pricePerNight: Number(r.pricePerNight),
        })),
      },
    }));
  } catch {
    // Tables may not exist yet
  }

  return (
    <section className="bg-pv-black pt-28 pb-20 sm:pb-24 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <span className="micro-label text-gold tracking-[3px]">
            Discover
          </span>
          <h1 className="mt-3 font-serif text-3xl text-white font-light sm:text-4xl">
            All Experiences
          </h1>
          {search && (
            <p className="mt-3 text-white/40 font-light">
              Showing results for &ldquo;{search}&rdquo;
            </p>
          )}
        </div>
        <ExperienceGrid experiences={serialized as never} />
      </div>
    </section>
  );
}
