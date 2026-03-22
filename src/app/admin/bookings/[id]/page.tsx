export const dynamic = "force-dynamic";

import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { getUserStaffAssignments } from "@/lib/auth";
import { formatCurrency, formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { STATUS_COLORS, STATUS_LABELS } from "@/types";
import type { UserRole } from "@/types";
import { BookingDetailClient } from "./BookingDetailClient";
import { BookingNotesForm } from "./BookingNotesForm";

export default async function BookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const assignments = await getUserStaffAssignments(user.id);
  if (assignments.length === 0) return null;

  const booking = await prisma.booking.findUnique({
    where: { id },
    include: {
      guest: true,
      room: true,
      experience: true,
      hotel: { select: { name: true } },
    },
  });

  if (!booking) {
    notFound();
  }

  const role = assignments[0].role as UserRole;

  // Timeline steps
  const timelineSteps = [
    {
      label: "Created",
      date: booking.createdAt,
      done: true,
    },
    {
      label: "Confirmed",
      date: booking.status !== "pending" ? booking.updatedAt : null,
      done: ["confirmed", "checked_in", "checked_out"].includes(booking.status),
    },
    {
      label: "Checked In",
      date: booking.checkedInAt,
      done: ["checked_in", "checked_out"].includes(booking.status),
    },
    {
      label: "Checked Out",
      date: booking.checkedOutAt,
      done: booking.status === "checked_out",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-light text-white font-serif">
              Booking {booking.reference}
            </h1>
            <span
              className={cn(
                "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
                STATUS_COLORS[booking.status]
              )}
            >
              {STATUS_LABELS[booking.status]}
            </span>
          </div>
          <p className="mt-1 text-sm text-white/40 font-sans">
            {booking.hotel?.name}
          </p>
        </div>
        <Link
          href="/admin/bookings"
          className="text-sm font-semibold text-gold hover:text-gold transition-colors font-sans"
        >
          &larr; Back to Bookings
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left column - Main info */}
        <div className="space-y-6 lg:col-span-2">
          {/* Guest info */}
          <div className="border border-white/[0.06] bg-pv-black-80 p-6">
            <h2 className="mb-4 text-lg font-light text-white font-serif">
              Guest Information
            </h2>
            {booking.guest ? (
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs text-white/40">Name</p>
                  <p className="font-medium text-white">
                    <Link
                      href={`/admin/guests/${booking.guest.id}`}
                      className="text-gold hover:underline"
                    >
                      {booking.guest.firstName} {booking.guest.lastName}
                    </Link>
                  </p>
                </div>
                <div>
                  <p className="text-xs text-white/40">Email</p>
                  <p className="font-medium text-white">
                    {booking.guest.email}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-white/40">Phone</p>
                  <p className="font-medium text-white">
                    {booking.guest.phone ?? "---"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-white/40">Nationality</p>
                  <p className="font-medium text-white">
                    {booking.guest.nationality ?? "---"}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-white/40">No guest data available.</p>
            )}
          </div>

          {/* Room & Experience */}
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="border border-white/[0.06] bg-pv-black-80 p-6">
              <h2 className="mb-3 text-lg font-light text-white font-serif">
                Room
              </h2>
              {booking.room ? (
                <div className="space-y-2">
                  <p className="font-medium text-white">
                    {booking.room.name}
                  </p>
                  <p className="text-sm capitalize text-white/80">
                    {booking.room.type}
                  </p>
                  <p className="text-sm text-white/40">
                    {formatCurrency(Number(booking.room.pricePerNight))}/night
                  </p>
                </div>
              ) : (
                <p className="text-sm text-white/40">---</p>
              )}
            </div>

            <div className="border border-white/[0.06] bg-pv-black-80 p-6">
              <h2 className="mb-3 text-lg font-light text-white font-serif">
                Experience
              </h2>
              {booking.experience ? (
                <div className="space-y-2">
                  <p className="font-medium text-white">
                    {booking.experience.title}
                  </p>
                  <p className="text-sm capitalize text-white/80">
                    {booking.experience.category}
                  </p>
                  <p className="text-sm text-white/40">
                    {booking.experience.location}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-white/40">---</p>
              )}
            </div>
          </div>

          {/* Dates & Financials */}
          <div className="border border-white/[0.06] bg-pv-black-80 p-6">
            <h2 className="mb-4 text-lg font-light text-white font-serif">
              Stay Details
            </h2>
            <div className="grid gap-4 sm:grid-cols-4">
              <div>
                <p className="text-xs text-white/40">Check-in</p>
                <p className="font-medium text-white">
                  {formatDate(booking.checkIn)}
                </p>
              </div>
              <div>
                <p className="text-xs text-white/40">Check-out</p>
                <p className="font-medium text-white">
                  {formatDate(booking.checkOut)}
                </p>
              </div>
              <div>
                <p className="text-xs text-white/40">Nights</p>
                <p className="font-medium text-white">{booking.nights}</p>
              </div>
              <div>
                <p className="text-xs text-white/40">Guests</p>
                <p className="font-medium text-white">
                  {booking.guestCount}
                </p>
              </div>
            </div>
            <div className="mt-4 border-t border-white/[0.06] pt-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-white/80">Room Total</p>
                <p className="text-xl font-bold text-white">
                  {formatCurrency(Number(booking.roomTotal))}
                </p>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="border border-white/[0.06] bg-pv-black-80 p-6">
            <h2 className="mb-4 text-lg font-light text-white font-serif">
              Timeline
            </h2>
            <div className="relative flex items-center justify-between">
              {/* Connector line */}
              <div className="absolute left-0 right-0 top-4 h-0.5 bg-white/[0.06]" />
              {timelineSteps.map((step, i) => (
                <div
                  key={step.label}
                  className="relative flex flex-col items-center"
                >
                  <div
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold",
                      step.done
                        ? "bg-green-500 text-white"
                        : "bg-white/[0.06] text-white/40"
                    )}
                  >
                    {i + 1}
                  </div>
                  <p
                    className={cn(
                      "mt-2 text-xs font-medium",
                      step.done ? "text-white" : "text-white/40"
                    )}
                  >
                    {step.label}
                  </p>
                  {step.date && (
                    <p className="mt-0.5 text-[10px] text-white/30">
                      {formatDate(step.date)}
                    </p>
                  )}
                </div>
              ))}
            </div>
            {booking.status === "cancelled" && (
              <div className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                This booking was cancelled.
              </div>
            )}
          </div>
        </div>

        {/* Right column - Actions & sidebar info */}
        <div className="space-y-6">
          {/* Card Warranty */}
          <div className="border border-white/[0.06] bg-pv-black-80 p-6">
            <h2 className="mb-3 text-lg font-light text-white font-serif">
              Card Warranty
            </h2>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm text-white/80">Status</p>
                <Badge
                  variant={booking.warrantyCollected ? "green" : "yellow"}
                >
                  {booking.warrantyCollected ? "Collected" : "Pending"}
                </Badge>
              </div>
              {booking.cardBrand && (
                <div className="flex items-center justify-between">
                  <p className="text-sm text-white/80">Card</p>
                  <p className="text-sm font-medium text-white">
                    {booking.cardBrand.toUpperCase()} ****{booking.cardLast4}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="border border-white/[0.06] bg-pv-black-80 p-6">
            <h2 className="mb-3 text-lg font-light text-white font-serif">
              Actions
            </h2>
            <BookingDetailClient
              booking={JSON.parse(JSON.stringify(booking))}
              userRole={role}
            />
          </div>

          {/* Notes */}
          <div className="border border-white/[0.06] bg-pv-black-80 p-6">
            <h2 className="mb-3 text-lg font-light text-white font-serif">
              Notes
            </h2>
            <BookingNotesForm
              bookingId={booking.id}
              initialNotes={booking.notes ?? ""}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
