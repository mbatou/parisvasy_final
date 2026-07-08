export const dynamic = "force-dynamic";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getUserStaffAssignments } from "@/lib/auth";
import { NewStaffClient } from "./NewStaffClient";
import type { UserRole } from "@/types";

export default async function NewUserPage() {
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
        <p className="mt-2 text-sm text-white/40">Only super administrators can create staff.</p>
      </div>
    );
  }

  const db = createAdminClient();
  const { data: hotels } = await db
    .from("Hotel")
    .select("id, name")
    .order("name", { ascending: true });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-light text-white font-serif">
          Create Staff Member
        </h1>
        <p className="mt-1 text-sm text-white/40 font-sans">
          Directly create a new staff account with login credentials.
        </p>
      </div>

      <div className="mx-auto max-w-lg border border-white/[0.06] bg-pv-black-80 p-6">
        <NewStaffClient hotels={hotels ?? []} />
      </div>
    </div>
  );
}
