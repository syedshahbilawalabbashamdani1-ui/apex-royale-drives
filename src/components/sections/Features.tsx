"use client";

import { motion } from "framer-motion";
import {
  Car,
  Shield,
  Clock,
  CreditCard,
  Headphones,
  MapPin,
} from "lucide-react";

const features = [
  {
    icon: Car,
    title: "Diverse Fleet",
    description:
      "From luxury SUVs like Land Cruiser and G Wagon to affordable sedans like Corolla and Civic — find the right car for every need.",
  },
  {
    icon: Shield,
    title: "Professional Drivers",
    description:
      "Experienced, courteous chauffeurs who know Islamabad and Rawalpindi inside out. Safe and comfortable rides guaranteed.",
  },
  {
    icon: Clock,
    title: "24/7 Availability",
    description:
      "Round-the-clock service. Rent anytime, day or night, with instant WhatsApp confirmation.",
  },
  {
    icon: CreditCard,
    title: "Transparent Pricing",
    description:
      "Competitive rates with no hidden fees. Daily, weekly, and monthly packages available.",
  },
  {
    icon: Headphones,
    title: "Customer Support",
    description:
      "Dedicated support via WhatsApp and phone. We're always ready to assist with bookings and inquiries.",
  },
  {
    icon: MapPin,
    title: "Islamabad & Rawalpindi",
    description:
      "Serving both cities with airport transfers, corporate travel, wedding cars, and special event transportation.",
  },
];

export default function Features() {
  return (
    <section className="py-24" style={{ background: "var(--bg-tertiary)" }}>
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16 space-y-4"
        >
          <span className="font-sans text-sm text-electric-cyan font-medium tracking-wider uppercase">
            Why Choose Us
          </span>
          <h2 className="font-general-sans text-3xl sm:text-4xl font-bold" style={{ color: "var(--text-primary)" }}>
            THE <span className="text-gradient">APEX</span> ADVANTAGE
          </h2>
          <p className="font-sans max-w-2xl mx-auto" style={{ color: "var(--text-secondary)" }}>
            We don&apos;t just rent cars. We deliver experiences. Discover why
            clients trust Apex Royale Drives in Islamabad and Rawalpindi.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <div className="card-dark p-6 h-full hover:border-electric-cyan/30 transition-all duration-300 hover:shadow-cyan-glow">
                <div className="w-14 h-14 rounded-xl bg-electric-cyan/10 flex items-center justify-center mb-5 group-hover:bg-electric-cyan/20 transition-colors">
                  <feature.icon className="w-7 h-7 text-electric-cyan" aria-hidden="true" />
                </div>
                <h3 className="font-general-sans text-lg font-bold mb-3 group-hover:text-electric-cyan transition-colors" style={{ color: "var(--text-primary)" }}>
                  {feature.title}
                </h3>
                <p className="font-sans text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
