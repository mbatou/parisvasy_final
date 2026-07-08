"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, Bell, LogOut, ChevronRight, ExternalLink } from "lucide-react";
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
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-white/[0.06] bg-pv-black-90 px-6">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-sm" aria-label="Breadcrumb">
        {breadcrumbs.map((crumb, i) => (
          <span key={i} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight className="h-3.5 w-3.5 text-white/20" />}
            {crumb.href ? (
              <Link
                href={crumb.href}
                className="text-white/40 transition-colors hover:text-gold"
              >
                {crumb.label}
              </Link>
            ) : (
              <span className="font-medium text-white/80">{crumb.label}</span>
            )}
          </span>
        ))}
      </nav>

      {/* Right section */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/20" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9 w-56 border border-white/[0.06] bg-pv-black-80 pl-9 pr-3 text-sm text-white/80 placeholder:text-white/20 transition-all focus:border-gold/30 focus:outline-none focus:ring-1 focus:ring-gold/30 font-light"
          />
        </div>

        {/* View site */}
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden items-center gap-1.5 border border-white/[0.08] px-3 py-1.5 text-[11px] uppercase tracking-wide text-white/40 transition-colors hover:border-gold/30 hover:text-gold md:flex"
        >
          View site
          <ExternalLink className="h-3 w-3" />
        </a>

        {/* Notifications */}
        <button
          type="button"
          className="relative p-2 text-white/30 transition-colors hover:text-gold"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
        </button>

        {/* User */}
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center bg-gold/15 border border-gold/25 text-xs font-medium text-gold">
            {initials}
          </div>
          <div className="hidden flex-col md:flex">
            <span className="text-sm font-light text-white/80">
              {user.firstName} {user.lastName}
            </span>
            <Badge variant="gold" className="mt-0.5 w-fit">
              {role.replace("_", " ")}
            </Badge>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="p-2 text-white/30 transition-colors hover:text-red-400"
            aria-label="Logout"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
