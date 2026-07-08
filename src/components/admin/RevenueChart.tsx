"use client";

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface RevenueDataPoint {
  month: string;
  revenue: number;
  bookings: number;
}

interface RevenueChartProps {
  data: RevenueDataPoint[];
}

type ChartMode = "bar" | "line";

export function RevenueChart({ data }: RevenueChartProps) {
  const [mode, setMode] = useState<ChartMode>("bar");

  const formatRevenue = (value: number) =>
    new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
      notation: "compact",
    }).format(value);

  return (
    <div className="space-y-4">
      {/* Toggle */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setMode("bar")}
          className={cn(
            "rounded px-3 py-1.5 text-xs font-light transition-colors",
            mode === "bar"
              ? "bg-gold text-pv-black"
              : "bg-white/[0.04] text-white/40 hover:bg-white/[0.08]"
          )}
        >
          Bar Chart
        </button>
        <button
          type="button"
          onClick={() => setMode("line")}
          className={cn(
            "rounded px-3 py-1.5 text-xs font-light transition-colors",
            mode === "line"
              ? "bg-gold text-pv-black"
              : "bg-white/[0.04] text-white/40 hover:bg-white/[0.08]"
          )}
        >
          Line Chart
        </button>
      </div>

      {/* Chart */}
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          {mode === "bar" ? (
            <BarChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 12, fill: "rgba(255,255,255,0.4)" }}
              />
              <YAxis
                yAxisId="revenue"
                tickFormatter={formatRevenue}
                tick={{ fontSize: 12, fill: "rgba(255,255,255,0.4)" }}
              />
              <YAxis
                yAxisId="bookings"
                orientation="right"
                tick={{ fontSize: 12, fill: "rgba(255,255,255,0.4)" }}
              />
              <Tooltip
                formatter={(value: unknown, name: unknown) =>
                  name === "revenue"
                    ? [formatRevenue(Number(value)), "Revenue"]
                    : [Number(value), "Bookings"]
                }
                contentStyle={{
                  borderRadius: "2px",
                  border: "1px solid rgba(255,255,255,0.06)",
                  backgroundColor: "#1a1a1a",
                  color: "rgba(255,255,255,0.8)",
                  fontSize: "12px",
                }}
              />
              <Legend />
              <Bar
                yAxisId="revenue"
                dataKey="revenue"
                fill="#c9a84c"
                radius={[4, 4, 0, 0]}
                name="Revenue"
              />
              <Bar
                yAxisId="bookings"
                dataKey="bookings"
                fill="rgba(255,255,255,0.2)"
                radius={[4, 4, 0, 0]}
                name="Bookings"
              />
            </BarChart>
          ) : (
            <LineChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 12, fill: "rgba(255,255,255,0.4)" }}
              />
              <YAxis
                yAxisId="revenue"
                tickFormatter={formatRevenue}
                tick={{ fontSize: 12, fill: "rgba(255,255,255,0.4)" }}
              />
              <YAxis
                yAxisId="bookings"
                orientation="right"
                tick={{ fontSize: 12, fill: "rgba(255,255,255,0.4)" }}
              />
              <Tooltip
                formatter={(value: unknown, name: unknown) =>
                  name === "revenue"
                    ? [formatRevenue(Number(value)), "Revenue"]
                    : [Number(value), "Bookings"]
                }
                contentStyle={{
                  borderRadius: "2px",
                  border: "1px solid rgba(255,255,255,0.06)",
                  backgroundColor: "#1a1a1a",
                  color: "rgba(255,255,255,0.8)",
                  fontSize: "12px",
                }}
              />
              <Legend />
              <Line
                yAxisId="revenue"
                type="monotone"
                dataKey="revenue"
                stroke="#c9a84c"
                strokeWidth={2}
                dot={{ r: 4 }}
                name="Revenue"
              />
              <Line
                yAxisId="bookings"
                type="monotone"
                dataKey="bookings"
                stroke="rgba(255,255,255,0.4)"
                strokeWidth={2}
                dot={{ r: 4 }}
                name="Bookings"
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
