export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { RoomEditClient } from "./RoomEditClient";

export default async function EditRoomPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const room = await prisma.room.findUnique({
    where: { id },
  });

  if (!room) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-light text-white font-serif">
          Edit Room
        </h1>
        <p className="mt-1 text-sm text-white/40 font-sans">
          Update &ldquo;{room.name}&rdquo;
        </p>
      </div>

      <div className="border border-white/[0.06] bg-pv-black-80 p-6">
        <RoomEditClient room={JSON.parse(JSON.stringify(room))} />
      </div>
    </div>
  );
}
