"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CONTACT } from "@/lib/constants";
import { WhatsAppIcon } from "@/components/ui/SocialIcons";

export default function CTA() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, var(--bg-tertiary), var(--bg-primary), var(--bg-tertiary))" }} />

      {/* Glow effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-electric-cyan/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-deep-ocean/20 rounded-full blur-[120px]" />

      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-8"
        >
          <h2 className="font-orbitron text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight" style={{ color: "var(--text-primary)" }}>
            READY TO HIT
            <br />
            <span className="text-gradient">THE ROAD?</span>
          </h2>

          <p className="font-inter text-lg max-w-2xl mx-auto" style={{ color: "var(--text-secondary)" }}>
            Book your car today and experience comfortable, reliable travel in
            Islamabad and Rawalpindi. Special rates for weekly and monthly rentals.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/booking" className="btn-primary text-base px-8 py-4">
              <span>Book Your Ride</span>
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            <a
              href={`https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent("Hi, I want to rent a car in Islamabad")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary text-base px-8 py-4"
            >
              <WhatsAppIcon className="w-5 h-5 mr-2" />
              <span>WhatsApp Us</span>
            </a>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap items-center justify-center gap-8 pt-8">
            {[
              "No Hidden Fees",
              "Professional Drivers",
              "24/7 Support",
              "Airport Transfers",
            ].map((badge) => (
              <div
                key={badge}
                className="flex items-center gap-2"
                style={{ color: "var(--text-secondary)" }}
              >
                <div className="w-2 h-2 rounded-full bg-electric-cyan" />
                <span className="font-inter text-sm">{badge}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
