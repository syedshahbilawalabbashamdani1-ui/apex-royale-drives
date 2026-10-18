"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { Grip, Phone, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { CONTACT, NAV_LINKS } from "@/lib/constants";
import Button from "@/components/ui/Button";

export default function NavigationMenu() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const id = useId();
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    const closeOutside = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", closeOutside);
    return () => {
      document.removeEventListener("pointerdown", closeOutside);
    };
  }, [open]);

  return (
    <div ref={root} className="relative" onBlur={(event) => {
      if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
    }} onKeyDown={(event) => {
      if (event.key === "Escape") { setOpen(false); trigger.current?.focus(); }
    }}>
      <button ref={trigger} type="button" onClick={() => setOpen(!open)}
        className="min-w-11 min-h-11 flex items-center justify-center text-text cursor-pointer rounded-full hover:bg-surface-2 transition-colors"
        aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} aria-controls={id}>
        {open ? <X className="w-6 h-6" /> : <Grip className="w-6 h-6" />}
      </button>
      <div id={id} hidden={!open}
        className="navigation-menu absolute top-[calc(100%+1rem)] right-0 w-[min(17.6rem,calc(100vw-2rem))] max-h-[calc(100dvh-var(--header-h)-2rem)] overflow-y-auto overscroll-contain p-4">
        {NAV_LINKS.map((link) => (
          <Link key={link.href} href={link.href} onClick={() => setOpen(false)}
            aria-current={pathname === link.href ? "page" : undefined}
            className="flex items-center min-h-11 px-3 text-lg transition-opacity hover:opacity-70 aria-[current=page]:underline underline-offset-4">{link.label}</Link>
        ))}
        <div className="border-t border-current/20 my-3" />
        <div className="flex flex-wrap gap-x-4 px-3 text-sm">
          <Link href="/faq" onClick={() => setOpen(false)} className="min-h-11 flex items-center hover:underline">FAQ</Link>
          <Link href="/privacy" onClick={() => setOpen(false)} className="min-h-11 flex items-center hover:underline">Privacy</Link>
          <Link href="/terms" onClick={() => setOpen(false)} className="min-h-11 flex items-center hover:underline">Terms</Link>
        </div>
        <a href={`tel:${CONTACT.phone}`} className="flex flex-wrap items-center gap-2 min-h-11 px-3 text-sm my-2">
          <Phone className="w-4 h-4" />{CONTACT.phone}
        </a>
        <Button href="/booking" onClick={() => setOpen(false)} className="w-full bg-background text-text">Book Now</Button>
      </div>
    </div>
  );
}
