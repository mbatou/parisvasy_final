import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
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
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(booking);
  } catch (error) {
    console.error("Error fetching booking:", error);
    return NextResponse.json(
      { error: "Failed to fetch booking" },
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

    const {
      status,
      checkedInAt,
      checkedInBy,
      checkedOutAt,
      checkedOutBy,
      notes,
      stripeSetupIntentId,
      stripePaymentMethodId,
      cardLast4,
      cardBrand,
      warrantyCollected,
    } = body;

    const data: Record<string, unknown> = {};
    if (status !== undefined) data.status = status;
    if (checkedInAt !== undefined) data.checkedInAt = new Date(checkedInAt);
    if (checkedInBy !== undefined) data.checkedInBy = checkedInBy;
    if (checkedOutAt !== undefined) data.checkedOutAt = new Date(checkedOutAt);
    if (checkedOutBy !== undefined) data.checkedOutBy = checkedOutBy;
    if (notes !== undefined) data.notes = notes;
    if (stripeSetupIntentId !== undefined) data.stripeSetupIntentId = stripeSetupIntentId;
    if (stripePaymentMethodId !== undefined) data.stripePaymentMethodId = stripePaymentMethodId;
    if (cardLast4 !== undefined) data.cardLast4 = cardLast4;
    if (cardBrand !== undefined) data.cardBrand = cardBrand;
    if (warrantyCollected !== undefined) data.warrantyCollected = warrantyCollected;

    const booking = await prisma.booking.update({
      where: { id },
      data,
      include: {
        hotel: true,
        room: true,
        experience: true,
        guest: true,
      },
    });

    return NextResponse.json(booking);
  } catch (error) {
    console.error("Error updating booking:", error);
    return NextResponse.json(
      { error: "Failed to update booking" },
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

    const booking = await prisma.booking.update({
      where: { id },
      data: { status: "cancelled" },
    });

    return NextResponse.json(booking);
  } catch (error) {
    console.error("Error cancelling booking:", error);
    return NextResponse.json(
      { error: "Failed to cancel booking" },
      { status: 500 }
    );
  }
}
