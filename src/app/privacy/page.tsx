"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Shield } from "lucide-react";
import { CONTACT, SITE_URL } from "@/lib/constants";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen" style={{ background: "var(--bg-primary)" }}>
      <div className="py-20" style={{ background: "var(--bg-tertiary)" }}>
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 font-sans text-sm mb-6">
            <Link href="/" className="text-theme-secondary hover:text-electric-cyan transition-colors flex items-center gap-1">
              <ArrowLeft className="w-4 h-4" /> Home
            </Link>
            <span style={{ color: "var(--text-secondary)", opacity: 0.5 }}>/</span>
            <span style={{ color: "var(--text-primary)" }}>Privacy Policy</span>
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-electric-cyan" />
              <h1 className="font-sans text-4xl sm:text-5xl font-bold" style={{ color: "var(--text-primary)" }}>
                Privacy <span className="text-accent">Policy</span>
              </h1>
            </div>
            <p className="font-sans" style={{ color: "var(--text-secondary)" }}>
              Last updated: September 2026
            </p>
          </motion.div>
        </div>
      </div>

      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
        {[
          {
            title: "1. Information We Collect",
            body: `When you use our services or visit ${SITE_URL}, we may collect the following personal information: your name, email address, phone number, pickup and drop-off addresses, and booking history. We also collect standard web analytics data including IP address, browser type, and pages visited.`,
          },
          {
            title: "2. How We Use Your Information",
            body: `We use your personal information to: confirm and coordinate your bookings, communicate with you regarding your reservations and pickup details, provide customer support, and improve our services and website. We do not use your information for automated decision-making or advertising.`,
          },
          {
            title: "3. WhatsApp Communications",
            body: `Our primary mode of booking confirmation and customer communication is via WhatsApp. By providing your phone number, you consent to receive booking-related messages via WhatsApp. You can opt out of promotional messages at any time by messaging us with "STOP".`,
          },
          {
            title: "4. Information Sharing",
            body: `We do not sell, trade, or rent your personal information to third parties. We may share your information with: our professional drivers (limited to your name and contact for booking fulfillment), payment processing partners, and law enforcement agencies when required by law.`,
          },
          {
            title: "5. Data Security",
            body: `We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.`,
          },
          {
            title: "6. Cookies & Tracking",
            body: `This website does not set advertising or tracking cookies. It stores two preferences in your browser's local storage, which never leaves your device: your light or dark theme choice, and any vehicles you have saved to your wishlist. Clearing your browser data removes both.`,
          },
          {
            title: "7. Data Retention",
            body: `We retain your personal information for as long as necessary to fulfill the purposes outlined in this policy, unless a longer retention period is required or permitted by law. Booking records are retained for 2 years for accounting and legal purposes.`,
          },
          {
            title: "8. Your Rights",
            body: `You have the right to: access the personal information we hold about you, request correction of inaccurate information, request deletion of your personal information, opt out of marketing communications, and lodge a complaint with a relevant data protection authority.`,
          },
          {
            title: "9. Children's Privacy",
            body: `Our services are not directed to individuals under the age of 18. We do not knowingly collect personal information from children. If we become aware that we have collected information from a child, we will take steps to delete it promptly.`,
          },
          {
            title: "10. Changes to This Policy",
            body: `We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated revision date. We encourage you to review this policy periodically.`,
          },
          {
            title: "11. Contact Us",
            body: `If you have any questions about this Privacy Policy or how we handle your data, please contact us at ${CONTACT.phone} or email ${CONTACT.email}. Address: ${CONTACT.address}.`,
          },
        ].map((section) => (
          <motion.section
            key={section.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-sans text-lg font-bold mb-3" style={{ color: "var(--text-primary)" }}>
              {section.title}
            </h2>
            <p className="font-sans text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              {section.body}
            </p>
          </motion.section>
        ))}
      </div>
    </div>
  );
}
