"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CONTACT } from "@/lib/constants";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
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
    if (formData.phone && !/^[+\d\s-]{7,15}$/.test(formData.phone)) {
      next.phone = "Please enter a valid phone number";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const encodedMessage = encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\nPhone: ${formData.phone}\nSubject: ${formData.subject}\nMessage: ${formData.message}`
    );
    window.open(
      `https://wa.me/${CONTACT.whatsapp}?text=${encodedMessage}`,
      "_blank"
    );
  };

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-primary)" }}>
      {/* Header */}
      <div className="py-20" style={{ background: "var(--bg-tertiary)" }}>
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-4"
          >
            <h1 className="font-orbitron text-4xl sm:text-5xl font-bold text-theme-primary">
              CONTACT <span className="text-gradient">US</span>
            </h1>
            <p className="font-inter text-theme-secondary max-w-2xl mx-auto">
              Have questions? We&apos;re here to help. Reach out to us via any of
              the following channels.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <div>
              <h2 className="font-orbitron text-2xl font-bold text-theme-primary mb-4">
                GET IN <span className="text-gradient">TOUCH</span>
              </h2>
              <p className="font-inter text-theme-secondary leading-relaxed">
                Whether you need a car for a day or a month, have questions about
                our fleet, or want to discuss corporate partnerships, we&apos;re
                ready to assist.
              </p>
            </div>

            <div className="space-y-6">
              <a
                href={`tel:${CONTACT.phone}`}
                className="card-dark p-6 flex items-start gap-4 hover:border-electric-cyan/30 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-electric-cyan/10 flex items-center justify-center flex-shrink-0 group-hover:bg-electric-cyan/20 transition-colors">
                  <Phone className="w-6 h-6 text-electric-cyan" />
                </div>
                <div>
                  <h3 className="font-orbitron text-sm font-bold text-theme-primary group-hover:text-electric-cyan transition-colors">
                    Phone
                  </h3>
                  <p className="font-inter text-sm text-theme-secondary mt-1">
                    {CONTACT.phone}
                  </p>
                  <p className="font-inter text-xs text-theme-secondary/60 mt-1">
                    Available 24/7
                  </p>
                </div>
              </a>

              <a
                href={`mailto:${CONTACT.email}`}
                className="card-dark p-6 flex items-start gap-4 hover:border-electric-cyan/30 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-electric-cyan/10 flex items-center justify-center flex-shrink-0 group-hover:bg-electric-cyan/20 transition-colors">
                  <Mail className="w-6 h-6 text-electric-cyan" />
                </div>
                <div>
                  <h3 className="font-orbitron text-sm font-bold text-theme-primary group-hover:text-electric-cyan transition-colors">
                    Email
                  </h3>
                  <p className="font-inter text-sm text-theme-secondary mt-1">
                    {CONTACT.email}
                  </p>
                  <p className="font-inter text-xs text-theme-secondary/60 mt-1">
                    Response within 2 hours
                  </p>
                </div>
              </a>

              <div className="card-dark p-6 flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-electric-cyan/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-electric-cyan" />
                </div>
                <div>
                  <h3 className="font-orbitron text-sm font-bold text-theme-primary">
                    Location
                  </h3>
                  <p className="font-inter text-sm text-theme-secondary mt-1">
                    {CONTACT.address}
                  </p>
                </div>
              </div>

              <div className="card-dark p-6 flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-electric-cyan/10 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6 text-electric-cyan" />
                </div>
                <div>
                  <h3 className="font-orbitron text-sm font-bold text-theme-primary">
                    Working Hours
                  </h3>
                  <p className="font-inter text-sm text-theme-secondary mt-1">
                    24/7 - Always Available
                  </p>
                  <p className="font-inter text-xs text-theme-secondary/60 mt-1">
                    Office: 9 AM - 9 PM
                  </p>
                </div>
              </div>
            </div>

            {/* WhatsApp CTA */}
            <a
              href={`https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent("Hi, I have a question about car rental")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 w-full py-4 bg-green-600 hover:bg-green-700 rounded-lg font-inter text-theme-primary font-medium transition-colors"
            >
              <WhatsAppIcon className="w-5 h-5" />
              Chat on WhatsApp
            </a>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <form onSubmit={handleSubmit} className="card-dark p-8 space-y-6">
              <h3 className="font-orbitron text-xl font-bold text-theme-primary">
                SEND A MESSAGE
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="contact-name" className="block font-inter text-sm text-theme-secondary mb-2">
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
                    className="w-full px-4 py-3 border border-electric-cyan/10 rounded-lg font-inter text-sm text-theme-primary placeholder:text-theme-secondary/50 focus:outline-none focus:border-electric-cyan/30 transition-colors"
                    style={{ background: "var(--bg-primary)" }}
                  />
                </div>

                <div>
                  <label htmlFor="contact-email" className="block font-inter text-sm text-theme-secondary mb-2">
                    Email
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 border border-electric-cyan/10 rounded-lg font-inter text-sm text-theme-primary placeholder:text-theme-secondary/50 focus:outline-none focus:border-electric-cyan/30 transition-colors"
                    style={{ background: "var(--bg-primary)" }}
                  />
                  {errors.email && (
                    <p className="font-inter text-xs text-red-400 mt-1">{errors.email}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="contact-phone" className="block font-inter text-sm text-theme-secondary mb-2">
                    Phone
                  </label>
                  <input
                    id="contact-phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    placeholder="+92 300 123 4567"
                    className="w-full px-4 py-3 border border-electric-cyan/10 rounded-lg font-inter text-sm text-theme-primary placeholder:text-theme-secondary/50 focus:outline-none focus:border-electric-cyan/30 transition-colors"
                    style={{ background: "var(--bg-primary)" }}
                  />
                  {errors.phone && (
                    <p className="font-inter text-xs text-red-400 mt-1">{errors.phone}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="contact-subject" className="block font-inter text-sm text-theme-secondary mb-2">
                    Subject
                  </label>
                  <select
                    id="contact-subject"
                    value={formData.subject}
                    onChange={(e) =>
                      setFormData({ ...formData, subject: e.target.value })
                    }
                    required
                    className="w-full px-4 py-3 border border-electric-cyan/10 rounded-lg font-inter text-sm text-theme-primary focus:outline-none focus:border-electric-cyan/30 transition-colors"
                    style={{ background: "var(--bg-primary)" }}
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
                <label htmlFor="contact-message" className="block font-inter text-sm text-theme-secondary mb-2">
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
                  className="w-full px-4 py-3 border border-electric-cyan/10 rounded-lg font-inter text-sm text-theme-primary placeholder:text-theme-secondary/50 focus:outline-none focus:border-electric-cyan/30 transition-colors resize-none"
                  style={{ background: "var(--bg-primary)" }}
                />
              </div>

              <button type="submit" className="btn-primary w-full py-4">
                <Send className="w-5 h-5 mr-2" />
                Send Message
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
