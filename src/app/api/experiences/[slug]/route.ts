import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const supabase = createAdminClient();
    const { slug } = await params;

    const { data: experience, error } = await supabase
      .from("Experience")
      .select("*, hotel:Hotel(*, rooms:Room(*))")
      .eq("slug", slug)
      .single();

    if (error || !experience) {
      return NextResponse.json(
        { error: "Experience not found" },
        { status: 404 }
      );
    }

    // Post-process to filter active rooms and sort by price
    if (experience.hotel && experience.hotel.rooms) {
      experience.hotel.rooms = experience.hotel.rooms
        .filter((r: { isActive: boolean }) => r.isActive)
        .sort((a: { pricePerNight: number }, b: { pricePerNight: number }) => a.pricePerNight - b.pricePerNight);
    }

    return NextResponse.json(experience);
  } catch (error) {
    console.error("Error fetching experience:", error);
    return NextResponse.json(
      { error: "Failed to fetch experience" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const supabase = createAdminClient();
    const { slug } = await params;
    const body = await request.json();

    const updateData = {
      ...body,
      updatedAt: new Date().toISOString(),
      ...(body.flashStart ? { flashStart: new Date(body.flashStart).toISOString() } : {}),
      ...(body.flashEnd ? { flashEnd: new Date(body.flashEnd).toISOString() } : {}),
    };

    const { data: experience, error } = await supabase
      .from("Experience")
      .update(updateData)
      .eq("slug", slug)
      .select("*, hotel:Hotel(*)")
      .single();

    if (error) throw error;

    return NextResponse.json(experience);
  } catch (error) {
    console.error("Error updating experience:", error);
    return NextResponse.json(
      { error: "Failed to update experience" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const supabase = createAdminClient();
    const { slug } = await params;

    const { error } = await supabase
      .from("Experience")
      .delete()
      .eq("slug", slug);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting experience:", error);
    return NextResponse.json(
      { error: "Failed to delete experience" },
      { status: 500 }
    );
  }
}
