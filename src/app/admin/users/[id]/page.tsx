export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getUserStaffAssignments } from "@/lib/auth";
import { EditStaffClient } from "./EditStaffClient";
import type { UserRole } from "@/types";

export default async function EditUserPage({
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

  if (role !== "super_admin") {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <h1 className="text-2xl font-light text-white font-serif">Access Denied</h1>
        <p className="mt-2 text-sm text-white/40">Only super administrators can edit staff.</p>
      </div>
    );
  }

  const db = createAdminClient();

  // Get staff assignment
  const { data: assignment, error } = await db
    .from("StaffAssignment")
    .select("*, hotel:Hotel(id, name)")
    .eq("id", id)
    .single();

  if (error || !assignment) {
    notFound();
  }

  // Get guest data
  const { data: guest } = await db
    .from("Guest")
    .select("firstName, lastName, email, phone")
    .eq("authUserId", assignment.userId)
    .single();

  // Get hotels
  const { data: hotels } = await db
    .from("Hotel")
    .select("id, name")
    .order("name", { ascending: true });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-light text-white font-serif">
          Edit Staff Member
        </h1>
        <p className="mt-1 text-sm text-white/40 font-sans">
          Update {guest?.firstName ?? "staff"} {guest?.lastName ?? "member"}
        </p>
      </div>

      <div className="mx-auto max-w-lg border border-white/[0.06] bg-pv-black-80 p-6">
        <EditStaffClient
          staffId={id}
          assignment={JSON.parse(JSON.stringify(assignment))}
          guest={guest ? JSON.parse(JSON.stringify(guest)) : null}
          hotels={hotels ?? []}
        />
      </div>
    </div>
  );
}
