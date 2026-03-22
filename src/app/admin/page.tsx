export const dynamic = "force-dynamic";

import Link from "next/link";
import {
  CalendarCheck,
  LogIn,
  LogOut,
  DollarSign,
  BarChart3,
  Plus,
  ArrowRight,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { getUserStaffAssignments } from "@/lib/auth";
import { formatCurrency, formatDate } from "@/lib/utils";
import { StatsCards } from "@/components/admin/StatsCards";
import { STATUS_LABELS } from "@/types";
import type { UserRole, BookingStatus } from "@/types";

const STATUS_BADGE_COLORS: Record<BookingStatus, string> = {
  pending: "bg-yellow-500/15 text-yellow-400",
  confirmed: "bg-blue-500/15 text-blue-400",
  checked_in: "bg-green-500/15 text-green-400",
  checked_out: "bg-white/10 text-white/50",
  cancelled: "bg-red-500/15 text-red-400",
  no_show: "bg-red-500/15 text-red-400",
};

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ hotel?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  let assignments: Array<{ role: string; hotelId: string }> = [];
  try {
    assignments = await getUserStaffAssignments(user.id);
  } catch {
    // Tables may not exist
  }
  if (assignments.length === 0) return null;

  const role = assignments[0].role as UserRole;
  const hotelId = params.hotel ?? assignments[0].hotelId;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59);

  let todayCheckIns = 0, todayCheckOuts = 0, activeBookings = 0, revenue = 0, roomCount = 0, occupiedRooms = 0;
  let recentBookings: Array<{
    id: string;
    reference: string;
    checkIn: Date;
    roomTotal: unknown;
    status: BookingStatus;
    guest: { firstName: string; lastName: string } | null;
    room: { name: string } | null;
    experience: { title: string } | null;
  }> = [];

  try {
    const [ci, co, ab, mr, tr, or] = await Promise.all([
      prisma.booking.count({
        where: { hotelId, checkIn: { gte: today, lt: tomorrow }, status: { in: ["confirmed", "checked_in"] } },
      }),
      prisma.booking.count({
        where: { hotelId, checkOut: { gte: today, lt: tomorrow }, status: { in: ["checked_in", "checked_out"] } },
      }),
      prisma.booking.count({
        where: { hotelId, status: { in: ["confirmed", "checked_in"] } },
      }),
      prisma.booking.aggregate({
        where: { hotelId, createdAt: { gte: monthStart, lte: monthEnd }, status: { notIn: ["cancelled"] } },
        _sum: { roomTotal: true },
      }),
      prisma.room.aggregate({
        where: { hotelId, isActive: true },
        _sum: { totalRooms: true },
      }),
      prisma.booking.count({
        where: { hotelId, status: "checked_in", checkIn: { lte: today }, checkOut: { gte: today } },
      }),
    ]);
    todayCheckIns = ci;
    todayCheckOuts = co;
    activeBookings = ab;
    revenue = Number(mr._sum.roomTotal ?? 0);
    roomCount = tr._sum.totalRooms ?? 0;
    occupiedRooms = or;

    recentBookings = await prisma.booking.findMany({
      where: { hotelId },
      include: {
        guest: { select: { firstName: true, lastName: true } },
        room: { select: { name: true } },
        experience: { select: { title: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 10,
    });
  } catch {
    // Tables may not exist yet
  }

  const occupancyRate = roomCount > 0 ? Math.round((occupiedRooms / roomCount) * 100) : 0;

  const stats = [
    { label: "Today's Check-ins", value: todayCheckIns, icon: LogIn },
    { label: "Today's Check-outs", value: todayCheckOuts, icon: LogOut },
    { label: "Active Bookings", value: activeBookings, icon: CalendarCheck },
    { label: "Monthly Revenue", value: formatCurrency(revenue), icon: DollarSign },
    { label: "Occupancy Rate", value: `${occupancyRate}%`, icon: BarChart3 },
  ];

  return (
    <div className="space-y-8">
      {/* Page title */}
      <div>
        <h1 className="font-serif text-2xl text-white font-light">Dashboard</h1>
        <p className="mt-1 text-sm text-white/40 font-light">
          Overview of today&apos;s operations and recent activity.
        </p>
      </div>

      {/* Stats */}
      <StatsCards stats={stats} />

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {[
          { href: "/admin/bookings", icon: CalendarCheck, label: "All Bookings" },
          { href: "/admin/experiences/new", icon: Plus, label: "New Experience" },
          { href: "/admin/rooms/new", icon: Plus, label: "New Room" },
          { href: "/admin/finance", icon: BarChart3, label: "Finance" },
        ].map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className="flex items-center gap-3 border border-white/[0.06] bg-pv-black-80 p-4 hover:border-gold/20 transition-all"
          >
            <action.icon className="h-5 w-5 text-gold" />
            <span className="text-[11px] uppercase tracking-wide font-medium text-white/70">
              {action.label}
            </span>
          </Link>
        ))}
      </div>

      {/* Recent bookings */}
      <div className="border border-white/[0.06] bg-pv-black-80">
        <div className="flex items-center justify-between border-b border-white/[0.06] px-6 py-4">
          <h2 className="font-serif text-lg text-white font-light">
            Recent Bookings
          </h2>
          <Link
            href="/admin/bookings"
            className="inline-flex items-center gap-1 text-[11px] uppercase tracking-wide text-gold hover:text-gold-light transition-colors"
          >
            View all <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.04] text-left">
                {["Ref", "Guest", "Experience", "Room", "Check-in", "Total", "Status"].map((h) => (
                  <th key={h} className="px-6 py-3 text-[10px] font-medium uppercase tracking-luxury text-gold/50">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {recentBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-3">
                    <Link
                      href={`/admin/bookings/${booking.id}`}
                      className="font-mono text-xs text-gold hover:text-gold-light"
                    >
                      {booking.reference}
                    </Link>
                  </td>
                  <td className="px-6 py-3 text-white/70 font-light">
                    {booking.guest
                      ? `${booking.guest.firstName} ${booking.guest.lastName}`
                      : "\u2014"}
                  </td>
                  <td className="px-6 py-3 text-white/50 font-light">
                    {booking.experience?.title ?? "\u2014"}
                  </td>
                  <td className="px-6 py-3 text-white/50 font-light">
                    {booking.room?.name ?? "\u2014"}
                  </td>
                  <td className="px-6 py-3 text-white/50 font-light">
                    {formatDate(booking.checkIn)}
                  </td>
                  <td className="px-6 py-3 text-gold font-light">
                    {formatCurrency(Number(booking.roomTotal))}
                  </td>
                  <td className="px-6 py-3">
                    <span
                      className={`inline-block px-2 py-0.5 text-[9px] uppercase tracking-wide font-medium ${STATUS_BADGE_COLORS[booking.status]}`}
                    >
                      {STATUS_LABELS[booking.status]}
                    </span>
                  </td>
                </tr>
              ))}
              {recentBookings.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-12 text-center text-white/30 font-light"
                  >
                    No bookings yet. Create your first experience to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
