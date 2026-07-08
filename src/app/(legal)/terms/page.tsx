import type { Metadata } from "next";
import LegalPage, {
  P, H3, UL, LI, Highlight, InlineLink,
  type LegalSection,
} from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Terms of Service — PARISVASY",
  description: "Terms and conditions for using the PARISVASY platform.",
};

const sections: LegalSection[] = [
  {
    id: "acceptance",
    title: "Acceptance of terms",
    content: (
      <>
        <P>
          By accessing or using the PARISVASY platform (&ldquo;the Platform&rdquo;), including our
          website, booking services, and related applications, you agree to be bound by these Terms
          of Service (&ldquo;Terms&rdquo;). If you do not agree to these Terms, please do not use
          our services.
        </P>
        <P>
          These Terms constitute a legally binding agreement between you and PARISVASY SAS. We
          reserve the right to update these Terms at any time, and your continued use of the
          Platform after such changes constitutes acceptance of the revised Terms.
        </P>
      </>
    ),
  },
  {
    id: "about",
    title: "About PARISVASY",
    content: (
      <>
        <P>
          PARISVASY is a hospitality platform that combines premium hotel accommodations with
          curated experiences. We partner with selected hotels to offer guests a seamless booking
          experience where a complimentary experience is included with every room reservation.
        </P>
        <P>
          PARISVASY SAS is a company registered in France. Our registered address is 12 Rue de
          Rivoli, 75001 Paris, France.
        </P>
      </>
    ),
  },
  {
    id: "booking",
    title: "Booking and reservations",
    content: (
      <>
        <H3>Eligibility</H3>
        <P>
          To make a booking through our Platform, you must be at least 18 years of age and have the
          legal capacity to enter into a binding contract. By making a booking, you confirm that the
          information you provide is accurate and complete.
        </P>
        <H3>Booking process</H3>
        <P>
          Our booking process is designed to be simple and transparent. You select an experience,
          choose your dates and room, and provide your contact information. No user account is
          required to make a booking — we believe in frictionless hospitality.
        </P>
        <H3>Confirmation</H3>
        <P>
          Upon completing your booking and providing your card warranty, you will receive a booking
          confirmation with a unique reference number. This confirmation is sent to the email
          address you provided during the booking process.
        </P>
        <Highlight>
          No account is required to book with PARISVASY. We collect only the information necessary
          to process your reservation.
        </Highlight>
      </>
    ),
  },
  {
    id: "experiences",
    title: "Experiences",
    content: (
      <>
        <H3>Complimentary inclusion</H3>
        <P>
          Every booking on PARISVASY includes a complimentary experience at no additional cost. The
          experience is an integral part of our offering and is included in the room rate.
        </P>
        <H3>Availability</H3>
        <P>
          Experiences are subject to availability and may vary based on season, weather conditions,
          or other factors. PARISVASY reserves the right to substitute an experience of equal or
          greater value if the originally booked experience becomes unavailable.
        </P>
        <H3>Third-party providers</H3>
        <P>
          Some experiences may be provided by third-party operators. While we carefully select our
          partners, PARISVASY acts as an intermediary and the experience itself is subject to the
          third-party provider&apos;s own terms and conditions.
        </P>
      </>
    ),
  },
  {
    id: "pricing",
    title: "Pricing and payment warranty",
    content: (
      <>
        <H3>Pricing</H3>
        <P>
          All prices displayed on the Platform are in Euros (€) and include applicable taxes unless
          otherwise stated. Prices are per room and may vary based on room type, dates, and
          availability.
        </P>
        <Highlight>
          No payment is taken at the time of booking. Your card is held as a warranty only.
        </Highlight>
        <H3>Card warranty</H3>
        <P>
          During the booking process, you are asked to provide credit card details. This card is
          held as a warranty (guarantee) for your reservation. Your card will not be charged at the
          time of booking. Payment for your stay is collected directly by the hotel at check-in or
          check-out, according to the hotel&apos;s own payment policy.
        </P>
        <H3>Warranty enforcement</H3>
        <P>
          Your card warranty may be charged in the following circumstances:
        </P>
        <UL>
          <LI>Late cancellation (less than 48 hours before check-in)</LI>
          <LI>No-show (failure to arrive without prior cancellation)</LI>
          <LI>Damage to hotel property during your stay</LI>
        </UL>
        <P>
          The amount charged will not exceed the total value of the first night&apos;s stay unless
          otherwise specified in the hotel&apos;s cancellation policy.
        </P>
      </>
    ),
  },
  {
    id: "cancellation",
    title: "Cancellation and modifications",
    content: (
      <>
        <H3>Free cancellation</H3>
        <P>
          You may cancel your booking free of charge up to 48 hours before your scheduled check-in
          date and time. Cancellations can be made by contacting our support team with your booking
          reference number.
        </P>
        <H3>Late cancellation</H3>
        <P>
          Cancellations made less than 48 hours before check-in may be subject to a fee equivalent
          to the first night&apos;s room rate. This fee will be charged to the card provided as
          warranty.
        </P>
        <H3>Modifications</H3>
        <P>
          Booking modifications (dates, room type, guest count) are subject to availability and may
          result in a price adjustment. Contact our support team to request modifications.
        </P>
        <H3>Force majeure</H3>
        <P>
          In cases of force majeure (natural disasters, pandemics, government restrictions, etc.),
          PARISVASY will work with you and the hotel to find a suitable alternative, including full
          refund, date change, or credit for future use.
        </P>
      </>
    ),
  },
  {
    id: "check-in-out",
    title: "Check-in and check-out",
    content: (
      <>
        <H3>Times</H3>
        <P>
          Standard check-in time is from 15:00 (3:00 PM) and check-out time is by 11:00 (11:00 AM),
          unless otherwise stated by the hotel. Early check-in or late check-out may be available
          upon request and subject to availability.
        </P>
        <H3>Identification</H3>
        <P>
          A valid government-issued photo identification (passport or national ID card) is required
          at check-in. The name on the identification must match the name on the booking.
        </P>
        <H3>Payment at check-in</H3>
        <P>
          Full payment for your stay is collected by the hotel at check-in or check-out. The hotel
          may accept various payment methods. The card used as warranty during booking may be used
          for payment if you so choose.
        </P>
      </>
    ),
  },
  {
    id: "conduct",
    title: "User conduct",
    content: (
      <>
        <P>When using our Platform and during your stay, you agree to:</P>
        <UL>
          <LI>Provide accurate and truthful information</LI>
          <LI>Comply with all applicable laws and regulations</LI>
          <LI>Respect hotel property, staff, and other guests</LI>
          <LI>Not use the Platform for any fraudulent or unlawful purpose</LI>
          <LI>Not attempt to circumvent any security measures</LI>
          <LI>Not reproduce, duplicate, or exploit any part of the Platform</LI>
        </UL>
        <P>
          PARISVASY reserves the right to refuse service, cancel bookings, or restrict access to the
          Platform for users who violate these terms.
        </P>
      </>
    ),
  },
  {
    id: "ip",
    title: "Intellectual property",
    content: (
      <P>
        All content on the PARISVASY Platform — including text, graphics, logos, images, software,
        and the overall design — is the property of PARISVASY SAS or its licensors and is protected
        by French and international intellectual property laws. You may not reproduce, distribute,
        modify, or create derivative works from any content without our prior written consent.
      </P>
    ),
  },
  {
    id: "liability",
    title: "Limitation of liability",
    content: (
      <>
        <P>
          PARISVASY acts as an intermediary between guests and hotel partners. While we strive to
          ensure the accuracy of all information on our Platform:
        </P>
        <UL>
          <LI>
            We are not liable for the quality, safety, or legality of hotel accommodations or
            experiences
          </LI>
          <LI>
            We are not responsible for any personal injury, property damage, or loss during your
            stay or experience
          </LI>
          <LI>
            Our total liability to you for any claim arising from use of our Platform shall not
            exceed the total amount of your booking
          </LI>
        </UL>
        <P>
          Nothing in these Terms limits our liability for death or personal injury caused by our
          negligence, fraud, or any other liability that cannot be excluded by law.
        </P>
      </>
    ),
  },
  {
    id: "governing-law",
    title: "Governing law",
    content: (
      <>
        <P>
          These Terms are governed by and construed in accordance with the laws of France. Any
          disputes arising from these Terms or your use of the Platform shall be subject to the
          exclusive jurisdiction of the courts of Paris, France.
        </P>
        <P>
          For EU consumers: You may also use the European Commission&apos;s Online Dispute
          Resolution (ODR) platform at{" "}
          <InlineLink href="https://ec.europa.eu/consumers/odr">
            ec.europa.eu/consumers/odr
          </InlineLink>
          .
        </P>
      </>
    ),
  },
  {
    id: "changes",
    title: "Changes to these terms",
    content: (
      <P>
        We may revise these Terms from time to time. The most current version will always be posted
        on this page with the updated effective date. By continuing to use the Platform after changes
        are posted, you agree to the revised Terms. We encourage you to review these Terms
        periodically.
      </P>
    ),
  },
  {
    id: "contact",
    title: "Contact",
    content: (
      <>
        <P>
          If you have any questions about these Terms of Service, please contact us:
        </P>
        <UL>
          <LI>Email: legal@parisvasy.com</LI>
          <LI>Address: 12 Rue de Rivoli, 75001 Paris, France</LI>
        </UL>
      </>
    ),
  },
];

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Terms of Service"
      effectiveDate="March 23, 2026"
      sections={sections}
      contactEmail="legal@parisvasy.com"
    />
  );
}
