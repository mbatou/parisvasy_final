"use client";

import { useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  CalendarCheck,
  Sparkles,
  BedDouble,
  Users,
  BarChart3,
  Building2,
  UserCog,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { UserRole, Hotel } from "@/types";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  roles?: UserRole[];
}

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Bookings", href: "/admin/bookings", icon: CalendarCheck },
  { label: "Experiences", href: "/admin/experiences", icon: Sparkles, roles: ["hotel_manager", "super_admin"] },
  { label: "Rooms", href: "/admin/rooms", icon: BedDouble, roles: ["hotel_manager", "super_admin"] },
  { label: "Guests", href: "/admin/guests", icon: Users },
  {
    label: "Finance",
    href: "/admin/finance",
    icon: BarChart3,
    roles: ["finance_manager", "hotel_manager", "super_admin"],
  },
  {
    label: "Hotels",
    href: "/admin/hotels",
    icon: Building2,
    roles: ["super_admin"],
  },
  {
    label: "Users",
    href: "/admin/users",
    icon: UserCog,
    roles: ["super_admin"],
  },
];

interface SidebarProps {
  userRole: UserRole;
  currentHotelId: string;
  hotels: Pick<Hotel, "id" | "name">[];
  currentPath: string;
}

export function Sidebar({
  userRole,
  currentHotelId,
  hotels,
  currentPath,
}: SidebarProps) {
  const [collapsed, setCollapsed] = useState(true);
  const [hotelOpen, setHotelOpen] = useState(false);

  const visibleItems = NAV_ITEMS.filter(
    (item) => !item.roles || item.roles.includes(userRole)
  );

  const selectedHotel = hotels.find((h) => h.id === currentHotelId);

  return (
    <>
      {/* Mobile hamburger toggle */}
      <button
        type="button"
        className="fixed left-4 top-4 z-50 bg-pv-black-80 border border-white/[0.06] p-2 text-white shadow-lg lg:hidden"
        onClick={() => setCollapsed(!collapsed)}
        aria-label={collapsed ? "Open menu" : "Close menu"}
      >
        {collapsed ? <Menu className="h-5 w-5" /> : <X className="h-5 w-5" />}
      </button>

      {/* Overlay for mobile */}
      {!collapsed && (
        <div
          className="fixed inset-0 z-30 bg-black/60 lg:hidden"
          onClick={() => setCollapsed(true)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 flex h-screen w-64 flex-col bg-pv-black border-r border-white/[0.06] text-white transition-transform duration-300",
          collapsed ? "-translate-x-full lg:translate-x-0" : "translate-x-0"
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-center border-b border-white/[0.06] px-4">
          <Link
            href="/admin"
            className="font-sans text-[13px] font-semibold tracking-[4px] text-gold"
          >
            PARISVASY
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-5">
          {visibleItems.map((item) => {
            const isActive =
              currentPath === item.href ||
              (item.href !== "/admin" && currentPath.startsWith(item.href));
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setCollapsed(true)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 text-[11px] uppercase tracking-wide font-medium transition-all",
                  isActive
                    ? "bg-gold/10 text-gold border-l-2 border-gold"
                    : "text-white/40 hover:bg-white/[0.04] hover:text-white/70 border-l-2 border-transparent"
                )}
              >
                <Icon className="h-4 w-4 flex-shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Hotel selector - super_admin only */}
        {userRole === "super_admin" && hotels.length > 0 && (
          <div className="border-t border-white/[0.06] px-3 py-4">
            <div className="relative">
              <button
                type="button"
                onClick={() => setHotelOpen(!hotelOpen)}
                className="flex w-full items-center justify-between bg-pv-black-80 border border-white/[0.06] px-3 py-2.5 text-[11px] uppercase tracking-wide text-white/60 transition-colors hover:border-gold/20"
              >
                <span className="truncate">
                  {selectedHotel?.name || "Select hotel"}
                </span>
                <ChevronDown
                  className={cn(
                    "h-3.5 w-3.5 flex-shrink-0 transition-transform",
                    hotelOpen && "rotate-180"
                  )}
                />
              </button>
              {hotelOpen && (
                <div className="absolute bottom-full left-0 mb-1 w-full bg-pv-black-80 border border-white/[0.06] py-1 shadow-lg">
                  {hotels.map((hotel) => (
                    <Link
                      key={hotel.id}
                      href={`/admin?hotel=${hotel.id}`}
                      onClick={() => {
                        setHotelOpen(false);
                        setCollapsed(true);
                      }}
                      className={cn(
                        "block truncate px-3 py-2 text-sm transition-colors font-light",
                        hotel.id === currentHotelId
                          ? "bg-gold/10 text-gold"
                          : "text-white/50 hover:bg-white/[0.04] hover:text-white"
                      )}
                    >
                      {hotel.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
