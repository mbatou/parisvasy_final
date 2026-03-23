import type { Metadata } from "next";
import { SectionReveal } from "@/components/public/SectionReveal";
import {
  MapPin,
  Gift,
  Rocket,
  BadgeEuro,
  BookOpen,
  Users,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Careers — PARISVASY",
  description:
    "Help us redefine hospitality. Join the PARISVASY team in Paris.",
};

const PERKS = [
  {
    icon: MapPin,
    title: "Paris-based",
    desc: "Central Paris office with flexible remote work options. The best of both worlds.",
  },
  {
    icon: Gift,
    title: "Experience perks",
    desc: "Complimentary PARISVASY experiences every quarter. Because you should enjoy what you build.",
  },
  {
    icon: Rocket,
    title: "Growth stage",
    desc: "Early stage means direct impact on the product. Your ideas shape what we build next.",
  },
  {
    icon: BadgeEuro,
    title: "Competitive package",
    desc: "Competitive salary, equity options, full health coverage, and generous PTO.",
  },
  {
    icon: BookOpen,
    title: "Learning budget",
    desc: "Annual budget for conferences, courses, and books. We invest in your growth.",
  },
  {
    icon: Users,
    title: "Team culture",
    desc: "Quarterly retreats, team lunches, and an honest, craft-focused culture.",
  },
];

const POSITIONS = [
  {
    title: "Senior Full-Stack Engineer",
    department: "Engineering",
    type: "Full-time",
    location: "Paris / Remote",
  },
  {
    title: "Hotel Partnerships Manager",
    department: "Business",
    type: "Full-time",
    location: "Paris",
  },
  {
    title: "Experience Curator",
    department: "Operations",
    type: "Full-time",
    location: "Paris",
  },
  {
    title: "Product Designer",
    department: "Design",
    type: "Full-time",
    location: "Paris / Remote",
  },
];

export default function CareersPage() {
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
                Join the team
              </span>
              <span className="h-px w-8 bg-gold/40" />
            </div>
            <h1 className="mt-6 font-serif text-4xl font-light text-white sm:text-5xl lg:text-6xl">
              Help us redefine{" "}
              <em className="not-italic text-gold">hospitality</em>
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-base text-white/40 font-light leading-relaxed">
              We&rsquo;re building the future of hotel experiences — and we
              need exceptional people to do it.
            </p>
          </SectionReveal>
        </div>
      </section>

      {/* Intro */}
      <section className="border-y border-white/[0.06] bg-pv-black-90 py-16 sm:py-20">
        <div className="mx-auto max-w-2xl px-4 text-center sm:px-6">
          <SectionReveal>
            <p className="text-[15px] font-light leading-[1.8] text-white/40">
              We&rsquo;re a small, ambitious team based in Paris. We move
              fast, care deeply about craft, and believe that great
              hospitality starts with great people. If you&rsquo;re passionate
              about travel, design, or technology — and want to build
              something meaningful — we&rsquo;d love to meet you.
            </p>
          </SectionReveal>
        </div>
      </section>

      {/* Perks Grid */}
      <section className="bg-pv-black py-24 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionReveal>
            <div className="text-center">
              <span className="micro-label text-gold tracking-[3px]">
                Why join us
              </span>
              <h2 className="mt-4 font-serif text-3xl text-white font-light sm:text-4xl">
                Perks &amp; benefits
              </h2>
            </div>
          </SectionReveal>

          <div className="mt-16 grid grid-cols-1 gap-px bg-white/[0.06] border border-white/[0.06] sm:grid-cols-2 lg:grid-cols-3">
            {PERKS.map((perk, i) => {
              const Icon = perk.icon;
              return (
                <SectionReveal key={perk.title} delay={i * 80}>
                  <div className="bg-pv-black px-7 py-10 transition-colors hover:bg-white/[0.02] h-full">
                    <div className="flex h-10 w-10 items-center justify-center border border-gold/25 bg-gold/[0.06]">
                      <Icon className="h-4.5 w-4.5 text-gold" />
                    </div>
                    <h3 className="mt-5 font-serif text-lg text-white font-light">
                      {perk.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/40 font-light">
                      {perk.desc}
                    </p>
                  </div>
                </SectionReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="border-y border-white/[0.06] bg-pv-black-90 py-24 sm:py-28">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <SectionReveal>
            <div className="text-center">
              <span className="micro-label text-gold tracking-[3px]">
                Open roles
              </span>
              <h2 className="mt-4 font-serif text-3xl text-white font-light sm:text-4xl">
                Current openings
              </h2>
            </div>
          </SectionReveal>

          <div className="mt-16 border-t border-white/[0.06]">
            {POSITIONS.map((pos, i) => (
              <SectionReveal key={pos.title} delay={i * 80}>
                <div className="flex flex-col gap-4 border-b border-white/[0.06] py-7 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="font-serif text-xl text-white font-light">
                      {pos.title}
                    </h3>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {[pos.department, pos.type, pos.location].map((tag) => (
                        <span
                          key={tag}
                          className="border border-white/[0.1] px-2.5 py-0.5 text-[10px] uppercase tracking-wide text-white/40"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <a
                    href={`mailto:careers@parisvasy.com?subject=Application: ${pos.title}`}
                    className="shrink-0 border border-gold/25 px-5 py-2 text-center text-[11px] font-medium uppercase tracking-wide text-gold transition-all hover:bg-gold hover:text-pv-black"
                  >
                    Apply
                  </a>
                </div>
              </SectionReveal>
            ))}
          </div>

          {/* Spontaneous application */}
          <SectionReveal delay={400}>
            <div className="mt-16 border border-white/[0.06] bg-pv-black p-8 text-center sm:p-12">
              <h3 className="font-serif text-2xl text-white font-light">
                Don&rsquo;t see your role?
              </h3>
              <p className="mx-auto mt-3 max-w-md text-sm text-white/40 font-light leading-relaxed">
                We&rsquo;re always looking for exceptional people who are
                passionate about hospitality, technology, and design. Send us
                your application — we&rsquo;d love to hear from you.
              </p>
              <a
                href="mailto:careers@parisvasy.com"
                className="mt-6 inline-block bg-gold px-8 py-3 text-[11px] font-medium uppercase tracking-wide text-pv-black transition-colors hover:bg-gold-light"
              >
                Send spontaneous application
              </a>
            </div>
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
              Build something unforgettable
            </h2>
            <p className="mx-auto mt-4 max-w-md text-white/40 font-light">
              Join the team and help us redefine what a hotel stay can be.
            </p>
            <a
              href="mailto:careers@parisvasy.com"
              className="mt-8 inline-block bg-gold px-8 py-3 text-[11px] font-medium uppercase tracking-wide text-pv-black transition-colors hover:bg-gold-light"
            >
              Get in touch
            </a>
          </SectionReveal>
        </div>
      </section>
    </>
  );
}
