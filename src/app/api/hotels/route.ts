import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  try {
    const supabase = createAdminClient();

    const { data: hotels, error } = await supabase
      .from("Hotel")
      .select("*")
      .eq("isActive", true)
      .order("name", { ascending: true });

    if (error) throw error;

    // Fetch counts separately for each hotel
    const hotelsWithCounts = await Promise.all(
      (hotels ?? []).map(async (hotel) => {
        const [roomsCount, experiencesCount, bookingsCount] = await Promise.all([
          supabase
            .from("Room")
            .select("id", { count: "exact", head: true })
            .eq("hotelId", hotel.id),
          supabase
            .from("Experience")
            .select("id", { count: "exact", head: true })
            .eq("hotelId", hotel.id),
          supabase
            .from("Booking")
            .select("id", { count: "exact", head: true })
            .eq("hotelId", hotel.id),
        ]);

        return {
          ...hotel,
          _count: {
            rooms: roomsCount.count ?? 0,
            experiences: experiencesCount.count ?? 0,
            bookings: bookingsCount.count ?? 0,
          },
        };
      })
    );

    return NextResponse.json(hotelsWithCounts);
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
    const supabase = createAdminClient();
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

    const { data: hotel, error } = await supabase
      .from("Hotel")
      .insert({
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
        updatedAt: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(hotel, { status: 201 });
  } catch (error) {
    console.error("Error creating hotel:", error);
    return NextResponse.json(
      { error: "Failed to create hotel" },
      { status: 500 }
    );
  }
}
