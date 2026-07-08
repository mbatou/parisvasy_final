export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getUserStaffAssignments } from "@/lib/auth";
import { ExperienceEditClient } from "./ExperienceEditClient";
import type { UserRole } from "@/types";

export default async function EditExperiencePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const assignments = await getUserStaffAssignments(user.id);
  if (assignments.length === 0) return null;

  const role = assignments[0].role as UserRole;
  const assignedHotelId = assignments[0].hotelId;

  const db = createAdminClient();
  const { data: experience, error } = await db
    .from('Experience')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !experience) {
    notFound();
  }

  // Get hotels for super_admin
  let hotels: { id: string; name: string }[] = [];
  if (role === "super_admin") {
    const { data } = await db
      .from('Hotel')
      .select('id, name')
      .order('name', { ascending: true });
    hotels = data ?? [];
  } else {
    const hotel = assignments[0].hotel;
    if (hotel) hotels = [{ id: hotel.id, name: hotel.name }];
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-light text-white font-serif">
          Edit Experience
        </h1>
        <p className="mt-1 text-sm text-white/40 font-sans">
          Update &ldquo;{experience.title}&rdquo;
        </p>
      </div>

      <div className="border border-white/[0.06] bg-pv-black-80 p-6">
        <ExperienceEditClient
          experience={JSON.parse(JSON.stringify(experience))}
          userRole={role}
          assignedHotelId={assignedHotelId}
          hotels={hotels}
        />
      </div>
    </div>
  );
}
