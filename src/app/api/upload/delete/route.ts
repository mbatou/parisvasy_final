import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: NextRequest) {
  try {
    const { bucket, filename } = await request.json();

    if (!bucket || !filename) {
      return NextResponse.json(
        { error: "Bucket and filename are required" },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();
    const { error } = await supabase.storage.from(bucket).remove([filename]);

    if (error) {
      console.error("Delete error:", error);
      return NextResponse.json(
        { error: "Failed to delete file" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting file:", error);
    return NextResponse.json(
      { error: "Failed to delete file" },
      { status: 500 }
    );
  }
}
