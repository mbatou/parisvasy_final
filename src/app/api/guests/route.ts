import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(request: NextRequest) {
  try {
    const supabase = createAdminClient();
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");

    let query = supabase
      .from("Guest")
      .select("*")
      .order("createdAt", { ascending: false });

    if (search) {
      query = query.or(
        `firstName.ilike.%${search}%,lastName.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%`
      );
    }

    const { data: guests, error } = await query;

    if (error) throw error;

    return NextResponse.json(guests);
  } catch (error) {
    console.error("Error listing guests:", error);
    return NextResponse.json(
      { error: "Failed to list guests" },
      { status: 500 }
    );
  }
}
