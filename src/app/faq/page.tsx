"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ChevronDown, ArrowLeft, HelpCircle } from "lucide-react";
import { CONTACT } from "@/lib/constants";
import { cn } from "@/lib/utils";

const faqCategories = [
  {
    category: "Booking & Reservations",
    questions: [
      {
        q: "How do I book a car?",
        a: "You can book a car through our Booking page by selecting your dates, pickup location, and preferred vehicle. After submitting, our team will confirm your reservation via WhatsApp within minutes.",
      },
      {
        q: "Can I book multiple cars at once?",
        a: "Yes! Our booking system supports multi-car reservations. Select multiple vehicles in Step 1 and specify the number of days for each. You'll receive a combined quote via WhatsApp.",
      },
      {
        q: "Do you offer custom fleet requests?",
        a: "Absolutely. If you need a vehicle not listed in our fleet, use the 'Custom Fleet Request' option in the booking form to describe your requirements and we'll do our best to accommodate.",
      },
      {
        q: "How far in advance should I book?",
        a: "We recommend booking at least 24 hours in advance for the best availability. For peak seasons, weddings, or special events, we suggest booking 1-2 weeks ahead.",
      },
    ],
  },
  {
    category: "Pricing & Payments",
    questions: [
      {
        q: "What are your rental rates?",
        a: "Rates vary by vehicle. Daily rates start from Rs. 30,000 for sedans up to Rs. 150,000 for luxury SUVs. Weekly and monthly discounts are available. Check our Fleet page for specific pricing.",
      },
      {
        q: "Are there any hidden charges?",
        a: "No hidden charges. The price quoted is the price you pay. Fuel is not included — you only pay for the fuel you use during your rental period.",
      },
      {
        q: "What payment methods do you accept?",
        a: "We accept bank transfers, cash, and JazzCash/EasyPaisa. Payment is collected at the time of vehicle pickup or as agreed during booking confirmation.",
      },
      {
        q: "Is a security deposit required?",
        a: "A security deposit may be required for certain high-value vehicles. This is fully refundable upon return of the vehicle in its original condition.",
      },
    ],
  },
  {
    category: "Vehicles & Drivers",
    questions: [
      {
        q: "Do you provide drivers?",
        a: "Yes, professional experienced drivers are available with every rental. Driver charges may apply separately depending on the rental package.",
      },
      {
        q: "What vehicles are in your fleet?",
        a: "Our fleet includes sedans (Audi A6, Corolla, Yaris, City), SUVs (Fortuner, Revo), and luxury vehicles. All vehicles are well-maintained and regularly serviced.",
      },
      {
        q: "Can I drive the car myself?",
        a: "Self-drive options are available for select vehicles. A valid driving license and ID are required. Please mention your preference during booking.",
      },
      {
        q: "Are the cars insured?",
        a: "All our vehicles come with comprehensive insurance coverage. In case of any incident, standard insurance terms and deductibles apply.",
      },
    ],
  },
  {
    category: "Pickup & Drop-off",
    questions: [
      {
        q: "Where can I pick up the car?",
        a: "We offer pickup from F-10 Markaz (our main office), Islamabad International Airport, and any location within Islamabad and Rawalpindi. Additional locations can be arranged.",
      },
      {
        q: "Do you offer airport transfers?",
        a: "Yes! We provide seamless airport pickup and drop-off services. Our driver will meet you at the arrivals terminal with a name board.",
      },
      {
        q: "What areas do you serve?",
        a: "We primarily serve Islamabad and Rawalpindi. For outstation travel to Murree, Naran, Swat, and other northern areas, special packages are available.",
      },
      {
        q: "What are the rental durations available?",
        a: "We offer daily, weekly, and monthly rental plans. Long-distance travel packages for trips to northern Pakistan are also available.",
      },
    ],
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<string | null>(null);

  const toggle = (key: string) => {
    setOpenIndex(openIndex === key ? null : key);
  };

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-primary)" }}>
      {/* Hero */}
      <div className="py-20" style={{ background: "var(--bg-tertiary)" }}>
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 font-sans text-sm mb-6">
            <Link
              href="/"
              className="text-theme-secondary hover:text-electric-cyan transition-colors flex items-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" />
              Home
            </Link>
            <span style={{ color: "var(--text-secondary)", opacity: 0.5 }}>/</span>
            <span style={{ color: "var(--text-primary)" }}>FAQ</span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-4"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <HelpCircle className="w-8 h-8 text-electric-cyan" />
            </div>
            <h1 className="font-general-sans text-4xl sm:text-5xl font-bold" style={{ color: "var(--text-primary)" }}>
              Frequently Asked <span className="text-gradient">Questions</span>
            </h1>
            <p className="font-sans max-w-2xl mx-auto" style={{ color: "var(--text-secondary)" }}>
              Everything you need to know about renting a car with Apex Royale Drives. Can&apos;t find your answer?{" "}
              <Link href="/contact" className="text-electric-cyan hover:underline">Contact us</Link>.
            </p>
          </motion.div>
        </div>
      </div>

      {/* FAQ Content */}
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        {faqCategories.map((cat, catIndex) => (
          <motion.section
            key={cat.category}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: catIndex * 0.1 }}
          >
            <h2 className="font-general-sans text-xl font-bold mb-6" style={{ color: "var(--text-primary)" }}>
              {cat.category}
            </h2>
            <div className="space-y-3">
              {cat.questions.map((item, i) => {
                const key = `${catIndex}-${i}`;
                const isOpen = openIndex === key;
                return (
                  <div
                    key={key}
                    className="border rounded-lg overflow-hidden transition-colors"
                    style={{
                      background: "var(--bg-secondary)",
                      borderColor: isOpen ? "var(--accent)" : "var(--border-primary)",
                    }}
                  >
                    <button
                      onClick={() => toggle(key)}
                      className="w-full flex items-center justify-between p-4 text-left"
                      aria-expanded={isOpen}
                    >
                      <span className="font-sans text-sm font-medium pr-4" style={{ color: "var(--text-primary)" }}>
                        {item.q}
                      </span>
                      <ChevronDown
                        className={cn(
                          "w-5 h-5 flex-shrink-0 transition-transform duration-200",
                          isOpen && "rotate-180"
                        )}
                        style={{ color: "var(--text-secondary)" }}
                      />
                    </button>
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="px-4 pb-4">
                            <p className="font-sans text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                              {item.a}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </motion.section>
        ))}

        {/* CTA */}
        <div className="text-center pt-8 border-t" style={{ borderColor: "var(--border-primary)" }}>
          <p className="font-sans mb-4" style={{ color: "var(--text-secondary)" }}>
            Still have questions? We&apos;re here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={`https://wa.me/${CONTACT.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              Chat on WhatsApp
            </a>
            <Link href="/contact" className="btn-secondary">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
