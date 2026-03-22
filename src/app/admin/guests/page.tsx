export const dynamic = "force-dynamic";

import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { getUserStaffAssignments } from "@/lib/auth";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/Table";
import { Users, Mail, Phone, Search } from "lucide-react";

export default async function GuestsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; hotel?: string }>;
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
  const query = params.q?.trim() ?? "";

  // Build the where clause for search
  const searchFilter = query
    ? {
        OR: [
          { firstName: { contains: query, mode: "insensitive" as const } },
          { lastName: { contains: query, mode: "insensitive" as const } },
          { email: { contains: query, mode: "insensitive" as const } },
          { phone: { contains: query, mode: "insensitive" as const } },
        ],
      }
    : {};

  // Get guests who have bookings at this hotel
  const guests = await prisma.guest.findMany({
    where: {
      ...searchFilter,
      bookings: { some: { hotelId } },
    },
    include: {
      _count: { select: { bookings: true } },
      bookings: {
        where: { hotelId },
        orderBy: { checkIn: "desc" },
        take: 1,
        select: { checkIn: true, status: true },
      },
    },
    orderBy: { lastName: "asc" },
    take: 100,
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-light text-white font-serif">
            Guests
          </h1>
          <p className="mt-1 text-sm text-white/40 font-sans">
            Guest directory and booking history.
          </p>
        </div>
      </div>

      {/* Search */}
      <form className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
          <input
            type="text"
            name="q"
            defaultValue={query}
            placeholder="Search by name, email, or phone..."
            className="h-10 w-full rounded-lg border border-white/[0.06] bg-pv-black-80 pl-9 pr-3 text-sm text-white placeholder:text-white/30 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30"
          />
        </div>
        <button
          type="submit"
          className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/[0.08]"
        >
          Search
        </button>
        {query && (
          <Link
            href="/admin/guests"
            className="text-sm font-medium text-white/40 hover:text-white"
          >
            Clear
          </Link>
        )}
      </form>

      {/* Results */}
      <div className="border border-white/[0.06] bg-pv-black-80">
        {guests.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Users className="h-12 w-12 text-white/30" />
            <p className="mt-4 text-lg font-medium text-white/80">
              {query ? "No guests found" : "No guests yet"}
            </p>
            <p className="mt-1 text-sm text-white/40">
              {query
                ? "Try a different search term."
                : "Guests will appear here after they make bookings."}
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Nationality</TableHead>
                <TableHead>Bookings</TableHead>
                <TableHead>Last Visit</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {guests.map((guest) => (
                <TableRow key={guest.id}>
                  <TableCell>
                    <Link
                      href={`/admin/guests/${guest.id}`}
                      className="font-medium text-gold hover:underline"
                    >
                      {guest.firstName} {guest.lastName}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center gap-1 text-white/80">
                      <Mail className="h-3.5 w-3.5" />
                      {guest.email}
                    </span>
                  </TableCell>
                  <TableCell>
                    {guest.phone ? (
                      <span className="inline-flex items-center gap-1 text-white/80">
                        <Phone className="h-3.5 w-3.5" />
                        {guest.phone}
                      </span>
                    ) : (
                      <span className="text-white/30">---</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {guest.nationality ?? (
                      <span className="text-white/30">---</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant="navy">{guest._count.bookings}</Badge>
                  </TableCell>
                  <TableCell>
                    {guest.bookings[0] ? (
                      <span className="text-sm text-white/80">
                        {formatDate(guest.bookings[0].checkIn)}
                      </span>
                    ) : (
                      <span className="text-white/30">---</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
