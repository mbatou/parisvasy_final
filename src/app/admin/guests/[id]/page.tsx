export const dynamic = "force-dynamic";

import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatCurrency, formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { STATUS_COLORS, STATUS_LABELS } from "@/types";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/Table";
import { Mail, Phone, Globe, CreditCard } from "lucide-react";

export default async function GuestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const guest = await prisma.guest.findUnique({
    where: { id },
    include: {
      bookings: {
        include: {
          hotel: { select: { name: true } },
          room: { select: { name: true } },
          experience: { select: { title: true } },
        },
        orderBy: { checkIn: "desc" },
      },
    },
  });

  if (!guest) {
    notFound();
  }

  const totalSpent = guest.bookings.reduce(
    (sum, b) => sum + Number(b.roomTotal),
    0
  );
  const totalBookings = guest.bookings.length;
  const totalNights = guest.bookings.reduce((sum, b) => sum + b.nights, 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-light text-white font-serif">
            {guest.firstName} {guest.lastName}
          </h1>
          <p className="mt-1 text-sm text-white/40 font-sans">
            Guest profile and booking history
          </p>
        </div>
        <Link
          href="/admin/guests"
          className="text-sm font-semibold text-gold hover:text-gold transition-colors font-sans"
        >
          &larr; Back to Guests
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left - Guest info card */}
        <div className="space-y-6">
          <div className="border border-white/[0.06] bg-pv-black-80 p-6">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gold text-pv-black text-xl font-bold text-white">
              {guest.firstName.charAt(0)}
              {guest.lastName.charAt(0)}
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-white/40" />
                <span className="text-white">{guest.email}</span>
              </div>
              {guest.phone && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-white/40" />
                  <span className="text-white">{guest.phone}</span>
                </div>
              )}
              {guest.nationality && (
                <div className="flex items-center gap-2 text-sm">
                  <Globe className="h-4 w-4 text-white/40" />
                  <span className="text-white">{guest.nationality}</span>
                </div>
              )}
              {guest.idNumber && (
                <div className="flex items-center gap-2 text-sm">
                  <CreditCard className="h-4 w-4 text-white/40" />
                  <span className="text-white">{guest.idNumber}</span>
                </div>
              )}
            </div>

            {guest.notes && (
              <div className="mt-4 rounded-lg bg-pv-black-90 p-3">
                <p className="text-xs font-medium text-white/80">Notes</p>
                <p className="mt-1 text-sm text-white">{guest.notes}</p>
              </div>
            )}

            <p className="mt-4 text-xs text-white/30">
              Guest since {formatDate(guest.createdAt)}
            </p>
          </div>

          {/* Summary stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="border border-white/[0.06] bg-pv-black-80 p-4 text-center">
              <p className="text-xl font-bold text-white">
                {totalBookings}
              </p>
              <p className="text-xs text-white/40">Bookings</p>
            </div>
            <div className="border border-white/[0.06] bg-pv-black-80 p-4 text-center">
              <p className="text-xl font-bold text-white">{totalNights}</p>
              <p className="text-xs text-white/40">Nights</p>
            </div>
            <div className="border border-white/[0.06] bg-pv-black-80 p-4 text-center">
              <p className="text-lg font-bold text-white">
                {formatCurrency(totalSpent)}
              </p>
              <p className="text-xs text-white/40">Total Spent</p>
            </div>
          </div>
        </div>

        {/* Right - Booking history */}
        <div className="lg:col-span-2">
          <div className="border border-white/[0.06] bg-pv-black-80">
            <div className="border-b border-white/[0.06] px-6 py-4">
              <h2 className="text-lg font-light text-white font-serif">
                Booking History
              </h2>
            </div>
            {guest.bookings.length === 0 ? (
              <div className="px-6 py-12 text-center text-sm text-white/40">
                No bookings found for this guest.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Reference</TableHead>
                    <TableHead>Hotel</TableHead>
                    <TableHead>Experience</TableHead>
                    <TableHead>Room</TableHead>
                    <TableHead>Dates</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {guest.bookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell>
                        <Link
                          href={`/admin/bookings/${booking.id}`}
                          className="font-mono text-xs text-gold hover:underline"
                        >
                          {booking.reference}
                        </Link>
                      </TableCell>
                      <TableCell className="text-white/80">
                        {booking.hotel?.name ?? "---"}
                      </TableCell>
                      <TableCell className="text-white/80">
                        {booking.experience?.title ?? "---"}
                      </TableCell>
                      <TableCell className="text-white/80">
                        {booking.room?.name ?? "---"}
                      </TableCell>
                      <TableCell className="text-white/80">
                        {formatDate(booking.checkIn)} -{" "}
                        {formatDate(booking.checkOut)}
                      </TableCell>
                      <TableCell className="font-medium text-white">
                        {formatCurrency(Number(booking.roomTotal))}
                      </TableCell>
                      <TableCell>
                        <span
                          className={cn(
                            "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
                            STATUS_COLORS[booking.status]
                          )}
                        >
                          {STATUS_LABELS[booking.status]}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
