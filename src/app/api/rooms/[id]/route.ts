import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = createAdminClient();
    const { id } = await params;

    const { data: room, error } = await supabase
      .from("Room")
      .select("*, hotel:Hotel(*)")
      .eq("id", id)
      .single();

    if (error || !room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    return NextResponse.json(room);
  } catch (error) {
    console.error("Error fetching room:", error);
    return NextResponse.json(
      { error: "Failed to fetch room" },
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

    const { data: room, error } = await supabase
      .from("Room")
      .update({ ...body, updatedAt: new Date().toISOString() })
      .eq("id", id)
      .select("*, hotel:Hotel(*)")
      .single();

    if (error) throw error;

    return NextResponse.json(room);
  } catch (error) {
    console.error("Error updating room:", error);
    return NextResponse.json(
      { error: "Failed to update room" },
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
      .from("Room")
      .delete()
      .eq("id", id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting room:", error);
    return NextResponse.json(
      { error: "Failed to delete room" },
      { status: 500 }
    );
  }
}
