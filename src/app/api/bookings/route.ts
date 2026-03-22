import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(request: NextRequest) {
  try {
    const supabase = createAdminClient();
    const { searchParams } = new URL(request.url);
    const hotelId = searchParams.get("hotelId");
    const status = searchParams.get("status");
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    let query = supabase
      .from("Booking")
      .select("*, room:Room(*), experience:Experience(*), guest:Guest(*)")
      .order("checkIn", { ascending: false });

    if (hotelId) query = query.eq("hotelId", hotelId);
    if (status) query = query.eq("status", status);
    if (from) query = query.gte("checkIn", new Date(from).toISOString());
    if (to) query = query.lte("checkIn", new Date(to).toISOString());

    const { data: bookings, error } = await query;

    if (error) throw error;

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
    const supabase = createAdminClient();
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
    const { count } = await supabase
      .from("Booking")
      .select("id", { count: "exact", head: true })
      .like("reference", `PVS-${year}%`);

    const reference = `PVS-${year}-${String((count ?? 0) + 1).padStart(4, "0")}`;

    // Check room availability
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    const { data: room, error: roomError } = await supabase
      .from("Room")
      .select("*")
      .eq("id", roomId)
      .single();

    if (roomError || !room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    const { count: overlappingBookings } = await supabase
      .from("Booking")
      .select("id", { count: "exact", head: true })
      .eq("roomId", roomId)
      .not("status", "in", "(cancelled,no_show)")
      .lt("checkIn", checkOutDate.toISOString())
      .gt("checkOut", checkInDate.toISOString());

    if ((overlappingBookings ?? 0) >= room.totalRooms) {
      return NextResponse.json(
        { error: "Room not available for selected dates" },
        { status: 409 }
      );
    }

    // Create guest if needed (upsert by email)
    let guestRecord;
    if (guest?.id) {
      const { data } = await supabase
        .from("Guest")
        .select("*")
        .eq("id", guest.id)
        .single();
      guestRecord = data;
    } else if (guest?.email) {
      const { data } = await supabase
        .from("Guest")
        .upsert(
          {
            email: guest.email,
            firstName: guest.firstName,
            lastName: guest.lastName,
            phone: guest.phone,
            nationality: guest.nationality,
            updatedAt: new Date().toISOString(),
          },
          { onConflict: "email" }
        )
        .select()
        .single();
      guestRecord = data;
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

    const { data: booking, error: createError } = await supabase
      .from("Booking")
      .insert({
        reference,
        hotelId,
        roomId,
        experienceId,
        guestId: guestRecord.id,
        checkIn: checkInDate.toISOString(),
        checkOut: checkOutDate.toISOString(),
        nights,
        guestCount: guestCount ?? 2,
        roomTotal,
        status: "pending",
        updatedAt: new Date().toISOString(),
      })
      .select("*, room:Room(*), experience:Experience(*), guest:Guest(*), hotel:Hotel(*)")
      .single();

    if (createError) throw createError;

    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    console.error("Error creating booking:", error);
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 }
    );
  }
}
