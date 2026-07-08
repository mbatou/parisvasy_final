import type { Metadata } from "next";
import LegalPage, {
  P, H3, UL, LI, Highlight, InlineLink,
  type LegalSection,
} from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy — PARISVASY",
  description: "How PARISVASY collects, uses, and protects your personal data.",
};

const sections: LegalSection[] = [
  {
    id: "introduction",
    title: "Introduction",
    content: (
      <>
        <P>
          PARISVASY SAS (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;) is committed to
          protecting your privacy and personal data. This Privacy Policy explains how we collect,
          use, store, and protect your information when you use our Platform.
        </P>
        <P>
          This policy is compliant with the General Data Protection Regulation (GDPR — EU Regulation
          2016/679) and the French Data Protection Act (Loi Informatique et Libertés).
        </P>
      </>
    ),
  },
  {
    id: "data-controller",
    title: "Data controller",
    content: (
      <>
        <P>The data controller responsible for your personal data is:</P>
        <UL>
          <LI>PARISVASY SAS</LI>
          <LI>12 Rue de Rivoli, 75001 Paris, France</LI>
          <LI>Email: privacy@parisvasy.com</LI>
        </UL>
      </>
    ),
  },
  {
    id: "information-collected",
    title: "Information we collect",
    content: (
      <>
        <H3>Information you provide directly</H3>
        <UL>
          <LI>Name, email address, and phone number (when making a booking)</LI>
          <LI>Credit card details (held as warranty, not stored in full on our servers)</LI>
          <LI>Booking preferences (dates, room type, guest count)</LI>
          <LI>Communications you send to us (support inquiries, feedback)</LI>
        </UL>
        <H3>Information collected automatically</H3>
        <UL>
          <LI>IP address and approximate location</LI>
          <LI>Browser type and version</LI>
          <LI>Device information (operating system, screen resolution)</LI>
          <LI>Pages visited, time spent, and navigation patterns</LI>
          <LI>Referring website or source</LI>
        </UL>
        <H3>Information from third parties</H3>
        <UL>
          <LI>Hotel partners may share information about your stay (check-in/out status)</LI>
          <LI>Payment processors may confirm transaction status</LI>
        </UL>
      </>
    ),
  },
  {
    id: "how-we-use",
    title: "How we use your information",
    content: (
      <>
        <P>We use your personal data for the following purposes:</P>
        <UL>
          <LI>Processing and managing your hotel bookings</LI>
          <LI>Coordinating experiences with hotel partners and third-party providers</LI>
          <LI>Sending booking confirmations and updates</LI>
          <LI>Providing customer support</LI>
          <LI>Improving our Platform and services</LI>
          <LI>Complying with legal obligations</LI>
          <LI>Preventing fraud and ensuring platform security</LI>
        </UL>
        <Highlight>
          We do not sell your personal data. We do not use your data for advertising or marketing
          purposes without your explicit consent.
        </Highlight>
      </>
    ),
  },
  {
    id: "legal-basis",
    title: "Legal basis for processing",
    content: (
      <>
        <P>
          Under Article 6 of the GDPR, we process your personal data on the following legal bases:
        </P>
        <UL>
          <LI>
            <strong className="text-white/60">Contract performance</strong> — Processing necessary
            to fulfil your booking and provide our services (Art. 6(1)(b))
          </LI>
          <LI>
            <strong className="text-white/60">Legitimate interests</strong> — Improving our
            services, preventing fraud, and ensuring platform security (Art. 6(1)(f))
          </LI>
          <LI>
            <strong className="text-white/60">Legal obligation</strong> — Complying with applicable
            laws, tax requirements, and regulatory obligations (Art. 6(1)(c))
          </LI>
          <LI>
            <strong className="text-white/60">Consent</strong> — Where required, such as for
            non-essential cookies or marketing communications (Art. 6(1)(a))
          </LI>
        </UL>
      </>
    ),
  },
  {
    id: "data-sharing",
    title: "Data sharing and third parties",
    content: (
      <>
        <P>We share your data with the following categories of recipients:</P>
        <H3>Hotel partners</H3>
        <P>
          Your booking details (name, dates, preferences) are shared with the hotel to fulfil your
          reservation. Hotels are independent data controllers for the data they receive.
        </P>
        <H3>Service providers</H3>
        <UL>
          <LI>
            <strong className="text-white/60">Supabase</strong> — Database and authentication
            services (data stored in EU region)
          </LI>
          <LI>
            <strong className="text-white/60">Vercel</strong> — Website hosting and content delivery
          </LI>
          <LI>
            <strong className="text-white/60">Resend</strong> — Transactional email delivery
          </LI>
        </UL>
        <P>
          All service providers are bound by data processing agreements and are required to protect
          your data in accordance with GDPR requirements.
        </P>
      </>
    ),
  },
  {
    id: "international-transfers",
    title: "International data transfers",
    content: (
      <P>
        Some of our service providers may process data outside the European Economic Area (EEA).
        Where this occurs, we ensure appropriate safeguards are in place, including Standard
        Contractual Clauses (SCCs) approved by the European Commission, to protect your data in
        accordance with GDPR requirements.
      </P>
    ),
  },
  {
    id: "data-retention",
    title: "Data retention",
    content: (
      <>
        <P>We retain your personal data for the following periods:</P>
        <UL>
          <LI>
            <strong className="text-white/60">Booking data</strong> — 3 years after your last stay
            (as required by French commercial law)
          </LI>
          <LI>
            <strong className="text-white/60">Card warranty details</strong> — Deleted within 30
            days of check-out or cancellation
          </LI>
          <LI>
            <strong className="text-white/60">Communication records</strong> — 2 years from last
            interaction
          </LI>
          <LI>
            <strong className="text-white/60">Analytics data</strong> — 13 months (anonymised after
            this period)
          </LI>
          <LI>
            <strong className="text-white/60">Account data (staff)</strong> — Duration of
            employment plus 1 year
          </LI>
        </UL>
        <P>
          After the retention period, data is securely deleted or anonymised.
        </P>
      </>
    ),
  },
  {
    id: "your-rights",
    title: "Your rights under GDPR",
    content: (
      <>
        <P>Under the GDPR, you have the following rights regarding your personal data:</P>
        <UL>
          <LI>
            <strong className="text-white/60">Right of access</strong> — Request a copy of your
            personal data
          </LI>
          <LI>
            <strong className="text-white/60">Right to rectification</strong> — Request correction
            of inaccurate data
          </LI>
          <LI>
            <strong className="text-white/60">Right to erasure</strong> — Request deletion of your
            data (&ldquo;right to be forgotten&rdquo;)
          </LI>
          <LI>
            <strong className="text-white/60">Right to restrict processing</strong> — Request
            limitation of how we process your data
          </LI>
          <LI>
            <strong className="text-white/60">Right to data portability</strong> — Receive your
            data in a structured, machine-readable format
          </LI>
          <LI>
            <strong className="text-white/60">Right to object</strong> — Object to processing based
            on legitimate interests
          </LI>
          <LI>
            <strong className="text-white/60">Right to withdraw consent</strong> — Withdraw consent
            at any time where processing is based on consent
          </LI>
        </UL>
        <P>
          To exercise any of these rights, please contact us at{" "}
          <InlineLink href="mailto:privacy@parisvasy.com">privacy@parisvasy.com</InlineLink>. We
          will respond to your request within 30 days.
        </P>
      </>
    ),
  },
  {
    id: "security",
    title: "Security measures",
    content: (
      <>
        <P>
          We implement appropriate technical and organisational measures to protect your personal
          data, including:
        </P>
        <UL>
          <LI>Encryption of data in transit (TLS/SSL) and at rest</LI>
          <LI>Row-level security policies on database tables</LI>
          <LI>Role-based access control for staff members</LI>
          <LI>Regular security assessments and updates</LI>
          <LI>Secure authentication with password hashing</LI>
        </UL>
        <P>
          While we take all reasonable steps to protect your data, no method of transmission or
          storage is 100% secure. If you discover a security vulnerability, please contact us
          immediately at privacy@parisvasy.com.
        </P>
      </>
    ),
  },
  {
    id: "children",
    title: "Children&rsquo;s privacy",
    content: (
      <P>
        Our Platform is not intended for children under the age of 16. We do not knowingly collect
        personal data from children. If you believe we have inadvertently collected data from a
        child, please contact us immediately and we will delete it.
      </P>
    ),
  },
  {
    id: "changes",
    title: "Changes to this policy",
    content: (
      <P>
        We may update this Privacy Policy from time to time to reflect changes in our practices or
        applicable laws. The most current version will always be posted on this page with the
        updated effective date. For significant changes, we will notify you via email or a prominent
        notice on our Platform.
      </P>
    ),
  },
  {
    id: "contact",
    title: "Contact and complaints",
    content: (
      <>
        <P>For privacy-related inquiries or to exercise your rights:</P>
        <UL>
          <LI>Email: privacy@parisvasy.com</LI>
          <LI>Address: PARISVASY SAS, 12 Rue de Rivoli, 75001 Paris, France</LI>
        </UL>
        <P>
          If you are not satisfied with our response, you have the right to lodge a complaint with
          the French data protection authority:{" "}
          <InlineLink href="https://www.cnil.fr">
            Commission Nationale de l&apos;Informatique et des Libertés (CNIL)
          </InlineLink>
          .
        </P>
      </>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Privacy Policy"
      effectiveDate="March 23, 2026"
      sections={sections}
      contactEmail="privacy@parisvasy.com"
    />
  );
}
