export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
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
  const assignments = await prisma.staffAssignment.findMany({
    where: { userId: user.id, isActive: true },
    include: { hotel: { select: { id: true, name: true } } },
    orderBy: { createdAt: "desc" },
  });

  if (assignments.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream-100">
        <div className="rounded-xl border border-navy-100 bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-navy-500 font-serif">
            Access Denied
          </h1>
          <p className="mt-2 text-sm text-navy-300 font-sans">
            You do not have permission to access the admin panel.
          </p>
          <p className="mt-1 text-xs text-navy-200 font-sans">
            Error 403 &mdash; No staff assignment found for your account.
          </p>
          <a
            href="/"
            className="mt-4 inline-block rounded-lg bg-vermillion-500 px-4 py-2 text-sm font-semibold text-white hover:bg-vermillion-600 transition-colors"
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
    hotels = await prisma.hotel.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    });
  }

  // Resolve current path from headers
  const headerList = await headers();
  const currentPath = headerList.get("x-pathname") ?? "/admin";

  // Guest record for display name (fallback to email)
  const guest = await prisma.guest.findFirst({
    where: { authUserId: user.id },
    select: { firstName: true, lastName: true },
  });

  const topBarUser = {
    firstName: guest?.firstName ?? user.email?.split("@")[0] ?? "Admin",
    lastName: guest?.lastName ?? "",
    email: user.email ?? "",
  };

  return (
    <div className="min-h-screen bg-cream-100">
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
