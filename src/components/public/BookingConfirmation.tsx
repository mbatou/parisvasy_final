import { cn } from "@/lib/utils";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  CheckCircle2,
  Hotel,
  BedDouble,
  Compass,
  CalendarDays,
  Users,
  CreditCard,
  Mail,
} from "lucide-react";
import type { Booking } from "@/types";
import { STATUS_COLORS, STATUS_LABELS } from "@/types";

interface BookingConfirmationProps {
  booking: Booking & {
    hotel?: { name: string; city: string; country: string };
    room?: { name: string; type: string };
    experience?: { title: string; category: string };
    guest?: { firstName: string; lastName: string; email: string };
  };
}

export default function BookingConfirmation({
  booking,
}: BookingConfirmationProps) {
  const roomTotal =
    typeof booking.roomTotal === "string"
      ? parseFloat(booking.roomTotal)
      : typeof booking.roomTotal === "number"
        ? booking.roomTotal
        : Number(booking.roomTotal);

  return (
    <div className="mx-auto flex max-w-lg flex-col items-center gap-8">
      {/* Success Icon */}
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-pv-black-90">
          <CheckCircle2 className="h-10 w-10 text-sage" />
        </div>
        <h2 className="font-serif text-3xl font-light text-white">Booking confirmed</h2>
        <p className="text-sm text-white/40">
          Your reservation has been successfully created.
        </p>
      </div>

      {/* Booking Reference */}
      <div className="w-full bg-pv-black-90 px-6 py-5 text-center">
        <p className="text-xs font-medium uppercase tracking-wider text-white/40">
          Booking reference
        </p>
        <p className="mt-1 font-serif text-2xl font-light tracking-wide text-white">
          {booking.reference}
        </p>
      </div>

      {/* Details Card */}
      <div className="w-full divide-y divide-white/[0.06] border border-white/[0.06] bg-pv-black-80">
        {/* Hotel */}
        {booking.hotel && (
          <div className="flex items-center gap-3 px-5 py-4">
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

        {/* Room */}
        {booking.room && (
          <div className="flex items-center gap-3 px-5 py-4">
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

        {/* Experience */}
        {booking.experience && (
          <div className="flex items-center gap-3 px-5 py-4">
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

        {/* Dates */}
        <div className="flex items-center gap-3 px-5 py-4">
          <CalendarDays className="h-5 w-5 shrink-0 text-white/30" />
          <div>
            <p className="text-sm font-semibold text-white">
              {formatDate(booking.checkIn)} &mdash;{" "}
              {formatDate(booking.checkOut)}
            </p>
            <p className="text-xs text-white/40">
              {booking.nights} {booking.nights === 1 ? "night" : "nights"}
            </p>
          </div>
        </div>

        {/* Guests */}
        <div className="flex items-center gap-3 px-5 py-4">
          <Users className="h-5 w-5 shrink-0 text-white/30" />
          <p className="text-sm text-white">
            {booking.guestCount}{" "}
            {booking.guestCount === 1 ? "guest" : "guests"}
          </p>
        </div>

        {/* Total */}
        <div className="flex items-center justify-between px-5 py-4">
          <span className="text-sm font-medium text-white/50">Room total</span>
          <span className="text-lg font-bold text-gold">
            {formatCurrency(roomTotal)}
          </span>
        </div>

        {/* Card Status */}
        <div className="flex items-center gap-3 px-5 py-4">
          <CreditCard className="h-5 w-5 shrink-0 text-white/30" />
          <div className="flex flex-1 items-center justify-between">
            <div>
              <p className="text-sm text-white">
                {booking.cardBrand && booking.cardLast4
                  ? `${booking.cardBrand} ending ${booking.cardLast4}`
                  : "Card on file"}
              </p>
              <p className="text-xs text-white/40">Warranty only</p>
            </div>
            <span
              className={cn(
                "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
                booking.warrantyCollected
                  ? "bg-green-100 text-green-800"
                  : "bg-yellow-100 text-yellow-800"
              )}
            >
              {booking.warrantyCollected ? "Secured" : "Pending"}
            </span>
          </div>
        </div>

        {/* Booking Status */}
        <div className="flex items-center justify-between px-5 py-4">
          <span className="text-sm font-medium text-white/50">Status</span>
          <span
            className={cn(
              "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
              STATUS_COLORS[booking.status]
            )}
          >
            {STATUS_LABELS[booking.status]}
          </span>
        </div>
      </div>

      {/* Email Notification */}
      <div className="flex w-full items-center gap-3 bg-pv-black-90 px-5 py-4">
        <Mail className="h-5 w-5 shrink-0 text-white/30" />
        <p className="text-sm text-white/40">
          A confirmation email has been sent to{" "}
          <span className="font-medium text-navy">
            {booking.guest?.email ?? "your email address"}
          </span>
          .
        </p>
      </div>
    </div>
  );
}
