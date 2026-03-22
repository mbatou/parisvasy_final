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
            className="border border-white/[0.06] bg-pv-black-80 p-5 transition-all hover:border-gold/15"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center bg-gold/10 border border-gold/20">
                <Icon className="h-5 w-5 text-gold" />
              </div>
              {stat.trend && (
                <div
                  className={cn(
                    "flex items-center gap-0.5 text-xs font-medium",
                    isPositive ? "text-green-400" : "text-red-400"
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
            <p className="mt-4 font-serif text-2xl text-white font-light">
              {stat.value}
            </p>
            <p className="mt-1 text-[10px] uppercase tracking-luxury text-white/30">
              {stat.label}
            </p>
            {stat.trend?.label && (
              <p className="mt-0.5 text-[10px] text-white/20">
                {stat.trend.label}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
