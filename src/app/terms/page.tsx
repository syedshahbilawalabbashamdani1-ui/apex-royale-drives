"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";
import { CONTACT, SITE_NAME } from "@/lib/constants";

export default function TermsPage() {
  return (
    <div className="min-h-screen" style={{ background: "var(--bg-primary)" }}>
      <div className="page-intro" style={{ background: "var(--bg-tertiary)" }}>
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 font-sans text-sm mb-6">
            <Link href="/" className="text-theme-secondary hover:text-accent-ink transition-colors flex items-center gap-1">
              <ArrowLeft className="w-4 h-4" /> Home
            </Link>
            <span style={{ color: "var(--text-secondary)", opacity: 0.5 }}>/</span>
            <span style={{ color: "var(--text-primary)" }}>Terms &amp; Conditions</span>
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <div className="flex items-center gap-3">
              <FileText className="w-8 h-8 text-accent-ink" />
              <h1 className="font-sans text-4xl sm:text-5xl font-bold" style={{ color: "var(--text-primary)" }}>
                Terms &amp; <span className="text-accent-ink">Conditions</span>
              </h1>
            </div>
            <p className="font-sans" style={{ color: "var(--text-secondary)" }}>
              Last updated: September 2026
            </p>
          </motion.div>
        </div>
      </div>

      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 page-body space-y-10">
        {[
          {
            title: "1. Acceptance of Terms",
            body: `By accessing or using the services of ${SITE_NAME} ("the Company"), including our website, booking services, and vehicle rental, you agree to be bound by these Terms and Conditions. If you do not agree, please do not use our services.`,
          },
          {
            title: "2. Booking & Reservations",
            body: `Bookings can be made through our website or via WhatsApp. A booking is confirmed only after you receive written confirmation from our team. The Company reserves the right to refuse or cancel bookings at its discretion. Prices quoted are subject to change until a booking is confirmed.`,
          },
          {
            title: "3. Rental Period & Pricing",
            body: `The rental period begins at the time of vehicle pickup and ends at the time of return. Rental rates are as displayed on our Fleet page or as quoted during booking. All rentals are charged per day. The rental amount is the vehicle's daily rate multiplied by the number of rental days. All prices are in Pakistani Rupees (PKR) and inclusive of applicable taxes unless stated otherwise.`,
          },
          {
            title: "4. Professional Driver",
            body: `Every rental is provided with a professional driver. Driver time and vehicle wear are included in the rental rate and no separate driver charge applies. Fuel, tolls and parking are charged separately at cost. Vehicles are not rented for self-drive.`,
          },
          {
            title: "5. Insurance & Liability",
            body: `All vehicles are covered by comprehensive insurance. In the event of an accident or damage, the renter may be liable for an excess amount as specified in the rental agreement. The Company is not liable for any loss of personal belongings left in the vehicle. Insurance does not cover damage caused by negligence, driving under the influence, or use outside permitted areas.`,
          },
          {
            title: "6. Fuel Policy",
            body: `Fuel is not included in the rental rate. The driver refuels the vehicle as needed during the rental and the cost is charged to you at cost. Tolls on motorways and inter-city highways, and parking, are also charged at cost and are always reported to you before they are incurred.`,
          },
          {
            title: "7. Cancellation & Refunds",
            body: `Cancellations made at least 24 hours before the scheduled pickup time will receive a full refund. Cancellations made less than 24 hours before pickup may be subject to a cancellation fee. No-shows will be charged the full rental amount. Refunds are processed within 5-7 business days.`,
          },
          {
            title: "8. Vehicle Condition & Returns",
            body: `The renter must return the vehicle in the same condition as received, subject to normal wear and tear. Late returns will incur additional charges at the daily rate. The Company reserves to charge for any damage beyond normal wear and tear.`,
          },
          {
            title: "9. Prohibited Uses",
            body: `The vehicle shall not be used for: illegal activities, racing or speed testing, towing or pushing other vehicles, driving under the influence of drugs or alcohol, carrying passengers or goods for hire, or use outside of Islamabad, Rawalpindi, and pre-approved travel destinations.`,
          },
          {
            title: "10. Outstation Travel",
            body: `Travel to northern areas (Murree, Naran, Swat, etc.) requires prior arrangement and approval. Special outstation packages apply. The renter must inform the Company of the travel itinerary. Additional charges may apply for long-distance rentals.`,
          },
          {
            title: "11. Amendments",
            body: `The Company reserves the right to amend these Terms and Conditions at any time. Continued use of our services after changes constitutes acceptance of the updated terms.`,
          },
          {
            title: "12. Contact",
            body: `For any questions regarding these Terms and Conditions, please contact us at ${CONTACT.phone} or email ${CONTACT.email}.`,
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
