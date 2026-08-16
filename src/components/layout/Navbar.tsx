"use client";

import { useState } from "react";
import Link from "next/link";
import { NAV_LINKS, CONTACT } from "@/lib/constants";
import { Menu, X, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 bg-carbon-black border-b border-electric-cyan/10 shadow-lg shadow-electric-cyan/5"
    >
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center shrink-0">
            <img
              src="/Images/Homepage/logo.png"
              alt="Apex Royale Drives"
              className="h-16 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-sans text-sm font-medium text-silver-chrome hover:text-electric-cyan transition-colors relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-brand group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <a
              href={`https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent("Hi, I want to rent a car in Islamabad")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-silver-chrome hover:text-electric-cyan transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span className="font-sans">Call Us</span>
            </a>
            <ThemeToggle />
            <Link href="/booking" className="btn-primary text-sm">
              Book Now
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white p-2"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          "md:hidden transition-all duration-300 overflow-hidden",
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="bg-carbon-black/98 backdrop-blur-md border-t border-electric-cyan/10 px-4 py-6 space-y-4">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="block font-sans text-base text-silver-chrome hover:text-electric-cyan transition-colors py-2"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-4 border-t border-gunmetal space-y-3">
            <a
              href={`https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent("Hi, I want to rent a car in Islamabad")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-silver-chrome hover:text-electric-cyan transition-colors py-2"
            >
              <Phone className="w-4 h-4" />
              <span className="font-sans">{CONTACT.phone}</span>
            </a>
            <Link
              href="/booking"
              onClick={() => setIsOpen(false)}
              className="btn-primary w-full text-center"
            >
              Book Now
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
