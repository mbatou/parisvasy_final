export const dynamic = "force-dynamic";

import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { getUserStaffAssignments } from "@/lib/auth";
import { Badge } from "@/components/ui/Badge";
import { CATEGORY_LABELS, CATEGORY_COLORS } from "@/types";
import type { UserRole } from "@/types";
import { cn } from "@/lib/utils";
import { Plus, Sparkles, MapPin, Clock, Users } from "lucide-react";

export default async function ExperiencesPage({
  searchParams,
}: {
  searchParams: Promise<{ hotel?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const assignments = await getUserStaffAssignments(user.id);
  if (assignments.length === 0) return null;

  const hotelId = params.hotel ?? assignments[0].hotelId;

  const experiences = await prisma.experience.findMany({
    where: { hotelId },
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { bookings: true } },
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-light text-white font-serif">
            Experiences
          </h1>
          <p className="mt-1 text-sm text-white/40 font-sans">
            Manage curated experiences for your guests.
          </p>
        </div>
        <Link
          href="/admin/experiences/new"
          className="inline-flex items-center gap-2 rounded-lg bg-gold text-pv-black px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-gold/80"
        >
          <Plus className="h-4 w-4" />
          New Experience
        </Link>
      </div>

      {experiences.length === 0 ? (
        <div className="flex flex-col items-center justify-center border border-white/[0.06] bg-pv-black-80 py-16">
          <Sparkles className="h-12 w-12 text-white/30" />
          <p className="mt-4 text-lg font-medium text-white/80">
            No experiences yet
          </p>
          <p className="mt-1 text-sm text-white/40">
            Create your first experience to get started.
          </p>
          <Link
            href="/admin/experiences/new"
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-gold text-pv-black px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-gold/80"
          >
            <Plus className="h-4 w-4" />
            Create Experience
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {experiences.map((exp) => (
            <Link
              key={exp.id}
              href={`/admin/experiences/${exp.id}`}
              className="group border border-white/[0.06] bg-pv-black-80 p-5 transition-all hover:border-gold/20"
            >
              {/* Cover image */}
              {exp.coverImage ? (
                <div className="mb-4 h-40 overflow-hidden rounded-lg">
                  <img
                    src={exp.coverImage}
                    alt={exp.title}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                </div>
              ) : (
                <div className="mb-4 flex h-40 items-center justify-center rounded-lg bg-pv-black-90">
                  <Sparkles className="h-8 w-8 text-white/30" />
                </div>
              )}

              <div className="flex items-start justify-between gap-2">
                <h3 className="font-serif text-lg font-light text-white group-hover:text-gold transition-colors">
                  {exp.title}
                </h3>
                <span
                  className={cn(
                    "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold",
                    CATEGORY_COLORS[exp.category]
                  )}
                >
                  {CATEGORY_LABELS[exp.category]}
                </span>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-white/40">
                <span className="inline-flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {exp.location}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {exp.duration}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Users className="h-3.5 w-3.5" />
                  Max {exp.maxGroup}
                </span>
              </div>

              <div className="mt-3 flex items-center justify-between">
                <Badge variant={exp.isActive ? "green" : "red"}>
                  {exp.isActive ? "Active" : "Inactive"}
                </Badge>
                {exp.isFlash && (
                  <Badge variant="gold">Flash Deal</Badge>
                )}
                <span className="text-xs text-white/40">
                  {exp._count.bookings} booking
                  {exp._count.bookings !== 1 ? "s" : ""}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
