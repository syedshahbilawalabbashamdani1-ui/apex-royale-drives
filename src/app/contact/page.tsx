"use client";

import FieldError from "@/components/ui/FieldError";
import PageHeader from "@/components/layout/PageHeader";
import WhatsAppLink from "@/components/ui/WhatsAppLink";
import Heading from "@/components/ui/Heading";

import Button from "@/components/ui/Button";
import { useState } from "react";
import { motion } from "framer-motion";
import { CONTACT, whatsappLink } from "@/lib/constants";
import { isValidPhone, normalizePhone, PHONE_ERROR } from "@/lib/phone";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
} from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/SocialIcons";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<{ email?: string; phone?: string }>({});

  const validate = () => {
    const next: typeof errors = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      next.email = "Please enter a valid email address";
    }
    if (!isValidPhone(formData.phone, false)) {
      next.phone = PHONE_ERROR;
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const message = `Hi, I have a ${formData.subject || "general"} inquiry.\n\nName: ${formData.name}\nEmail: ${formData.email}\nPhone: ${normalizePhone(formData.phone)}\n\nMessage: ${formData.message}`;
    window.open(whatsappLink(message), "_blank");
  };

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-primary)" }}>
      <PageHeader title="Contact us" breadcrumb="Contact" description="Have questions? We're here to help. Reach out to us via any of the following channels." />

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 page-body">
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <div>
              <Heading as="h2" size="subsection" className="mb-4">
                Get in touch
              </Heading>
              <p className="font-sans text-theme-secondary leading-relaxed">
                Whether you need a car for one day or several days, have questions about
                our fleet, or want to discuss corporate partnerships, we&apos;re
                ready to assist.
              </p>
            </div>

            <div className="space-y-6">
              <a
                href={`tel:${CONTACT.phone}`}
                className="panel p-6 flex items-start gap-4 hover:border-electric-cyan/30 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-surface-2 flex items-center justify-center flex-shrink-0 group-hover:bg-surface-hover transition-colors">
                  <Phone className="w-6 h-6 text-accent-ink" />
                </div>
                <div>
                  <Heading as="h3" size="label" className="text-sm group-hover:text-accent-ink transition-colors">
                    Phone
                  </Heading>
                  <p className="font-sans text-sm text-theme-secondary mt-1">
                    {CONTACT.phone}
                  </p>
                  <p className="font-sans text-xs text-theme-secondary/60 mt-1">
                    Available 24/7
                  </p>
                </div>
              </a>

              <a
                href={`mailto:${CONTACT.email}`}
                className="panel p-6 flex items-start gap-4 hover:border-electric-cyan/30 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-surface-2 flex items-center justify-center flex-shrink-0 group-hover:bg-surface-hover transition-colors">
                  <Mail className="w-6 h-6 text-accent-ink" />
                </div>
                <div>
                  <Heading as="h3" size="label" className="text-sm group-hover:text-accent-ink transition-colors">
                    Email
                  </Heading>
                  <p className="font-sans text-sm text-theme-secondary mt-1">
                    {CONTACT.email}
                  </p>
                  <p className="font-sans text-xs text-theme-secondary/60 mt-1">
                    Response within 2 hours
                  </p>
                </div>
              </a>

              <div className="panel p-6 flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-surface-2 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-accent-ink" />
                </div>
                <div>
                  <Heading as="h3" size="label" className="text-sm">
                    Location
                  </Heading>
                  <p className="font-sans text-sm text-theme-secondary mt-1">
                    {CONTACT.address}
                  </p>
                </div>
              </div>

              <div className="panel p-6 flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-surface-2 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6 text-accent-ink" />
                </div>
                <div>
                  <Heading as="h3" size="label" className="text-sm">
                    Working hours
                  </Heading>
                  <p className="font-sans text-sm text-theme-secondary mt-1">
                    24/7 - Always Available
                  </p>
                  <p className="font-sans text-xs text-theme-secondary/60 mt-1">
                    Office: 9 AM - 9 PM
                  </p>
                </div>
              </div>
            </div>

            <WhatsAppLink message="Hi, I have a question about car rental" className="w-full">
              <WhatsAppIcon className="w-5 h-5" aria-hidden="true" />
              Chat on WhatsApp
            </WhatsAppLink>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <form onSubmit={handleSubmit} className="panel p-5 sm:p-6 space-y-6">
              <Heading as="h2" size="subsection">
                Send a message
              </Heading>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="contact-name" className="block font-sans text-sm text-theme-secondary mb-2">
                    Full Name
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                    placeholder="Enter your name"
                    className="field w-full px-4 py-3 rounded-control font-sans text-sm text-theme-primary placeholder:text-theme-secondary/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="contact-email" className="block font-sans text-sm text-theme-secondary mb-2">
                    Email
                  </label>
                  <input
                    id="contact-email"
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? "contact-email-error" : undefined}
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                    placeholder="Enter your email"
                    className="field w-full px-4 py-3 rounded-control font-sans text-sm text-theme-primary placeholder:text-theme-secondary/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent transition-colors"
                  />
                  {errors.email && (
                    <FieldError id="contact-email-error">{errors.email}</FieldError>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="contact-phone" className="block font-sans text-sm text-theme-secondary mb-2">
                    Phone
                  </label>
                  <input
                    id="contact-phone"
                      aria-invalid={!!errors.phone}
                      aria-describedby={errors.phone ? "contact-phone-error" : undefined}
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    placeholder="+92 300 123 4567"
                    className="field w-full px-4 py-3 rounded-control font-sans text-sm text-theme-primary placeholder:text-theme-secondary/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent transition-colors"
                  />
                  {errors.phone && (
                    <FieldError id="contact-phone-error">{errors.phone}</FieldError>
                  )}
                </div>

                <div>
                  <label htmlFor="contact-subject" className="block font-sans text-sm text-theme-secondary mb-2">
                    Subject
                  </label>
                  <select
                    id="contact-subject"
                    value={formData.subject}
                    onChange={(e) =>
                      setFormData({ ...formData, subject: e.target.value })
                    }
                    required
                    className="field w-full px-4 py-3 rounded-control font-sans text-sm text-theme-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent transition-colors"
                  >
                    <option value="">Select a subject</option>
                    <option value="booking">Car Booking Inquiry</option>
                    <option value="corporate">Corporate Partnership</option>
                    <option value="wedding">Wedding Car Rental</option>
                    <option value="tour">Tour Package</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="contact-message" className="block font-sans text-sm text-theme-secondary mb-2">
                  Message
                </label>
                <textarea
                  id="contact-message"
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  required
                  rows={5}
                  placeholder="Tell us how we can help..."
                  className="field w-full px-4 py-3 rounded-control font-sans text-sm text-theme-primary placeholder:text-theme-secondary/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent transition-colors resize-none"
                />
              </div>

              <Button type="submit" className="w-full py-4">
                <WhatsAppIcon className="w-5 h-5 mr-2" />
                Send on WhatsApp
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
