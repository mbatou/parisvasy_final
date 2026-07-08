import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { LegalTabBar } from "@/components/legal/LegalTabBar";

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-pv-black">
      {/* Simplified navbar */}
      <header className="fixed top-0 z-50 w-full border-b border-white/[0.06] bg-[rgba(10,10,10,0.92)] backdrop-blur-[24px]">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="font-sans text-[15px] font-semibold tracking-[4px] text-gold"
          >
            PARISVASY
          </Link>
          <Link
            href="/"
            className="flex items-center gap-1.5 text-[11px] uppercase tracking-wide text-white/40 transition-colors hover:text-gold"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to site
          </Link>
        </nav>
        <LegalTabBar />
      </header>

      {/* Content — offset for fixed header + tab bar */}
      <main className="flex-1 pt-[7.5rem]">{children}</main>

      {/* Minimal footer */}
      <footer className="border-t border-white/[0.06] bg-pv-black py-8">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-[11px] text-white/20 tracking-wide">
            &copy; {new Date().getFullYear()} PARISVASY. All rights reserved.
            {" · "}
            <Link href="/terms" className="transition-colors hover:text-gold">Terms</Link>
            {" · "}
            <Link href="/privacy" className="transition-colors hover:text-gold">Privacy</Link>
            {" · "}
            <Link href="/cookies" className="transition-colors hover:text-gold">Cookies</Link>
          </p>
        </div>
      </footer>
    </div>
  );
}
