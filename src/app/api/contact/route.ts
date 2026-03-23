import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { firstName, lastName, email, subject, bookingReference, message } =
      body;

    // Validate required fields
    if (!firstName || !lastName || !email || !subject || !message) {
      return NextResponse.json(
        { error: "All required fields must be filled" },
        { status: 400 }
      );
    }

    // Basic email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    const { error } = await supabase.from("ContactMessage").insert({
      firstName,
      lastName,
      email,
      subject,
      bookingReference: bookingReference || null,
      message,
    });

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving contact message:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = createAdminClient();
    const { searchParams } = new URL(request.url);
    const readFilter = searchParams.get("read");

    let query = supabase
      .from("ContactMessage")
      .select("*")
      .order("createdAt", { ascending: false });

    if (readFilter === "true") query = query.eq("read", true);
    if (readFilter === "false") query = query.eq("read", false);

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error listing contact messages:", error);
    return NextResponse.json(
      { error: "Failed to list messages" },
      { status: 500 }
    );
  }
}
