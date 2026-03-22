export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { Sidebar } from "@/components/admin/Sidebar";
import { TopBar } from "@/components/admin/TopBar";
import type { UserRole } from "@/types";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Get all staff assignments for this user
  let assignments: Array<{
    role: string;
    hotelId: string;
    hotel: { id: string; name: string };
  }> = [];

  try {
    const db = createAdminClient();
    const { data } = await db
      .from('StaffAssignment')
      .select('role, hotelId, hotel:Hotel(id, name)')
      .eq('userId', user.id)
      .eq('isActive', true)
      .order('createdAt', { ascending: false });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    assignments = (data ?? []).map((d: any) => ({
      role: d.role,
      hotelId: d.hotelId,
      hotel: Array.isArray(d.hotel) ? d.hotel[0] : d.hotel,
    }));
  } catch {
    // Tables might not exist yet
  }

  if (assignments.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-pv-black">
        <div className="border border-white/[0.06] bg-pv-black-80 p-8 text-center max-w-md">
          <h1 className="text-2xl font-serif text-white font-light">
            Access Denied
          </h1>
          <p className="mt-3 text-sm text-white/40 font-light">
            You do not have permission to access the admin panel.
          </p>
          <p className="mt-1 text-xs text-white/20 font-light">
            Error 403 &mdash; No staff assignment found for your account.
          </p>
          <a
            href="/"
            className="mt-6 inline-block border border-gold px-6 py-2 text-[11px] uppercase tracking-wide text-gold font-medium hover:bg-gold hover:text-pv-black transition-all"
          >
            Return Home
          </a>
        </div>
      </div>
    );
  }

  const role = assignments[0].role as UserRole;
  const currentHotelId = assignments[0].hotelId;

  // For super_admin, get all hotels
  let hotels = assignments.map((a) => a.hotel);
  if (role === "super_admin") {
    try {
      const db = createAdminClient();
      const { data } = await db
        .from('Hotel')
        .select('id, name')
        .order('name', { ascending: true });

      hotels = data ?? hotels;
    } catch {
      // Tables might not exist yet
    }
  }

  // Resolve current path from headers
  const headerList = await headers();
  const currentPath = headerList.get("x-pathname") ?? "/admin";

  // Guest record for display name (fallback to email)
  let guest: { firstName: string; lastName: string } | null = null;
  try {
    const db = createAdminClient();
    const { data } = await db
      .from('Guest')
      .select('firstName, lastName')
      .eq('authUserId', user.id)
      .limit(1)
      .single();

    guest = data;
  } catch {
    // Tables might not exist yet
  }

  const topBarUser = {
    firstName: guest?.firstName ?? user.email?.split("@")[0] ?? "Admin",
    lastName: guest?.lastName ?? "",
    email: user.email ?? "",
  };

  return (
    <div className="min-h-screen bg-pv-black-90">
      <Sidebar
        userRole={role}
        currentHotelId={currentHotelId}
        hotels={hotels}
        currentPath={currentPath}
      />
      <div className="lg:ml-64">
        <TopBar
          user={topBarUser}
          role={role}
          breadcrumbs={[{ label: "Admin", href: "/admin" }]}
        />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
