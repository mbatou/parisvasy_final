import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const hotelId = searchParams.get("hotelId");

    const where: Record<string, unknown> = {};
    if (hotelId) where.hotelId = hotelId;

    const rooms = await prisma.room.findMany({
      where,
      include: {
        hotel: true,
      },
      orderBy: { pricePerNight: "asc" },
    });

    return NextResponse.json(rooms);
  } catch (error) {
    console.error("Error listing rooms:", error);
    return NextResponse.json(
      { error: "Failed to list rooms" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      hotelId,
      name,
      type,
      description,
      size,
      maxGuests,
      amenities,
      images,
      pricePerNight,
      totalRooms,
    } = body;

    const room = await prisma.room.create({
      data: {
        hotelId,
        name,
        type,
        description,
        size,
        maxGuests: maxGuests ?? 2,
        amenities: amenities ?? [],
        images: images ?? [],
        pricePerNight,
        totalRooms: totalRooms ?? 1,
      },
      include: {
        hotel: true,
      },
    });

    return NextResponse.json(room, { status: 201 });
  } catch (error) {
    console.error("Error creating room:", error);
    return NextResponse.json(
      { error: "Failed to create room" },
      { status: 500 }
    );
  }
}
