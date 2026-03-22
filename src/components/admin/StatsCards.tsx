import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, type LucideIcon } from "lucide-react";

interface Stat {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    label?: string;
  };
}

interface StatsCardsProps {
  stats: Stat[];
}

export function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
      {stats.map((stat) => {
        const Icon = stat.icon;
        const isPositive = stat.trend && stat.trend.value >= 0;

        return (
          <div
            key={stat.label}
            className="rounded-xl border border-navy-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cream-100">
                <Icon className="h-5 w-5 text-vermillion-500" />
              </div>
              {stat.trend && (
                <div
                  className={cn(
                    "flex items-center gap-0.5 text-xs font-medium",
                    isPositive ? "text-green-600" : "text-red-600"
                  )}
                >
                  {isPositive ? (
                    <TrendingUp className="h-3.5 w-3.5" />
                  ) : (
                    <TrendingDown className="h-3.5 w-3.5" />
                  )}
                  <span>{Math.abs(stat.trend.value)}%</span>
                </div>
              )}
            </div>
            <p className="mt-3 text-2xl font-bold text-navy-500">
              {stat.value}
            </p>
            <p className="mt-1 text-xs text-navy-300">{stat.label}</p>
            {stat.trend?.label && (
              <p className="mt-0.5 text-[10px] text-navy-200">
                {stat.trend.label}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
