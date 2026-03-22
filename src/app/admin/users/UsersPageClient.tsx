"use client";

import { useRouter } from "next/navigation";
import { UserRoleManager } from "@/components/admin/UserRoleManager";
import type { UserRole } from "@/types";

interface StaffMember {
  id: string;
  userId: string;
  hotelId: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  hotel?: { id: string; name: string };
  email?: string;
  name?: string;
}

interface UsersPageClientProps {
  staff: StaffMember[];
  hotels: { id: string; name: string }[];
}

export function UsersPageClient({ staff, hotels }: UsersPageClientProps) {
  const router = useRouter();

  const handleInvite = async (data: {
    email: string;
    role: UserRole;
    hotelId: string;
  }) => {
    const res = await fetch("/api/users/invite", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      router.refresh();
    }
  };

  const handleDeactivate = async (staffId: string) => {
    const res = await fetch(`/api/users/staff/${staffId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: false }),
    });

    if (res.ok) {
      router.refresh();
    }
  };

  return (
    <UserRoleManager
      staff={staff}
      hotels={hotels}
      onInvite={handleInvite}
      onDeactivate={handleDeactivate}
    />
  );
}
