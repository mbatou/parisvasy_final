"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const COOKIE_NAME = "parisvasy_consent";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Check if consent was already given
    const consent = document.cookie
      .split("; ")
      .find((c) => c.startsWith(`${COOKIE_NAME}=`));
    if (!consent) {
      // Small delay so it doesn't flash on page load
      const timer = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const setConsent = (value: "all" | "necessary") => {
    // Set cookie for 1 year
    const expires = new Date();
    expires.setFullYear(expires.getFullYear() + 1);
    document.cookie = `${COOKIE_NAME}=${value}; path=/; expires=${expires.toUTCString()}; SameSite=Lax`;
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[60] border-t border-gold/20 bg-[rgba(10,10,10,0.96)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <p className="text-sm font-light text-white/50">
          We use cookies to ensure you get the best experience.{" "}
          <Link
            href="/cookies"
            className="text-gold transition-colors hover:text-gold-light hover:underline decoration-gold/30"
          >
            See our Cookie Policy
          </Link>
          .
        </p>
        <div className="flex shrink-0 gap-3">
          <button
            onClick={() => setConsent("necessary")}
            className="border border-white/[0.12] px-4 py-2 text-[11px] uppercase tracking-wide text-white/50 transition-colors hover:border-white/30 hover:text-white"
          >
            Necessary only
          </button>
          <button
            onClick={() => setConsent("all")}
            className="bg-gold px-4 py-2 text-[11px] uppercase tracking-wide font-medium text-pv-black transition-colors hover:bg-gold-light"
          >
            Accept all
          </button>
        </div>
      </div>
    </div>
  );
}
