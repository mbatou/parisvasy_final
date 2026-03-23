import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: NextRequest) {
  try {
    const supabase = createAdminClient();
    const body = await request.json();
    const { firstName, lastName, email, password, role, hotelId } = body;

    if (!firstName || !lastName || !email || !password || !role || !hotelId) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    // 1. Create user in Supabase Auth
    const { data: authData, error: authError } =
      await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          first_name: firstName,
          last_name: lastName,
        },
      });

    if (authError) {
      console.error("Auth error:", authError);
      return NextResponse.json(
        { error: authError.message },
        { status: 400 }
      );
    }

    const userId = authData.user.id;

    // 2. Create Guest record
    const { error: guestError } = await supabase.from("Guest").insert({
      authUserId: userId,
      email,
      firstName,
      lastName,
      phone: body.phone ?? null,
      updatedAt: new Date().toISOString(),
    });

    if (guestError) {
      console.error("Guest creation error:", guestError);
      // Don't fail the whole thing, just log it
    }

    // 3. Create StaffAssignment
    const { error: staffError } = await supabase
      .from("StaffAssignment")
      .insert({
        userId,
        hotelId,
        role,
        isActive: body.isActive !== false,
      });

    if (staffError) {
      console.error("Staff assignment error:", staffError);
      return NextResponse.json(
        { error: "User created but failed to assign role: " + staffError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, userId }, { status: 201 });
  } catch (error) {
    console.error("Error creating staff:", error);
    return NextResponse.json(
      { error: "Failed to create staff member" },
      { status: 500 }
    );
  }
}
