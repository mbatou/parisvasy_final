import type { Metadata } from "next";
import "./globals.css";
import { CustomCursor } from "@/components/public/CustomCursor";
import CookieConsent from "@/components/public/CookieConsent";

export const metadata: Metadata = {
  title: "PARISVASY — Book a room, live an experience",
  description:
    "Curated hotel stays with unique experiences included — from Seine cruises to Michelin dinners. No extra cost, just unforgettable memories in Paris.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <CustomCursor />
        {children}
        <CookieConsent />
      </body>
    </html>
  );
}
