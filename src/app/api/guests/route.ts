import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");

    const where: Record<string, unknown> = {};

    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: "insensitive" } },
        { lastName: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { phone: { contains: search, mode: "insensitive" } },
      ];
    }

    const guests = await prisma.guest.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(guests);
  } catch (error) {
    console.error("Error listing guests:", error);
    return NextResponse.json(
      { error: "Failed to list guests" },
      { status: 500 }
    );
  }
}
