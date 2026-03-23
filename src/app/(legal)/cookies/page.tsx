import type { Metadata } from "next";
import LegalPage, {
  P, H3, UL, LI, Highlight, InlineLink,
  type LegalSection,
} from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Cookie Policy — PARISVASY",
  description: "How PARISVASY uses cookies and similar technologies.",
};

const sections: LegalSection[] = [
  {
    id: "what-are-cookies",
    title: "What are cookies",
    content: (
      <P>
        Cookies are small text files that are placed on your device (computer, tablet, or phone)
        when you visit a website. They are widely used to make websites work more efficiently, to
        remember your preferences, and to provide information to the website owner. Cookies can be
        &ldquo;persistent&rdquo; (remaining on your device until deleted) or &ldquo;session&rdquo;
        (deleted when you close your browser).
      </P>
    ),
  },
  {
    id: "how-we-use",
    title: "How we use cookies",
    content: (
      <>
        <P>
          PARISVASY uses a minimal number of cookies to ensure the Platform functions correctly
          and to improve your experience. We prioritise your privacy and use only the cookies
          necessary for our services.
        </P>
        <Highlight>
          We do not use advertising or tracking cookies. We do not serve ads and do not track you
          across other websites.
        </Highlight>
      </>
    ),
  },
  {
    id: "types",
    title: "Types of cookies we use",
    content: (
      <>
        <H3>Strictly necessary cookies</H3>
        <P>
          These cookies are essential for the Platform to function. They enable core features like
          secure authentication, session management, and booking functionality. You cannot opt out
          of these cookies as the Platform would not work without them.
        </P>
        <UL>
          <LI>
            <strong className="text-white/60">Authentication cookies</strong> — Manage your login
            session (Supabase Auth)
          </LI>
          <LI>
            <strong className="text-white/60">Hotel selection</strong> — Remember your selected
            hotel context in the admin panel (pv_selected_hotel)
          </LI>
          <LI>
            <strong className="text-white/60">Cookie consent</strong> — Remember your cookie
            preferences (parisvasy_consent)
          </LI>
        </UL>

        <H3>Functional cookies</H3>
        <P>
          These cookies enhance your experience by remembering preferences and settings you have
          chosen.
        </P>
        <UL>
          <LI>
            <strong className="text-white/60">Language preference</strong> — Remember your
            preferred language (if applicable)
          </LI>
          <LI>
            <strong className="text-white/60">UI preferences</strong> — Remember display settings
          </LI>
        </UL>

        <H3>Analytics cookies</H3>
        <P>
          With your consent, we may use analytics cookies to understand how visitors interact with
          our Platform. This helps us improve our services. All analytics data is anonymised and
          aggregated.
        </P>
        <UL>
          <LI>
            <strong className="text-white/60">Vercel Analytics</strong> — Privacy-focused web
            analytics (no personal data collected)
          </LI>
        </UL>
      </>
    ),
  },
  {
    id: "third-party",
    title: "Third-party cookies",
    content: (
      <>
        <P>
          Some cookies on our Platform are placed by third-party services that we use:
        </P>
        <UL>
          <LI>
            <strong className="text-white/60">Supabase</strong> — Authentication and session
            management
          </LI>
          <LI>
            <strong className="text-white/60">Vercel</strong> — Hosting and performance analytics
          </LI>
        </UL>
        <P>
          We do not allow any third-party advertising networks to place cookies on our Platform. We
          do not participate in cross-site tracking or retargeting.
        </P>
      </>
    ),
  },
  {
    id: "managing",
    title: "Managing your cookies",
    content: (
      <>
        <H3>Consent banner</H3>
        <P>
          When you first visit our Platform, you will see a cookie consent banner allowing you to
          accept all cookies or use only strictly necessary ones. You can change your preference at
          any time by clearing your cookies and revisiting the Platform.
        </P>
        <H3>Browser settings</H3>
        <P>
          You can also manage cookies through your browser settings. Here are links to cookie
          management instructions for popular browsers:
        </P>
        <UL>
          <LI>
            <InlineLink href="https://support.google.com/chrome/answer/95647">
              Google Chrome
            </InlineLink>
          </LI>
          <LI>
            <InlineLink href="https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer">
              Mozilla Firefox
            </InlineLink>
          </LI>
          <LI>
            <InlineLink href="https://support.apple.com/en-us/105082">Safari</InlineLink>
          </LI>
          <LI>
            <InlineLink href="https://support.microsoft.com/en-us/microsoft-edge/manage-cookies-in-microsoft-edge-view-allow-block-delete-and-use-168dab11-0753-043d-7c16-ede5947fc64d">
              Microsoft Edge
            </InlineLink>
          </LI>
        </UL>
        <P>
          Please note that disabling cookies may affect the functionality of our Platform. Strictly
          necessary cookies cannot be disabled without breaking core features.
        </P>
      </>
    ),
  },
  {
    id: "changes",
    title: "Changes to this policy",
    content: (
      <P>
        We may update this Cookie Policy from time to time to reflect changes in the cookies we use
        or for regulatory reasons. The most current version will always be posted on this page with
        the updated effective date.
      </P>
    ),
  },
  {
    id: "contact",
    title: "Contact",
    content: (
      <>
        <P>
          If you have any questions about our use of cookies, please contact us:
        </P>
        <UL>
          <LI>Email: privacy@parisvasy.com</LI>
          <LI>Address: PARISVASY SAS, 12 Rue de Rivoli, 75001 Paris, France</LI>
        </UL>
      </>
    ),
  },
];

export default function CookiesPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Cookie Policy"
      effectiveDate="March 23, 2026"
      sections={sections}
      contactEmail="privacy@parisvasy.com"
    />
  );
}
