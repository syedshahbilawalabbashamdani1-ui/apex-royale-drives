"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { whatsappLink } from "@/lib/constants";
import CustomVehicleDialog from "@/components/ui/CustomVehicleDialog";

export default function CustomFleetCard() {
  const [open, setOpen] = useState(false);
  return (
    <>
      {/* Card */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group panel p-6 text-left transition-all duration-300 hover:border-electric-cyan/40 hover:shadow-accent flex flex-col items-center justify-center text-center h-full cursor-pointer"
        style={{ borderStyle: "dashed", borderColor: "rgba(var(--accent-r), var(--accent-g), var(--accent-b), 0.25)" }}
      >
        <div className="w-14 h-14 rounded-full bg-surface-2 border border-line flex items-center justify-center mb-5 group-hover:bg-surface-hover transition-colors">
          <Plus className="w-7 h-7 text-accent-ink" aria-hidden="true" />
        </div>
        <h3 className="font-sans text-lg font-bold mb-2 group-hover:text-accent-ink transition-colors" style={{ color: "var(--text-primary)" }}>
          CUSTOM FLEET
        </h3>
        <p className="font-sans text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
          Can&apos;t find your dream car? Tell us what you&apos;re looking for and
          we&apos;ll arrange it for you.
        </p>
        <span className="mt-5 inline-flex items-center gap-2 font-sans text-sm font-medium text-accent-ink">
          Request a Vehicle
        </span>
      </button>


      <CustomVehicleDialog
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={(name) => window.open(whatsappLink(
          `Hi, I would like to request a custom vehicle that is not in your current fleet: "${name}". Please let me know if you can arrange it.`
        ), "_blank", "noopener,noreferrer")}
        submitLabel="Continue to WhatsApp"
        note="Send the message in WhatsApp so our team can confirm availability and pricing."
      />
    </>
  );
}
