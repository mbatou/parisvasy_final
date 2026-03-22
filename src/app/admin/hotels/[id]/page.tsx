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
        <h1 className="text-2xl font-bold text-navy-500 font-serif">
          Edit Hotel
        </h1>
        <p className="mt-1 text-sm text-navy-300 font-sans">
          Update &ldquo;{hotel.name}&rdquo;
        </p>
      </div>

      <div className="rounded-xl border border-navy-100 bg-white p-6 shadow-sm">
        <HotelEditClient hotel={JSON.parse(JSON.stringify(hotel))} />
      </div>
    </div>
  );
}
