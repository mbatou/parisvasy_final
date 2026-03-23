import type { Metadata } from "next";
import Link from "next/link";
import { SectionReveal } from "@/components/public/SectionReveal";
import { CreditCard, Clock, Gift } from "lucide-react";

export const metadata: Metadata = {
  title: "How it Works — PARISVASY",
  description:
    "Every stay includes a curated Parisian experience at no extra cost. Here's exactly how it works.",
};

const STEPS = [
  {
    num: "01",
    title: "Browse experiences",
    desc: "Explore our curated selection of Parisian adventures — from Seine cruises to Michelin-starred dinners, hidden jazz clubs to private art tours.",
  },
  {
    num: "02",
    title: "Choose your room",
    desc: "Select your preferred room type, dates, and number of guests at one of our carefully selected partner hotels.",
  },
  {
    num: "03",
    title: "Provide your card",
    desc: "Enter your card details as a warranty only. No payment is taken at booking — you pay the hotel directly at check-in.",
  },
];

const JOURNEY = [
  {
    label: "Booking",
    text: "No account needed. Just your name, email, and phone number. Pick your experience, choose your room, select your dates.",
  },
  {
    label: "Card warranty",
    text: "No charge at booking. Your card is held securely via Stripe as a guarantee. It's only charged for late cancellation or no-show.",
  },
  {
    label: "Before arrival",
    text: "Reminder email 48h before check-in. This is also your last chance to cancel free of charge or request modifications.",
  },
  {
    label: "Check-in",
    text: "Arrive from 3:00 PM. Present a valid ID at the front desk. Full payment for your stay is collected by the hotel at this point.",
  },
  {
    label: "Your experience",
    text: "Enjoy your curated adventure — entirely complimentary. From river cruises to wine tastings, it's all included in your stay.",
  },
  {
    label: "Check-out",
    text: "Check out by 11:00 AM. Your card warranty is released. No surprises, no hidden fees. Just unforgettable memories.",
  },
];

const GUARANTEES = [
  {
    icon: CreditCard,
    title: "No payment at booking",
    desc: "Your card is held as warranty only",
  },
  {
    icon: Clock,
    title: "Free cancellation 48h",
    desc: "Cancel up to 48 hours before check-in",
  },
  {
    icon: Gift,
    title: "Experience included",
    desc: "Every stay includes a curated experience",
  },
];

export default function HowItWorksPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-pv-black pb-20 pt-20 sm:pt-24">
        <div className="pointer-events-none absolute inset-0 flex items-start justify-center">
          <div className="mt-24 h-[500px] w-[800px] rounded-full bg-gold/[0.04] blur-[120px]" />
        </div>
        <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
          <SectionReveal>
            <div className="flex items-center justify-center gap-3">
              <span className="h-px w-8 bg-gold/40" />
              <span className="text-[11px] font-medium uppercase tracking-[3px] text-gold">
                The PARISVASY way
              </span>
              <span className="h-px w-8 bg-gold/40" />
            </div>
            <h1 className="mt-6 font-serif text-4xl font-light text-white sm:text-5xl lg:text-6xl">
              Book a room, live an{" "}
              <em className="not-italic text-gold">experience</em>
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-base text-white/40 font-light leading-relaxed">
              Every stay includes a curated Parisian experience at no extra
              cost. Here&rsquo;s exactly how it works.
            </p>
          </SectionReveal>
        </div>
      </section>

      {/* 3-Step Grid */}
      <section className="border-y border-white/[0.06] bg-pv-black">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 divide-y divide-white/[0.06] sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {STEPS.map((step, i) => (
              <SectionReveal key={step.num} delay={i * 100}>
                <div className="group px-8 py-14 transition-colors hover:bg-white/[0.02] sm:px-10">
                  <span className="font-serif text-[64px] leading-none text-gold/20 transition-colors group-hover:text-gold/30">
                    {step.num}
                  </span>
                  <h3 className="mt-4 font-serif text-xl text-white font-light">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/40 font-light">
                    {step.desc}
                  </p>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* The Full Journey */}
      <section className="bg-pv-black py-24 sm:py-28">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <SectionReveal>
            <div className="text-center">
              <span className="micro-label text-gold tracking-[3px]">
                Step by step
              </span>
              <h2 className="mt-4 font-serif text-3xl text-white font-light sm:text-4xl">
                The full journey
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-white/40 font-light">
                From booking to check-out, here&rsquo;s what to expect
              </p>
            </div>
          </SectionReveal>

          <div className="mt-16 border-t border-white/[0.06]">
            {JOURNEY.map((item, i) => (
              <SectionReveal key={item.label} delay={i * 80}>
                <div className="grid grid-cols-1 border-b border-white/[0.06] py-7 sm:grid-cols-[180px_1fr] sm:gap-8">
                  <p className="text-[11px] font-medium uppercase tracking-[2.5px] text-gold">
                    {item.label}
                  </p>
                  <p className="mt-2 text-[15px] font-light leading-[1.8] text-white/40 sm:mt-0">
                    {item.text}
                  </p>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Guarantee Bar */}
      <section className="border-y border-white/[0.06] bg-pv-black-90">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 divide-y divide-white/[0.06] sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {GUARANTEES.map((g, i) => {
              const Icon = g.icon;
              return (
                <SectionReveal key={g.title} delay={i * 100}>
                  <div className="flex items-center gap-4 px-8 py-8 sm:px-10">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center border border-gold/25 bg-gold/[0.06]">
                      <Icon className="h-5 w-5 text-gold" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">
                        {g.title}
                      </p>
                      <p className="mt-0.5 text-xs text-white/30 font-light">
                        {g.desc}
                      </p>
                    </div>
                  </div>
                </SectionReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-pv-black py-24 sm:py-28">
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-[400px] w-[600px] rounded-full bg-gold/[0.03] blur-[100px]" />
        </div>
        <div className="relative mx-auto max-w-2xl px-4 text-center sm:px-6">
          <SectionReveal>
            <h2 className="font-serif text-3xl text-white font-light sm:text-4xl">
              Ready to explore?
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
