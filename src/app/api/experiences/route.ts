import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const hotelId = searchParams.get("hotelId");
    const category = searchParams.get("category");
    const isFlash = searchParams.get("isFlash");
    const search = searchParams.get("search");

    const where: Record<string, unknown> = { isActive: true };

    if (hotelId) where.hotelId = hotelId;
    if (category) where.category = category;
    if (isFlash === "true") where.isFlash = true;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { location: { contains: search, mode: "insensitive" } },
      ];
    }

    const experiences = await prisma.experience.findMany({
      where,
      include: {
        hotel: {
          include: {
            rooms: {
              where: { isActive: true },
              orderBy: { pricePerNight: "asc" },
              take: 1,
              select: { pricePerNight: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(experiences);
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
    while (await prisma.experience.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${suffix}`;
      suffix++;
    }

    const experience = await prisma.experience.create({
      data: {
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
        isFlash: isFlash ?? false,
        flashStart: flashStart ? new Date(flashStart) : null,
        flashEnd: flashEnd ? new Date(flashEnd) : null,
      },
      include: {
        hotel: true,
      },
    });

    return NextResponse.json(experience, { status: 201 });
  } catch (error) {
    console.error("Error creating experience:", error);
    return NextResponse.json(
      { error: "Failed to create experience" },
      { status: 500 }
    );
  }
}
