import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = createAdminClient();
    const { id } = await params;

    const { data: guest, error } = await supabase
      .from("Guest")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !guest) {
      return NextResponse.json({ error: "Guest not found" }, { status: 404 });
    }

    // Fetch bookings with relations separately
    const { data: bookings } = await supabase
      .from("Booking")
      .select("*, hotel:Hotel(*), room:Room(*), experience:Experience(*)")
      .eq("guestId", id)
      .order("checkIn", { ascending: false });

    return NextResponse.json({ ...guest, bookings: bookings ?? [] });
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
    const supabase = createAdminClient();
    const { id } = await params;
    const body = await request.json();

    const { data: guest, error } = await supabase
      .from("Guest")
      .update({ ...body, updatedAt: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(guest);
  } catch (error) {
    console.error("Error updating guest:", error);
    return NextResponse.json(
      { error: "Failed to update guest" },
      { status: 500 }
    );
  }
}
