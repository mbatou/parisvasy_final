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
  { label: "Experiences", href: "/admin/experiences", icon: Sparkles },
  { label: "Rooms", href: "/admin/rooms", icon: BedDouble },
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
        className="fixed left-4 top-4 z-50 rounded-lg bg-navy-500 p-2 text-white shadow-lg lg:hidden"
        onClick={() => setCollapsed(!collapsed)}
        aria-label={collapsed ? "Open menu" : "Close menu"}
      >
        {collapsed ? <Menu className="h-5 w-5" /> : <X className="h-5 w-5" />}
      </button>

      {/* Overlay for mobile */}
      {!collapsed && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setCollapsed(true)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 flex h-screen w-64 flex-col bg-navy-500 text-white transition-transform duration-300",
          collapsed ? "-translate-x-full lg:translate-x-0" : "translate-x-0"
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-center border-b border-navy-400 px-4">
          <span className="font-serif text-xl font-bold tracking-wide text-white">
            PARISVASY
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
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
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-vermillion-500 text-white"
                    : "text-navy-100 hover:bg-navy-400 hover:text-white"
                )}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Hotel selector - super_admin only */}
        {userRole === "super_admin" && hotels.length > 0 && (
          <div className="border-t border-navy-400 px-3 py-4">
            <div className="relative">
              <button
                type="button"
                onClick={() => setHotelOpen(!hotelOpen)}
                className="flex w-full items-center justify-between rounded-lg bg-navy-400 px-3 py-2.5 text-sm text-white transition-colors hover:bg-navy-300"
              >
                <span className="truncate">
                  {selectedHotel?.name || "Select hotel"}
                </span>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 flex-shrink-0 transition-transform",
                    hotelOpen && "rotate-180"
                  )}
                />
              </button>
              {hotelOpen && (
                <div className="absolute bottom-full left-0 mb-1 w-full rounded-lg border border-navy-300 bg-navy-400 py-1 shadow-lg">
                  {hotels.map((hotel) => (
                    <Link
                      key={hotel.id}
                      href={`/admin?hotel=${hotel.id}`}
                      onClick={() => {
                        setHotelOpen(false);
                        setCollapsed(true);
                      }}
                      className={cn(
                        "block truncate px-3 py-2 text-sm transition-colors",
                        hotel.id === currentHotelId
                          ? "bg-vermillion-500 text-white"
                          : "text-navy-100 hover:bg-navy-300 hover:text-white"
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
