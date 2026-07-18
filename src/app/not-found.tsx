import Link from "next/link";
import { Wrench } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg-primary)" }}>
      <div className="text-center space-y-8 px-4">
        {/* Icon */}
        <div className="w-24 h-24 rounded-full bg-electric-cyan/10 flex items-center justify-center mx-auto">
          <Wrench className="w-12 h-12 text-electric-cyan" />
        </div>

        {/* Heading */}
        <div className="space-y-3">
          <h1 className="font-orbitron text-6xl font-black text-gradient">
            404
          </h1>
          <h2 className="font-orbitron text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
            Page Not Found
          </h2>
        </div>

        {/* Message */}
        <div className="max-w-md mx-auto space-y-4">
          <p className="font-inter text-lg" style={{ color: "var(--text-secondary)" }}>
            The website is currently under maintenance. Please try again later.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link href="/" className="btn-primary">
            Go to Homepage
          </Link>
          <a
            href="https://wa.me/923045255558?text=Hi, I tried visiting your website but it seems to be under maintenance."
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
