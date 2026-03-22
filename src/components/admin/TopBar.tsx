"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, Bell, LogOut, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { getInitials } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Badge } from "@/components/ui/Badge";

interface Breadcrumb {
  label: string;
  href?: string;
}

interface TopBarProps {
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
  role: string;
  breadcrumbs: Breadcrumb[];
}

export function TopBar({ user, role, breadcrumbs }: TopBarProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  };

  const initials = getInitials(user.firstName, user.lastName);

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-navy-100 bg-white px-6">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-sm" aria-label="Breadcrumb">
        {breadcrumbs.map((crumb, i) => (
          <span key={i} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight className="h-3.5 w-3.5 text-navy-200" />}
            {crumb.href ? (
              <Link
                href={crumb.href}
                className="text-navy-300 transition-colors hover:text-navy-500"
              >
                {crumb.label}
              </Link>
            ) : (
              <span className="font-medium text-navy-500">{crumb.label}</span>
            )}
          </span>
        ))}
      </nav>

      {/* Right section */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-200" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9 w-56 rounded-lg border border-navy-100 bg-cream-50 pl-9 pr-3 text-sm text-navy-500 placeholder:text-navy-200 transition-colors focus:border-vermillion-500 focus:outline-none focus:ring-2 focus:ring-vermillion-300"
          />
        </div>

        {/* Notifications */}
        <button
          type="button"
          className="relative rounded-lg p-2 text-navy-300 transition-colors hover:bg-cream-100 hover:text-navy-500"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
        </button>

        {/* User */}
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-vermillion-500 text-xs font-bold text-white">
            {initials}
          </div>
          <div className="hidden flex-col md:flex">
            <span className="text-sm font-medium text-navy-500">
              {user.firstName} {user.lastName}
            </span>
            <Badge variant="navy" className="mt-0.5 w-fit text-[10px]">
              {role.replace("_", " ")}
            </Badge>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="rounded-lg p-2 text-navy-300 transition-colors hover:bg-red-50 hover:text-red-600"
            aria-label="Logout"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
