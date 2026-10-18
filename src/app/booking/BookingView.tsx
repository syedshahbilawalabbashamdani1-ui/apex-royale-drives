"use client";

import BookingSteps from "@/components/ui/BookingSteps";
import Button from "@/components/ui/Button";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cars, locations } from "@/lib/cars";
import { formatPKR, priceCar, rentalDays } from "@/lib/pricing";
import { quoteMessage, type RentalQuote } from "@/lib/quote";
import QuoteSummary from "@/components/ui/QuoteSummary";
import { isValidPhone, normalizePhone, PHONE_ERROR } from "@/lib/phone";
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

/** Today in Pakistan Standard Time (UTC+5), as YYYY-MM-DD. */
function todayInPKT(): string {
  return new Date(Date.now() + 5 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

/** The day after an ISO date, as YYYY-MM-DD. */
function addDays(iso: string, days: number): string {
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function BookingView({
  initialCarId,
}: {
  initialCarId: string | null;
}) {
  const [currentStep, setCurrentStep] = useState(initialCarId ? 2 : 1);
  const [formData, setFormData] = useState<BookingFormData>({
    carIds: initialCarId ? [initialCarId] : [],
    customCarNames: [],
    pickupDate: "",
    returnDate: "",
    pickupLocation: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
  });

  const [showRequest, setShowRequest] = useState(false);
  const [bookingSummary, setBookingSummary] = useState<{
    carNames: string[];
    pickupDate: string;
    returnDate: string;
    quote: RentalQuote;
  } | null>(null);
  const [stepErrors, setStepErrors] = useState<{ email?: string; phone?: string }>({});

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
    setFormData((prev) => ({
      ...prev,
      carIds: prev.carIds.includes(carId)
        ? prev.carIds.filter((id) => id !== carId)
        : [...prev.carIds, carId],
    }));
  };

  const selectedCars = cars.filter((c) => formData.carIds.includes(c.id));
  const totalSelectionCount = formData.carIds.length + formData.customCarNames.length;

  /* ── pricing ──────────────────────────────────────────── */
  const days = rentalDays(formData.pickupDate, formData.returnDate);
  const isDateRangeValid = days > 0;

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
  const minReturnDate = formData.pickupDate
    ? addDays(formData.pickupDate, 1)
    : today;

  /* ── navigation ───────────────────────────────────────── */
  const nextStep = () => {
    if (currentStep === 3) {
      const errs: typeof stepErrors = {};
      if (!EMAIL_RE.test(formData.email)) {
        errs.email = "Please enter a valid email address";
      }
      if (!isValidPhone(formData.phone)) {
        errs.phone = PHONE_ERROR;
      }
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
      `Name: ${formData.firstName} ${formData.lastName}`,
      `Phone: ${normalizePhone(formData.phone)}`,
      `Email: ${formData.email}`,
    ];

    lines.push(quoteMessage(rentalQuote));

    if (formData.message?.trim()) {
      lines.push("", `Notes: ${formData.message.trim()}`);
    }

    return lines.join("\n");
  };

  const handleSubmit = () => {
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
    !formData.firstName ||
    !formData.lastName ||
    !formData.email ||
    !formData.phone ||
    !formData.pickupLocation;

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-primary)" }}>
      {/* Header */}
      <div className="py-20" style={{ background: "var(--bg-tertiary)" }}>
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-4"
          >
            <h1 className="font-sans text-4xl sm:text-5xl font-bold" style={{ color: "var(--text-primary)" }}>
              BOOK YOUR <span className="text-accent">RIDE</span>
            </h1>
            <p className="font-sans max-w-2xl mx-auto" style={{ color: "var(--text-secondary)" }}>
              Select one or more vehicles, pick your dates, and we&apos;ll confirm
              your reservation within minutes.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <BookingSteps current={currentStep} />

        {/* Form Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* ── Step 1: Select Car(s) ─────────────────────── */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="font-sans text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
                    Select Your Vehicle{totalSelectionCount > 1 ? "s" : ""}
                  </h2>
                  {totalSelectionCount > 0 && (
                    <span className="px-3 py-1 rounded-full bg-electric-cyan/10 border border-electric-cyan/20 font-sans text-xs text-electric-cyan font-medium">
                      {totalSelectionCount} selected
                    </span>
                  )}
                </div>

                {formData.customCarNames.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.customCarNames.map((name, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-electric-cyan/10 border border-electric-cyan/20 font-sans text-sm text-electric-cyan"
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
                        aria-checked={isSelected}
                        aria-label={`${car.name} — ${car.brand}, ${formatPKR(car.pricePerDay)} per day`}
                        onClick={() => toggleCar(car.id)}
                        className={cn(
                          "panel p-4 text-left transition-all",
                          isSelected
                            ? "border-electric-cyan shadow-accent"
                            : "hover:border-electric-cyan/30"
                        )}
                      >
                        <div className="flex gap-4">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={car.images[0]}
                            alt={car.name}
                            className="w-20 h-16 rounded-lg object-cover flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h3 className="font-sans text-sm font-bold truncate" style={{ color: "var(--text-primary)" }}>
                              {car.name}
                            </h3>
                            <p className="font-sans text-xs" style={{ color: "var(--text-secondary)" }}>
                              {car.brand} &bull; {car.category}
                            </p>
                            <div className="mt-2 flex items-center gap-2">
                              <span className="font-sans text-sm font-bold text-accent">
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
                                ? "bg-electric-cyan border-electric-cyan"
                                : "border-theme-secondary/30"
                            )}
                          >
                            {isSelected && <Check className="w-4 h-4 text-accent-contrast" />}
                          </div>
                        </div>
                      </button>
                    );
                  })}

                  {/* Custom Fleet Card */}
                  <button
                    type="button"
                    onClick={() => setCustomFleetOpen(true)}
                    className="group panel p-4 text-left transition-all duration-300 hover:border-electric-cyan/40 hover:shadow-accent flex items-center justify-center text-center cursor-pointer"
                    style={{ borderStyle: "dashed", borderColor: "rgba(var(--accent-r), var(--accent-g), var(--accent-b), 0.25)" }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-full bg-electric-cyan/10 border border-electric-cyan/20 flex items-center justify-center group-hover:bg-electric-cyan/20 transition-colors flex-shrink-0">
                        <Plus className="w-7 h-7 text-electric-cyan" aria-hidden="true" />
                      </div>
                      <div className="text-left">
                        <h3 className="font-sans text-sm font-bold group-hover:text-electric-cyan transition-colors" style={{ color: "var(--text-primary)" }}>
                          CUSTOM FLEET
                        </h3>
                        <p className="font-sans text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                          Can&apos;t find your dream car? Request any vehicle.
                        </p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            )}

            {/* ── Step 2: Dates & Location ──────────────────── */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <h2 className="font-sans text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
                  Dates & Pickup Location
                </h2>
                <div className="panel p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="booking-pickup-date" className="block font-sans text-sm mb-2" style={{ color: "var(--text-secondary)" }}>
                        Pickup Date
                      </label>
                      <input
                        id="booking-pickup-date"
                        type="date"
                        value={formData.pickupDate}
                        onChange={(e) => {
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
                        className="field w-full px-4 py-3 rounded-lg font-sans text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent transition-colors"
                        style={{ background: "var(--bg-primary)", color: "var(--text-primary)", borderColor: "var(--border-primary)", colorScheme: "light" }}
                      />
                    </div>
                    <div>
                      <label htmlFor="booking-return-date" className="block font-sans text-sm mb-2" style={{ color: "var(--text-secondary)" }}>
                        Return Date
                      </label>
                      <input
                        id="booking-return-date"
                        type="date"
                        value={formData.returnDate}
                        onChange={(e) =>
                          setFormData({ ...formData, returnDate: e.target.value })
                        }
                        min={minReturnDate}
                        className="field w-full px-4 py-3 rounded-lg font-sans text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent transition-colors"
                        style={{ background: "var(--bg-primary)", color: "var(--text-primary)", borderColor: "var(--border-primary)", colorScheme: "light" }}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="booking-pickup-location" className="block font-sans text-sm mb-2" style={{ color: "var(--text-secondary)" }}>
                      Pickup Location
                    </label>
                    <select
                      id="booking-pickup-location"
                      value={formData.pickupLocation}
                      onChange={(e) =>
                        setFormData({ ...formData, pickupLocation: e.target.value })
                      }
                      className="field w-full px-4 py-3 rounded-lg font-sans text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent transition-colors"
                      style={{ background: "var(--bg-primary)", color: "var(--text-primary)", borderColor: "var(--border-primary)" }}
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
                    <div className="p-4 rounded-lg space-y-2" style={{ background: "var(--bg-primary)" }}>
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
                            <span className="text-red-400">Return date must be after pickup date</span>
                          )}
                        </span>
                      </div>
                      <div className="h-px my-2" style={{ background: "var(--border-primary)" }} />
                      <QuoteSummary quote={rentalQuote} />
                      <p className="font-sans text-xs" style={{ color: "var(--text-secondary)" }}>
                        Longer bookings are charged at the weekly or monthly rate,
                        whichever combination works out cheapest.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── Step 3: Personal Info ─────────────────────── */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <h2 className="font-sans text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
                  Personal Information
                </h2>
                <div className="panel p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="booking-first-name" className="block font-sans text-sm mb-2" style={{ color: "var(--text-secondary)" }}>
                        First Name
                      </label>
                      <input
                        id="booking-first-name"
                        type="text"
                        value={formData.firstName}
                        onChange={(e) =>
                          setFormData({ ...formData, firstName: e.target.value })
                        }
                        placeholder="Enter first name"
                        className="field w-full px-4 py-3 rounded-lg font-sans text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent transition-colors"
                        style={{ background: "var(--bg-primary)", color: "var(--text-primary)", borderColor: "var(--border-primary)" }}
                      />
                    </div>
                    <div>
                      <label htmlFor="booking-last-name" className="block font-sans text-sm mb-2" style={{ color: "var(--text-secondary)" }}>
                        Last Name
                      </label>
                      <input
                        id="booking-last-name"
                        type="text"
                        value={formData.lastName}
                        onChange={(e) =>
                          setFormData({ ...formData, lastName: e.target.value })
                        }
                        placeholder="Enter last name"
                        className="field w-full px-4 py-3 rounded-lg font-sans text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent transition-colors"
                        style={{ background: "var(--bg-primary)", color: "var(--text-primary)", borderColor: "var(--border-primary)" }}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="booking-email" className="block font-sans text-sm mb-2" style={{ color: "var(--text-secondary)" }}>
                      Email Address
                    </label>
                    <input
                      id="booking-email"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      placeholder="Enter email address"
                      className="field w-full px-4 py-3 rounded-lg font-sans text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent transition-colors"
                      style={{ background: "var(--bg-primary)", color: "var(--text-primary)", borderColor: "var(--border-primary)" }}
                    />
                    {stepErrors.email && (
                      <p className="font-sans text-xs text-red-400 mt-1">{stepErrors.email}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="booking-phone" className="block font-sans text-sm mb-2" style={{ color: "var(--text-secondary)" }}>
                      Phone Number
                    </label>
                    <input
                      id="booking-phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      placeholder="+92 300 1234567"
                      className="field w-full px-4 py-3 rounded-lg font-sans text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent transition-colors"
                      style={{ background: "var(--bg-primary)", color: "var(--text-primary)", borderColor: "var(--border-primary)" }}
                    />
                    {stepErrors.phone && (
                      <p className="font-sans text-xs text-red-400 mt-1">{stepErrors.phone}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="booking-message" className="block font-sans text-sm mb-2" style={{ color: "var(--text-secondary)" }}>
                      Additional Message (Optional)
                    </label>
                    <textarea
                      id="booking-message"
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      placeholder="Child seat, extra luggage, pickup flight details..."
                      rows={3}
                      className="field w-full px-4 py-3 rounded-lg font-sans text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent transition-colors resize-none"
                      style={{ background: "var(--bg-primary)", color: "var(--text-primary)", borderColor: "var(--border-primary)" }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ── Step 4: Confirmation ──────────────────────── */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <h2 className="font-sans text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
                  Review Your Request
                </h2>
                <div className="panel p-6 space-y-6">
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg">
                      <h4 className="font-sans text-sm font-semibold text-electric-cyan mb-3">
                        VEHICLE{totalSelectionCount > 1 ? "S" : ""}
                      </h4>
                      <div className="space-y-3">
                        {quote.map(({ car, breakdown }) => (
                          <div key={car.id} className="flex items-center gap-4">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={car.images[0]}
                              alt={car.name}
                              className="w-16 h-12 rounded-lg object-cover flex-shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <h3 className="font-sans text-base font-bold truncate" style={{ color: "var(--text-primary)" }}>
                                {car.name}
                              </h3>
                              <p className="font-sans text-xs" style={{ color: "var(--text-secondary)" }}>
                                {breakdown.label}
                              </p>
                            </div>
                            <span className="font-sans text-sm font-bold text-accent flex-shrink-0">
                              {formatPKR(breakdown.total)}
                            </span>
                          </div>
                        ))}
                        {formData.customCarNames.map((name, i) => (
                          <div key={`custom-${i}`} className="flex items-center gap-4">
                            <div className="w-16 h-12 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "var(--bg-secondary)" }}>
                              <Plus className="w-5 h-5 text-electric-cyan/50" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-sans text-base font-bold truncate italic" style={{ color: "var(--text-primary)" }}>
                                {name}
                              </h3>
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
                      <div className="p-4 rounded-lg" style={{ background: "var(--bg-primary)" }}>
                        <h4 className="font-sans text-xs font-semibold text-electric-cyan mb-2">
                          PICKUP
                        </h4>
                        <p className="font-sans text-sm" style={{ color: "var(--text-primary)" }}>
                          {formData.pickupDate}
                        </p>
                        <p className="font-sans text-xs mt-1" style={{ color: "var(--text-secondary)" }}>
                          {formData.pickupLocation}
                        </p>
                      </div>
                      <div className="p-4 rounded-lg" style={{ background: "var(--bg-primary)" }}>
                        <h4 className="font-sans text-xs font-semibold text-electric-cyan mb-2">
                          RETURN
                        </h4>
                        <p className="font-sans text-sm" style={{ color: "var(--text-primary)" }}>
                          {formData.returnDate}
                        </p>
                        <p className="font-sans text-xs mt-1" style={{ color: "var(--text-secondary)" }}>
                          {formData.pickupLocation}
                        </p>
                      </div>
                    </div>

                    <div className="p-4 rounded-lg" style={{ background: "var(--bg-primary)" }}>
                      <h4 className="font-sans text-xs font-semibold text-electric-cyan mb-2">
                        CONTACT
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

                    <div className="p-4 bg-accent rounded-lg text-accent-contrast">
                      <QuoteSummary quote={rentalQuote} />
                    </div>
                  </div>

                  <div className="p-4 bg-electric-cyan/10 border border-electric-cyan/20 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Phone className="w-5 h-5 text-electric-cyan mt-0.5" />
                      <div>
                        <h4 className="font-sans text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                          Send Your Request on WhatsApp
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
              "flex items-center gap-2 px-6 py-3 rounded-lg font-sans text-sm font-medium transition-colors",
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
                  (datesMissing || !formData.pickupLocation || !isDateRangeValid)) ||
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
