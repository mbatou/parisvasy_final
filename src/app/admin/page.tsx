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
import { STATUS_COLORS, STATUS_LABELS } from "@/types";
import type { UserRole } from "@/types";
import { cn } from "@/lib/utils";

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

  const assignments = await getUserStaffAssignments(user.id);
  if (assignments.length === 0) return null;

  const role = assignments[0].role as UserRole;
  const hotelId = params.hotel ?? assignments[0].hotelId;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59);

  // Fetch stats in parallel
  const [todayCheckIns, todayCheckOuts, activeBookings, monthlyRevenue, totalRooms, occupiedRooms] =
    await Promise.all([
      prisma.booking.count({
        where: {
          hotelId,
          checkIn: { gte: today, lt: tomorrow },
          status: { in: ["confirmed", "checked_in"] },
        },
      }),
      prisma.booking.count({
        where: {
          hotelId,
          checkOut: { gte: today, lt: tomorrow },
          status: { in: ["checked_in", "checked_out"] },
        },
      }),
      prisma.booking.count({
        where: {
          hotelId,
          status: { in: ["confirmed", "checked_in"] },
        },
      }),
      prisma.booking.aggregate({
        where: {
          hotelId,
          createdAt: { gte: monthStart, lte: monthEnd },
          status: { notIn: ["cancelled"] },
        },
        _sum: { roomTotal: true },
      }),
      prisma.room.aggregate({
        where: { hotelId, isActive: true },
        _sum: { totalRooms: true },
      }),
      prisma.booking.count({
        where: {
          hotelId,
          status: "checked_in",
          checkIn: { lte: today },
          checkOut: { gte: today },
        },
      }),
    ]);

  const revenue = Number(monthlyRevenue._sum.roomTotal ?? 0);
  const roomCount = totalRooms._sum.totalRooms ?? 0;
  const occupancyRate = roomCount > 0 ? Math.round((occupiedRooms / roomCount) * 100) : 0;

  const stats = [
    { label: "Today's Check-ins", value: todayCheckIns, icon: LogIn },
    { label: "Today's Check-outs", value: todayCheckOuts, icon: LogOut },
    { label: "Active Bookings", value: activeBookings, icon: CalendarCheck },
    { label: "Monthly Revenue", value: formatCurrency(revenue), icon: DollarSign },
    { label: "Occupancy Rate", value: `${occupancyRate}%`, icon: BarChart3 },
  ];

  // Recent bookings
  const recentBookings = await prisma.booking.findMany({
    where: { hotelId },
    include: {
      guest: { select: { firstName: true, lastName: true } },
      room: { select: { name: true } },
      experience: { select: { title: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  return (
    <div className="space-y-8">
      {/* Page title */}
      <div>
        <h1 className="text-2xl font-bold text-navy-500 font-serif">Dashboard</h1>
        <p className="mt-1 text-sm text-navy-300 font-sans">
          Overview of today&apos;s operations and recent activity.
        </p>
      </div>

      {/* Stats */}
      <StatsCards stats={stats} />

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Link
          href="/admin/bookings"
          className="flex items-center gap-3 rounded-xl border border-navy-50 bg-white p-4 shadow-sm hover:border-vermillion-200 transition-colors"
        >
          <CalendarCheck className="h-5 w-5 text-vermillion-500" />
          <span className="text-sm font-semibold text-navy-500 font-sans">
            All Bookings
          </span>
        </Link>
        <Link
          href="/admin/experiences/new"
          className="flex items-center gap-3 rounded-xl border border-navy-50 bg-white p-4 shadow-sm hover:border-vermillion-200 transition-colors"
        >
          <Plus className="h-5 w-5 text-vermillion-500" />
          <span className="text-sm font-semibold text-navy-500 font-sans">
            New Experience
          </span>
        </Link>
        <Link
          href="/admin/rooms/new"
          className="flex items-center gap-3 rounded-xl border border-navy-50 bg-white p-4 shadow-sm hover:border-vermillion-200 transition-colors"
        >
          <Plus className="h-5 w-5 text-vermillion-500" />
          <span className="text-sm font-semibold text-navy-500 font-sans">
            New Room
          </span>
        </Link>
        <Link
          href="/admin/finance"
          className="flex items-center gap-3 rounded-xl border border-navy-50 bg-white p-4 shadow-sm hover:border-vermillion-200 transition-colors"
        >
          <BarChart3 className="h-5 w-5 text-vermillion-500" />
          <span className="text-sm font-semibold text-navy-500 font-sans">
            Finance
          </span>
        </Link>
      </div>

      {/* Recent bookings */}
      <div className="rounded-xl border border-navy-50 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-navy-50 px-6 py-4">
          <h2 className="text-lg font-bold text-navy-500 font-serif">
            Recent Bookings
          </h2>
          <Link
            href="/admin/bookings"
            className="inline-flex items-center gap-1 text-sm font-semibold text-vermillion-500 hover:text-vermillion-600 transition-colors font-sans"
          >
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm font-sans">
            <thead>
              <tr className="border-b border-navy-50 text-left">
                <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-navy-300">
                  Ref
                </th>
                <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-navy-300">
                  Guest
                </th>
                <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-navy-300">
                  Experience
                </th>
                <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-navy-300">
                  Room
                </th>
                <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-navy-300">
                  Check-in
                </th>
                <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-navy-300">
                  Total
                </th>
                <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-navy-300">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-50">
              {recentBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-cream-50 transition-colors">
                  <td className="px-6 py-3">
                    <Link
                      href={`/admin/bookings/${booking.id}`}
                      className="font-mono text-xs text-vermillion-500 hover:underline"
                    >
                      {booking.reference}
                    </Link>
                  </td>
                  <td className="px-6 py-3 text-navy-500">
                    {booking.guest
                      ? `${booking.guest.firstName} ${booking.guest.lastName}`
                      : "\u2014"}
                  </td>
                  <td className="px-6 py-3 text-navy-400">
                    {booking.experience?.title ?? "\u2014"}
                  </td>
                  <td className="px-6 py-3 text-navy-400">
                    {booking.room?.name ?? "\u2014"}
                  </td>
                  <td className="px-6 py-3 text-navy-400">
                    {formatDate(booking.checkIn)}
                  </td>
                  <td className="px-6 py-3 font-medium text-navy-500">
                    {formatCurrency(Number(booking.roomTotal))}
                  </td>
                  <td className="px-6 py-3">
                    <span
                      className={cn(
                        "inline-block rounded-full px-2 py-0.5 text-xs font-semibold",
                        STATUS_COLORS[booking.status]
                      )}
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
                    className="px-6 py-8 text-center text-navy-300"
                  >
                    No bookings yet.
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
