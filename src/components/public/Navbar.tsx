"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import {
  Menu,
  X,
  LogIn,
  UserPlus,
  LogOut,
  User,
  LayoutDashboard,
} from "lucide-react";
import type { UserRole } from "@/types";

const NAV_LINKS = [
  { href: "/experiences", label: "Experiences" },
  { href: "/#how-it-works", label: "How it works" },
];

const STAFF_ROLES: UserRole[] = [
  "super_admin",
  "hotel_manager",
  "finance_manager",
  "front_desk",
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<{ id: string; email?: string } | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();
      if (authUser) {
        setUser({ id: authUser.id, email: authUser.email });
        const role = (authUser.user_metadata?.role as UserRole) ?? "customer";
        setUserRole(role);
      }
    };
    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({ id: session.user.id, email: session.user.email });
        const role =
          (session.user.user_metadata?.role as UserRole) ?? "customer";
        setUserRole(role);
      } else {
        setUser(null);
        setUserRole(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setUserRole(null);
    setMobileOpen(false);
    router.push("/");
  };

  const isStaff = userRole && STAFF_ROLES.includes(userRole);

  return (
    <header
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-500",
        scrolled
          ? "bg-[rgba(10,10,10,0.92)] backdrop-blur-[24px] border-b border-white/[0.06]"
          : "bg-transparent"
      )}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="font-sans text-[15px] font-semibold tracking-[4px] text-gold"
        >
          PARISVASY
        </Link>

        {/* Desktop Nav Links */}
        <ul className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="micro-label text-white/60 transition-colors hover:text-gold link-underline"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Desktop Right Side */}
        <div className="hidden items-center gap-4 md:flex">
          {isStaff && (
            <Link
              href="/admin"
              className="micro-label flex items-center gap-1.5 border border-gold/25 px-4 py-2 text-gold transition-all hover:bg-gold hover:text-pv-black"
            >
              <LayoutDashboard className="h-3.5 w-3.5" />
              Back office
            </Link>
          )}
          {user ? (
            <div className="flex items-center gap-4">
              <Link
                href="/admin"
                className="flex items-center gap-1.5 text-[11px] uppercase tracking-wide text-white/60 transition-colors hover:text-gold"
              >
                <User className="h-3.5 w-3.5" />
                {user.email?.split("@")[0] ?? "Account"}
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-[11px] uppercase tracking-wide text-white/40 transition-colors hover:text-gold"
              >
                <LogOut className="h-3.5 w-3.5" />
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="flex items-center gap-1.5 text-[11px] uppercase tracking-wide text-white/60 transition-colors hover:text-gold"
              >
                <LogIn className="h-3.5 w-3.5" />
                Login
              </Link>
              <Link
                href="/register"
                className="flex items-center gap-1.5 border border-gold px-4 py-2 text-[11px] uppercase tracking-wide text-gold transition-all hover:bg-gold hover:text-pv-black"
              >
                <UserPlus className="h-3.5 w-3.5" />
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <X className="h-6 w-6 text-white" />
          ) : (
            <Menu className="h-6 w-6 text-white" />
          )}
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="border-t border-white/[0.06] bg-pv-black-90 px-4 pb-6 md:hidden">
          <ul className="flex flex-col gap-1 py-4">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block px-3 py-2.5 text-[11px] uppercase tracking-wide text-white/60 transition-colors hover:text-gold"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            {isStaff && (
              <li>
                <Link
                  href="/admin"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 px-3 py-2.5 text-[11px] uppercase tracking-wide text-gold transition-colors hover:text-gold-light"
                >
                  <LayoutDashboard className="h-3.5 w-3.5" />
                  Back office
                </Link>
              </li>
            )}
          </ul>
          <div className="flex flex-col gap-2 border-t border-white/[0.06] pt-4">
            {user ? (
              <>
                <Link
                  href="/admin"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 px-3 py-2.5 text-[11px] uppercase tracking-wide text-white/60 hover:text-gold"
                >
                  <User className="h-3.5 w-3.5" />
                  {user.email?.split("@")[0] ?? "Account"}
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-3 py-2.5 text-[11px] uppercase tracking-wide text-white/40 hover:text-gold"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 px-3 py-2.5 text-[11px] uppercase tracking-wide text-white/60 hover:text-gold"
                >
                  <LogIn className="h-3.5 w-3.5" />
                  Login
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileOpen(false)}
                  className="mt-2 flex items-center justify-center gap-2 border border-gold px-4 py-2.5 text-[11px] uppercase tracking-wide text-gold hover:bg-gold hover:text-pv-black"
                >
                  <UserPlus className="h-3.5 w-3.5" />
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
