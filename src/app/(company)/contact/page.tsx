import type { Metadata } from "next";
import { SectionReveal } from "@/components/public/SectionReveal";
import Link from "next/link";
import ContactForm from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact — PARISVASY",
  description: "Get in touch with the PARISVASY team.",
};

/*
 * NOTE: Email addresses below are placeholders.
 * Replace with actual company emails before going live.
 */

const CONTACT_INFO = [
  { label: "General inquiries", value: "contact@parisvasy.com", href: "mailto:contact@parisvasy.com" },
  { label: "Partnerships", value: "partners@parisvasy.com", href: "mailto:partners@parisvasy.com" },
  { label: "Press & media", value: "press@parisvasy.com", href: "mailto:press@parisvasy.com" },
];

export default function ContactPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-pv-black pb-16 pt-20 sm:pt-24">
        <div className="pointer-events-none absolute inset-0 flex items-start justify-center">
          <div className="mt-24 h-[500px] w-[800px] rounded-full bg-gold/[0.04] blur-[120px]" />
        </div>
        <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
          <SectionReveal>
            <div className="flex items-center justify-center gap-3">
              <span className="h-px w-8 bg-gold/40" />
              <span className="text-[11px] font-medium uppercase tracking-[3px] text-gold">
                Get in touch
              </span>
              <span className="h-px w-8 bg-gold/40" />
            </div>
            <h1 className="mt-6 font-serif text-4xl font-light text-white sm:text-5xl lg:text-6xl">
              We&rsquo;d love to hear from you
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-base text-white/40 font-light leading-relaxed">
              Whether you have a question about a booking, want to partner with
              us, or just want to say hello — we&rsquo;re here.
            </p>
          </SectionReveal>
        </div>
      </section>

      {/* Contact Grid */}
      <section className="bg-pv-black pb-24 sm:pb-28">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <SectionReveal>
            <div className="grid grid-cols-1 border border-white/[0.06] lg:grid-cols-[360px_1fr]">
              {/* Left - Contact Info */}
              <div className="border-b border-white/[0.06] bg-pv-black-90 p-8 sm:p-10 lg:border-b-0 lg:border-r">
                <h2 className="font-serif text-2xl text-white font-light">
                  Contact information
                </h2>

                <div className="mt-8 space-y-6">
                  {CONTACT_INFO.map((item) => (
                    <div key={item.label}>
                      <p className="text-[11px] font-medium uppercase tracking-[2px] text-white/30">
                        {item.label}
                      </p>
                      <a
                        href={item.href}
                        className="mt-1 block text-sm text-gold transition-colors hover:text-gold-light"
                      >
                        {item.value}
                      </a>
                    </div>
                  ))}
                </div>

                <div className="mt-10 border-t border-white/[0.06] pt-6">
                  <p className="text-[11px] font-medium uppercase tracking-[2px] text-white/30">
                    Address
                  </p>
                  <p className="mt-1 text-sm text-white/50 font-light leading-relaxed">
                    PARISVASY SAS
                    <br />
                    12 Rue de Rivoli
                    <br />
                    75001 Paris, France
                  </p>
                </div>

                <div className="mt-8 border-t border-white/[0.06] pt-6">
                  <p className="text-[11px] font-medium uppercase tracking-[2px] text-white/30">
                    Support hours
                  </p>
                  <div className="mt-2 space-y-1 text-sm text-white/40 font-light">
                    <p>Mon–Fri: 9:00–19:00</p>
                    <p>Saturday: 10:00–17:00</p>
                    <p>Sunday: Closed</p>
                  </div>
                </div>
              </div>

              {/* Right - Form */}
              <div className="p-8 sm:p-10">
                <ContactForm />
              </div>
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden border-t border-white/[0.06] bg-pv-black py-24 sm:py-28">
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-[400px] w-[600px] rounded-full bg-gold/[0.03] blur-[100px]" />
        </div>
        <div className="relative mx-auto max-w-2xl px-4 text-center sm:px-6">
          <SectionReveal>
            <h2 className="font-serif text-3xl text-white font-light sm:text-4xl">
              Prefer to book directly?
            </h2>
            <p className="mx-auto mt-4 max-w-md text-white/40 font-light">
              Browse our curated collection of Parisian experiences and find
              your perfect stay.
            </p>
            <Link
              href="/experiences"
              className="mt-8 inline-block bg-gold px-8 py-3 text-[11px] font-medium uppercase tracking-wide text-pv-black transition-colors hover:bg-gold-light"
            >
              Browse experiences
            </Link>
          </SectionReveal>
        </div>
      </section>
    </>
  );
}
