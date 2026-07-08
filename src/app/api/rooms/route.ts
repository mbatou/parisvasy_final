import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(request: NextRequest) {
  try {
    const supabase = createAdminClient();
    const { searchParams } = new URL(request.url);
    const hotelId = searchParams.get("hotelId");

    let query = supabase
      .from("Room")
      .select("*, hotel:Hotel(*)")
      .order("pricePerNight", { ascending: true });

    if (hotelId) query = query.eq("hotelId", hotelId);

    const { data: rooms, error } = await query;

    if (error) throw error;

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
    const supabase = createAdminClient();
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

    const { data: room, error } = await supabase
      .from("Room")
      .insert({
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
        updatedAt: new Date().toISOString(),
      })
      .select("*, hotel:Hotel(*)")
      .single();

    if (error) throw error;

    return NextResponse.json(room, { status: 201 });
  } catch (error) {
    console.error("Error creating room:", error);
    return NextResponse.json(
      { error: "Failed to create room" },
      { status: 500 }
    );
  }
}
