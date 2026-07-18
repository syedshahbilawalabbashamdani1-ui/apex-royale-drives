"use client";

import Link from "next/link";
import { SITE_NAME, CONTACT, SOCIAL_LINKS } from "@/lib/constants";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  ArrowUp,
} from "lucide-react";
import { WhatsAppIcon, InstagramIcon, TikTokIcon } from "@/components/ui/SocialIcons";

const footerLinks = {
  company: [
    { label: "About Us", href: "/about" },
    { label: "Our Fleet", href: "/fleet" },
    { label: "Contact", href: "/contact" },
  ],
  services: [
    { label: "Airport Transfers", href: "/booking" },
    { label: "Wedding Cars", href: "/fleet?category=Luxury" },
    { label: "Corporate Rental", href: "/fleet" },
    { label: "Tour Packages", href: "/fleet?category=SUV" },
  ],
};

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer style={{ background: "#0A1A2E", borderColor: "rgba(32, 224, 255, 0.1)" }} className="border-t">
      {/* Main Footer */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-3">
              <img
                src="/Images/Homepage/logo.png"
                alt="Apex Royale Drives"
                className="h-28 w-auto"
              />
            </Link>
            <p className="font-inter text-silver-chrome text-sm leading-relaxed">
              Trusted rent-a-car service in Islamabad and Rawalpindi. Luxury
              and affordable vehicles with professional drivers and 24/7 support.
            </p>
            <div className="flex gap-4">
              {[
                { icon: WhatsAppIcon, href: `https://wa.me/${CONTACT.whatsapp}`, label: "WhatsApp" },
                { icon: InstagramIcon, href: SOCIAL_LINKS.instagram, label: "Instagram" },
                { icon: TikTokIcon, href: SOCIAL_LINKS.tiktok, label: "TikTok" },
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-10 h-10 rounded-lg bg-gunmetal flex items-center justify-center text-silver-chrome hover:bg-electric-cyan/10 hover:text-electric-cyan transition-all"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-orbitron text-sm font-semibold mb-6 tracking-wider text-white">
              COMPANY
            </h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-inter text-sm text-silver-chrome hover:text-electric-cyan transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-orbitron text-sm font-semibold mb-6 tracking-wider text-white">
              SERVICES
            </h4>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-inter text-sm text-silver-chrome hover:text-electric-cyan transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-orbitron text-sm font-semibold mb-6 tracking-wider text-white">
              CONTACT US
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-electric-cyan mt-0.5 flex-shrink-0" />
                <span className="font-inter text-sm text-silver-chrome">
                  {CONTACT.address}
                </span>
              </li>
              <li>
                <a
                  href={`tel:${CONTACT.phone}`}
                  className="flex items-center gap-3 text-silver-chrome hover:text-electric-cyan transition-colors"
                >
                  <Phone className="w-5 h-5 text-electric-cyan flex-shrink-0" />
                  <span className="font-inter text-sm">{CONTACT.phone}</span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${CONTACT.email}`}
                  className="flex items-center gap-3 text-silver-chrome hover:text-electric-cyan transition-colors"
                >
                  <Mail className="w-5 h-5 text-electric-cyan flex-shrink-0" />
                  <span className="font-inter text-sm">{CONTACT.email}</span>
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-electric-cyan mt-0.5 flex-shrink-0" />
                <span className="font-inter text-sm text-silver-chrome">
                  Available 24/7 for bookings
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t" style={{ borderColor: "rgba(32, 224, 255, 0.1)" }}>
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="font-inter text-sm text-silver-chrome">
              &copy; {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
            </p>
            <button
              onClick={scrollToTop}
              className="w-10 h-10 rounded-lg bg-gunmetal flex items-center justify-center text-silver-chrome hover:bg-electric-cyan/10 hover:text-electric-cyan transition-all"
              aria-label="Scroll to top"
            >
              <ArrowUp className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
