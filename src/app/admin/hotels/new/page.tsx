"use client";

import { useRouter } from "next/navigation";
import { HotelForm } from "@/components/admin/HotelForm";

export default function NewHotelPage() {
  const router = useRouter();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = async (data: any) => {
    const res = await fetch("/api/hotels", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      router.push("/admin/hotels");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-light text-white font-serif">
          New Hotel
        </h1>
        <p className="mt-1 text-sm text-white/40 font-sans">
          Add a new hotel to the PARISVASY network.
        </p>
      </div>

      <div className="border border-white/[0.06] bg-pv-black-80 p-6">
        <HotelForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
