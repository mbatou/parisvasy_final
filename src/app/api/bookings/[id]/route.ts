import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = createAdminClient();
    const { id } = await params;

    const { data: booking, error } = await supabase
      .from("Booking")
      .select("*, hotel:Hotel(*), room:Room(*), experience:Experience(*), guest:Guest(*)")
      .eq("id", id)
      .single();

    if (error || !booking) {
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
    const supabase = createAdminClient();
    const { id } = await params;
    const body = await request.json();

    // Get current user for check-in/out tracking
    const authClient = await createClient();
    const { data: { user } } = await authClient.auth.getUser();

    const data: Record<string, unknown> = { updatedAt: new Date().toISOString() };

    // Handle action-based status changes
    if (body.action) {
      const now = new Date().toISOString();
      switch (body.action) {
        case "confirm":
          data.status = "confirmed";
          break;
        case "check_in":
          data.status = "checked_in";
          data.checkedInAt = now;
          if (user) data.checkedInBy = user.id;
          break;
        case "check_out":
          data.status = "checked_out";
          data.checkedOutAt = now;
          if (user) data.checkedOutBy = user.id;
          break;
        case "cancel":
          data.status = "cancelled";
          break;
        case "no_show":
          data.status = "no_show";
          break;
      }
    }

    // Handle direct field updates
    if (body.status !== undefined && !body.action) data.status = body.status;
    if (body.checkIn !== undefined) data.checkIn = new Date(body.checkIn).toISOString();
    if (body.checkOut !== undefined) data.checkOut = new Date(body.checkOut).toISOString();
    if (body.roomId !== undefined) data.roomId = body.roomId;
    if (body.guestCount !== undefined) data.guestCount = body.guestCount;
    if (body.notes !== undefined) data.notes = body.notes;
    if (body.nights !== undefined) data.nights = body.nights;
    if (body.roomTotal !== undefined) data.roomTotal = body.roomTotal;
    if (body.checkedInAt !== undefined) data.checkedInAt = new Date(body.checkedInAt).toISOString();
    if (body.checkedInBy !== undefined) data.checkedInBy = body.checkedInBy;
    if (body.checkedOutAt !== undefined) data.checkedOutAt = new Date(body.checkedOutAt).toISOString();
    if (body.checkedOutBy !== undefined) data.checkedOutBy = body.checkedOutBy;
    if (body.stripeSetupIntentId !== undefined) data.stripeSetupIntentId = body.stripeSetupIntentId;
    if (body.stripePaymentMethodId !== undefined) data.stripePaymentMethodId = body.stripePaymentMethodId;
    if (body.cardLast4 !== undefined) data.cardLast4 = body.cardLast4;
    if (body.cardBrand !== undefined) data.cardBrand = body.cardBrand;
    if (body.warrantyCollected !== undefined) data.warrantyCollected = body.warrantyCollected;

    const { data: booking, error } = await supabase
      .from("Booking")
      .update(data)
      .eq("id", id)
      .select("*, hotel:Hotel(*), room:Room(*), experience:Experience(*), guest:Guest(*)")
      .single();

    if (error) throw error;

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
    const supabase = createAdminClient();
    const { id } = await params;

    const { data: booking, error } = await supabase
      .from("Booking")
      .update({ status: "cancelled", updatedAt: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(booking);
  } catch (error) {
    console.error("Error cancelling booking:", error);
    return NextResponse.json(
      { error: "Failed to cancel booking" },
      { status: 500 }
    );
  }
}
