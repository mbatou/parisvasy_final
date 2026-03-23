"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/admin/Sidebar";
import { TopBar } from "@/components/admin/TopBar";
import type { UserRole } from "@/types";

interface AdminShellProps {
  userRole: UserRole;
  currentHotelId: string;
  hotels: { id: string; name: string }[];
  topBarUser: {
    firstName: string;
    lastName: string;
    email: string;
  };
  children: React.ReactNode;
}

export function AdminShell({
  userRole,
  currentHotelId,
  hotels,
  topBarUser,
  children,
}: AdminShellProps) {
  const router = useRouter();

  const handleHotelChange = useCallback(
    (hotelId: string) => {
      document.cookie = `pv_selected_hotel=${hotelId};path=/;max-age=${60 * 60 * 24 * 365}`;
      router.refresh();
    },
    [router]
  );

  return (
    <div className="min-h-screen bg-pv-black-90">
      <Sidebar
        userRole={userRole}
        currentHotelId={currentHotelId}
        hotels={hotels}
        onHotelChange={handleHotelChange}
      />
      <div className="lg:ml-64">
        <TopBar
          user={topBarUser}
          role={userRole}
          breadcrumbs={[{ label: "Admin", href: "/admin" }]}
        />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
