export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  Hotel,
  BedDouble,
  Compass,
  CalendarDays,
  Users,
  ShieldCheck,
} from "lucide-react";
import BookingPaymentClient from "./BookingPaymentClient";

interface BookingPageProps {
  params: Promise<{ id: string }>;
}

export default async function BookingPage({ params }: BookingPageProps) {
  const { id } = await params;

  const booking = await prisma.booking.findUnique({
    where: { id },
    include: {
      hotel: true,
      room: true,
      experience: true,
      guest: true,
    },
  });

  if (!booking) {
    notFound();
  }

  const roomTotal =
    typeof booking.roomTotal === "number"
      ? booking.roomTotal
      : Number(booking.roomTotal);

  return (
    <section className="bg-white py-12 sm:py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="font-serif text-3xl text-navy sm:text-4xl">
            Complete your booking
          </h1>
          <p className="mt-2 text-ink-300">
            Provide your card as a warranty to secure your reservation
          </p>
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-2">
          {/* Left: Booking Summary */}
          <div className="rounded-2xl border border-cream-300 bg-cream p-6">
            <h3 className="font-serif text-xl text-navy">Booking summary</h3>

            <div className="mt-5 space-y-4">
              {booking.hotel && (
                <div className="flex items-center gap-3">
                  <Hotel className="h-5 w-5 shrink-0 text-ink-200" />
                  <div>
                    <p className="text-sm font-semibold text-navy">
                      {booking.hotel.name}
                    </p>
                    <p className="text-xs text-ink-300">
                      {booking.hotel.city}, {booking.hotel.country}
                    </p>
                  </div>
                </div>
              )}

              {booking.room && (
                <div className="flex items-center gap-3">
                  <BedDouble className="h-5 w-5 shrink-0 text-ink-200" />
                  <div>
                    <p className="text-sm font-semibold text-navy">
                      {booking.room.name}
                    </p>
                    <p className="text-xs capitalize text-ink-300">
                      {booking.room.type}
                    </p>
                  </div>
                </div>
              )}

              {booking.experience && (
                <div className="flex items-center gap-3">
                  <Compass className="h-5 w-5 shrink-0 text-ink-200" />
                  <div>
                    <p className="text-sm font-semibold text-navy">
                      {booking.experience.title}
                    </p>
                    <p className="text-xs capitalize text-ink-300">
                      {booking.experience.category} &middot; Included free
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3">
                <CalendarDays className="h-5 w-5 shrink-0 text-ink-200" />
                <div>
                  <p className="text-sm font-semibold text-navy">
                    {formatDate(booking.checkIn)} &mdash;{" "}
                    {formatDate(booking.checkOut)}
                  </p>
                  <p className="text-xs text-ink-300">
                    {booking.nights}{" "}
                    {booking.nights === 1 ? "night" : "nights"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 shrink-0 text-ink-200" />
                <p className="text-sm text-navy">
                  {booking.guestCount}{" "}
                  {booking.guestCount === 1 ? "guest" : "guests"}
                </p>
              </div>
            </div>

            {/* Total */}
            <div className="mt-6 border-t border-cream-300 pt-4">
              <div className="flex justify-between text-sm text-ink-400">
                <span>Room total</span>
                <span className="text-lg font-bold text-vermillion">
                  {formatCurrency(roomTotal)}
                </span>
              </div>
              <div className="mt-1 flex justify-between text-sm">
                <span className="text-sage-500">Experience</span>
                <span className="font-semibold text-sage-500">
                  Included free
                </span>
              </div>
            </div>

            {/* Warranty info */}
            <div className="mt-5 flex items-start gap-3 rounded-xl bg-white p-4">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-sage" />
              <div>
                <p className="text-sm font-semibold text-sage-500">
                  Warranty only — no charge now
                </p>
                <p className="mt-0.5 text-xs text-ink-300">
                  Your card is held as a guarantee. You will only be charged if
                  the cancellation policy applies.
                </p>
              </div>
            </div>
          </div>

          {/* Right: Stripe Card Collection */}
          <div>
            <BookingPaymentClient
              bookingId={booking.id}
              guestEmail={booking.guest?.email ?? ""}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
