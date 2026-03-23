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

    // Before deleting: reassign super_admin staff to another hotel
    // so they don't lose admin access due to CASCADE delete
    const { data: staff } = await supabase
      .from("StaffAssignment")
      .select("id, userId, role")
      .eq("hotelId", id)
      .eq("isActive", true);

    const superAdmins = (staff ?? []).filter((s) => s.role === "super_admin");

    if (superAdmins.length > 0) {
      // Find another hotel to reassign them to
      const { data: otherHotels } = await supabase
        .from("Hotel")
        .select("id")
        .neq("id", id)
        .limit(1);

      if (otherHotels && otherHotels.length > 0) {
        // Reassign super_admins to the other hotel
        const targetHotelId = otherHotels[0].id;
        for (const admin of superAdmins) {
          // Check if they already have an assignment at the target hotel
          const { data: existing } = await supabase
            .from("StaffAssignment")
            .select("id")
            .eq("userId", admin.userId)
            .eq("hotelId", targetHotelId)
            .limit(1);

          if (existing && existing.length > 0) {
            // Already assigned there, just remove the one being deleted
            continue;
          }

          // Move the assignment to the other hotel
          await supabase
            .from("StaffAssignment")
            .update({ hotelId: targetHotelId })
            .eq("id", admin.id);
        }
      }
      // If no other hotel exists, the super_admin assignments will be cascade-deleted
      // but the auto-recovery in the admin layout will handle restoration when a new hotel is created
    }

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
