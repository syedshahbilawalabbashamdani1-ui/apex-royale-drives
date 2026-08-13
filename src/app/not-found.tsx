import Link from "next/link";
import { MapPin } from "lucide-react";
import { CONTACT } from "@/lib/constants";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg-primary)" }}>
      <div className="text-center space-y-8 px-4">
        {/* Icon */}
        <div className="w-24 h-24 rounded-full bg-electric-cyan/10 flex items-center justify-center mx-auto">
          <MapPin className="w-12 h-12 text-electric-cyan" />
        </div>

        {/* Heading */}
        <div className="space-y-3">
          <h1 className="font-playfair text-6xl font-black text-gradient">
            404
          </h1>
          <h2 className="font-playfair text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
            Page Not Found
          </h2>
        </div>

        {/* Message */}
        <div className="max-w-md mx-auto space-y-4">
          <p className="font-sans text-lg" style={{ color: "var(--text-secondary)" }}>
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link href="/" className="btn-primary">
            Go to Homepage
          </Link>
          <a
            href={`https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent("Hi, I need help finding something on your website.")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary"
          >
            Contact on WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
