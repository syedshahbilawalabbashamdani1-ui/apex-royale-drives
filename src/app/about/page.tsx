"use client";

import PageSection from "@/components/layout/PageSection";
import PageHeader from "@/components/layout/PageHeader";
import Heading from "@/components/ui/Heading";

import Button from "@/components/ui/Button";
import { motion } from "framer-motion";
import Image from "next/image";
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
import { CONTACT, RATING } from "@/lib/constants";
import { cars } from "@/lib/cars";

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Apex Royale Drives",
  url: "https://apexroyaledrives.com",
  logo: "https://apexroyaledrives.com/Images/Homepage/logo.png",
  description: "Trusted rent-a-car service in Islamabad and Rawalpindi offering luxury and affordable vehicles with professional drivers.",
  address: {
    "@type": "PostalAddress",
    streetAddress: "F-10 Markaz F 10/4",
    addressLocality: "Islamabad",
    postalCode: "44000",
    addressCountry: "PK",
  },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: CONTACT.phone,
    contactType: "customer service",
    availableLanguage: ["English", "Urdu"],
  },
  sameAs: [
    "https://wa.me/923045255558",
    "https://instagram.com/apex_royale_drives",
    "https://tiktok.com/@apex.royale.drives",
  ],
};

const stats = [
  { icon: Car, value: String(cars.length), label: "Vehicles in Fleet" },
  { icon: Award, value: RATING.value, label: "Google Rating" },
  { icon: MapPin, value: "2", label: "Cities Served" },
  { icon: Clock, value: "24/7", label: "Availability" },
];

const values = [
  {
    icon: Target,
    title: "Quality service",
    description:
      "Clean, well-maintained vehicles and professional drivers ensure a smooth travel experience every time.",
  },
  {
    icon: Heart,
    title: "Customer satisfaction",
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema).replace(/</g, "\\u003c") }}
      />
      <PageHeader
        title="Driving excellence"
        align="left"
        description="Apex Royale Drives is a trusted rent-a-car service in Islamabad and Rawalpindi, offering luxury and affordable vehicles for every occasion."
      />

      {/* Stats */}
      <PageSection style={{ background: "var(--bg-tertiary)" }}>
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
                <div className="w-14 h-14 rounded-xl bg-surface-2 flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-7 h-7 text-accent-ink" />
                </div>
                <div className="font-sans text-3xl font-bold text-accent-ink">
                  {stat.value}
                </div>
                <div className="font-sans text-sm text-theme-secondary mt-1">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </PageSection>

      {/* Story */}
      <PageSection>
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-6 lg:gap-10 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <Heading as="h2" size="section">
                From a vision to reality
              </Heading>
              <div className="space-y-4 font-sans text-theme-secondary leading-relaxed">
                <p>
                  Founded in 2026, Apex Royale Drives started with a clear
                  mission: to provide reliable, comfortable, and affordable car
                  rental services in Islamabad and Rawalpindi.
                </p>
                <p>
                  Our fleet includes luxury vehicles like the Mercedes G63 AMG,
                  Mercedes Maybach S-Class, Range Rover, Toyota Land Cruiser V8
                  ZX, Toyota Land Cruiser Prado, Audi A6, and Toyota Hilux Revo.
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
              className="panel p-5 sm:p-6"
            >
              <div className="aspect-square rounded-xl overflow-hidden relative">
                <Image
                  src="/Images/About/g63.jpg"
                  alt="Mercedes G63 AMG - Apex Royale Drives"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                  loading="lazy"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </PageSection>

      {/* Values */}
      <PageSection style={{ background: "var(--bg-tertiary)" }}>
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center section-heading space-y-4"
          >
            <Heading as="h2" size="section">
              What drives us
            </Heading>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="panel p-5 sm:p-6 text-center hover:border-electric-cyan/30 transition-all"
              >
                <div className="w-16 h-16 rounded-xl bg-surface-2 flex items-center justify-center mx-auto mb-6">
                  <value.icon className="w-8 h-8 text-accent-ink" />
                </div>
                <Heading as="h3" size="subsection" className="mb-3">
                  {value.title}
                </Heading>
                <p className="font-sans text-sm text-theme-secondary leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </PageSection>

      {/* Fleet Highlights */}
      <PageSection>
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center section-heading space-y-4"
          >
            <Heading as="h2" size="section">
              Vehicles we offer
            </Heading>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { category: "Luxury SUVs", items: "Land Cruiser V8 ZX, Land Cruiser Prado, Toyota Revo" },
              { category: "Premium cars", items: "Mercedes G63 AMG, Mercedes Maybach S-Class, Range Rover, Audi A6" },
              { category: "Airport transfers", items: "Professional drivers, on-time pickup & drop" },
              { category: "Wedding & events", items: "Premium vehicles for special occasions" },
              { category: "Business travel", items: "Executive cars with professional chauffeurs" },
              { category: "Tour packages", items: "Northern areas & long-distance travel" },
            ].map((item, index) => (
              <motion.div
                key={item.category}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="panel p-6 hover:border-electric-cyan/30 transition-all"
              >
                <Heading as="h3" size="card" className="text-lg text-accent-ink mb-2">
                  {item.category}
                </Heading>
                <p className="font-sans text-sm text-theme-secondary">
                  {item.items}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </PageSection>

      {/* Contact CTA */}
      <PageSection style={{ background: "var(--bg-tertiary)" }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <Heading as="h2" size="section">
              Get in touch
            </Heading>
            <p className="font-sans text-lg text-theme-secondary">
              Ready to experience the Apex Royale difference? Contact us today.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <a
                href={`tel:${CONTACT.phone}`}
                className="panel p-6 hover:border-electric-cyan/30 transition-all group"
              >
                <Phone className="w-8 h-8 text-accent-ink mx-auto mb-3" />
                <Heading as="h3" size="label" className=" group-hover:text-accent-ink transition-colors">
                  Call us
                </Heading>
                <p className="font-sans text-sm text-theme-secondary mt-1">
                  {CONTACT.phone}
                </p>
              </a>

              <a
                href={`mailto:${CONTACT.email}`}
                className="panel p-6 hover:border-electric-cyan/30 transition-all group"
              >
                <Mail className="w-8 h-8 text-accent-ink mx-auto mb-3" />
                <Heading as="h3" size="label" className=" group-hover:text-accent-ink transition-colors">
                  Email us
                </Heading>
                <p className="font-sans text-sm text-theme-secondary mt-1">
                  {CONTACT.email}
                </p>
              </a>

              <div className="panel p-6">
                <Clock className="w-8 h-8 text-accent-ink mx-auto mb-3" />
                <Heading as="h3" size="label" >
                  Working hours
                </Heading>
                <p className="font-sans text-sm text-theme-secondary mt-1">
                  24/7 Available
                </p>
              </div>
            </div>

            <Button href="/fleet">
              Explore Our Fleet
            </Button>
          </motion.div>
        </div>
      </PageSection>
    </div>
  );
}
