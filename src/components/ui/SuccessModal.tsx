"use client";

import { useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle } from "lucide-react";

interface SuccessModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  bookingSummary?: {
    carName: string;
    pickupDate: string;
    returnDate: string;
    total: number;
  };
}

export default function SuccessModal({
  open,
  onClose,
  title = "Booking Confirmed!",
  message = "Booking submitted successfully! We will contact you shortly via WhatsApp.",
  bookingSummary,
}: SuccessModalProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (!open) return;
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, handleKeyDown]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="success-modal"
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="relative w-full max-w-md rounded-2xl border overflow-hidden"
            style={{
              background: "var(--bg-secondary, #1E293B)",
              borderColor: "rgba(var(--accent-r, 0), var(--accent-g, 224), var(--accent-b, 255), 0.15)",
            }}
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            {/* Content */}
            <div className="p-8 text-center space-y-5">
              {/* Icon */}
              <div className="flex justify-center">
                <div className="w-16 h-16 rounded-full flex items-center justify-center"
                  style={{ background: "rgba(var(--accent-r, 0), var(--accent-g, 224), var(--accent-b, 255), 0.12)" }}
                >
                  <CheckCircle className="w-9 h-9 text-electric-cyan" />
                </div>
              </div>

              {/* Title */}
              <h3
                className="font-playfair text-xl font-bold"
                style={{ color: "var(--text-primary, #F8FAFC)" }}
              >
                {title}
              </h3>

              {/* Message */}
              <p
                className="font-sans text-sm leading-relaxed"
                style={{ color: "var(--text-secondary, #94A3B8)" }}
              >
                {message}
              </p>

              {/* Booking Summary */}
              {bookingSummary && (
                <div
                  className="rounded-xl p-4 space-y-3 text-left"
                  style={{ background: "var(--bg-primary, #0F172A)" }}
                >
                  <div className="flex justify-between font-sans text-sm">
                    <span style={{ color: "var(--text-secondary, #94A3B8)" }}>Vehicle</span>
                    <span className="font-medium" style={{ color: "var(--text-primary, #F8FAFC)" }}>
                      {bookingSummary.carName}
                    </span>
                  </div>
                  <div className="flex justify-between font-sans text-sm">
                    <span style={{ color: "var(--text-secondary, #94A3B8)" }}>Pickup</span>
                    <span style={{ color: "var(--text-primary, #F8FAFC)" }}>
                      {bookingSummary.pickupDate}
                    </span>
                  </div>
                  <div className="flex justify-between font-sans text-sm">
                    <span style={{ color: "var(--text-secondary, #94A3B8)" }}>Return</span>
                    <span style={{ color: "var(--text-primary, #F8FAFC)" }}>
                      {bookingSummary.returnDate}
                    </span>
                  </div>
                  <div className="h-px" style={{ background: "var(--border-primary, #334155)" }} />
                  <div className="flex justify-between font-playfair text-sm">
                    <span className="font-semibold" style={{ color: "var(--text-primary, #F8FAFC)" }}>
                      Total
                    </span>
                    <span className="font-bold text-gradient">
                      Rs. {bookingSummary.total.toLocaleString()}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-8 pb-8">
              <button
                onClick={onClose}
                className="btn-primary w-full"
              >
                Got it
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
