"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Car,
  Award,
  MapPin,
  Phone,
  Mail,
  Clock,
  Target,
  Heart,
  Shield,
} from "lucide-react";
import { CONTACT } from "@/lib/constants";

const stats = [
  { icon: Car, value: "30+", label: "Happy Clients" },
  { icon: Award, value: "5.0", label: "Google Rating" },
  { icon: MapPin, value: "2", label: "Cities Served" },
  { icon: Clock, value: "24/7", label: "Availability" },
];

const values = [
  {
    icon: Target,
    title: "Quality Service",
    description:
      "Clean, well-maintained vehicles and professional drivers ensure a smooth travel experience every time.",
  },
  {
    icon: Heart,
    title: "Customer Satisfaction",
    description:
      "From luxury car rentals to affordable family cars, we are committed to meeting your unique travel needs.",
  },
  {
    icon: Shield,
    title: "Reliability",
    description:
      "24/7 customer support, transparent pricing, and dependable service you can count on in Islamabad and Rawalpindi.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen" style={{ background: "var(--bg-primary)" }}>
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-dark" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-electric-cyan/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-deep-ocean/20 rounded-full blur-[120px]" />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <span className="font-inter text-sm text-electric-cyan font-medium tracking-wider uppercase">
              About Us
            </span>
            <h1 className="font-orbitron text-4xl sm:text-5xl lg:text-6xl font-bold text-theme-primary mt-4 mb-6">
              DRIVING <span className="text-gradient">EXCELLENCE</span>
            </h1>
            <p className="font-inter text-lg text-theme-secondary leading-relaxed">
              Apex Royale Drives is a trusted rent-a-car service in Islamabad
              and Rawalpindi, offering luxury and affordable vehicles for every
              occasion.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20" style={{ background: "var(--bg-tertiary)" }}>
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-14 h-14 rounded-xl bg-electric-cyan/10 flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-7 h-7 text-electric-cyan" />
                </div>
                <div className="font-orbitron text-3xl font-bold text-gradient">
                  {stat.value}
                </div>
                <div className="font-inter text-sm text-theme-secondary mt-1">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-24">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <span className="font-inter text-sm text-electric-cyan font-medium tracking-wider uppercase">
                Our Story
              </span>
              <h2 className="font-orbitron text-3xl font-bold text-theme-primary">
                FROM A VISION TO <span className="text-gradient">REALITY</span>
              </h2>
              <div className="space-y-4 font-inter text-theme-secondary leading-relaxed">
                <p>
                  Founded in 2026, Apex Royale Drives started with a clear
                  mission: to provide reliable, comfortable, and affordable car
                  rental services in Islamabad and Rawalpindi.
                </p>
                <p>
                  Our fleet includes luxury vehicles like Land Cruiser ZX, LC
                  300, Prado, G Wagon, Mercedes S Class, and Audi A6, as well
                  as practical options like Corolla Altis, Honda Civic, Kia
                  Sportage, and hatchbacks.
                </p>
                <p>
                  Whether you need a car for a business trip, airport transfer,
                  wedding, or special event, we provide professional drivers,
                  clean vehicles, and 24/7 customer support to ensure a smooth
                  travel experience. Our commitment to quality service and
                  customer satisfaction has earned us a 5.0 Google rating from
                  our clients.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="card-dark p-8"
            >
              <div className="aspect-square rounded-xl overflow-hidden">
                <img
                  src="/Images/About/g63.jpg"
                  alt="Mercedes G63 AMG - Apex Royale Drives"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24" style={{ background: "var(--bg-tertiary)" }}>
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16 space-y-4"
          >
            <span className="font-inter text-sm text-electric-cyan font-medium tracking-wider uppercase">
              Our Values
            </span>
            <h2 className="font-orbitron text-3xl font-bold text-theme-primary">
              WHAT <span className="text-gradient">DRIVES</span> US
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card-dark p-8 text-center hover:border-electric-cyan/30 transition-all"
              >
                <div className="w-16 h-16 rounded-xl bg-electric-cyan/10 flex items-center justify-center mx-auto mb-6">
                  <value.icon className="w-8 h-8 text-electric-cyan" />
                </div>
                <h3 className="font-orbitron text-xl font-bold text-theme-primary mb-3">
                  {value.title}
                </h3>
                <p className="font-inter text-sm text-theme-secondary leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Fleet Highlights */}
      <section className="py-24">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16 space-y-4"
          >
            <span className="font-inter text-sm text-electric-cyan font-medium tracking-wider uppercase">
              Our Fleet
            </span>
            <h2 className="font-orbitron text-3xl font-bold text-theme-primary">
              VEHICLES WE <span className="text-gradient">OFFER</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { category: "Luxury SUVs", items: "Land Cruiser ZX, LC 300, Prado, G Wagon, Range Rover" },
              { category: "Premium Sedans", items: "Mercedes S Class, E Class, Audi A4, A5, A6" },
              { category: "Family Cars", items: "Corolla Altis, Honda Civic, Kia Sportage, Honda BR-V" },
              { category: "Economy", items: "Hatchback cars for daily use" },
              { category: "Airport Transfers", items: "Professional drivers, on-time pickup & drop" },
              { category: "Wedding & Events", items: "Premium vehicles for special occasions" },
            ].map((item, index) => (
              <motion.div
                key={item.category}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card-dark p-6 hover:border-electric-cyan/30 transition-all"
              >
                <h3 className="font-orbitron text-lg font-bold text-gradient mb-2">
                  {item.category}
                </h3>
                <p className="font-inter text-sm text-theme-secondary">
                  {item.items}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-24" style={{ background: "var(--bg-tertiary)" }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="font-orbitron text-3xl font-bold text-theme-primary">
              GET IN <span className="text-gradient">TOUCH</span>
            </h2>
            <p className="font-inter text-lg text-theme-secondary">
              Ready to experience the Apex Royale difference? Contact us today.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <a
                href={`tel:${CONTACT.phone}`}
                className="card-dark p-6 hover:border-electric-cyan/30 transition-all group"
              >
                <Phone className="w-8 h-8 text-electric-cyan mx-auto mb-3" />
                <h4 className="font-orbitron text-sm font-bold text-theme-primary group-hover:text-electric-cyan transition-colors">
                  Call Us
                </h4>
                <p className="font-inter text-sm text-theme-secondary mt-1">
                  {CONTACT.phone}
                </p>
              </a>

              <a
                href={`mailto:${CONTACT.email}`}
                className="card-dark p-6 hover:border-electric-cyan/30 transition-all group"
              >
                <Mail className="w-8 h-8 text-electric-cyan mx-auto mb-3" />
                <h4 className="font-orbitron text-sm font-bold text-theme-primary group-hover:text-electric-cyan transition-colors">
                  Email Us
                </h4>
                <p className="font-inter text-sm text-theme-secondary mt-1">
                  {CONTACT.email}
                </p>
              </a>

              <div className="card-dark p-6">
                <Clock className="w-8 h-8 text-electric-cyan mx-auto mb-3" />
                <h4 className="font-orbitron text-sm font-bold text-theme-primary">
                  Working Hours
                </h4>
                <p className="font-inter text-sm text-theme-secondary mt-1">
                  24/7 Available
                </p>
              </div>
            </div>

            <Link href="/fleet" className="btn-primary">
              Explore Our Fleet
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
