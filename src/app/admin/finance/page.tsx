export const dynamic = "force-dynamic";

import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { getUserStaffAssignments } from "@/lib/auth";
import { formatCurrency, formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { StatsCards } from "@/components/admin/StatsCards";
import { RevenueChart } from "@/components/admin/RevenueChart";
import { Badge } from "@/components/ui/Badge";
import { STATUS_COLORS, STATUS_LABELS } from "@/types";
import type { UserRole } from "@/types";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/Table";
import { DollarSign, TrendingUp, CalendarCheck, Download } from "lucide-react";
import { FinanceExportButton } from "./FinanceExportButton";

export default async function FinancePage({
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

  const hotelId = params.hotel ?? assignments[0].hotelId;

  const now = new Date();
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const thisMonthEnd = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    0,
    23,
    59,
    59
  );
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonthEnd = new Date(
    now.getFullYear(),
    now.getMonth(),
    0,
    23,
    59,
    59
  );
  const yearStart = new Date(now.getFullYear(), 0, 1);

  // Fetch stats in parallel
  const [thisMonthRev, lastMonthRev, ytdRev, totalBookingsCount] =
    await Promise.all([
      prisma.booking.aggregate({
        where: {
          hotelId,
          createdAt: { gte: thisMonthStart, lte: thisMonthEnd },
          status: { notIn: ["cancelled"] },
        },
        _sum: { roomTotal: true },
      }),
      prisma.booking.aggregate({
        where: {
          hotelId,
          createdAt: { gte: lastMonthStart, lte: lastMonthEnd },
          status: { notIn: ["cancelled"] },
        },
        _sum: { roomTotal: true },
      }),
      prisma.booking.aggregate({
        where: {
          hotelId,
          createdAt: { gte: yearStart },
          status: { notIn: ["cancelled"] },
        },
        _sum: { roomTotal: true },
        _count: true,
      }),
      prisma.booking.count({
        where: {
          hotelId,
          createdAt: { gte: yearStart },
          status: { notIn: ["cancelled"] },
        },
      }),
    ]);

  const thisMonth = Number(thisMonthRev._sum.roomTotal ?? 0);
  const lastMonth = Number(lastMonthRev._sum.roomTotal ?? 0);
  const ytd = Number(ytdRev._sum.roomTotal ?? 0);
  const avgBookingValue =
    totalBookingsCount > 0 ? ytd / totalBookingsCount : 0;
  const monthGrowth =
    lastMonth > 0 ? Math.round(((thisMonth - lastMonth) / lastMonth) * 100) : 0;

  const stats = [
    {
      label: "This Month",
      value: formatCurrency(thisMonth),
      icon: DollarSign,
      trend: { value: monthGrowth, label: "vs last month" },
    },
    {
      label: "Last Month",
      value: formatCurrency(lastMonth),
      icon: DollarSign,
    },
    {
      label: "Year to Date",
      value: formatCurrency(ytd),
      icon: TrendingUp,
    },
    {
      label: "Avg Booking Value",
      value: formatCurrency(avgBookingValue),
      icon: CalendarCheck,
    },
  ];

  // Monthly revenue data for chart (last 12 months)
  const monthlyData = [];
  for (let i = 11; i >= 0; i--) {
    const mStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const mEnd = new Date(
      now.getFullYear(),
      now.getMonth() - i + 1,
      0,
      23,
      59,
      59
    );
    const monthLabel = mStart.toLocaleString("en-US", {
      month: "short",
      year: "2-digit",
    });

    const mRev = await prisma.booking.aggregate({
      where: {
        hotelId,
        createdAt: { gte: mStart, lte: mEnd },
        status: { notIn: ["cancelled"] },
      },
      _sum: { roomTotal: true },
      _count: true,
    });

    monthlyData.push({
      month: monthLabel,
      revenue: Number(mRev._sum.roomTotal ?? 0),
      bookings: mRev._count,
    });
  }

  // Recent financial bookings
  const financialBookings = await prisma.booking.findMany({
    where: {
      hotelId,
      status: { notIn: ["cancelled"] },
    },
    include: {
      guest: { select: { firstName: true, lastName: true } },
      room: { select: { name: true } },
      experience: { select: { title: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 25,
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy-500 font-serif">
            Finance
          </h1>
          <p className="mt-1 text-sm text-navy-300 font-sans">
            Revenue overview and financial reporting.
          </p>
        </div>
        <FinanceExportButton hotelId={hotelId} />
      </div>

      {/* Stats */}
      <StatsCards stats={stats} />

      {/* Revenue Chart */}
      <div className="rounded-xl border border-navy-100 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-bold text-navy-500 font-serif">
          Revenue Overview (12 Months)
        </h2>
        <RevenueChart data={monthlyData} />
      </div>

      {/* Bookings table */}
      <div className="rounded-xl border border-navy-100 bg-white shadow-sm">
        <div className="border-b border-navy-100 px-6 py-4">
          <h2 className="text-lg font-bold text-navy-500 font-serif">
            Recent Transactions
          </h2>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Reference</TableHead>
                <TableHead>Guest</TableHead>
                <TableHead>Experience</TableHead>
                <TableHead>Room</TableHead>
                <TableHead>Check-in</TableHead>
                <TableHead>Nights</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Warranty</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {financialBookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell>
                    <Link
                      href={`/admin/bookings/${booking.id}`}
                      className="font-mono text-xs text-vermillion-500 hover:underline"
                    >
                      {booking.reference}
                    </Link>
                  </TableCell>
                  <TableCell className="text-navy-400">
                    {booking.guest
                      ? `${booking.guest.firstName} ${booking.guest.lastName}`
                      : "---"}
                  </TableCell>
                  <TableCell className="text-navy-400">
                    {booking.experience?.title ?? "---"}
                  </TableCell>
                  <TableCell className="text-navy-400">
                    {booking.room?.name ?? "---"}
                  </TableCell>
                  <TableCell className="text-navy-400">
                    {formatDate(booking.checkIn)}
                  </TableCell>
                  <TableCell className="text-navy-400">
                    {booking.nights}
                  </TableCell>
                  <TableCell className="font-semibold text-navy-500">
                    {formatCurrency(Number(booking.roomTotal))}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={booking.warrantyCollected ? "green" : "yellow"}
                    >
                      {booking.warrantyCollected ? "Collected" : "Pending"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
                        STATUS_COLORS[booking.status]
                      )}
                    >
                      {STATUS_LABELS[booking.status]}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
