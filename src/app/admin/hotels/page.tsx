export const dynamic = "force-dynamic";

import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { getUserStaffAssignments } from "@/lib/auth";
import { Badge } from "@/components/ui/Badge";
import type { UserRole } from "@/types";
import { Plus, Building2, Star, MapPin } from "lucide-react";

export default async function HotelsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const assignments = await getUserStaffAssignments(user.id);
  if (assignments.length === 0) return null;

  const role = assignments[0].role as UserRole;

  // Only super_admin can access this page
  if (role !== "super_admin") {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <h1 className="text-2xl font-bold text-navy-500 font-serif">
          Access Denied
        </h1>
        <p className="mt-2 text-sm text-navy-300">
          Only super administrators can manage hotels.
        </p>
      </div>
    );
  }

  const hotels = await prisma.hotel.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: {
        select: {
          rooms: true,
          experiences: true,
          bookings: true,
        },
      },
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy-500 font-serif">
            Hotels
          </h1>
          <p className="mt-1 text-sm text-navy-300 font-sans">
            Manage all hotels in the PARISVASY network.
          </p>
        </div>
        <Link
          href="/admin/hotels/new"
          className="inline-flex items-center gap-2 rounded-lg bg-vermillion-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-vermillion-600"
        >
          <Plus className="h-4 w-4" />
          New Hotel
        </Link>
      </div>

      {hotels.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-navy-100 bg-white py-16">
          <Building2 className="h-12 w-12 text-navy-200" />
          <p className="mt-4 text-lg font-medium text-navy-400">
            No hotels yet
          </p>
          <p className="mt-1 text-sm text-navy-300">
            Add your first hotel to get started.
          </p>
          <Link
            href="/admin/hotels/new"
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-vermillion-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-vermillion-600"
          >
            <Plus className="h-4 w-4" />
            Create Hotel
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {hotels.map((hotel) => (
            <Link
              key={hotel.id}
              href={`/admin/hotels/${hotel.id}`}
              className="group rounded-xl border border-navy-100 bg-white p-5 shadow-sm transition-all hover:border-vermillion-200 hover:shadow-md"
            >
              {/* Cover image */}
              {hotel.coverImage ? (
                <div className="mb-4 h-40 overflow-hidden rounded-lg">
                  <img
                    src={hotel.coverImage}
                    alt={hotel.name}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                </div>
              ) : (
                <div className="mb-4 flex h-40 items-center justify-center rounded-lg bg-cream-100">
                  <Building2 className="h-8 w-8 text-navy-200" />
                </div>
              )}

              <div className="flex items-start justify-between gap-2">
                <h3 className="font-serif text-lg font-bold text-navy-500 group-hover:text-vermillion-500 transition-colors">
                  {hotel.name}
                </h3>
                <Badge variant={hotel.isActive ? "green" : "red"}>
                  {hotel.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>

              <div className="mt-2 flex items-center gap-2 text-sm text-navy-300">
                <MapPin className="h-3.5 w-3.5" />
                {hotel.city}, {hotel.country}
              </div>

              <div className="mt-1 flex items-center gap-1">
                {Array.from({ length: hotel.stars }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2 border-t border-navy-50 pt-3">
                <div className="text-center">
                  <p className="text-lg font-bold text-navy-500">
                    {hotel._count.rooms}
                  </p>
                  <p className="text-[10px] text-navy-300">Rooms</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-navy-500">
                    {hotel._count.experiences}
                  </p>
                  <p className="text-[10px] text-navy-300">Experiences</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-navy-500">
                    {hotel._count.bookings}
                  </p>
                  <p className="text-[10px] text-navy-300">Bookings</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
