"use client";

import { CONTACT } from "@/lib/constants";
import { WhatsAppIcon } from "@/components/ui/SocialIcons";

export default function WhatsAppButton() {
  const message = encodeURIComponent(
    "Hi, I want to rent a car in Islamabad"
  );
  const whatsappUrl = `https://wa.me/${CONTACT.whatsapp}?text=${message}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 group"
      aria-label="Chat on WhatsApp"
    >
      <div className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center shadow-lg hover:bg-green-600 transition-colors hover:scale-110 transform duration-300">
        <WhatsAppIcon className="w-7 h-7 text-white" />
      </div>
      <span className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full animate-pulse" />
    </a>
  );
}
