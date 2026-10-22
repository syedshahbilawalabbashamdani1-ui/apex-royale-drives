import PageHeader from "@/components/layout/PageHeader";
import Heading from "@/components/ui/Heading";
import { CONTACT, SITE_URL } from "@/lib/constants";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen" style={{ background: "var(--bg-primary)" }}>
      <PageHeader title="Privacy policy" breadcrumb="Privacy policy" width="reading" description="Last updated: September 2026" />

      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 page-body space-y-8">
        {[
          {
            title: "1. Information we collect",
            body: `When you use our services or visit ${SITE_URL}, we may collect the following personal information: your name, email address, phone number, pickup and drop-off addresses, and booking history. We also collect standard web analytics data including IP address, browser type, and pages visited.`,
          },
          {
            title: "2. How we use your information",
            body: `We use your personal information to: confirm and coordinate your bookings, communicate with you regarding your reservations and pickup details, provide customer support, and improve our services and website. We do not use your information for automated decision-making or advertising.`,
          },
          {
            title: "3. WhatsApp communications",
            body: `Our primary mode of booking confirmation and customer communication is via WhatsApp. By providing your phone number, you consent to receive booking-related messages via WhatsApp. You can opt out of promotional messages at any time by messaging us with "STOP".`,
          },
          {
            title: "4. Information sharing",
            body: `We do not sell, trade, or rent your personal information to third parties. We may share your information with: our professional drivers (limited to your name and contact for booking fulfillment), payment processing partners, and law enforcement agencies when required by law.`,
          },
          {
            title: "5. Data security",
            body: `We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.`,
          },
          {
            title: "6. Cookies & tracking",
            body: `This website does not set advertising or tracking cookies. It stores two preferences in your browser's local storage, which never leaves your device: your light or dark theme choice, and any vehicles you have saved to your wishlist. Clearing your browser data removes both.`,
          },
          {
            title: "7. Data retention",
            body: `We retain your personal information for as long as necessary to fulfill the purposes outlined in this policy, unless a longer retention period is required or permitted by law. Booking records are retained for 2 years for accounting and legal purposes.`,
          },
          {
            title: "8. Your rights",
            body: `You have the right to: access the personal information we hold about you, request correction of inaccurate information, request deletion of your personal information, opt out of marketing communications, and lodge a complaint with a relevant data protection authority.`,
          },
          {
            title: "9. Children's privacy",
            body: `Our services are not directed to individuals under the age of 18. We do not knowingly collect personal information from children. If we become aware that we have collected information from a child, we will take steps to delete it promptly.`,
          },
          {
            title: "10. Changes to this policy",
            body: `We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated revision date. We encourage you to review this policy periodically.`,
          },
          {
            title: "11. Contact us",
            body: `If you have any questions about this Privacy Policy or how we handle your data, please contact us at ${CONTACT.phone} or email ${CONTACT.email}. Address: ${CONTACT.address}.`,
          },
        ].map((section) => (
          <section key={section.title}>
            <Heading as="h2" size="subsection" className="mb-3">
              {section.title}
            </Heading>
            <p className="font-sans text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              {section.body}
            </p>
          </section>
        ))}
      </div>
    </div>
  );
}
