import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(request: NextRequest) {
  try {
    const supabase = createAdminClient();
    const { searchParams } = new URL(request.url);
    const hotelId = searchParams.get("hotelId");
    const category = searchParams.get("category");
    const isFlash = searchParams.get("isFlash");
    const search = searchParams.get("search");
    const checkIn = searchParams.get("checkIn");
    const checkOut = searchParams.get("checkOut");

    let query = supabase
      .from("Experience")
      .select("*, hotel:Hotel(*, rooms:Room(pricePerNight))")
      .eq("isActive", true)
      .order("createdAt", { ascending: false });

    if (hotelId) query = query.eq("hotelId", hotelId);
    if (category) query = query.eq("category", category);
    if (isFlash === "true") query = query.eq("isFlash", true);
    if (search) {
      query = query.or(
        `title.ilike.%${search}%,description.ilike.%${search}%,location.ilike.%${search}%`
      );
    }

    // Filter by availability window — experiences must cover the entire stay
    // Experiences with null availableFrom/availableTo are always available
    if (checkIn && checkOut) {
      query = query.or(
        `and(availableFrom.is.null,availableTo.is.null),and(availableFrom.lte.${new Date(checkIn).toISOString()},availableTo.gte.${new Date(checkOut).toISOString()})`
      );
    }

    const { data: experiences, error } = await query;

    if (error) throw error;

    // Post-process to filter hotel rooms (active only, cheapest first, take 1)
    const processed = (experiences ?? []).map((exp) => {
      if (exp.hotel && exp.hotel.rooms) {
        // Filter active rooms and get cheapest - since we can't filter nested relations
        // in PostgREST the same way, we do a simple sort + slice here
        const rooms = [...exp.hotel.rooms]
          .sort((a: { pricePerNight: number }, b: { pricePerNight: number }) => a.pricePerNight - b.pricePerNight)
          .slice(0, 1);
        return { ...exp, hotel: { ...exp.hotel, rooms } };
      }
      return exp;
    });

    return NextResponse.json(processed);
  } catch (error) {
    console.error("Error listing experiences:", error);
    return NextResponse.json(
      { error: "Failed to list experiences" },
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
      title,
      category,
      description,
      location,
      duration,
      maxGroup,
      inclusions,
      images,
      coverImage,
      availableFrom,
      availableTo,
      isFlash,
      flashStart,
      flashEnd,
    } = body;

    // Auto-generate slug from title
    const baseSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    // Ensure slug uniqueness
    let slug = baseSlug;
    let suffix = 1;
    while (true) {
      const { data } = await supabase
        .from("Experience")
        .select("id")
        .eq("slug", slug)
        .single();
      if (!data) break;
      slug = `${baseSlug}-${suffix}`;
      suffix++;
    }

    const { data: experience, error } = await supabase
      .from("Experience")
      .insert({
        hotelId,
        title,
        slug,
        category,
        description,
        location,
        duration,
        maxGroup: maxGroup ?? 10,
        inclusions: inclusions ?? [],
        images: images ?? [],
        coverImage,
        availableFrom: availableFrom ? new Date(availableFrom).toISOString() : null,
        availableTo: availableTo ? new Date(availableTo).toISOString() : null,
        isFlash: isFlash ?? false,
        flashStart: flashStart ? new Date(flashStart).toISOString() : null,
        flashEnd: flashEnd ? new Date(flashEnd).toISOString() : null,
        updatedAt: new Date().toISOString(),
      })
      .select("*, hotel:Hotel(*)")
      .single();

    if (error) throw error;

    return NextResponse.json(experience, { status: 201 });
  } catch (error) {
    console.error("Error creating experience:", error);
    return NextResponse.json(
      { error: "Failed to create experience" },
      { status: 500 }
    );
  }
}
