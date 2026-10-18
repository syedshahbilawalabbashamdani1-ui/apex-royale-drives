"use client";

import WhatsAppLink from "./WhatsAppLink";
import { WhatsAppIcon } from "@/components/ui/SocialIcons";

export default function WhatsAppButton() {
  return (
    <WhatsAppLink
      message="Hi, I want to rent a car in Islamabad"
      className="fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] left-4 z-[var(--z-overlay)] gap-3"
    >
      <WhatsAppIcon className="w-5 h-5" aria-hidden="true" />
      <span>WhatsApp</span>
    </WhatsAppLink>
  );
}
