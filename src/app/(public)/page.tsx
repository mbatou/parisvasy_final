export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import HeroSearch from "@/components/public/HeroSearch";
import ExperienceGrid from "@/components/public/ExperienceGrid";
import { Star, Compass, Gift, ShieldCheck } from "lucide-react";
import type { Experience, Room } from "@/types";

type SerializedExperience = Experience & {
  hotel?: { rooms?: Room[] };
};

export default async function HomePage() {
  let serialized: SerializedExperience[] = [];
  let experienceCount = 0;

  try {
    const experiences = await prisma.experience.findMany({
      where: { isActive: true },
      include: {
        hotel: {
          include: { rooms: { where: { isActive: true }, orderBy: { pricePerNight: "asc" } } },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 9,
    });

    experienceCount = await prisma.experience.count({
      where: { isActive: true },
    });

    // Serialize Decimal fields for client components
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
  } catch (error) {
    console.error("Database query failed (tables may not exist yet):", error);
  }

  return (
    <>
      {/* Hero Section */}
      <HeroSearch />

      {/* Trust Bar */}
      <section className="border-y border-cream-200 bg-white py-8">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-8 px-4 sm:gap-12 md:gap-16">
          <div className="flex items-center gap-2 text-sm font-medium text-ink-400">
            <Star className="h-5 w-5 text-champagne" />
            <span>4.9/5 average rating</span>
          </div>
          <div className="flex items-center gap-2 text-sm font-medium text-ink-400">
            <Compass className="h-5 w-5 text-vermillion" />
            <span>{experienceCount} experiences</span>
          </div>
          <div className="flex items-center gap-2 text-sm font-medium text-ink-400">
            <Gift className="h-5 w-5 text-sage" />
            <span>0&euro; experience cost</span>
          </div>
          <div className="flex items-center gap-2 text-sm font-medium text-ink-400">
            <ShieldCheck className="h-5 w-5 text-navy-300" />
            <span>Free cancellation</span>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="bg-cream py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="font-serif text-3xl text-navy sm:text-4xl">
              How it works
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-ink-300">
              Three simple steps to an unforgettable stay in Paris
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-10 sm:grid-cols-3">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-vermillion text-xl font-bold text-white">
                1
              </div>
              <h3 className="mt-5 font-serif text-xl text-navy">
                Pick an experience
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-300">
                Browse our curated collection of Parisian experiences — from
                Seine cruises to hidden wine tastings.
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-vermillion text-xl font-bold text-white">
                2
              </div>
              <h3 className="mt-5 font-serif text-xl text-navy">
                Choose your room
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-300">
                Select a room at the partner hotel. The experience is always
                included free with your stay.
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-vermillion text-xl font-bold text-white">
                3
              </div>
              <h3 className="mt-5 font-serif text-xl text-navy">
                Book &amp; enjoy
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-300">
                Confirm your booking with a card warranty — no upfront payment.
                Then just show up and enjoy.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Experiences Grid */}
      <section className="bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <h2 className="font-serif text-3xl text-navy sm:text-4xl">
              Featured experiences
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-ink-300">
              Discover our most popular Parisian adventures
            </p>
          </div>
          <ExperienceGrid experiences={serialized} />
        </div>
      </section>
    </>
  );
}
