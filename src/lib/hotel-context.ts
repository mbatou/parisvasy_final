import { cookies } from "next/headers";
import { createAdminClient } from "@/lib/supabase/admin";
import { getUserStaffAssignments } from "@/lib/auth";
import type { UserRole } from "@/types";

/**
 * Get the effective hotel ID for the current user context.
 * - Super admins: returns selected hotel from cookie, or null for "all hotels"
 * - Other roles: returns their assigned hotel ID
 */
export async function getEffectiveHotelId(userId: string): Promise<{
  role: UserRole;
  hotelId: string | null;
  assignedHotelId: string;
}> {
  const assignments = await getUserStaffAssignments(userId);
  if (assignments.length === 0) {
    throw new Error("No staff assignments found");
  }

  const role = assignments[0].role as UserRole;
  const assignedHotelId = assignments[0].hotelId;

  if (role === "super_admin") {
    const cookieStore = await cookies();
    const selected = cookieStore.get("pv_selected_hotel")?.value;
    const hotelId = selected && selected !== "all" ? selected : null;
    return { role, hotelId, assignedHotelId };
  }

  return { role, hotelId: assignedHotelId, assignedHotelId };
}

/**
 * Build a Supabase query filter for hotel scoping.
 * Returns the hotelId to filter by, or null for all hotels.
 */
export async function getHotelsForUser(userId: string): Promise<{ id: string; name: string }[]> {
  const assignments = await getUserStaffAssignments(userId);
  if (assignments.length === 0) return [];

  const role = assignments[0].role as UserRole;

  if (role === "super_admin") {
    const db = createAdminClient();
    const { data } = await db
      .from("Hotel")
      .select("id, name")
      .order("name", { ascending: true });
    return data ?? [];
  }

  const hotel = assignments[0].hotel;
  return hotel ? [{ id: hotel.id, name: hotel.name }] : [];
}
