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
            "rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
            mode === "bar"
              ? "bg-vermillion-500 text-white"
              : "bg-cream-100 text-navy-400 hover:bg-cream-200"
          )}
        >
          Bar Chart
        </button>
        <button
          type="button"
          onClick={() => setMode("line")}
          className={cn(
            "rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
            mode === "line"
              ? "bg-vermillion-500 text-white"
              : "bg-cream-100 text-navy-400 hover:bg-cream-200"
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
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 12, fill: "#6b7280" }}
              />
              <YAxis
                yAxisId="revenue"
                tickFormatter={formatRevenue}
                tick={{ fontSize: 12, fill: "#6b7280" }}
              />
              <YAxis
                yAxisId="bookings"
                orientation="right"
                tick={{ fontSize: 12, fill: "#6b7280" }}
              />
              <Tooltip
                formatter={(value: unknown, name: unknown) =>
                  name === "revenue"
                    ? [formatRevenue(Number(value)), "Revenue"]
                    : [Number(value), "Bookings"]
                }
                contentStyle={{
                  borderRadius: "8px",
                  border: "1px solid #e5e7eb",
                  fontSize: "12px",
                }}
              />
              <Legend />
              <Bar
                yAxisId="revenue"
                dataKey="revenue"
                fill="#e74c3c"
                radius={[4, 4, 0, 0]}
                name="Revenue"
              />
              <Bar
                yAxisId="bookings"
                dataKey="bookings"
                fill="#1a2332"
                radius={[4, 4, 0, 0]}
                name="Bookings"
              />
            </BarChart>
          ) : (
            <LineChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 12, fill: "#6b7280" }}
              />
              <YAxis
                yAxisId="revenue"
                tickFormatter={formatRevenue}
                tick={{ fontSize: 12, fill: "#6b7280" }}
              />
              <YAxis
                yAxisId="bookings"
                orientation="right"
                tick={{ fontSize: 12, fill: "#6b7280" }}
              />
              <Tooltip
                formatter={(value: unknown, name: unknown) =>
                  name === "revenue"
                    ? [formatRevenue(Number(value)), "Revenue"]
                    : [Number(value), "Bookings"]
                }
                contentStyle={{
                  borderRadius: "8px",
                  border: "1px solid #e5e7eb",
                  fontSize: "12px",
                }}
              />
              <Legend />
              <Line
                yAxisId="revenue"
                type="monotone"
                dataKey="revenue"
                stroke="#e74c3c"
                strokeWidth={2}
                dot={{ r: 4 }}
                name="Revenue"
              />
              <Line
                yAxisId="bookings"
                type="monotone"
                dataKey="bookings"
                stroke="#1a2332"
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
