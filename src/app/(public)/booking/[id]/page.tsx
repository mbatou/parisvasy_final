export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
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

  const supabase = createAdminClient();

  const { data: booking, error } = await supabase
    .from('Booking')
    .select('*, hotel:Hotel(*), room:Room(*), experience:Experience(*), guest:Guest(*)')
    .eq('id', id)
    .single();

  if (error || !booking) {
    notFound();
  }

  const roomTotal =
    typeof booking.roomTotal === "number"
      ? booking.roomTotal
      : Number(booking.roomTotal);

  return (
    <section className="bg-pv-black pt-28 py-12 sm:py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="font-serif text-3xl font-light text-white sm:text-4xl">
            Complete your booking
          </h1>
          <p className="mt-2 text-white/40">
            Provide your card as a warranty to secure your reservation
          </p>
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-2">
          {/* Left: Booking Summary */}
          <div className="border border-white/[0.06] bg-pv-black-90 p-6">
            <h3 className="font-serif text-xl font-light text-white">Booking summary</h3>

            <div className="mt-5 space-y-4">
              {booking.hotel && (
                <div className="flex items-center gap-3">
                  <Hotel className="h-5 w-5 shrink-0 text-white/30" />
                  <div>
                    <p className="text-sm font-semibold text-white">
                      {booking.hotel.name}
                    </p>
                    <p className="text-xs text-white/40">
                      {booking.hotel.city}, {booking.hotel.country}
                    </p>
                  </div>
                </div>
              )}

              {booking.room && (
                <div className="flex items-center gap-3">
                  <BedDouble className="h-5 w-5 shrink-0 text-white/30" />
                  <div>
                    <p className="text-sm font-semibold text-white">
                      {booking.room.name}
                    </p>
                    <p className="text-xs capitalize text-white/40">
                      {booking.room.type}
                    </p>
                  </div>
                </div>
              )}

              {booking.experience && (
                <div className="flex items-center gap-3">
                  <Compass className="h-5 w-5 shrink-0 text-white/30" />
                  <div>
                    <p className="text-sm font-semibold text-white">
                      {booking.experience.title}
                    </p>
                    <p className="text-xs capitalize text-white/40">
                      {booking.experience.category} &middot; Included free
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3">
                <CalendarDays className="h-5 w-5 shrink-0 text-white/30" />
                <div>
                  <p className="text-sm font-semibold text-white">
                    {formatDate(booking.checkIn)} &mdash;{" "}
                    {formatDate(booking.checkOut)}
                  </p>
                  <p className="text-xs text-white/40">
                    {booking.nights}{" "}
                    {booking.nights === 1 ? "night" : "nights"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 shrink-0 text-white/30" />
                <p className="text-sm text-white">
                  {booking.guestCount}{" "}
                  {booking.guestCount === 1 ? "guest" : "guests"}
                </p>
              </div>
            </div>

            {/* Total */}
            <div className="mt-6 border-t border-white/[0.06] pt-4">
              <div className="flex justify-between text-sm text-white/50">
                <span>Room total</span>
                <span className="text-lg font-bold text-gold">
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
            <div className="mt-5 flex items-start gap-3 bg-pv-black-80 p-4">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-sage" />
              <div>
                <p className="text-sm font-semibold text-sage-500">
                  Warranty only — no charge now
                </p>
                <p className="mt-0.5 text-xs text-white/40">
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
