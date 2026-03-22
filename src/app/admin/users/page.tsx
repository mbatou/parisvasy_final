export const dynamic = "force-dynamic";

import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getUserStaffAssignments } from "@/lib/auth";
import type { UserRole } from "@/types";
import { UsersPageClient } from "./UsersPageClient";

export default async function UsersPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const assignments = await getUserStaffAssignments(user.id);
  if (assignments.length === 0) return null;

  const role = assignments[0].role as UserRole;

  // Only super_admin can access this page
  if (role !== "super_admin") {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <h1 className="text-2xl font-light text-white font-serif">
          Access Denied
        </h1>
        <p className="mt-2 text-sm text-white/40">
          Only super administrators can manage users.
        </p>
      </div>
    );
  }

  const db = createAdminClient();

  const { data: hotelsData } = await db
    .from('Hotel')
    .select('id, name')
    .order('name', { ascending: true });

  const hotels = hotelsData ?? [];

  const { data: staffAssignmentsData } = await db
    .from('StaffAssignment')
    .select('*, hotel:Hotel(id, name)')
    .order('createdAt', { ascending: false });

  const staffAssignments = staffAssignmentsData ?? [];

  // Enrich with guest data where possible (for display names)
  // First, get all unique userIds
  const userIds = [...new Set(staffAssignments.map((sa) => sa.userId))];

  // Batch fetch all guests by authUserId
  const { data: guestsData } = userIds.length > 0
    ? await db
        .from('Guest')
        .select('authUserId, firstName, lastName, email')
        .in('authUserId', userIds)
    : { data: [] };

  const guestsByUserId = new Map(
    (guestsData ?? []).map((g) => [g.authUserId, g])
  );

  const enrichedStaff = staffAssignments.map((sa) => {
    const guest = guestsByUserId.get(sa.userId);

    return {
      ...sa,
      role: sa.role as UserRole,
      name: guest
        ? `${guest.firstName} ${guest.lastName}`
        : undefined,
      email: guest?.email ?? undefined,
    };
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-light text-white font-serif">
            Users &amp; Staff
          </h1>
          <p className="mt-1 text-sm text-white/40 font-sans">
            Manage staff members and their role assignments.
          </p>
        </div>
        <Link
          href="/admin/users/new"
          className="inline-flex items-center gap-2 rounded-lg bg-gold text-pv-black px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-gold/80"
        >
          Invite Staff
        </Link>
      </div>

      <UsersPageClient staff={enrichedStaff} hotels={hotels} />
    </div>
  );
}
