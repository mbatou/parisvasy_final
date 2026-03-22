export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { HotelEditClient } from "./HotelEditClient";

export default async function EditHotelPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const hotel = await prisma.hotel.findUnique({
    where: { id },
  });

  if (!hotel) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-light text-white font-serif">
          Edit Hotel
        </h1>
        <p className="mt-1 text-sm text-white/40 font-sans">
          Update &ldquo;{hotel.name}&rdquo;
        </p>
      </div>

      <div className="border border-white/[0.06] bg-pv-black-80 p-6">
        <HotelEditClient hotel={JSON.parse(JSON.stringify(hotel))} />
      </div>
    </div>
  );
}
