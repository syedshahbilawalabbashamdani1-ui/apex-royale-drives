"use client";

import Dialog from "./Dialog";
import { CheckCircle } from "lucide-react";
import WhatsAppLink from "./WhatsAppLink";
import QuoteSummary from "./QuoteSummary";
import type { RentalQuote } from "@/lib/quote";

interface BookingRequestModalProps {
  open: boolean;
  onClose: () => void;
  whatsappMessage: string;
  title?: string;
  message?: string;
  bookingSummary?: {
    carNames: string[];
    pickupDate: string;
    returnDate: string;
    quote: RentalQuote;
  };
}

export default function BookingRequestModal({
  open,
  onClose,
  whatsappMessage,
  title = "Request ready",
  message = "Your request has not been sent yet. Continue to WhatsApp, send the message, and wait for our team to confirm availability and your reservation.",
  bookingSummary,
}: BookingRequestModalProps) {
  return (
    <Dialog open={open} onClose={onClose} titleId="booking-request-title">
            {/* Content */}
            <div className="p-5 sm:p-8 text-center space-y-5">
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
                id="booking-request-title"
                className="font-sans text-xl font-bold"
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
                  <div className="font-sans text-sm">
                    <span style={{ color: "var(--text-secondary, #94A3B8)" }}>Vehicle{bookingSummary.carNames.length > 1 ? "s" : ""}</span>
                    <div className="mt-1 space-y-1">
                      {bookingSummary.carNames.slice(0, 3).map((name, i) => (
                        <div key={i} className="font-medium" style={{ color: "var(--text-primary, #F8FAFC)" }}>
                          {name}
                        </div>
                      ))}
                      {bookingSummary.carNames.length > 3 && (
                        <div className="text-xs" style={{ color: "var(--text-secondary, #94A3B8)" }}>
                          and {bookingSummary.carNames.length - 3} more...
                        </div>
                      )}
                    </div>
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
                  <div style={{ color: "var(--text-primary, #F8FAFC)" }}>
                    <QuoteSummary quote={bookingSummary.quote} />
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-5 pb-5 sm:px-8 sm:pb-8">
              <WhatsAppLink message={whatsappMessage} className="w-full">
                Continue to WhatsApp
              </WhatsAppLink>
              <button
                type="button"
                onClick={onClose}
                className="w-full min-h-11 mt-3 py-2 text-sm text-theme-secondary cursor-pointer"
              >
                Back to booking
              </button>
            </div>
    </Dialog>
  );
}
