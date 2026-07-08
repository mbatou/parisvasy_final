import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = createAdminClient();
    const { id } = await params;

    const { data: assignment, error } = await supabase
      .from("StaffAssignment")
      .select("*, hotel:Hotel(id, name)")
      .eq("id", id)
      .single();

    if (error || !assignment) {
      return NextResponse.json(
        { error: "Staff assignment not found" },
        { status: 404 }
      );
    }

    // Get guest data
    const { data: guest } = await supabase
      .from("Guest")
      .select("firstName, lastName, email, phone")
      .eq("authUserId", assignment.userId)
      .single();

    return NextResponse.json({ ...assignment, guest });
  } catch (error) {
    console.error("Error fetching staff:", error);
    return NextResponse.json(
      { error: "Failed to fetch staff member" },
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

    const updateData: Record<string, unknown> = {};

    if (body.role !== undefined) updateData.role = body.role;
    if (body.hotelId !== undefined) updateData.hotelId = body.hotelId;
    if (body.isActive !== undefined) updateData.isActive = body.isActive;

    const { data: assignment, error } = await supabase
      .from("StaffAssignment")
      .update(updateData)
      .eq("id", id)
      .select("*, hotel:Hotel(id, name)")
      .single();

    if (error) throw error;

    // Update guest name if provided
    if (body.firstName || body.lastName) {
      const guestUpdate: Record<string, unknown> = {
        updatedAt: new Date().toISOString(),
      };
      if (body.firstName) guestUpdate.firstName = body.firstName;
      if (body.lastName) guestUpdate.lastName = body.lastName;

      await supabase
        .from("Guest")
        .update(guestUpdate)
        .eq("authUserId", assignment.userId);
    }

    // Reset password if provided
    if (body.newPassword && body.newPassword.length >= 8) {
      await supabase.auth.admin.updateUserById(assignment.userId, {
        password: body.newPassword,
      });
    }

    return NextResponse.json(assignment);
  } catch (error) {
    console.error("Error updating staff:", error);
    return NextResponse.json(
      { error: "Failed to update staff member" },
      { status: 500 }
    );
  }
}
