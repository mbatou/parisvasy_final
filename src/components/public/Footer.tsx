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
    <footer className="bg-navy text-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Link href="/" className="font-serif text-2xl text-vermillion">
              PARISVASY
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-navy-200">
              Book a room, live an experience. Curated hotel stays with
              unforgettable experiences included — at no extra cost.
            </p>
            {/* Social icons placeholder */}
            <div className="mt-6 flex gap-4">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-navy-400 text-xs text-navy-100 transition-colors hover:bg-vermillion hover:text-white">
                FB
              </span>
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-navy-400 text-xs text-navy-100 transition-colors hover:bg-vermillion hover:text-white">
                IG
              </span>
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-navy-400 text-xs text-navy-100 transition-colors hover:bg-vermillion hover:text-white">
                TW
              </span>
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-navy-400 text-xs text-navy-100 transition-colors hover:bg-vermillion hover:text-white">
                LI
              </span>
            </div>
          </div>

          {/* Experiences */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-cream-300">
              Experiences
            </h3>
            <ul className="mt-4 flex flex-col gap-2.5">
              {EXPERIENCE_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-navy-200 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-cream-300">
              Company
            </h3>
            <ul className="mt-4 flex flex-col gap-2.5">
              {COMPANY_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-navy-200 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-cream-300">
              Legal
            </h3>
            <ul className="mt-4 flex flex-col gap-2.5">
              {LEGAL_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-navy-200 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 border-t border-navy-400 pt-8 text-center">
          <p className="text-sm text-navy-200">
            &copy; {year} PARISVASY. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
