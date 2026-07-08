export const dynamic = "force-dynamic";

import { createAdminClient } from "@/lib/supabase/admin";
import HeroSearch from "@/components/public/HeroSearch";
import ExperienceGrid from "@/components/public/ExperienceGrid";
import { SectionReveal } from "@/components/public/SectionReveal";
import { Star, Compass, Gift, ShieldCheck } from "lucide-react";
import type { Experience, Room } from "@/types";

type SerializedExperience = Experience & {
  hotel?: { rooms?: Room[] };
};

export default async function HomePage() {
  let serialized: SerializedExperience[] = [];
  let experienceCount = 0;

  try {
    const supabase = createAdminClient();

    const now = new Date().toISOString();

    const { data: experiences, error } = await supabase
      .from('Experience')
      .select('*, hotel:Hotel(*, rooms:Room(*))')
      .eq('isActive', true)
      .or(`and(availableFrom.is.null,availableTo.is.null),and(availableFrom.lte.${now},availableTo.gte.${now})`)
      .order('createdAt', { ascending: false })
      .limit(9);

    if (error) throw error;

    const { count, error: countError } = await supabase
      .from('Experience')
      .select('id', { count: 'exact', head: true })
      .eq('isActive', true);

    if (countError) throw countError;

    experienceCount = count ?? 0;

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
  } catch (error) {
    console.error("Database query failed (tables may not exist yet):", error);
  }

  return (
    <>
      {/* Hero Section */}
      <HeroSearch />

      {/* Marquee Ticker */}
      <div className="border-y border-white/[0.06] bg-pv-black-90 py-3 overflow-hidden">
        <div className="animate-marquee whitespace-nowrap flex">
          {[0, 1].map((i) => (
            <div key={i} className="flex items-center gap-12 px-6 shrink-0">
              <span className="flex items-center gap-2 text-[11px] uppercase tracking-wide text-white/40">
                <Star className="h-3.5 w-3.5 text-gold" />
                4.9/5 average rating
              </span>
              <span className="text-white/10">&bull;</span>
              <span className="flex items-center gap-2 text-[11px] uppercase tracking-wide text-white/40">
                <Compass className="h-3.5 w-3.5 text-gold" />
                {experienceCount || "12"}+ curated experiences
              </span>
              <span className="text-white/10">&bull;</span>
              <span className="flex items-center gap-2 text-[11px] uppercase tracking-wide text-white/40">
                <Gift className="h-3.5 w-3.5 text-gold" />
                0&euro; experience cost
              </span>
              <span className="text-white/10">&bull;</span>
              <span className="flex items-center gap-2 text-[11px] uppercase tracking-wide text-white/40">
                <ShieldCheck className="h-3.5 w-3.5 text-gold" />
                Free cancellation 48h
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* How It Works */}
      <section id="how-it-works" className="bg-pv-black py-24 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionReveal>
            <div className="text-center">
              <span className="micro-label text-gold tracking-[3px]">
                How it works
              </span>
              <h2 className="mt-4 font-serif text-3xl text-white font-light sm:text-4xl">
                Three simple steps
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-white/40 font-light">
                To an unforgettable stay in Paris
              </p>
            </div>
          </SectionReveal>

          <div className="mt-16 grid grid-cols-1 gap-12 sm:grid-cols-3">
            {[
              {
                num: "01",
                title: "Pick an experience",
                desc: "Browse our curated collection of Parisian experiences — from Seine cruises to hidden wine tastings.",
              },
              {
                num: "02",
                title: "Choose your room",
                desc: "Select a room at the partner hotel. The experience is always included free with your stay.",
              },
              {
                num: "03",
                title: "Book & enjoy",
                desc: "Confirm your booking with a card warranty — no upfront payment. Then just show up and enjoy.",
              },
            ].map((step, i) => (
              <SectionReveal key={step.num} delay={i * 150}>
                <div className="flex flex-col items-center text-center">
                  <div className="flex h-16 w-16 items-center justify-center border border-gold/25 bg-gold/[0.06]">
                    <span className="font-serif text-2xl text-gold font-light">
                      {step.num}
                    </span>
                  </div>
                  <h3 className="mt-6 font-serif text-xl text-white font-light">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/40 font-light">
                    {step.desc}
                  </p>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Experiences Grid */}
      <section className="bg-pv-black-90 py-24 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionReveal>
            <div className="mb-16 text-center">
              <span className="micro-label text-gold tracking-[3px]">
                Curated for you
              </span>
              <h2 className="mt-4 font-serif text-3xl text-white font-light sm:text-4xl">
                Featured experiences
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-white/40 font-light">
                Discover our most popular Parisian adventures
              </p>
            </div>
          </SectionReveal>
          <ExperienceGrid experiences={serialized} />
        </div>
      </section>
    </>
  );
}
