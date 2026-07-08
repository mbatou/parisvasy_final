export const dynamic = "force-dynamic";

import { createAdminClient } from "@/lib/supabase/admin";
import ExperienceGrid from "@/components/public/ExperienceGrid";
import type { ExperienceCategory, Room } from "@/types";

interface ExperiencesPageProps {
  searchParams: Promise<{
    category?: string;
    q?: string;
    checkIn?: string;
    checkOut?: string;
  }>;
}

export default async function ExperiencesPage({
  searchParams,
}: ExperiencesPageProps) {
  const params = await searchParams;
  const category = params.category as ExperienceCategory | undefined;
  const search = params.q;
  const checkIn = params.checkIn;
  const checkOut = params.checkOut;

  let serialized: Array<Record<string, unknown>> = [];

  try {
    const supabase = createAdminClient();

    let query = supabase
      .from('Experience')
      .select('*, hotel:Hotel(*, rooms:Room(*))')
      .eq('isActive', true)
      .order('createdAt', { ascending: false });

    if (category) {
      query = query.eq('category', category);
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%,location.ilike.%${search}%`);
    }

    // Filter by availability window
    if (checkIn && checkOut) {
      query = query.or(
        `and(availableFrom.is.null,availableTo.is.null),and(availableFrom.lte.${new Date(checkIn).toISOString()},availableTo.gte.${new Date(checkOut).toISOString()})`
      );
    }

    const { data: experiences, error } = await query;

    if (error) throw error;

    serialized = (experiences ?? []).map((exp) => ({
      ...exp,
      hotel: {
        ...exp.hotel,
        rooms: (exp.hotel?.rooms ?? [])
          .filter((r: Room) => r.isActive)
          .sort((a: Room, b: Room) => Number(a.pricePerNight) - Number(b.pricePerNight))
          .map((r: Room) => ({
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
