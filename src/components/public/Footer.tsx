import Link from "next/link";

const EXPERIENCE_LINKS = [
  { href: "/experiences?category=cruise", label: "Cruises" },
  { href: "/experiences?category=gastronomy", label: "Gastronomy" },
  { href: "/experiences?category=culture", label: "Culture" },
  { href: "/experiences?category=wellness", label: "Wellness" },
  { href: "/experiences?category=adventure", label: "Adventure" },
  { href: "/experiences?category=nightlife", label: "Nightlife" },
];

const COMPANY_LINKS = [
  { href: "/#how-it-works", label: "How it works" },
  { href: "/about", label: "About us" },
  { href: "/contact", label: "Contact" },
  { href: "/careers", label: "Careers" },
];

const LEGAL_LINKS = [
  { href: "/terms", label: "Terms of Service" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/cookies", label: "Cookie Policy" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-pv-black border-t border-white/[0.06]">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Link
              href="/"
              className="font-sans text-[15px] font-semibold tracking-[4px] text-gold"
            >
              PARISVASY
            </Link>
            <p className="mt-5 text-sm leading-relaxed text-white/40 font-light">
              Book a room, live an experience. Curated hotel stays with
              unforgettable experiences included — at no extra cost.
            </p>
          </div>

          {/* Experiences */}
          <div>
            <h3 className="micro-label text-gold tracking-[2.5px]">
              Experiences
            </h3>
            <ul className="mt-5 flex flex-col gap-3">
              {EXPERIENCE_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/40 transition-colors hover:text-gold font-light"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="micro-label text-gold tracking-[2.5px]">
              Company
            </h3>
            <ul className="mt-5 flex flex-col gap-3">
              {COMPANY_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/40 transition-colors hover:text-gold font-light"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="micro-label text-gold tracking-[2.5px]">
              Legal
            </h3>
            <ul className="mt-5 flex flex-col gap-3">
              {LEGAL_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/40 transition-colors hover:text-gold font-light"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-16 border-t border-white/[0.06] pt-8 text-center">
          <p className="text-[11px] text-white/20 tracking-wide">
            &copy; {year} PARISVASY. All rights reserved.
            {" · "}
            <Link href="/terms" className="transition-colors hover:text-gold">Terms</Link>
            {" · "}
            <Link href="/privacy" className="transition-colors hover:text-gold">Privacy</Link>
            {" · "}
            <Link href="/cookies" className="transition-colors hover:text-gold">Cookies</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
