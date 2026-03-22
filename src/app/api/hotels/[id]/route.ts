import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const hotel = await prisma.hotel.findUnique({
      where: { id },
      include: {
        rooms: { where: { isActive: true }, orderBy: { pricePerNight: "asc" } },
        experiences: { where: { isActive: true }, orderBy: { createdAt: "desc" } },
        _count: {
          select: {
            bookings: true,
          },
        },
      },
    });

    if (!hotel) {
      return NextResponse.json({ error: "Hotel not found" }, { status: 404 });
    }

    return NextResponse.json(hotel);
  } catch (error) {
    console.error("Error fetching hotel:", error);
    return NextResponse.json(
      { error: "Failed to fetch hotel" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const hotel = await prisma.hotel.update({
      where: { id },
      data: body,
    });

    return NextResponse.json(hotel);
  } catch (error) {
    console.error("Error updating hotel:", error);
    return NextResponse.json(
      { error: "Failed to update hotel" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.hotel.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting hotel:", error);
    return NextResponse.json(
      { error: "Failed to delete hotel" },
      { status: 500 }
    );
  }
}
