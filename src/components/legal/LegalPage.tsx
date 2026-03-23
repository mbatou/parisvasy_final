import Link from "next/link";
import { cn } from "@/lib/utils";

/*
 * NOTE: Company details below are placeholders.
 * Replace with actual registered company information before going live.
 */
const COMPANY = {
  name: "PARISVASY SAS",
  address: "12 Rue de Rivoli, 75001 Paris, France",
  legalEmail: "legal@parisvasy.com",
  privacyEmail: "privacy@parisvasy.com",
  generalEmail: "contact@parisvasy.com",
};

export interface LegalSection {
  id: string;
  title: string;
  content: React.ReactNode;
}

interface LegalPageProps {
  eyebrow: string;
  title: string;
  effectiveDate: string;
  sections: LegalSection[];
  contactEmail?: string;
}

export default function LegalPage({
  eyebrow,
  title,
  effectiveDate,
  sections,
  contactEmail,
}: LegalPageProps) {
  const email = contactEmail ?? COMPANY.legalEmail;

  return (
    <section className="bg-pv-black py-12 sm:py-16">
      <div className="mx-auto max-w-[800px] px-4 sm:px-6">
        {/* Header */}
        <div className="border-b border-white/[0.06] pb-10">
          <p className="text-[11px] font-medium uppercase tracking-[3px] text-gold">
            {eyebrow}
          </p>
          <h1 className="mt-3 font-serif text-4xl font-light text-white sm:text-[48px] sm:leading-[1.15]">
            {title}
          </h1>
          <p className="mt-4 text-sm text-white/30 font-light">
            Effective date: {effectiveDate}
          </p>
        </div>

        {/* Table of Contents */}
        <div className="mt-10 border border-white/[0.06] bg-pv-black-90 p-6 sm:p-8">
          <p className="mb-4 text-[11px] font-medium uppercase tracking-[2.5px] text-gold">
            Table of contents
          </p>
          <ol className="flex flex-col gap-2">
            {sections.map((section, i) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  className="group flex items-baseline gap-3 text-sm text-white/40 transition-colors hover:text-gold font-light"
                >
                  <span className="font-mono text-xs text-gold/60 group-hover:text-gold tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {section.title}
                </a>
              </li>
            ))}
          </ol>
        </div>

        {/* Sections */}
        <div className="mt-12 space-y-12">
          {sections.map((section, i) => (
            <div
              key={section.id}
              id={section.id}
              className="scroll-mt-36"
            >
              <h2 className="border-b border-white/[0.06] pb-3 font-serif text-[26px] font-light text-white">
                {i + 1}. {section.title}
              </h2>
              <div className="legal-prose mt-5">{section.content}</div>
            </div>
          ))}
        </div>

        {/* Contact Box */}
        <div className="mt-16 border border-white/[0.06] bg-pv-black-90 p-8 text-center">
          <p className="text-sm font-semibold text-white">{COMPANY.name}</p>
          <p className="mt-1 text-sm text-white/40 font-light">
            {COMPANY.address}
          </p>
          <a
            href={`mailto:${email}`}
            className="mt-2 inline-block text-sm text-gold transition-colors hover:text-gold-light"
          >
            {email}
          </a>
        </div>
      </div>
    </section>
  );
}

/* ── Reusable prose sub-components ──────────────────────────── */

export function P({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={cn("text-[15px] font-light leading-[1.8] text-white/40", className)}>
      {children}
    </p>
  );
}

export function H3({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mb-2 mt-6 text-lg font-medium text-white/60">
      {children}
    </h3>
  );
}

export function UL({ children }: { children: React.ReactNode }) {
  return <ul className="legal-list my-3 flex flex-col gap-1.5 pl-5">{children}</ul>;
}

export function LI({ children }: { children: React.ReactNode }) {
  return (
    <li className="relative text-[15px] font-light leading-[1.8] text-white/40">
      {children}
    </li>
  );
}

export function Highlight({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-5 border-l-2 border-gold bg-gold/[0.06] px-5 py-4">
      <p className="text-[15px] font-light leading-[1.8] text-white/60">{children}</p>
    </div>
  );
}

export function InlineLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-gold transition-colors hover:text-gold-light hover:underline decoration-gold/30"
    >
      {children}
    </a>
  );
}

export { COMPANY };
