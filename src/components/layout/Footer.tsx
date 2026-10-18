"use client";

import Link from "next/link";
import BrandLogo from "@/components/ui/BrandLogo";
import { MapPin, Phone, Mail } from "lucide-react";
import { SITE_NAME, CONTACT, SOCIAL_LINKS, whatsappLink } from "@/lib/constants";
import {
  WhatsAppIcon,
  InstagramIcon,
  TikTokIcon,
} from "@/components/ui/SocialIcons";

const footerLinks = {
  company: [
    { label: "About", href: "/about" },
    { label: "Fleet", href: "/fleet" },
    { label: "Contact", href: "/contact" },
    { label: "FAQ", href: "/faq" },
  ],
  services: [
    { label: "Airport transfers", href: "/booking" },
    { label: "Wedding cars", href: "/fleet?category=Luxury" },
    { label: "Corporate rental", href: "/fleet" },
    { label: "Northern areas", href: "/fleet?category=SUV" },
  ],
  legal: [
    { label: "Terms", href: "/terms" },
    { label: "Privacy", href: "/privacy" },
  ],
};

const socials = [
  {
    icon: WhatsAppIcon,
    href: whatsappLink("Hi, I want to rent a car in Islamabad"),
    label: "WhatsApp",
  },
  { icon: InstagramIcon, href: SOCIAL_LINKS.instagram, label: "Instagram" },
  { icon: TikTokIcon, href: SOCIAL_LINKS.tiktok, label: "TikTok" },
];

export default function Footer() {
  return (
    <footer className="brand-shell mt-8">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 lg:gap-12">
          <div className="col-span-2 md:col-span-1 space-y-5">
            <Link href="/" aria-label="Apex Royale Drives home" className="flex w-52 max-w-full aspect-[1366/751]">
              <BrandLogo />
            </Link>
            <p className="text-sm text-muted leading-relaxed max-w-[34ch]">
              Rent a car with a professional driver across Islamabad and
              Rawalpindi.
            </p>
            <div className="flex gap-3">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-11 h-11 rounded-full border border-line flex items-center justify-center text-muted transition-colors hover:text-text"
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          <nav aria-label="Company">
            <h2 className="text-sm font-medium mb-4">Company</h2>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted transition-colors hover:text-text"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Services">
            <h2 className="text-sm font-medium mb-4">Services</h2>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted transition-colors hover:text-text"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="text-sm font-medium mb-4">Contact</h2>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin
                  className="w-4 h-4 text-muted mt-1 shrink-0"
                  aria-hidden="true"
                />
                <span className="text-sm text-muted">{CONTACT.address}</span>
              </li>
              <li>
                <a
                  href={`tel:${CONTACT.phone}`}
                  className="flex items-center gap-3 text-muted transition-colors hover:text-text"
                >
                  <Phone className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span className="text-sm">{CONTACT.phone}</span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${CONTACT.email}`}
                  className="flex items-center gap-3 text-muted transition-colors hover:text-text"
                >
                  <Mail className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span className="text-sm break-all">{CONTACT.email}</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div>
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted">
            &copy; {new Date().getFullYear()} {SITE_NAME}
          </p>
          <div className="flex items-center gap-6">
            {footerLinks.legal.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-muted transition-colors hover:text-text"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
