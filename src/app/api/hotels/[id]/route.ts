import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = createAdminClient();
    const { id } = await params;

    const { data: hotel, error } = await supabase
      .from("Hotel")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !hotel) {
      return NextResponse.json({ error: "Hotel not found" }, { status: 404 });
    }

    // Fetch active rooms
    const { data: rooms } = await supabase
      .from("Room")
      .select("*")
      .eq("hotelId", id)
      .eq("isActive", true)
      .order("pricePerNight", { ascending: true });

    // Fetch active experiences
    const { data: experiences } = await supabase
      .from("Experience")
      .select("*")
      .eq("hotelId", id)
      .eq("isActive", true)
      .order("createdAt", { ascending: false });

    // Fetch bookings count
    const { count: bookingsCount } = await supabase
      .from("Booking")
      .select("id", { count: "exact", head: true })
      .eq("hotelId", id);

    return NextResponse.json({
      ...hotel,
      rooms: rooms ?? [],
      experiences: experiences ?? [],
      _count: {
        bookings: bookingsCount ?? 0,
      },
    });
  } catch (error) {
    console.error("Error fetching hotel:", error);
    return NextResponse.json(
      { error: "Failed to fetch hotel" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  return PATCH(request, context);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = createAdminClient();
    const { id } = await params;
    const body = await request.json();

    const { data: hotel, error } = await supabase
      .from("Hotel")
      .update({ ...body, updatedAt: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

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
    const supabase = createAdminClient();
    const { id } = await params;

    const { error } = await supabase
      .from("Hotel")
      .delete()
      .eq("id", id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting hotel:", error);
    return NextResponse.json(
      { error: "Failed to delete hotel" },
      { status: 500 }
    );
  }
}
