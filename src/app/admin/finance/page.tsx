export const dynamic = "force-dynamic";

import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getUserStaffAssignments } from "@/lib/auth";
import { formatCurrency, formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { StatsCards } from "@/components/admin/StatsCards";
import { RevenueChart } from "@/components/admin/RevenueChart";
import { Badge } from "@/components/ui/Badge";
import { STATUS_COLORS, STATUS_LABELS } from "@/types";
import type { UserRole, BookingStatus } from "@/types";
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

  const db = createAdminClient();

  // Fetch all non-cancelled bookings for this hotel from the start of the year
  // to avoid 12+ separate queries for the chart
  const twelveMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 11, 1);
  const { data: allBookings } = await db
    .from('Booking')
    .select('roomTotal, createdAt, status')
    .eq('hotelId', hotelId)
    .gte('createdAt', twelveMonthsAgo.toISOString())
    .not('status', 'eq', 'cancelled');

  const bookings = allBookings ?? [];

  // Compute stats from the fetched data
  const thisMonthBookings = bookings.filter(
    (b) => new Date(b.createdAt) >= thisMonthStart && new Date(b.createdAt) <= thisMonthEnd
  );
  const lastMonthBookings = bookings.filter(
    (b) => new Date(b.createdAt) >= lastMonthStart && new Date(b.createdAt) <= lastMonthEnd
  );
  const ytdBookings = bookings.filter(
    (b) => new Date(b.createdAt) >= yearStart
  );

  const thisMonth = thisMonthBookings.reduce((sum, b) => sum + Number(b.roomTotal ?? 0), 0);
  const lastMonth = lastMonthBookings.reduce((sum, b) => sum + Number(b.roomTotal ?? 0), 0);
  const ytd = ytdBookings.reduce((sum, b) => sum + Number(b.roomTotal ?? 0), 0);
  const totalBookingsCount = ytdBookings.length;
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

    const monthBookings = bookings.filter((b) => {
      const d = new Date(b.createdAt);
      return d >= mStart && d <= mEnd;
    });

    monthlyData.push({
      month: monthLabel,
      revenue: monthBookings.reduce((sum, b) => sum + Number(b.roomTotal ?? 0), 0),
      bookings: monthBookings.length,
    });
  }

  // Recent financial bookings
  const { data: financialBookingsData } = await db
    .from('Booking')
    .select('*, guest:Guest(firstName, lastName), room:Room(name), experience:Experience(title)')
    .eq('hotelId', hotelId)
    .not('status', 'eq', 'cancelled')
    .order('createdAt', { ascending: false })
    .limit(25);

  const financialBookings = financialBookingsData ?? [];

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-light text-white font-serif">
            Finance
          </h1>
          <p className="mt-1 text-sm text-white/40 font-sans">
            Revenue overview and financial reporting.
          </p>
        </div>
        <FinanceExportButton hotelId={hotelId} />
      </div>

      {/* Stats */}
      <StatsCards stats={stats} />

      {/* Revenue Chart */}
      <div className="border border-white/[0.06] bg-pv-black-80 p-6">
        <h2 className="mb-4 text-lg font-light text-white font-serif">
          Revenue Overview (12 Months)
        </h2>
        <RevenueChart data={monthlyData} />
      </div>

      {/* Bookings table */}
      <div className="border border-white/[0.06] bg-pv-black-80">
        <div className="border-b border-white/[0.06] px-6 py-4">
          <h2 className="text-lg font-light text-white font-serif">
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
                      className="font-mono text-xs text-gold hover:underline"
                    >
                      {booking.reference}
                    </Link>
                  </TableCell>
                  <TableCell className="text-white/80">
                    {booking.guest
                      ? `${booking.guest.firstName} ${booking.guest.lastName}`
                      : "---"}
                  </TableCell>
                  <TableCell className="text-white/80">
                    {booking.experience?.title ?? "---"}
                  </TableCell>
                  <TableCell className="text-white/80">
                    {booking.room?.name ?? "---"}
                  </TableCell>
                  <TableCell className="text-white/80">
                    {formatDate(booking.checkIn)}
                  </TableCell>
                  <TableCell className="text-white/80">
                    {booking.nights}
                  </TableCell>
                  <TableCell className="font-semibold text-white">
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
                        STATUS_COLORS[booking.status as BookingStatus]
                      )}
                    >
                      {STATUS_LABELS[booking.status as BookingStatus]}
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
