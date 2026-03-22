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
    const handleScroll = () => setScrolled(window.scrollY > 10);
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
        "sticky top-0 z-50 w-full bg-white transition-shadow duration-300",
        scrolled && "shadow-md"
      )}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="font-serif text-2xl text-vermillion">
          PARISVASY
        </Link>

        {/* Desktop Nav Links */}
        <ul className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-sm font-medium text-ink-400 transition-colors hover:text-vermillion"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Desktop Right Side */}
        <div className="hidden items-center gap-3 md:flex">
          {isStaff && (
            <Link
              href="/back-office"
              className="flex items-center gap-1.5 rounded-lg border border-navy-100 px-3 py-1.5 text-sm font-medium text-navy transition-colors hover:bg-navy-50"
            >
              <LayoutDashboard className="h-4 w-4" />
              Back-office
            </Link>
          )}
          {user ? (
            <div className="flex items-center gap-3">
              <Link
                href="/account"
                className="flex items-center gap-1.5 text-sm font-medium text-ink-400 transition-colors hover:text-vermillion"
              >
                <User className="h-4 w-4" />
                {user.email?.split("@")[0] ?? "Account"}
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-ink-300 transition-colors hover:text-vermillion"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-ink-400 transition-colors hover:text-vermillion"
              >
                <LogIn className="h-4 w-4" />
                Login
              </Link>
              <Link
                href="/register"
                className="flex items-center gap-1.5 rounded-lg bg-vermillion px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-vermillion-600"
              >
                <UserPlus className="h-4 w-4" />
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
            <X className="h-6 w-6 text-ink" />
          ) : (
            <Menu className="h-6 w-6 text-ink" />
          )}
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="border-t border-cream-200 bg-white px-4 pb-4 md:hidden">
          <ul className="flex flex-col gap-2 py-3">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-lg px-3 py-2 text-sm font-medium text-ink-400 transition-colors hover:bg-cream"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            {isStaff && (
              <li>
                <Link
                  href="/back-office"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-navy transition-colors hover:bg-cream"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Back-office
                </Link>
              </li>
            )}
          </ul>
          <div className="flex flex-col gap-2 border-t border-cream-200 pt-3">
            {user ? (
              <>
                <Link
                  href="/account"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-ink-400 hover:bg-cream"
                >
                  <User className="h-4 w-4" />
                  {user.email?.split("@")[0] ?? "Account"}
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-ink-300 hover:bg-cream"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-ink-400 hover:bg-cream"
                >
                  <LogIn className="h-4 w-4" />
                  Login
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center gap-1.5 rounded-lg bg-vermillion px-4 py-2 text-sm font-medium text-white hover:bg-vermillion-600"
                >
                  <UserPlus className="h-4 w-4" />
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
