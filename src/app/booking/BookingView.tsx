"use client";

import FieldError from "@/components/ui/FieldError";
import PageHeader from "@/components/layout/PageHeader";
import Heading from "@/components/ui/Heading";

import BookingSteps from "@/components/ui/BookingSteps";
import Button from "@/components/ui/Button";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cars, locations } from "@/lib/cars";
import { formatPKR, priceCar, rentalDays } from "@/lib/pricing";
import { isCalendarDate, todayInPKT, validateBookingDates, type BookingDateErrors } from "@/lib/bookingDates";
import { quoteMessage, type RentalQuote } from "@/lib/quote";
import QuoteSummary from "@/components/ui/QuoteSummary";
import { normalizePhone } from "@/lib/phone";
import { validateBookingContact } from "@/lib/bookingContact";
import { BOOKING_DRAFT_KEY, emptyBooking, restoreBookingDraft } from "@/lib/bookingDraft";
import { BookingFormData } from "@/types";
import {
  Check,
  ArrowLeft,
  ArrowRight,
  Phone,
  Plus,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import CustomVehicleDialog from "@/components/ui/CustomVehicleDialog";
import BookingRequestModal from "@/components/ui/BookingRequestModal";

/** The day after an ISO date, as YYYY-MM-DD. */
function addDays(iso: string, days: number): string {
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

export default function BookingView({
  initialCarId,
}: {
  initialCarId: string | null;
}) {
  const bookableInitialId = cars.find((car) => car.id === initialCarId && car.available)?.id;
  const [currentStep, setCurrentStep] = useState(bookableInitialId ? 2 : 1);
  const [formData, setFormData] = useState<BookingFormData>(() => emptyBooking(bookableInitialId));
  const [draftReady, setDraftReady] = useState(false);
  const restoredDraft = useRef(false);

  useEffect(() => {
    // Hydrate after the server render; never overwrite storage with the empty form.
    if (restoredDraft.current) return;
    restoredDraft.current = true;
    try {
      const draft = restoreBookingDraft(
        window.sessionStorage.getItem(BOOKING_DRAFT_KEY),
        cars.filter((car) => car.available).map((car) => car.id), locations, bookableInitialId,
      );
      // eslint-disable-next-line react-hooks/set-state-in-effect -- Restore browser-only session state after hydration.
      setFormData(draft.formData);
      setCurrentStep(draft.step);
    } catch { /* Storage can be blocked; the form still works in memory. */ }
    setDraftReady(true);
  }, [bookableInitialId]);

  useEffect(() => {
    if (!draftReady) return;
    try {
      window.sessionStorage.setItem(BOOKING_DRAFT_KEY, JSON.stringify({ version: 1, formData, step: currentStep }));
    } catch { /* Private browsing or a full storage quota must not block booking. */ }
  }, [formData, currentStep, draftReady]);

  const clearDraft = () => {
    setFormData(emptyBooking());
    setCurrentStep(1);
    setStepErrors({});
    setDateErrors({});
    setShowRequest(false);
    setBookingSummary(null);
    try { window.sessionStorage.removeItem(BOOKING_DRAFT_KEY); } catch {}
  };

  const [showRequest, setShowRequest] = useState(false);
  const [bookingSummary, setBookingSummary] = useState<{
    carNames: string[];
    pickupDate: string;
    returnDate: string;
    quote: RentalQuote;
  } | null>(null);
  const [stepErrors, setStepErrors] = useState<ReturnType<typeof validateBookingContact>>({});
  const [dateErrors, setDateErrors] = useState<BookingDateErrors>({});
  const pendingDateFocus = useRef<string | null>(null);
  const focusDateError = () => {
    const id = pendingDateFocus.current;
    if (!id) return;
    const input = document.getElementById(id);
    if (input) {
      input.focus();
      pendingDateFocus.current = null;
    }
  };
  const checkDates = () => {
    const errors = validateBookingDates(formData.pickupDate, formData.returnDate);
    setDateErrors(errors);
    if (!errors.pickupDate && !errors.returnDate) return true;
    pendingDateFocus.current = errors.pickupDate ? "booking-pickup-date" : "booking-return-date";
    if (currentStep === 2) focusDateError();
    else setCurrentStep(2);
    return false;
  };

  /* ── custom fleet modal ───────────────────────────────── */
  const [customFleetOpen, setCustomFleetOpen] = useState(false);
  const handleCustomFleetSubmit = (name: string) => {
    setFormData((prev) => ({ ...prev, customCarNames: [...prev.customCarNames, name] }));
    setCustomFleetOpen(false);
  };

  const removeCustomCar = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      customCarNames: prev.customCarNames.filter((_, i) => i !== index),
    }));
  };

  /* ── car selection ────────────────────────────────────── */
  const toggleCar = (carId: string) => {
    if (!cars.some((car) => car.id === carId && car.available)) return;
    setFormData((prev) => ({
      ...prev,
      carIds: prev.carIds.includes(carId)
        ? prev.carIds.filter((id) => id !== carId)
        : [...prev.carIds, carId],
    }));
  };

  const selectedCars = cars.filter((c) => c.available && formData.carIds.includes(c.id));
  const totalSelectionCount = selectedCars.length + formData.customCarNames.length;

  /* ── pricing ──────────────────────────────────────────── */
  const days = rentalDays(formData.pickupDate, formData.returnDate);
  const isDateRangeValid = days > 0 && Object.keys(validateBookingDates(formData.pickupDate, formData.returnDate)).length === 0;

  const quote = selectedCars.map((car) => ({
    car,
    breakdown: priceCar(car, days),
  }));

  const total = quote.reduce((sum, q) => sum + q.breakdown.total, 0);
  const rentalQuote: RentalQuote = {
    knownSubtotal: selectedCars.length > 0 && isDateRangeValid ? total : null,
    pendingCustomQuotes: formData.customCarNames.length,
  };

  const today = todayInPKT();
  const minReturnDate = isCalendarDate(formData.pickupDate)
    ? addDays(formData.pickupDate, 1)
    : today;

  /* ── navigation ───────────────────────────────────────── */
  const nextStep = () => {
    if (totalSelectionCount === 0) { setCurrentStep(1); return; }
    if (currentStep === 2 && !checkDates()) return;
    if (currentStep === 3) {
      const errs = validateBookingContact(formData);
      setStepErrors(errs);
      if (Object.keys(errs).length > 0) return;
    }
    setStepErrors({});
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  /* ── submit ───────────────────────────────────────────── */
  const buildSummaryLines = () =>
    [
      ...quote.map(
        (q) =>
          `${q.car.name} — ${formatPKR(q.car.pricePerDay)}/day (${q.breakdown.label}: ${formatPKR(q.breakdown.total)})`
      ),
      ...formData.customCarNames.map(
        (n) => `${n} (custom request — quote to follow)`
      ),
    ]
      .map((line, i) => `${i + 1}. ${line}`)
      .join("\n");

  const buildMessage = () => {
    const lines = [
      "Hi, I want to book the following vehicles:",
      buildSummaryLines(),
      "",
      `From: ${formData.pickupDate} to ${formData.returnDate} (${days} days)`,
      `Location: ${formData.pickupLocation}`,
      `Name: ${formData.firstName.trim()} ${formData.lastName.trim()}`,
      `Phone: ${normalizePhone(formData.phone)}`,
      `Email: ${formData.email.trim()}`,
    ];

    lines.push(quoteMessage(rentalQuote));

    if (formData.message?.trim()) {
      lines.push("", `Notes: ${formData.message.trim()}`);
    }

    return lines.join("\n");
  };

  const handleSubmit = () => {
    if (totalSelectionCount === 0) { setCurrentStep(1); return; }
    if (!checkDates()) return;
    const errors = validateBookingContact(formData);
    setStepErrors(errors);
    if (Object.keys(errors).length > 0) { setCurrentStep(3); return; }
    setBookingSummary({
      carNames: [
        ...selectedCars.map((c) => c.name),
        ...formData.customCarNames.map((n) => `${n} (custom request)`),
      ],
      pickupDate: formData.pickupDate,
      returnDate: formData.returnDate,
      quote: rentalQuote,
    });
    setShowRequest(true);
  };

  const datesMissing = !formData.pickupDate || !formData.returnDate;
  const contactMissing =
    !formData.firstName.trim() ||
    !formData.lastName.trim() ||
    !formData.email.trim() ||
    !formData.phone.trim() ||
    !formData.pickupLocation.trim();

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-primary)" }}>
      <PageHeader title="Book your ride" breadcrumb="Booking" description="Select one or more vehicles, pick your dates, and we'll confirm your reservation within minutes." />

      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 page-body">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <p className="text-sm text-theme-secondary">Your draft stays in this tab. Send it on WhatsApp to request a booking.</p>
          <button type="button" onClick={clearDraft} className="min-h-11 text-sm underline underline-offset-4 cursor-pointer">Clear draft</button>
        </div>
        <BookingSteps current={currentStep} />

        {/* Form Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            onAnimationComplete={() => { if (currentStep === 2) focusDateError(); }}
          >
            {/* ── Step 1: Select Car(s) ─────────────────────── */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <Heading as="h2" size="subsection">
                    Select your vehicle{totalSelectionCount > 1 ? "s" : ""}
                  </Heading>
                  {totalSelectionCount > 0 && (
                    <span className="px-3 py-1 rounded-full bg-surface-2 border border-line font-sans text-xs text-accent-ink font-medium">
                      {totalSelectionCount} selected
                    </span>
                  )}
                </div>

                {formData.customCarNames.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.customCarNames.map((name, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-control bg-surface-2 border border-line font-sans text-sm text-accent-ink"
                      >
                        {name}
                        <button
                          type="button"
                          onClick={() => removeCustomCar(i)}
                          className="hover:text-red-400 transition-colors cursor-pointer"
                          aria-label={`Remove ${name}`}
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {cars.map((car) => {
                    const isSelected = formData.carIds.includes(car.id);
                    return (
                      <button
                        key={car.id}
                        type="button"
                        role="checkbox"
                        disabled={!car.available}
                        aria-checked={isSelected}
                        aria-label={`${car.name} — ${car.brand}, ${formatPKR(car.pricePerDay)} per day`}
                        onClick={() => toggleCar(car.id)}
                        className={cn(
                          "panel p-4 text-left transition-all disabled:opacity-50 disabled:cursor-not-allowed",
                          isSelected
                            ? "border-accent"
                            : "hover:border-accent/30"
                        )}
                      >
                        <div className="flex gap-4">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={car.images[0]}
                            alt={car.name}
                            className="w-20 h-16 rounded-control object-cover flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <Heading as="h3" size="label" className="text-sm truncate">
                              {car.name}
                            </Heading>
                            <p className="font-sans text-xs" style={{ color: "var(--text-secondary)" }}>
                              {car.brand} &bull; {car.category}
                              {!car.available && " — Currently unavailable"}
                            </p>
                            <div className="mt-2 flex items-center gap-2">
                              <span className="font-sans text-sm font-bold text-accent-ink">
                                {formatPKR(car.pricePerDay)}
                              </span>
                              <span className="font-sans text-xs" style={{ color: "var(--text-secondary)" }}>
                                / day
                              </span>
                            </div>
                          </div>
                          <div
                            className={cn(
                              "w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 border transition-colors",
                              isSelected
                                ? "bg-text border-text"
                                : "border-theme-secondary/30"
                            )}
                          >
                            {isSelected && <Check className="w-4 h-4 text-background" />}
                          </div>
                        </div>
                      </button>
                    );
                  })}

                  {/* Custom Fleet Card */}
                  <button
                    type="button"
                    onClick={() => setCustomFleetOpen(true)}
                    className="group panel p-4 text-left transition-all duration-300 hover:border-electric-cyan/40  flex items-center justify-center text-center cursor-pointer"
                    style={{ borderStyle: "dashed", borderColor: "rgba(var(--accent-r), var(--accent-g), var(--accent-b), 0.25)" }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-full bg-surface-2 border border-line flex items-center justify-center group-hover:bg-surface-hover transition-colors flex-shrink-0">
                        <Plus className="w-7 h-7 text-accent-ink" aria-hidden="true" />
                      </div>
                      <div className="text-left">
                        <Heading as="h3" size="label" className="text-sm group-hover:text-accent-ink transition-colors">
                          Custom fleet
                        </Heading>
                        <p className="font-sans text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                          Can&apos;t find your dream car? Request any vehicle.
                        </p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            )}

            {/* ── Step 2: Dates & location ──────────────────── */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <Heading as="h2" size="subsection">
                  Dates & pickup location
                </Heading>
                <div className="panel p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="booking-pickup-date" className="block font-sans text-sm mb-2" style={{ color: "var(--text-secondary)" }}>
                        Pickup Date
                      </label>
                      <input
                        id="booking-pickup-date"
                        aria-invalid={!!dateErrors.pickupDate}
                        aria-describedby={dateErrors.pickupDate ? "booking-pickup-date-error" : undefined}
                        type="date"
                        value={formData.pickupDate}
                        onChange={(e) => {
                          setDateErrors({});
                          const newPickup = e.target.value;
                          const newReturn =
                            formData.returnDate && formData.returnDate <= newPickup
                              ? ""
                              : formData.returnDate;
                          setFormData({
                            ...formData,
                            pickupDate: newPickup,
                            returnDate: newReturn,
                          });
                        }}
                        min={today}
                        className="field w-full px-4 py-3 rounded-control font-sans text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent transition-colors"
                      />
                      {dateErrors.pickupDate && <FieldError id="booking-pickup-date-error">{dateErrors.pickupDate}</FieldError>}
                    </div>
                    <div>
                      <label htmlFor="booking-return-date" className="block font-sans text-sm mb-2" style={{ color: "var(--text-secondary)" }}>
                        Return Date
                      </label>
                      <input
                        id="booking-return-date"
                        aria-invalid={!!dateErrors.returnDate}
                        aria-describedby={dateErrors.returnDate ? "booking-return-date-error" : undefined}
                        type="date"
                        value={formData.returnDate}
                        onChange={(e) => {
                          setDateErrors({});
                          setFormData({ ...formData, returnDate: e.target.value });
                        }}
                        min={minReturnDate}
                        className="field w-full px-4 py-3 rounded-control font-sans text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent transition-colors"
                      />
                      {dateErrors.returnDate && <FieldError id="booking-return-date-error">{dateErrors.returnDate}</FieldError>}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="booking-pickup-location" className="block font-sans text-sm mb-2" style={{ color: "var(--text-secondary)" }}>
                      Pickup location
                    </label>
                    <select
                      id="booking-pickup-location"
                      value={formData.pickupLocation}
                      onChange={(e) =>
                        setFormData({ ...formData, pickupLocation: e.target.value })
                      }
                      className="field w-full px-4 py-3 rounded-control font-sans text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent transition-colors"
                    >
                      <option value="">Select a location</option>
                      {locations.map((loc) => (
                        <option key={loc} value={loc}>
                          {loc}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Price Summary */}
                  {totalSelectionCount > 0 && !datesMissing && (
                    <div className="p-4 rounded-control space-y-2" style={{ background: "var(--bg-primary)" }}>
                      {quote.map(({ car, breakdown }) => (
                        <div key={car.id} className="flex justify-between gap-4 font-sans text-sm">
                          <span style={{ color: "var(--text-secondary)" }}>
                            {car.name}
                          </span>
                          <span style={{ color: "var(--text-primary)" }}>
                            {breakdown.label} = {formatPKR(breakdown.total)}
                          </span>
                        </div>
                      ))}
                      {formData.customCarNames.map((name, i) => (
                        <div key={`custom-${i}`} className="flex justify-between font-sans text-sm">
                          <span className="italic" style={{ color: "var(--text-secondary)" }}>
                            {name} (custom)
                          </span>
                          <span style={{ color: "var(--text-secondary)" }}>
                            TBD
                          </span>
                        </div>
                      ))}
                      <div className="flex justify-between font-sans text-sm">
                        <span style={{ color: "var(--text-secondary)" }}>Duration</span>
                        <span style={{ color: isDateRangeValid ? "var(--text-primary)" : "var(--text-secondary)" }}>
                          {isDateRangeValid ? (
                            <>{days} days</>
                          ) : (
                            <span className="text-error">Return date must be after pickup date</span>
                          )}
                        </span>
                      </div>
                      <div className="h-px my-2" style={{ background: "var(--border-primary)" }} />
                      <QuoteSummary quote={rentalQuote} />
                      <p className="font-sans text-xs" style={{ color: "var(--text-secondary)" }}>
                        Rental amount = daily rate × number of days.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── Step 3: Personal Info ─────────────────────── */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <Heading as="h2" size="subsection">
                  Personal information
                </Heading>
                <div className="panel p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="booking-first-name" className="block font-sans text-sm mb-2" style={{ color: "var(--text-secondary)" }}>
                        First name
                      </label>
                      <input
                        id="booking-first-name"
                        aria-invalid={!!stepErrors.firstName}
                        aria-describedby={stepErrors.firstName ? "booking-first-name-error" : undefined}
                        type="text"
                        value={formData.firstName}
                        onChange={(e) =>
                          setFormData({ ...formData, firstName: e.target.value })
                        }
                        placeholder="Enter first name"
                        className="field w-full px-4 py-3 rounded-control font-sans text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent transition-colors"
                      />
                      {stepErrors.firstName && <FieldError id="booking-first-name-error">{stepErrors.firstName}</FieldError>}
                    </div>
                    <div>
                      <label htmlFor="booking-last-name" className="block font-sans text-sm mb-2" style={{ color: "var(--text-secondary)" }}>
                        Last name
                      </label>
                      <input
                        id="booking-last-name"
                        aria-invalid={!!stepErrors.lastName}
                        aria-describedby={stepErrors.lastName ? "booking-last-name-error" : undefined}
                        type="text"
                        value={formData.lastName}
                        onChange={(e) =>
                          setFormData({ ...formData, lastName: e.target.value })
                        }
                        placeholder="Enter last name"
                        className="field w-full px-4 py-3 rounded-control font-sans text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent transition-colors"
                      />
                      {stepErrors.lastName && <FieldError id="booking-last-name-error">{stepErrors.lastName}</FieldError>}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="booking-email" className="block font-sans text-sm mb-2" style={{ color: "var(--text-secondary)" }}>
                      Email address
                    </label>
                    <input
                      id="booking-email"
                      aria-invalid={!!stepErrors.email}
                      aria-describedby={stepErrors.email ? "booking-email-error" : undefined}
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      placeholder="Enter email address"
                      className="field w-full px-4 py-3 rounded-control font-sans text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent transition-colors"
                    />
                    {stepErrors.email && (
                      <FieldError id="booking-email-error">{stepErrors.email}</FieldError>
                    )}
                  </div>

                  <div>
                    <label htmlFor="booking-phone" className="block font-sans text-sm mb-2" style={{ color: "var(--text-secondary)" }}>
                      Phone number
                    </label>
                    <input
                      id="booking-phone"
                      aria-invalid={!!stepErrors.phone}
                      aria-describedby={stepErrors.phone ? "booking-phone-error" : undefined}
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      placeholder="+92 300 1234567"
                      className="field w-full px-4 py-3 rounded-control font-sans text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent transition-colors"
                    />
                    {stepErrors.phone && (
                      <FieldError id="booking-phone-error">{stepErrors.phone}</FieldError>
                    )}
                  </div>

                  <div>
                    <label htmlFor="booking-message" className="block font-sans text-sm mb-2" style={{ color: "var(--text-secondary)" }}>
                      Additional message (optional)
                    </label>
                    <textarea
                      id="booking-message"
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      placeholder="Child seat, extra luggage, pickup flight details..."
                      rows={3}
                      className="field w-full px-4 py-3 rounded-control font-sans text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent transition-colors resize-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ── Step 4: Confirmation ──────────────────────── */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <Heading as="h2" size="subsection">
                  Review your request
                </Heading>
                <div className="panel p-6 space-y-6">
                  <div className="space-y-4">
                    <div className="p-4 rounded-control">
                      <Heading as="h3" size="label" className="mb-3">
                        Vehicle{totalSelectionCount > 1 ? "s" : ""}
                      </Heading>
                      <div className="space-y-3">
                        {quote.map(({ car, breakdown }) => (
                          <div key={car.id} className="flex items-center gap-4">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={car.images[0]}
                              alt={car.name}
                              className="w-16 h-12 rounded-control object-cover flex-shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <Heading as="h3" size="card" className="text-base truncate">
                                {car.name}
                              </Heading>
                              <p className="font-sans text-xs" style={{ color: "var(--text-secondary)" }}>
                                {breakdown.label}
                              </p>
                            </div>
                            <span className="font-sans text-sm font-bold text-accent-ink flex-shrink-0">
                              {formatPKR(breakdown.total)}
                            </span>
                          </div>
                        ))}
                        {formData.customCarNames.map((name, i) => (
                          <div key={`custom-${i}`} className="flex items-center gap-4">
                            <div className="w-16 h-12 rounded-control flex items-center justify-center flex-shrink-0" style={{ background: "var(--bg-secondary)" }}>
                              <Plus className="w-5 h-5 text-accent-ink/50" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <Heading as="h3" size="card" className="text-base truncate italic">
                                {name}
                              </Heading>
                              <p className="font-sans text-xs" style={{ color: "var(--text-secondary)" }}>
                                Custom request
                              </p>
                            </div>
                            <span className="font-sans text-xs flex-shrink-0" style={{ color: "var(--text-secondary)" }}>
                              Quote on request
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-control" style={{ background: "var(--bg-primary)" }}>
                        <h4 className="font-sans text-xs font-semibold text-accent-ink mb-2">
                          Pickup
                        </h4>
                        <p className="font-sans text-sm" style={{ color: "var(--text-primary)" }}>
                          {formData.pickupDate}
                        </p>
                        <p className="font-sans text-xs mt-1" style={{ color: "var(--text-secondary)" }}>
                          {formData.pickupLocation}
                        </p>
                      </div>
                      <div className="p-4 rounded-control" style={{ background: "var(--bg-primary)" }}>
                        <h4 className="font-sans text-xs font-semibold text-accent-ink mb-2">
                          Return
                        </h4>
                        <p className="font-sans text-sm" style={{ color: "var(--text-primary)" }}>
                          {formData.returnDate}
                        </p>
                        <p className="font-sans text-xs mt-1" style={{ color: "var(--text-secondary)" }}>
                          {formData.pickupLocation}
                        </p>
                      </div>
                    </div>

                    <div className="p-4 rounded-control" style={{ background: "var(--bg-primary)" }}>
                      <h4 className="font-sans text-xs font-semibold text-accent-ink mb-2">
                        Contact
                      </h4>
                      <p className="font-sans text-sm" style={{ color: "var(--text-primary)" }}>
                        {formData.firstName} {formData.lastName}
                      </p>
                      <p className="font-sans text-xs mt-1" style={{ color: "var(--text-secondary)" }}>
                        {formData.email} &bull; {formData.phone}
                      </p>
                      {formData.message?.trim() && (
                        <p className="font-sans text-xs mt-2 italic" style={{ color: "var(--text-secondary)" }}>
                          {formData.message.trim()}
                        </p>
                      )}
                    </div>

                    <div className="p-4 bg-surface-2 rounded-control text-text">
                      <QuoteSummary quote={rentalQuote} />
                    </div>
                  </div>

                  <div className="p-4 bg-surface-2 border border-line rounded-control">
                    <div className="flex items-start gap-3">
                      <Phone className="w-5 h-5 text-accent-ink mt-0.5" />
                      <div>
                        <h4 className="font-sans text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                          Send your request on WhatsApp
                        </h4>
                        <p className="font-sans text-xs mt-1" style={{ color: "var(--text-secondary)" }}>
                          Continue to WhatsApp and send your request. Your booking
                          is confirmed only after our team checks availability.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex flex-col-reverse sm:flex-row justify-between gap-3 mt-8">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className={cn(
              "flex items-center gap-2 px-6 py-3 rounded-control font-sans text-sm font-medium transition-colors",
              currentStep === 1
                ? "opacity-50 cursor-not-allowed text-theme-secondary"
                : "text-theme-primary hover:bg-surface-2"
            )}
          >
            <ArrowLeft className="w-4 h-4" />
            Previous
          </button>

          {currentStep < 4 ? (
            <Button
              onClick={nextStep}
              disabled={
                (currentStep === 1 && totalSelectionCount === 0) ||
                (currentStep === 2 &&
                  (datesMissing || !formData.pickupLocation)) ||
                (currentStep === 3 && contactMissing)
              }
              className="disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next Step
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={contactMissing || datesMissing}
              className="disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Check className="w-4 h-4 mr-2" />
              Prepare WhatsApp Request
            </Button>
          )}
        </div>
      </div>

      <BookingRequestModal
        open={showRequest}
        onClose={() => setShowRequest(false)}
        whatsappMessage={buildMessage()}
        bookingSummary={bookingSummary ?? undefined}
      />

      {/* ── Custom Fleet Modal ────────────────────────────── */}
      <CustomVehicleDialog
        open={customFleetOpen}
        onClose={() => setCustomFleetOpen(false)}
        onSubmit={handleCustomFleetSubmit}
        submitLabel="Add to booking"
        note="Our team will confirm availability and pricing via WhatsApp."
      />
    </div>
  );
}
