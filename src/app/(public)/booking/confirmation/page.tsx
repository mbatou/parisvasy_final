export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import BookingConfirmation from "@/components/public/BookingConfirmation";
import Link from "next/link";

interface ConfirmationPageProps {
  searchParams: Promise<{ bookingId?: string }>;
}

export default async function ConfirmationPage({
  searchParams,
}: ConfirmationPageProps) {
  const params = await searchParams;
  const bookingId = params.bookingId;

  if (!bookingId) {
    notFound();
  }

  const supabase = createAdminClient();

  const { data: booking, error } = await supabase
    .from('Booking')
    .select('*, hotel:Hotel(*), room:Room(*), experience:Experience(*), guest:Guest(*)')
    .eq('id', bookingId)
    .single();

  if (error || !booking) {
    notFound();
  }

  // Serialize for client component compatibility
  const serialized = {
    ...booking,
    roomTotal:
      typeof booking.roomTotal === "number"
        ? booking.roomTotal
        : Number(booking.roomTotal),
    checkIn: typeof booking.checkIn === "string" ? booking.checkIn : new Date(booking.checkIn).toISOString(),
    checkOut: typeof booking.checkOut === "string" ? booking.checkOut : new Date(booking.checkOut).toISOString(),
    createdAt: typeof booking.createdAt === "string" ? booking.createdAt : new Date(booking.createdAt).toISOString(),
    updatedAt: typeof booking.updatedAt === "string" ? booking.updatedAt : new Date(booking.updatedAt).toISOString(),
    checkedInAt: booking.checkedInAt ? (typeof booking.checkedInAt === "string" ? booking.checkedInAt : new Date(booking.checkedInAt).toISOString()) : null,
    checkedOutAt: booking.checkedOutAt ? (typeof booking.checkedOutAt === "string" ? booking.checkedOutAt : new Date(booking.checkedOutAt).toISOString()) : null,
    hotel: booking.hotel
      ? {
          name: booking.hotel.name,
          city: booking.hotel.city,
          country: booking.hotel.country,
        }
      : undefined,
    room: booking.room
      ? { name: booking.room.name, type: booking.room.type }
      : undefined,
    experience: booking.experience
      ? {
          title: booking.experience.title,
          category: booking.experience.category,
        }
      : undefined,
    guest: booking.guest
      ? {
          firstName: booking.guest.firstName,
          lastName: booking.guest.lastName,
          email: booking.guest.email,
        }
      : undefined,
  };

  return (
    <section className="bg-pv-black pt-28 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <BookingConfirmation booking={serialized as never} />

        <div className="mt-10 flex justify-center gap-4">
          <Link
            href="/"
            className="border border-white/[0.06] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/[0.06]"
          >
            Back to home
          </Link>
          <Link
            href="/experiences"
            className="bg-gold px-6 py-3 text-sm font-semibold text-pv-black transition-colors hover:bg-gold/90"
          >
            Browse more experiences
          </Link>
        </div>
      </div>
    </section>
  );
}
