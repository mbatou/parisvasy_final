import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const guest = await prisma.guest.findUnique({
      where: { id },
      include: {
        bookings: {
          include: {
            hotel: true,
            room: true,
            experience: true,
          },
          orderBy: { checkIn: "desc" },
        },
      },
    });

    if (!guest) {
      return NextResponse.json({ error: "Guest not found" }, { status: 404 });
    }

    return NextResponse.json(guest);
  } catch (error) {
    console.error("Error fetching guest:", error);
    return NextResponse.json(
      { error: "Failed to fetch guest" },
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

    const guest = await prisma.guest.update({
      where: { id },
      data: body,
    });

    return NextResponse.json(guest);
  } catch (error) {
    console.error("Error updating guest:", error);
    return NextResponse.json(
      { error: "Failed to update guest" },
      { status: 500 }
    );
  }
}
