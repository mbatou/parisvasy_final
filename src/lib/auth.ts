import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { UserRole } from "@/types";

export async function getCurrentUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function getUserRole(
  userId: string,
  hotelId?: string
): Promise<UserRole | null> {
  const supabase = createAdminClient();

  let query = supabase
    .from("StaffAssignment")
    .select("*")
    .eq("userId", userId)
    .eq("isActive", true)
    .order("createdAt", { ascending: false })
    .limit(1);

  if (hotelId) {
    query = query.eq("hotelId", hotelId);
  }

  const { data: assignment } = await query.single();

  return (assignment?.role as UserRole) ?? null;
}

export async function getUserStaffAssignments(userId: string) {
  const supabase = createAdminClient();

  const { data: assignments, error } = await supabase
    .from("StaffAssignment")
    .select("*, hotel:Hotel(*)")
    .eq("userId", userId)
    .eq("isActive", true);

  if (error) throw error;
  return assignments;
}

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Unauthorized");
  }
  return user;
}

export async function requireRole(
  roles: UserRole[],
  hotelId?: string
) {
  const user = await requireAuth();
  const role = await getUserRole(user.id, hotelId);

  if (!role || !roles.includes(role)) {
    throw new Error("Forbidden");
  }

  return { user, role };
}

export function canAccess(userRole: UserRole, feature: string): boolean {
  const permissions: Record<string, UserRole[]> = {
    manage_hotels: ["super_admin"],
    manage_staff: ["super_admin"],
    manage_rooms: ["super_admin", "hotel_manager"],
    manage_experiences: ["super_admin", "hotel_manager"],
    upload_images: ["super_admin", "hotel_manager"],
    create_flash_deals: ["super_admin", "hotel_manager"],
    view_bookings: ["super_admin", "hotel_manager", "finance_manager", "front_desk"],
    check_in_out: ["super_admin", "hotel_manager", "front_desk"],
    view_guests: ["super_admin", "hotel_manager", "front_desk"],
    view_finance: ["super_admin", "hotel_manager", "finance_manager"],
    export_finance: ["super_admin", "finance_manager"],
  };

  return permissions[feature]?.includes(userRole) ?? false;
}
