import type { Metadata } from "next";
import Link from "next/link";
import { SectionReveal } from "@/components/public/SectionReveal";

export const metadata: Metadata = {
  title: "About Us — PARISVASY",
  description:
    "Paris isn't just a city, it's an invitation. Learn about our mission to redefine hospitality.",
};

const STATS = [
  { value: "12+", label: "Curated experiences" },
  { value: "4.9", label: "Average rating" },
  { value: "0€", label: "Experience cost" },
  { value: "48h", label: "Free cancellation" },
];

const VALUES = [
  {
    title: "Authenticity",
    desc: "We show you the real Paris — not the tourist version. Local restaurants, hidden gems, and experiences curated by people who live and breathe this city.",
  },
  {
    title: "Transparency",
    desc: "No hidden fees, no surprise charges. Your card is held as a warranty only. You see the full price upfront, always.",
  },
  {
    title: "Hospitality",
    desc: "We treat every guest like a friend visiting Paris for the first time. Personal, warm, and genuinely invested in your experience.",
  },
  {
    title: "Excellence",
    desc: "4–5 star hotels, Michelin-starred restaurants, award-winning tour operators. We partner only with the best.",
  },
];

export default function AboutPage() {
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
                Our story
              </span>
              <span className="h-px w-8 bg-gold/40" />
            </div>
            <h1 className="mt-6 font-serif text-4xl font-light text-white sm:text-5xl lg:text-6xl">
              Paris isn&rsquo;t just a city,{" "}
              <em className="not-italic text-gold">it&rsquo;s an invitation</em>
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-base text-white/40 font-light leading-relaxed">
              We believe the best hotel stays are the ones you never forget.
              That&rsquo;s why every PARISVASY booking comes with a curated
              experience — at no extra cost.
            </p>
          </SectionReveal>
        </div>
      </section>

      {/* About Grid */}
      <section className="border-y border-white/[0.06] bg-pv-black py-24 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:gap-20">
            {/* Text */}
            <SectionReveal>
              <div>
                <span className="micro-label text-gold tracking-[3px]">
                  The concept
                </span>
                <h2 className="mt-4 font-serif text-3xl text-white font-light sm:text-4xl">
                  More than a booking platform
                </h2>
                <div className="mt-8 space-y-5">
                  <p className="text-[15px] font-light leading-[1.8] text-white/40">
                    PARISVASY was born from a simple observation: the best
                    memories from travel aren&rsquo;t just about where you
                    sleep — they&rsquo;re about what you{" "}
                    <span className="text-gold">experience</span>.
                  </p>
                  <p className="text-[15px] font-light leading-[1.8] text-white/40">
                    We partner with carefully selected hotels across Paris to
                    offer guests a seamless booking experience where a
                    complimentary adventure is included with every room
                    reservation. A Seine cruise at sunset, a private wine
                    tasting in Le Marais, a backstage tour of the Opéra
                    Garnier — all included in the price of your room.
                  </p>
                  <p className="text-[15px] font-light leading-[1.8] text-white/40">
                    No extra fees, no upsells, no catch. We negotiate
                    experience partnerships so that hotels attract guests who
                    want more than just a bed, and guests get{" "}
                    <span className="text-gold">
                      unforgettable memories at no extra cost
                    </span>
                    .
                  </p>
                </div>
              </div>
            </SectionReveal>

            {/* Image placeholder */}
            <SectionReveal delay={150}>
              <div className="flex items-center justify-center border border-white/[0.06] bg-pv-black-90 aspect-[4/3] lg:aspect-auto lg:h-full">
                <div className="text-center px-8">
                  <p className="font-serif text-2xl text-white/10">
                    PARISVASY
                  </p>
                  <p className="mt-2 text-xs text-white/20 font-light">
                    Image placeholder — replace with a photo of Paris
                  </p>
                </div>
              </div>
            </SectionReveal>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-b border-white/[0.06] bg-pv-black-90">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-2 divide-x divide-white/[0.06] sm:grid-cols-4">
            {STATS.map((stat, i) => (
              <SectionReveal key={stat.label} delay={i * 80}>
                <div className="px-6 py-10 text-center sm:px-8">
                  <p className="font-serif text-4xl text-gold font-light sm:text-[48px]">
                    {stat.value}
                  </p>
                  <p className="mt-2 text-[11px] uppercase tracking-wide text-white/30">
                    {stat.label}
                  </p>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Values Grid */}
      <section className="bg-pv-black py-24 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionReveal>
            <div className="text-center">
              <span className="micro-label text-gold tracking-[3px]">
                What we stand for
              </span>
              <h2 className="mt-4 font-serif text-3xl text-white font-light sm:text-4xl">
                Our values
              </h2>
            </div>
          </SectionReveal>

          <div className="mt-16 grid grid-cols-1 gap-px bg-white/[0.06] border border-white/[0.06] sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((v, i) => (
              <SectionReveal key={v.title} delay={i * 80}>
                <div className="bg-pv-black px-7 py-10 transition-colors hover:bg-white/[0.02] h-full">
                  <h3 className="font-serif text-xl text-white font-light">
                    {v.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/40 font-light">
                    {v.desc}
                  </p>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Team Note */}
      <section className="border-y border-white/[0.06] bg-pv-black-90 py-20 sm:py-24">
        <div className="mx-auto max-w-2xl px-4 text-center sm:px-6">
          <SectionReveal>
            <span className="micro-label text-gold tracking-[3px]">
              The team
            </span>
            <h2 className="mt-4 font-serif text-3xl text-white font-light sm:text-4xl">
              A small team, a big vision
            </h2>
            <p className="mt-5 text-[15px] font-light leading-[1.8] text-white/40">
              We started with one hotel and one experience. Today, we&rsquo;re
              expanding across Paris with a curated portfolio of premium
              hotels and unforgettable adventures. Our team is small,
              ambitious, and deeply passionate about hospitality. We&rsquo;re
              building something we believe in — and we&rsquo;re just getting
              started.
            </p>
          </SectionReveal>
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
              Experience Paris, our way
            </h2>
            <p className="mx-auto mt-4 max-w-md text-white/40 font-light">
              Curated hotel stays with unforgettable experiences included — at
              no extra cost.
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
