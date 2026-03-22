export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/Badge";
import { CATEGORY_LABELS, CATEGORY_COLORS } from "@/types";
import {
  MapPin,
  Clock,
  Users,
  Check,
  Gift,
} from "lucide-react";
import BookingSidebar from "./BookingSidebar";

interface ExperienceDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ExperienceDetailPage({
  params,
}: ExperienceDetailPageProps) {
  const { slug } = await params;

  const experience = await prisma.experience.findUnique({
    where: { slug },
    include: {
      hotel: {
        include: {
          rooms: { where: { isActive: true }, orderBy: { pricePerNight: "asc" } },
        },
      },
    },
  });

  if (!experience || !experience.isActive) {
    notFound();
  }

  const serializedRooms = (experience.hotel?.rooms ?? []).map((r) => ({
    ...r,
    pricePerNight: Number(r.pricePerNight),
  }));

  const gallery = experience.images.length > 0
    ? experience.images
    : experience.coverImage
      ? [experience.coverImage]
      : [];

  return (
    <div className="bg-pv-black pt-24">
      {/* Hero Image Gallery */}
      <div className="relative h-[40vh] overflow-hidden bg-pv-black-90 sm:h-[50vh] lg:h-[60vh]">
        {gallery.length > 0 ? (
          <div className="flex h-full">
            <div className="relative flex-1">
              <Image
                src={gallery[0]}
                alt={experience.title}
                fill
                className="object-cover"
                priority
                sizes="100vw"
              />
            </div>
            {gallery.length > 1 && (
              <div className="hidden w-1/3 flex-col gap-1 pl-1 lg:flex">
                {gallery.slice(1, 3).map((img, i) => (
                  <div key={i} className="relative flex-1">
                    <Image
                      src={img}
                      alt={`${experience.title} ${i + 2}`}
                      fill
                      className="object-cover"
                      sizes="33vw"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="flex h-full items-center justify-center text-white/30">
            <span className="text-lg">No images available</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="lg:grid lg:grid-cols-3 lg:gap-12">
          {/* Left: Experience Info */}
          <div className="lg:col-span-2">
            {/* Title & Meta */}
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                className={CATEGORY_COLORS[experience.category]}
              >
                {CATEGORY_LABELS[experience.category]}
              </Badge>
              {experience.isFlash && (
                <Badge variant="vermillion">Flash deal</Badge>
              )}
            </div>

            <h1 className="mt-4 font-serif text-3xl font-light leading-tight text-white sm:text-4xl">
              {experience.title}
            </h1>

            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-white/40">
              <span className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4" />
                {experience.location}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                {experience.duration}
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="h-4 w-4" />
                Up to {experience.maxGroup} guests
              </span>
            </div>

            {/* Hotel info */}
            {experience.hotel && (
              <p className="mt-3 text-sm text-white/40">
                At{" "}
                <span className="font-medium text-white">
                  {experience.hotel.name}
                </span>
                {" — "}
                {experience.hotel.address}, {experience.hotel.city}
              </p>
            )}

            {/* Description */}
            {experience.description && (
              <div className="mt-8">
                <h3 className="font-serif text-xl font-light text-white">
                  About this experience
                </h3>
                <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-white/50">
                  {experience.description}
                </p>
              </div>
            )}

            {/* What's included */}
            {experience.inclusions.length > 0 && (
              <div className="mt-10">
                <h3 className="font-serif text-xl font-light text-white">
                  What&apos;s included
                </h3>
                <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {experience.inclusions.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 text-sm text-white/50"
                    >
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-sage" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Included free banner */}
            <div className="mt-10 flex items-center gap-3 bg-pv-black-90 p-5">
              <Gift className="h-6 w-6 shrink-0 text-sage" />
              <div>
                <p className="font-semibold text-sage-500">
                  Experience included free
                </p>
                <p className="mt-0.5 text-sm text-sage-400">
                  This experience is complimentary with every room booking. You
                  only pay for the hotel room.
                </p>
              </div>
            </div>
          </div>

          {/* Right: Booking Sidebar */}
          <div className="mt-10 lg:mt-0">
            <BookingSidebar
              experienceId={experience.id}
              hotelId={experience.hotelId}
              rooms={serializedRooms}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
