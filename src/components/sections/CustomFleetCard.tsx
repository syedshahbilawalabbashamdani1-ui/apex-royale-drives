"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X } from "lucide-react";
import { CONTACT } from "@/lib/constants";
import { WhatsAppIcon } from "@/components/ui/SocialIcons";

export default function CustomFleetCard() {
  const [open, setOpen] = useState(false);
  const [carName, setCarName] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = carName.trim();
    if (!trimmed) {
      setError(true);
      return;
    }
    const message = encodeURIComponent(
      `Hi, I would like to request a custom vehicle that is not in your current fleet: "${trimmed}". Please let me know if you can arrange it.`
    );
    window.open(`https://wa.me/${CONTACT.whatsapp}?text=${message}`, "_blank");
    setCarName("");
    setError(false);
    setOpen(false);
  };

  return (
    <>
      {/* Card */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group card-dark p-6 text-left transition-all duration-300 hover:border-electric-cyan/40 hover:shadow-cyan-glow flex flex-col items-center justify-center text-center h-full cursor-pointer"
        style={{ borderStyle: "dashed", borderColor: "rgba(var(--accent-r), var(--accent-g), var(--accent-b), 0.25)" }}
      >
        <div className="w-14 h-14 rounded-full bg-electric-cyan/10 border border-electric-cyan/20 flex items-center justify-center mb-5 group-hover:bg-electric-cyan/20 transition-colors">
          <Plus className="w-7 h-7 text-electric-cyan" aria-hidden="true" />
        </div>
        <h3 className="font-general-sans text-lg font-bold mb-2 group-hover:text-electric-cyan transition-colors" style={{ color: "var(--text-primary)" }}>
          CUSTOM FLEET
        </h3>
        <p className="font-sans text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
          Can&apos;t find your dream car? Tell us what you&apos;re looking for and
          we&apos;ll arrange it for you.
        </p>
        <span className="mt-5 inline-flex items-center gap-2 font-sans text-sm font-medium text-electric-cyan">
          Request a Vehicle
        </span>
      </button>

      {/* Modal */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="custom-fleet-modal"
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />

            <motion.div
              className="relative w-full max-w-md rounded-2xl border overflow-hidden"
              style={{
                background: "var(--bg-secondary, #1E293B)",
                borderColor: "rgba(var(--accent-r), var(--accent-g), var(--accent-b), 0.15)",
              }}
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="custom-fleet-title"
            >
              <div className="p-8 space-y-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3
                      id="custom-fleet-title"
                      className="font-general-sans text-xl font-bold"
                      style={{ color: "var(--text-primary)" }}
                    >
                      REQUEST A <span className="text-gradient">CUSTOM VEHICLE</span>
                    </h3>
                    <p className="font-sans text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
                      Looking for a car that&apos;s not in our fleet? Let us know and
                      we&apos;ll check availability for you.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    aria-label="Close"
                    className="p-2 rounded-lg text-theme-secondary hover:text-electric-cyan transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="custom-car-name" className="block font-sans text-sm mb-2" style={{ color: "var(--text-secondary)" }}>
                      Which car are you looking for?
                    </label>
                    <input
                      id="custom-car-name"
                      type="text"
                      value={carName}
                      onChange={(e) => {
                        setCarName(e.target.value);
                        if (error) setError(false);
                      }}
                      placeholder="e.g. Toyota Land Cruiser LC 300"
                      className="w-full px-4 py-3 rounded-lg font-sans text-sm placeholder:opacity-50 focus:outline-none transition-colors"
                      style={{ background: "var(--bg-primary)", color: "var(--text-primary)", borderColor: "var(--border-primary)" }}
                    />
                    {error && (
                      <p className="font-sans text-xs text-red-400 mt-1">
                        Please tell us which car you&apos;re looking for
                      </p>
                    )}
                  </div>

                  <button type="submit" className="btn-primary w-full py-4">
                    <WhatsAppIcon className="w-5 h-5 mr-2" aria-hidden="true" />
                    Send Request on WhatsApp
                  </button>
                  <p className="font-sans text-xs text-center" style={{ color: "var(--text-secondary)" }}>
                    You&apos;ll be redirected to WhatsApp — our team will respond with
                    availability and pricing.
                  </p>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
