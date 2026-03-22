export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
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

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
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

  // Serialize for client component compatibility
  const serialized = {
    ...booking,
    roomTotal:
      typeof booking.roomTotal === "number"
        ? booking.roomTotal
        : Number(booking.roomTotal),
    checkIn: booking.checkIn.toISOString(),
    checkOut: booking.checkOut.toISOString(),
    createdAt: booking.createdAt.toISOString(),
    updatedAt: booking.updatedAt.toISOString(),
    checkedInAt: booking.checkedInAt?.toISOString() ?? null,
    checkedOutAt: booking.checkedOutAt?.toISOString() ?? null,
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
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <BookingConfirmation booking={serialized as never} />

        <div className="mt-10 flex justify-center gap-4">
          <Link
            href="/"
            className="rounded-xl border border-navy-200 px-6 py-3 text-sm font-semibold text-navy transition-colors hover:bg-navy-50"
          >
            Back to home
          </Link>
          <Link
            href="/experiences"
            className="rounded-xl bg-vermillion px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-vermillion-600"
          >
            Browse more experiences
          </Link>
        </div>
      </div>
    </section>
  );
}
