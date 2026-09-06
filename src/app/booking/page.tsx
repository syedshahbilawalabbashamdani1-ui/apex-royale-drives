"use client";

import { useState, useEffect, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { cars, locations } from "@/lib/cars";
import { CONTACT } from "@/lib/constants";
import { BookingFormData } from "@/types";
import {
  Car,
  Calendar,
  User,
  Check,
  ArrowLeft,
  ArrowRight,
  Phone,
  Plus,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import SuccessModal from "@/components/ui/SuccessModal";

const steps = [
  { id: 1, label: "Select Car", icon: Car },
  { id: 2, label: "Dates & Location", icon: Calendar },
  { id: 3, label: "Personal Info", icon: User },
  { id: 4, label: "Confirm", icon: Check },
];

function todayInPKT(): string {
  const now = new Date();
  const pkt = new Date(now.getTime() + 5 * 60 * 60 * 1000);
  return pkt.toISOString().split("T")[0];
}

export default function BookingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg-primary)" }}>
        <div className="w-12 h-12 border-4 border-electric-cyan/20 border-t-electric-cyan rounded-full animate-spin" />
      </div>
    }>
      <BookingContent />
    </Suspense>
  );
}

function BookingContent() {
  const searchParams = useSearchParams();
  const preselectedCar = searchParams.get("car") || "";
  const isValidPreselection = preselectedCar && cars.some((c) => c.id === preselectedCar);

  const [currentStep, setCurrentStep] = useState(isValidPreselection ? 2 : 1);
  const [formData, setFormData] = useState<BookingFormData>({
    carIds: isValidPreselection ? [preselectedCar] : [],
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

  const [showSuccess, setShowSuccess] = useState(false);
  const [bookingSummary, setBookingSummary] = useState<{
    carNames: string[];
    pickupDate: string;
    returnDate: string;
    total: number;
  } | null>(null);
  const [stepErrors, setStepErrors] = useState<{ email?: string; phone?: string }>({});

  /* ── custom fleet modal ───────────────────────────────── */
  const [customFleetOpen, setCustomFleetOpen] = useState(false);
  const [customCarInput, setCustomCarInput] = useState("");
  const [customCarError, setCustomCarError] = useState(false);

  useEffect(() => {
    if (!customFleetOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setCustomFleetOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [customFleetOpen]);

  const handleCustomFleetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = customCarInput.trim();
    if (!trimmed) {
      setCustomCarError(true);
      return;
    }
    setFormData((prev) => ({
      ...prev,
      customCarNames: [...prev.customCarNames, trimmed],
    }));
    setCustomCarInput("");
    setCustomCarError(false);
    setCustomFleetOpen(false);
  };

  const removeCustomCar = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      customCarNames: prev.customCarNames.filter((_, i) => i !== index),
    }));
  };

  /* ── car selection helpers ─────────────────────────────── */
  const toggleCar = (carId: string) => {
    setFormData((prev) => {
      const ids = prev.carIds.includes(carId)
        ? prev.carIds.filter((id) => id !== carId)
        : [...prev.carIds, carId];
      return { ...prev, carIds: ids };
    });
  };

  const selectedCars = cars.filter((c) => formData.carIds.includes(c.id));
  const totalSelectionCount = formData.carIds.length + formData.customCarNames.length;

  /* ── pricing ───────────────────────────────────────────── */
  const calculateDuration = () => {
    if (!formData.pickupDate || !formData.returnDate) return 0;
    const start = new Date(formData.pickupDate);
    const end = new Date(formData.returnDate);
    const days = Math.ceil(
      (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
    );
    return Math.max(0, days);
  };

  const isDateRangeValid = calculateDuration() > 0;

  const calculateTotal = () => {
    const duration = calculateDuration();
    if (duration <= 0) return 0;
    return selectedCars.reduce((sum, car) => sum + car.pricePerDay * duration, 0);
  };

  const minReturnDate = formData.pickupDate
    ? (() => {
        const d = new Date(formData.pickupDate);
        d.setDate(d.getDate() + 1);
        return d.toISOString().split("T")[0];
      })()
    : todayInPKT();

  /* ── navigation ────────────────────────────────────────── */
  const nextStep = () => {
    if (currentStep === 3) {
      const errs: typeof stepErrors = {};
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        errs.email = "Please enter a valid email address";
      }
      if (!/^[+\d\s-]{7,15}$/.test(formData.phone)) {
        errs.phone = "Please enter a valid phone number";
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

  /* ── submit ────────────────────────────────────────────── */
  const handleSubmit = () => {
    const carNames = [
      ...selectedCars.map((c) => c.name),
      ...formData.customCarNames.map((n) => `${n} (custom request)`),
    ];
    setBookingSummary({
      carNames,
      pickupDate: formData.pickupDate,
      returnDate: formData.returnDate,
      total: calculateTotal(),
    });
    setShowSuccess(true);
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    if (bookingSummary) {
      setTimeout(() => {
        const duration = calculateDuration();
        const carList = [
          ...selectedCars.map(
            (c) => `${c.name} — Rs. ${c.pricePerDay.toLocaleString()}/day`
          ),
          ...formData.customCarNames.map((n) => `${n} (custom request)`),
        ]
          .map((c, i) => `${i + 1}. ${c}`)
          .join("\n");

        window.open(
          `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(
            `Hi, I want to book the following vehicles:\n${carList}\n\nFrom: ${formData.pickupDate} to ${formData.returnDate} (${duration} days)\nLocation: ${formData.pickupLocation}\nName: ${formData.firstName} ${formData.lastName}, Phone: ${formData.phone}\nTotal: Rs. ${calculateTotal().toLocaleString()}`
          )}`,
          "_blank"
        );
      }, 250);
    }
  };

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
            <h1 className="font-general-sans text-4xl sm:text-5xl font-bold" style={{ color: "var(--text-primary)" }}>
              BOOK YOUR <span className="text-gradient">RIDE</span>
            </h1>
            <p className="font-sans max-w-2xl mx-auto" style={{ color: "var(--text-secondary)" }}>
              Select one or more vehicles, pick your dates, and we&apos;ll confirm
              your reservation within minutes.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Step Indicator */}
        <div className="mb-12">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={cn(
                    "flex items-center gap-2",
                    currentStep >= step.id ? "text-electric-cyan" : "text-theme-secondary/50"
                  )}
                >
                  <div
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center font-general-sans text-sm font-bold transition-colors",
                      currentStep >= step.id
                        ? "bg-electric-cyan text-carbon-black"
                        : "bg-gunmetal text-theme-secondary"
                    )}
                    aria-current={currentStep === step.id ? "step" : undefined}
                  >
                    {currentStep > step.id ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      step.id
                    )}
                  </div>
                  <span className="hidden sm:block font-sans text-sm font-medium" aria-label={`Step ${step.id}: ${step.label}`}>
                    {step.label}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      "hidden sm:block w-16 lg:w-24 h-0.5 mx-4",
                      currentStep > step.id ? "bg-electric-cyan" : "bg-gunmetal"
                    )}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

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
                  <h2 className="font-general-sans text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
                    Select Your Vehicle{totalSelectionCount > 1 ? "s" : ""}
                  </h2>
                  {totalSelectionCount > 0 && (
                    <span className="px-3 py-1 rounded-full bg-electric-cyan/10 border border-electric-cyan/20 font-sans text-xs text-electric-cyan font-medium">
                      {totalSelectionCount} selected
                    </span>
                  )}
                </div>

                {/* Custom car tags */}
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

                {/* Car grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {cars.map((car) => {
                    const isSelected = formData.carIds.includes(car.id);
                    return (
                      <button
                        key={car.id}
                        type="button"
                        role="checkbox"
                        aria-checked={isSelected}
                        aria-label={`${car.name} — ${car.brand}, Rs. ${car.pricePerDay.toLocaleString()} per day`}
                        onClick={() => toggleCar(car.id)}
                        className={cn(
                          "card-dark p-4 text-left transition-all",
                          isSelected
                            ? "border-electric-cyan shadow-cyan-glow"
                            : "hover:border-electric-cyan/30"
                        )}
                      >
                        <div className="flex gap-4">
                          <div className="w-20 h-16 rounded-lg overflow-hidden flex items-center justify-center flex-shrink-0" style={{ background: "var(--bg-secondary)" }}>
                            {car.images && car.images.length > 0 ? (
                              <img
                                src={car.images[0]}
                                alt={car.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="font-general-sans text-xl font-bold text-electric-cyan/50">
                                {car.brand.charAt(0)}
                              </span>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-general-sans text-sm font-bold truncate" style={{ color: "var(--text-primary)" }}>
                              {car.name}
                            </h3>
                            <p className="font-sans text-xs" style={{ color: "var(--text-secondary)" }}>
                              {car.brand} &bull; {car.category}
                            </p>
                            <div className="mt-2 flex items-center gap-2">
                              <span className="font-general-sans text-sm font-bold text-gradient">
                                Rs. {car.pricePerDay.toLocaleString()}
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
                            {isSelected && <Check className="w-4 h-4 text-carbon-black" />}
                          </div>
                        </div>
                      </button>
                    );
                  })}

                  {/* Custom Fleet Card */}
                  <button
                    type="button"
                    onClick={() => setCustomFleetOpen(true)}
                    className="group card-dark p-4 text-left transition-all duration-300 hover:border-electric-cyan/40 hover:shadow-cyan-glow flex items-center justify-center text-center cursor-pointer"
                    style={{ borderStyle: "dashed", borderColor: "rgba(var(--accent-r), var(--accent-g), var(--accent-b), 0.25)" }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-full bg-electric-cyan/10 border border-electric-cyan/20 flex items-center justify-center group-hover:bg-electric-cyan/20 transition-colors flex-shrink-0">
                        <Plus className="w-7 h-7 text-electric-cyan" aria-hidden="true" />
                      </div>
                      <div className="text-left">
                        <h3 className="font-general-sans text-sm font-bold group-hover:text-electric-cyan transition-colors" style={{ color: "var(--text-primary)" }}>
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
                <h2 className="font-general-sans text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
                  Dates & Pickup Location
                </h2>
                <div className="card-dark p-6 space-y-6">
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
                        min={todayInPKT()}
                        className="w-full px-4 py-3 rounded-lg font-sans text-sm focus:outline-none transition-colors"
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
                          setFormData({
                            ...formData,
                            returnDate: e.target.value,
                          })
                        }
                        min={minReturnDate}
                        className="w-full px-4 py-3 rounded-lg font-sans text-sm focus:outline-none transition-colors"
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
                        setFormData({
                          ...formData,
                          pickupLocation: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 rounded-lg font-sans text-sm focus:outline-none transition-colors"
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
                  {totalSelectionCount > 0 && formData.pickupDate && formData.returnDate && (
                    <div className="p-4 rounded-lg space-y-2" style={{ background: "var(--bg-primary)" }}>
                      {selectedCars.map((car) => (
                        <div key={car.id} className="flex justify-between font-sans text-sm">
                          <span style={{ color: "var(--text-secondary)" }}>
                            {car.name}
                          </span>
                          <span style={{ color: "var(--text-primary)" }}>
                            Rs. {car.pricePerDay.toLocaleString()} / day
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
                            <>{calculateDuration()} days</>
                          ) : (
                            <span className="text-red-400">Return date must be after pickup date</span>
                          )}
                        </span>
                      </div>
                      <div className="h-px my-2" style={{ background: "var(--border-primary)" }} />
                      <div className="flex justify-between font-general-sans">
                        <span className="font-semibold" style={{ color: "var(--text-primary)" }}>Total</span>
                        <span className="text-xl font-bold text-gradient">
                          {isDateRangeValid && selectedCars.length > 0
                            ? `Rs. ${calculateTotal().toLocaleString()}`
                            : formData.customCarNames.length > 0
                              ? "Quote on request"
                              : "—"}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── Step 3: Personal Info ─────────────────────── */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <h2 className="font-general-sans text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
                  Personal Information
                </h2>
                <div className="card-dark p-6 space-y-6">
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
                          setFormData({
                            ...formData,
                            firstName: e.target.value,
                          })
                        }
                        placeholder="Enter first name"
                        className="w-full px-4 py-3 rounded-lg font-sans text-sm placeholder:opacity-50 focus:outline-none transition-colors"
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
                        className="w-full px-4 py-3 rounded-lg font-sans text-sm placeholder:opacity-50 focus:outline-none transition-colors"
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
                      className="w-full px-4 py-3 rounded-lg font-sans text-sm placeholder:opacity-50 focus:outline-none transition-colors"
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
                      placeholder="+92 300 123 4567"
                      className="w-full px-4 py-3 rounded-lg font-sans text-sm placeholder:opacity-50 focus:outline-none transition-colors"
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
                      placeholder="Any special requests or requirements..."
                      rows={3}
                      className="w-full px-4 py-3 rounded-lg font-sans text-sm placeholder:opacity-50 focus:outline-none transition-colors resize-none"
                      style={{ background: "var(--bg-primary)", color: "var(--text-primary)", borderColor: "var(--border-primary)" }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ── Step 4: Confirmation ──────────────────────── */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <h2 className="font-general-sans text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
                  Confirm Your Booking
                </h2>
                <div className="card-dark p-6 space-y-6">
                  <div className="space-y-4">
                    {/* Vehicles */}
                    <div className="p-4 rounded-lg">
                      <h4 className="font-general-sans text-sm font-semibold text-electric-cyan mb-3">
                        VEHICLE{totalSelectionCount > 1 ? "S" : ""}
                      </h4>
                      <div className="space-y-3">
                        {selectedCars.map((car) => (
                          <div key={car.id} className="flex items-center gap-4">
                            <div className="w-16 h-12 rounded-lg overflow-hidden flex items-center justify-center flex-shrink-0" style={{ background: "var(--bg-secondary)" }}>
                              {car.images && car.images.length > 0 ? (
                                <img
                                  src={car.images[0]}
                                  alt={car.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <span className="font-general-sans text-lg font-bold text-electric-cyan/50">
                                  {car.brand.charAt(0)}
                                </span>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-general-sans text-base font-bold truncate" style={{ color: "var(--text-primary)" }}>
                                {car.name}
                              </h3>
                              <p className="font-sans text-xs" style={{ color: "var(--text-secondary)" }}>
                                {car.brand} &bull; {car.category}
                              </p>
                            </div>
                            <span className="font-general-sans text-sm font-bold text-gradient flex-shrink-0">
                              Rs. {car.pricePerDay.toLocaleString()}/day
                            </span>
                          </div>
                        ))}
                        {formData.customCarNames.map((name, i) => (
                          <div key={`custom-${i}`} className="flex items-center gap-4">
                            <div className="w-16 h-12 rounded-lg overflow-hidden flex items-center justify-center flex-shrink-0" style={{ background: "var(--bg-secondary)" }}>
                              <Plus className="w-5 h-5 text-electric-cyan/50" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-general-sans text-base font-bold truncate italic" style={{ color: "var(--text-primary)" }}>
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
                        <h4 className="font-general-sans text-xs font-semibold text-electric-cyan mb-2">
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
                        <h4 className="font-general-sans text-xs font-semibold text-electric-cyan mb-2">
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
                      <h4 className="font-general-sans text-xs font-semibold text-electric-cyan mb-2">
                        CONTACT
                      </h4>
                      <p className="font-sans text-sm" style={{ color: "var(--text-primary)" }}>
                        {formData.firstName} {formData.lastName}
                      </p>
                      <p className="font-sans text-xs" style={{ color: "var(--text-secondary)" }}>
                        {formData.email} &bull; {formData.phone}
                      </p>
                    </div>

                    <div className="p-4 bg-gradient-brand rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="font-sans text-theme-primary font-medium">
                          Total Amount
                        </span>
                        <span className="font-general-sans text-2xl font-bold text-theme-primary">
                          {selectedCars.length > 0
                            ? `Rs. ${calculateTotal().toLocaleString()}`
                            : "Quote on request"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* WhatsApp Notice */}
                  <div className="p-4 bg-electric-cyan/10 border border-electric-cyan/20 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Phone className="w-5 h-5 text-electric-cyan mt-0.5" />
                      <div>
                        <h4 className="font-sans text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                          WhatsApp Confirmation
                        </h4>
                        <p className="font-sans text-xs mt-1" style={{ color: "var(--text-secondary)" }}>
                          After submitting, you&apos;ll be redirected to WhatsApp
                          to confirm your booking with our team.
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
        <div className="flex justify-between mt-8">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className={cn(
              "flex items-center gap-2 px-6 py-3 rounded-lg font-sans text-sm font-medium transition-colors",
              currentStep === 1
                ? "opacity-50 cursor-not-allowed text-theme-secondary"
                : "text-theme-primary hover:bg-gunmetal"
            )}
          >
            <ArrowLeft className="w-4 h-4" />
            Previous
          </button>

          {currentStep < 4 ? (
            <button
              onClick={nextStep}
              disabled={
                (currentStep === 1 && totalSelectionCount === 0) ||
                (currentStep === 2 &&
                  (!formData.pickupDate || !formData.returnDate || !formData.pickupLocation || !isDateRangeValid)) ||
                (currentStep === 3 &&
                  (!formData.firstName || !formData.lastName || !formData.email || !formData.phone))
              }
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next Step
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={
                !formData.firstName || !formData.lastName || !formData.email || !formData.phone ||
                !formData.pickupDate || !formData.returnDate || !formData.pickupLocation
              }
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Check className="w-4 h-4 mr-2" />
              Confirm Booking
            </button>
          )}
        </div>
      </div>

      <SuccessModal
        open={showSuccess}
        onClose={handleSuccessClose}
        bookingSummary={bookingSummary ?? undefined}
      />

      {/* ── Custom Fleet Modal ────────────────────────────── */}
      <AnimatePresence>
        {customFleetOpen && (
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
              onClick={() => setCustomFleetOpen(false)}
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
                    onClick={() => setCustomFleetOpen(false)}
                    aria-label="Close"
                    className="p-2 rounded-lg text-theme-secondary hover:text-electric-cyan transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleCustomFleetSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="custom-car-name" className="block font-sans text-sm mb-2" style={{ color: "var(--text-secondary)" }}>
                      Which car are you looking for?
                    </label>
                    <input
                      id="custom-car-name"
                      type="text"
                      value={customCarInput}
                      onChange={(e) => {
                        setCustomCarInput(e.target.value);
                        if (customCarError) setCustomCarError(false);
                      }}
                      placeholder="e.g. Toyota Land Cruiser LC 300"
                      className="w-full px-4 py-3 rounded-lg font-sans text-sm placeholder:opacity-50 focus:outline-none transition-colors"
                      style={{ background: "var(--bg-primary)", color: "var(--text-primary)", borderColor: "var(--border-primary)" }}
                    />
                    {customCarError && (
                      <p className="font-sans text-xs text-red-400 mt-1">
                        Please tell us which car you&apos;re looking for
                      </p>
                    )}
                  </div>

                  <button type="submit" className="btn-primary w-full py-4">
                    <Plus className="w-5 h-5 mr-2" aria-hidden="true" />
                    Add to My Booking
                  </button>
                  <p className="font-sans text-xs text-center" style={{ color: "var(--text-secondary)" }}>
                    The vehicle will be added to your booking. Our team will confirm
                    availability and pricing via WhatsApp.
                  </p>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
