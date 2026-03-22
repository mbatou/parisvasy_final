export const dynamic = "force-dynamic";

import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
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
        <h1 className="text-2xl font-bold text-navy-500 font-serif">
          Access Denied
        </h1>
        <p className="mt-2 text-sm text-navy-300">
          Only super administrators can manage users.
        </p>
      </div>
    );
  }

  const hotels = await prisma.hotel.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  const staffAssignments = await prisma.staffAssignment.findMany({
    include: {
      hotel: { select: { id: true, name: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  // Enrich with guest data where possible (for display names)
  const enrichedStaff = await Promise.all(
    staffAssignments.map(async (sa) => {
      const guest = await prisma.guest.findFirst({
        where: { authUserId: sa.userId },
        select: { firstName: true, lastName: true, email: true },
      });

      return {
        ...sa,
        role: sa.role as UserRole,
        name: guest
          ? `${guest.firstName} ${guest.lastName}`
          : undefined,
        email: guest?.email ?? undefined,
      };
    })
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy-500 font-serif">
            Users &amp; Staff
          </h1>
          <p className="mt-1 text-sm text-navy-300 font-sans">
            Manage staff members and their role assignments.
          </p>
        </div>
        <Link
          href="/admin/users/new"
          className="inline-flex items-center gap-2 rounded-lg bg-vermillion-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-vermillion-600"
        >
          Invite Staff
        </Link>
      </div>

      <UsersPageClient staff={enrichedStaff} hotels={hotels} />
    </div>
  );
}
