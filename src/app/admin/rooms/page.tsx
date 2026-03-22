export const dynamic = "force-dynamic";

import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { getUserStaffAssignments } from "@/lib/auth";
import { formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { Plus, BedDouble, Users, Maximize2 } from "lucide-react";

export default async function RoomsPage({
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

  const rooms = await prisma.room.findMany({
    where: { hotelId },
    orderBy: { name: "asc" },
    include: {
      _count: { select: { bookings: true } },
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-light text-white font-serif">Rooms</h1>
          <p className="mt-1 text-sm text-white/40 font-sans">
            Manage room inventory and pricing.
          </p>
        </div>
        <Link
          href="/admin/rooms/new"
          className="inline-flex items-center gap-2 rounded-lg bg-gold text-pv-black px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-gold/80"
        >
          <Plus className="h-4 w-4" />
          New Room
        </Link>
      </div>

      {rooms.length === 0 ? (
        <div className="flex flex-col items-center justify-center border border-white/[0.06] bg-pv-black-80 py-16">
          <BedDouble className="h-12 w-12 text-white/30" />
          <p className="mt-4 text-lg font-medium text-white/80">
            No rooms yet
          </p>
          <p className="mt-1 text-sm text-white/40">
            Add your first room to start accepting bookings.
          </p>
          <Link
            href="/admin/rooms/new"
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-gold text-pv-black px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-gold/80"
          >
            <Plus className="h-4 w-4" />
            Create Room
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rooms.map((room) => (
            <Link
              key={room.id}
              href={`/admin/rooms/${room.id}`}
              className="group border border-white/[0.06] bg-pv-black-80 p-5 transition-all hover:border-gold/20"
            >
              {/* Cover image */}
              {room.images[0] ? (
                <div className="mb-4 h-40 overflow-hidden rounded-lg">
                  <img
                    src={room.images[0]}
                    alt={room.name}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                </div>
              ) : (
                <div className="mb-4 flex h-40 items-center justify-center rounded-lg bg-pv-black-90">
                  <BedDouble className="h-8 w-8 text-white/30" />
                </div>
              )}

              <div className="flex items-start justify-between gap-2">
                <h3 className="font-serif text-lg font-light text-white group-hover:text-gold transition-colors">
                  {room.name}
                </h3>
                <Badge variant="navy" className="shrink-0 capitalize">
                  {room.type}
                </Badge>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-white/40">
                <span className="inline-flex items-center gap-1">
                  <Maximize2 className="h-3.5 w-3.5" />
                  {room.size} m&sup2;
                </span>
                <span className="inline-flex items-center gap-1">
                  <Users className="h-3.5 w-3.5" />
                  Max {room.maxGuests}
                </span>
                <span className="inline-flex items-center gap-1">
                  <BedDouble className="h-3.5 w-3.5" />
                  {room.totalRooms} unit{room.totalRooms !== 1 ? "s" : ""}
                </span>
              </div>

              <div className="mt-3 flex items-center justify-between">
                <p className="text-lg font-bold text-white">
                  {formatCurrency(Number(room.pricePerNight))}
                  <span className="text-xs font-normal text-white/40">
                    /night
                  </span>
                </p>
                <Badge variant={room.isActive ? "green" : "red"}>
                  {room.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>

              {room.amenities.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1">
                  {room.amenities.slice(0, 4).map((a) => (
                    <span
                      key={a}
                      className="rounded-full bg-pv-black-90 px-2 py-0.5 text-[10px] text-white/80"
                    >
                      {a}
                    </span>
                  ))}
                  {room.amenities.length > 4 && (
                    <span className="rounded-full bg-pv-black-90 px-2 py-0.5 text-[10px] text-white/80">
                      +{room.amenities.length - 4}
                    </span>
                  )}
                </div>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
