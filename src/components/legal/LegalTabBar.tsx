"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const TABS = [
  { label: "Terms of service", href: "/terms" },
  { label: "Privacy policy", href: "/privacy" },
  { label: "Cookie policy", href: "/cookies" },
];

export function LegalTabBar() {
  const pathname = usePathname();

  return (
    <div className="border-t border-white/[0.06]">
      <div className="mx-auto flex max-w-7xl gap-0 px-4 sm:px-6 lg:px-8">
        {TABS.map((tab) => {
          const isActive = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "relative px-5 py-3 text-[11px] uppercase tracking-wide transition-colors",
                isActive
                  ? "text-gold font-medium"
                  : "text-white/30 hover:text-white/60"
              )}
            >
              {tab.label}
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-gold" />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
