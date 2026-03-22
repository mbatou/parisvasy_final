import type { UserRole } from "@/types";

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
