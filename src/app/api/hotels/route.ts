import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const hotels = await prisma.hotel.findMany({
      where: { isActive: true },
      include: {
        _count: {
          select: {
            rooms: true,
            experiences: true,
            bookings: true,
          },
        },
      },
      orderBy: { name: "asc" },
    });

    return NextResponse.json(hotels);
  } catch (error) {
    console.error("Error listing hotels:", error);
    return NextResponse.json(
      { error: "Failed to list hotels" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // TODO: Add super_admin role check via auth middleware
    const body = await request.json();
    const {
      name,
      slug,
      address,
      city,
      country,
      description,
      stars,
      coverImage,
      images,
      phone,
      email,
    } = body;

    const hotel = await prisma.hotel.create({
      data: {
        name,
        slug,
        address,
        city,
        country: country ?? "France",
        description,
        stars: stars ?? 4,
        coverImage,
        images: images ?? [],
        phone,
        email,
      },
    });

    return NextResponse.json(hotel, { status: 201 });
  } catch (error) {
    console.error("Error creating hotel:", error);
    return NextResponse.json(
      { error: "Failed to create hotel" },
      { status: 500 }
    );
  }
}
