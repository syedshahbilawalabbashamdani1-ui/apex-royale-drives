"use client";

import Button from "@/components/ui/Button";
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronDown, ArrowLeft, HelpCircle } from "lucide-react";
import { whatsappLink, CONTACT } from "@/lib/constants";
import { cars, locations } from "@/lib/cars";
import { formatPKR } from "@/lib/pricing";
import { cn } from "@/lib/utils";

/* ── facts derived from the fleet data so copy can never drift ── */

const dailyPrices = cars.map((c) => c.pricePerDay);
const cheapest = cars.reduce((a, b) => (a.pricePerDay <= b.pricePerDay ? a : b));
const fleetList = cars.map((c) => c.name).join(", ");

const faqCategories = [
  {
    category: "Booking & Reservations",
    questions: [
      {
        q: "How do I book a car?",
        a: "Use the Book page. Pick your vehicle, choose your dates and pickup location, and add your contact details. When you confirm, your booking summary opens in WhatsApp — send it to us and we will confirm availability and the final price. You can also call or message us directly at any hour.",
      },
      {
        q: "Can I book more than one vehicle?",
        a: "Yes. Select as many vehicles as you need in step one. They all share the same pickup and return dates, and we will send you a single combined quote.",
      },
      {
        q: "Do you offer vehicles that are not on your website?",
        a: "Yes. Every page has a Custom Fleet option. Tell us the make and model you are after and we will tell you whether we can arrange it and what it will cost.",
      },
      {
        q: "How far in advance should I book?",
        a: "For a specific date, especially a wedding or a busy travel day, book 24 to 48 hours ahead where you can. Same-day bookings are often fine — just message us and we will check the vehicle is free.",
      },
      {
        q: "How long does confirmation take?",
        a: "We reply on WhatsApp within minutes during business hours and at all other times because we operate 24/7.",
      },
    ],
  },
  {
    category: "Pricing & Payment",
    questions: [
      {
        q: "What are your rates?",
        a: `Daily rates run from ${formatPKR(Math.min(...dailyPrices))} for the ${cheapest.name} up to ${formatPKR(Math.max(...dailyPrices))} for our luxury vehicles. Each vehicle has its daily rate listed on its page.`,
      },
      {
        q: "How is the rental price calculated?",
        a: "All rentals use daily pricing. Multiply the vehicle's daily rate by the number of rental days. The booking form calculates this amount for you.",
      },
      {
        q: "Are there any hidden charges?",
        a: "The rental itself is one price. Not included: fuel, tolls on motorways and inter-city highways, and parking. Those are charged at cost and your driver will always tell you before anything is incurred.",
      },
      {
        q: "How do I pay?",
        a: "We confirm the exact amount and payment method with you on WhatsApp before the trip. We do not take any payment through this website.",
      },
    ],
  },
  {
    category: "Vehicles & Drivers",
    questions: [
      {
        q: "Do you provide drivers?",
        a: "Every rental includes a professional driver. Driver time, fuel and vehicle wear are all covered in the rental rate — there is no separate driver charge to work out.",
      },
      {
        q: "What vehicles are in your fleet?",
        a: `${fleetList}. You can see full specifications, features and pricing for each one on the Fleet page.`,
      },
      {
        q: "Can I drive the car myself?",
        a: "No. All our vehicles are rented with a professional driver. If you need a self-drive rental, we can point you to a provider in Islamabad.",
      },
      {
        q: "Can you request a vehicle you do not list?",
        a: "Often, yes. Send us the make and model through the Custom Fleet option and we will confirm availability and pricing.",
      },
    ],
  },
  {
    category: "Pickup & Coverage",
    questions: [
      {
        q: "Where can I pick up the car?",
        a: `Our regular pickup points are: ${locations.join("; ")}. Any other address in Islamabad or Rawalpindi can usually be arranged — just mention it in your booking or on WhatsApp.`,
      },
      {
        q: "Do you offer airport transfers?",
        a: "Yes. Islamabad International Airport is a regular pickup point. Send us your flight number and the driver will meet you at arrivals with a name board.",
      },
      {
        q: "Which cities do you cover?",
        a: "Islamabad and Rawalpindi for daily use, and longer trips to Murree, Naran, Swat, Kaghan and the northern areas. For outstation trips, message us with your route and we will quote the trip as a whole.",
      },
      {
        q: "How far in advance can I book?",
        a: "As far ahead as you like. The booking form accepts any future date.",
      },
    ],
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<string | null>(null);

  const toggle = (key: string) =>
    setOpenIndex((current) => (current === key ? null : key));

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-primary)" }}>
      {/* Hero */}
      <div className="py-20" style={{ background: "var(--bg-tertiary)" }}>
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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
            <h1 className="font-sans text-4xl sm:text-5xl font-bold" style={{ color: "var(--text-primary)" }}>
              Frequently Asked <span className="text-accent">Questions</span>
            </h1>
            <p className="font-sans max-w-2xl mx-auto" style={{ color: "var(--text-secondary)" }}>
              Everything you need to know about renting a car with Apex Royale
              Drives. Can&apos;t find your answer?{" "}
              <Link href="/contact" className="text-electric-cyan hover:underline">
                Contact us
              </Link>
              .
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
            <h2 className="font-sans text-xl font-bold mb-6" style={{ color: "var(--text-primary)" }}>
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
                    <h3>
                      <button
                        id={`faq-btn-${key}`}
                        onClick={() => toggle(key)}
                        className="w-full flex items-center justify-between p-4 text-left"
                        aria-expanded={isOpen}
                        aria-controls={`faq-panel-${key}`}
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
                    </h3>
                    {/*
                      The answer stays in the DOM whether or not it is expanded —
                      only the row height collapses. Conditional mounting would hide
                      every answer from crawlers and from anyone without JS, which is
                      the content this page exists to rank for.
                    */}
                    <div
                      id={`faq-panel-${key}`}
                      role="region"
                      aria-labelledby={`faq-btn-${key}`}
                      aria-hidden={!isOpen}
                      className="grid transition-[grid-template-rows] duration-200 ease-out"
                      style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                    >
                      <div className="overflow-hidden">
                        <div className="px-4 pb-4">
                          <p className="font-sans text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                            {item.a}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.section>
        ))}

        {/* CTA */}
        <div className="text-center pt-8 border-t" style={{ borderColor: "var(--border-primary)" }}>
          <p className="font-sans mb-4" style={{ color: "var(--text-secondary)" }}>
            Still have questions? Call {CONTACT.phone} — we&apos;re on WhatsApp 24/7.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              href={whatsappLink("Hi, I have a question about car rental")}
              target="_blank"
              rel="noopener noreferrer"
              className=""
            >
              Chat on WhatsApp
            </Button>
            <Button variant="ghost" href="/contact" className="">
              Contact Us
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
