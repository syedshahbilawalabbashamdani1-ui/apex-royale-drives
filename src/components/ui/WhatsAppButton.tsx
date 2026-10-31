"use client";

import WhatsAppLink from "./WhatsAppLink";
import { WhatsAppIcon } from "@/components/ui/SocialIcons";
import { useEffect, useRef } from "react";

export default function WhatsAppButton() {
  const position = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const legal = document.getElementById("footer-legal");
    const container = position.current;
    if (!legal || !container) return;
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const clearance = Math.max(0, window.innerHeight - legal.getBoundingClientRect().top + 16);
        container.style.bottom = `max(1.25rem, env(safe-area-inset-bottom), ${clearance}px)`;
      });
    };
    const observer = new ResizeObserver(update);
    observer.observe(document.body);
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div ref={position} className="fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-[max(1rem,env(safe-area-inset-right))] z-[var(--z-overlay)]">
      <WhatsAppLink
        message="Hi, I want to rent a car in Islamabad"
        className="gap-3"
      >
        <WhatsAppIcon className="w-5 h-5" aria-hidden="true" />
        <span>WhatsApp</span>
      </WhatsAppLink>
    </div>
  );
}
