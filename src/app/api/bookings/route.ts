import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const hotelId = searchParams.get("hotelId");
    const status = searchParams.get("status");
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    const where: Record<string, unknown> = {};

    if (hotelId) where.hotelId = hotelId;
    if (status) where.status = status;
    if (from || to) {
      where.checkIn = {};
      if (from) (where.checkIn as Record<string, unknown>).gte = new Date(from);
      if (to) (where.checkIn as Record<string, unknown>).lte = new Date(to);
    }

    const bookings = await prisma.booking.findMany({
      where,
      include: {
        room: true,
        experience: true,
        guest: true,
      },
      orderBy: { checkIn: "desc" },
    });

    return NextResponse.json(bookings);
  } catch (error) {
    console.error("Error listing bookings:", error);
    return NextResponse.json(
      { error: "Failed to list bookings" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      hotelId,
      roomId,
      experienceId,
      checkIn,
      checkOut,
      guestCount,
      roomTotal,
      guest,
    } = body;

    // Generate booking reference: PVS-{year}-{4digits}
    const year = new Date().getFullYear();
    const count = await prisma.booking.count({
      where: {
        reference: { startsWith: `PVS-${year}` },
      },
    });
    const reference = `PVS-${year}-${String(count + 1).padStart(4, "0")}`;

    // Check room availability
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    const room = await prisma.room.findUnique({ where: { id: roomId } });
    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    const overlappingBookings = await prisma.booking.count({
      where: {
        roomId,
        status: { notIn: ["cancelled", "no_show"] },
        checkIn: { lt: checkOutDate },
        checkOut: { gt: checkInDate },
      },
    });

    if (overlappingBookings >= room.totalRooms) {
      return NextResponse.json(
        { error: "Room not available for selected dates" },
        { status: 409 }
      );
    }

    // Create guest if needed (upsert by email)
    let guestRecord;
    if (guest?.id) {
      guestRecord = await prisma.guest.findUnique({
        where: { id: guest.id },
      });
    } else if (guest?.email) {
      guestRecord = await prisma.guest.upsert({
        where: { email: guest.email },
        update: {
          firstName: guest.firstName,
          lastName: guest.lastName,
          phone: guest.phone,
        },
        create: {
          email: guest.email,
          firstName: guest.firstName,
          lastName: guest.lastName,
          phone: guest.phone,
          nationality: guest.nationality,
        },
      });
    }

    if (!guestRecord) {
      return NextResponse.json(
        { error: "Guest information is required" },
        { status: 400 }
      );
    }

    const nights = Math.ceil(
      (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    const booking = await prisma.booking.create({
      data: {
        reference,
        hotelId,
        roomId,
        experienceId,
        guestId: guestRecord.id,
        checkIn: checkInDate,
        checkOut: checkOutDate,
        nights,
        guestCount: guestCount ?? 2,
        roomTotal,
        status: "pending",
      },
      include: {
        room: true,
        experience: true,
        guest: true,
        hotel: true,
      },
    });

    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    console.error("Error creating booking:", error);
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 }
    );
  }
}
