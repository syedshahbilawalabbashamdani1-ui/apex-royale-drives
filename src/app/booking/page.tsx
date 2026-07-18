"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { cars, locations } from "@/lib/cars";
import { CONTACT } from "@/lib/constants";
import { BookingFormData } from "@/types";
import {
  Car,
  Calendar,
  User,
  CreditCard,
  Check,
  ArrowLeft,
  ArrowRight,
  Phone,
  MapPin,
} from "lucide-react";
import { cn } from "@/lib/utils";

const steps = [
  { id: 1, label: "Select Car", icon: Car },
  { id: 2, label: "Dates & Location", icon: Calendar },
  { id: 3, label: "Personal Info", icon: User },
  { id: 4, label: "Confirm", icon: Check },
];

export default function BookingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<BookingFormData>({
    carId: "",
    pickupDate: "",
    returnDate: "",
    pickupLocation: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
  });

  const selectedCar = cars.find((c) => c.id === formData.carId);

  const calculateTotal = () => {
    if (!selectedCar || !formData.pickupDate || !formData.returnDate) return 0;
    const start = new Date(formData.pickupDate);
    const end = new Date(formData.returnDate);
    const days = Math.ceil(
      (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
    );
    return days * selectedCar.pricePerDay;
  };

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = () => {
    // In production, this would submit to an API
    alert(
      "Booking submitted successfully! We will contact you shortly via WhatsApp."
    );
    window.open(
      `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(
        `Hi, I want to book a ${selectedCar?.name} from ${formData.pickupDate} to ${formData.returnDate} at ${formData.pickupLocation}. Name: ${formData.firstName} ${formData.lastName}, Phone: ${formData.phone}`
      )}`,
      "_blank"
    );
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
            <h1 className="font-orbitron text-4xl sm:text-5xl font-bold" style={{ color: "var(--text-primary)" }}>
              BOOK YOUR <span className="text-gradient">RIDE</span>
            </h1>
            <p className="font-inter max-w-2xl mx-auto" style={{ color: "var(--text-secondary)" }}>
              Complete the booking form below and we&apos;ll confirm your
              reservation within minutes.
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
                      "w-10 h-10 rounded-full flex items-center justify-center font-orbitron text-sm font-bold transition-colors",
                      currentStep >= step.id
                        ? "bg-electric-cyan text-carbon-black"
                        : "bg-gunmetal text-theme-secondary"
                    )}
                  >
                    {currentStep > step.id ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      step.id
                    )}
                  </div>
                  <span className="hidden sm:block font-inter text-sm font-medium">
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
            {/* Step 1: Select Car */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <h2 className="font-orbitron text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
                  Select Your Vehicle
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {cars.map((car) => (
                    <button
                      key={car.id}
                      onClick={() =>
                        setFormData({ ...formData, carId: car.id })
                      }
                      className={cn(
                        "card-dark p-4 text-left transition-all",
                        formData.carId === car.id
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
                            <span className="font-orbitron text-xl font-bold text-electric-cyan/50">
                              {car.brand.charAt(0)}
                            </span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-orbitron text-sm font-bold truncate" style={{ color: "var(--text-primary)" }}>
                            {car.name}
                          </h3>
                          <p className="font-inter text-xs" style={{ color: "var(--text-secondary)" }}>
                            {car.brand} &bull; {car.category}
                          </p>
                          <div className="mt-2 flex items-center gap-2">
                            <span className="font-orbitron text-sm font-bold text-gradient">
                              Rs. {car.pricePerDay.toLocaleString()}
                            </span>
                            <span className="font-inter text-xs" style={{ color: "var(--text-secondary)" }}>
                              / day
                            </span>
                          </div>
                        </div>
                        {formData.carId === car.id && (
                          <div className="w-6 h-6 rounded-full bg-electric-cyan flex items-center justify-center flex-shrink-0">
                            <Check className="w-4 h-4 text-carbon-black" />
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Dates & Location */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <h2 className="font-orbitron text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
                  Dates & Pickup Location
                </h2>
                <div className="card-dark p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block font-inter text-sm mb-2" style={{ color: "var(--text-secondary)" }}>
                        Pickup Date
                      </label>
                      <input
                        type="date"
                        value={formData.pickupDate}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            pickupDate: e.target.value,
                          })
                        }
                        min={new Date().toISOString().split("T")[0]}
                        className="w-full px-4 py-3 rounded-lg font-inter text-sm focus:outline-none transition-colors"
                        style={{ background: "var(--bg-primary)", color: "var(--text-primary)", borderColor: "var(--border-primary)" }}
                      />
                    </div>
                    <div>
                      <label className="block font-inter text-sm mb-2" style={{ color: "var(--text-secondary)" }}>
                        Return Date
                      </label>
                      <input
                        type="date"
                        value={formData.returnDate}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            returnDate: e.target.value,
                          })
                        }
                        min={formData.pickupDate || new Date().toISOString().split("T")[0]}
                        className="w-full px-4 py-3 rounded-lg font-inter text-sm focus:outline-none transition-colors"
                        style={{ background: "var(--bg-primary)", color: "var(--text-primary)", borderColor: "var(--border-primary)" }}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-inter text-sm mb-2" style={{ color: "var(--text-secondary)" }}>
                      Pickup Location
                    </label>
                    <select
                      value={formData.pickupLocation}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          pickupLocation: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 rounded-lg font-inter text-sm focus:outline-none transition-colors"
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
                  {selectedCar && formData.pickupDate && formData.returnDate && (
                    <div className="p-4 rounded-lg space-y-2" style={{ background: "var(--bg-primary)" }}>
                      <div className="flex justify-between font-inter text-sm">
                        <span style={{ color: "var(--text-secondary)" }}>
                          {selectedCar.name}
                        </span>
                        <span style={{ color: "var(--text-primary)" }}>
                          Rs. {selectedCar.pricePerDay.toLocaleString()} / day
                        </span>
                      </div>
                      <div className="flex justify-between font-inter text-sm">
                        <span style={{ color: "var(--text-secondary)" }}>Duration</span>
                        <span style={{ color: "var(--text-primary)" }}>
                          {Math.ceil(
                            (new Date(formData.returnDate).getTime() -
                              new Date(formData.pickupDate).getTime()) /
                              (1000 * 60 * 60 * 24)
                          )}{" "}
                          days
                        </span>
                      </div>
                      <div className="h-px my-2" style={{ background: "var(--border-primary)" }} />
                      <div className="flex justify-between font-orbitron">
                        <span className="font-semibold" style={{ color: "var(--text-primary)" }}>Total</span>
                        <span className="text-xl font-bold text-gradient">
                          Rs. {calculateTotal().toLocaleString()}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 3: Personal Info */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <h2 className="font-orbitron text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
                  Personal Information
                </h2>
                <div className="card-dark p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block font-inter text-sm mb-2" style={{ color: "var(--text-secondary)" }}>
                        First Name
                      </label>
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            firstName: e.target.value,
                          })
                        }
                        placeholder="Enter first name"
                        className="w-full px-4 py-3 rounded-lg font-inter text-sm placeholder:opacity-50 focus:outline-none transition-colors"
                        style={{ background: "var(--bg-primary)", color: "var(--text-primary)", borderColor: "var(--border-primary)" }}
                      />
                    </div>
                    <div>
                      <label className="block font-inter text-sm mb-2" style={{ color: "var(--text-secondary)" }}>
                        Last Name
                      </label>
                      <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) =>
                          setFormData({ ...formData, lastName: e.target.value })
                        }
                        placeholder="Enter last name"
                        className="w-full px-4 py-3 rounded-lg font-inter text-sm placeholder:opacity-50 focus:outline-none transition-colors"
                        style={{ background: "var(--bg-primary)", color: "var(--text-primary)", borderColor: "var(--border-primary)" }}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-inter text-sm mb-2" style={{ color: "var(--text-secondary)" }}>
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      placeholder="Enter email address"
                      className="w-full px-4 py-3 rounded-lg font-inter text-sm placeholder:opacity-50 focus:outline-none transition-colors"
                      style={{ background: "var(--bg-primary)", color: "var(--text-primary)", borderColor: "var(--border-primary)" }}
                    />
                  </div>

                  <div>
                    <label className="block font-inter text-sm mb-2" style={{ color: "var(--text-secondary)" }}>
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      placeholder="+92 300 123 4567"
                      className="w-full px-4 py-3 rounded-lg font-inter text-sm placeholder:opacity-50 focus:outline-none transition-colors"
                      style={{ background: "var(--bg-primary)", color: "var(--text-primary)", borderColor: "var(--border-primary)" }}
                    />
                  </div>

                  <div>
                    <label className="block font-inter text-sm mb-2" style={{ color: "var(--text-secondary)" }}>
                      Additional Message (Optional)
                    </label>
                    <textarea
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      placeholder="Any special requests or requirements..."
                      rows={3}
                      className="w-full px-4 py-3 rounded-lg font-inter text-sm placeholder:opacity-50 focus:outline-none transition-colors resize-none"
                      style={{ background: "var(--bg-primary)", color: "var(--text-primary)", borderColor: "var(--border-primary)" }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Confirmation */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <h2 className="font-orbitron text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
                  Confirm Your Booking
                </h2>
                <div className="card-dark p-6 space-y-6">
                  {/* Summary */}
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg">
                      <h4 className="font-orbitron text-sm font-semibold text-electric-cyan mb-3">
                        VEHICLE
                      </h4>
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-12 rounded-lg overflow-hidden flex items-center justify-center" style={{ background: "var(--bg-secondary)" }}>
                          {selectedCar?.images && selectedCar.images.length > 0 ? (
                            <img
                              src={selectedCar.images[0]}
                              alt={selectedCar.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="font-orbitron text-lg font-bold text-electric-cyan/50">
                              {selectedCar?.brand.charAt(0)}
                            </span>
                          )}
                        </div>
                        <div>
                          <h3 className="font-orbitron text-lg font-bold" style={{ color: "var(--text-primary)" }}>
                            {selectedCar?.name}
                          </h3>
                          <p className="font-inter text-sm" style={{ color: "var(--text-secondary)" }}>
                            {selectedCar?.brand} &bull; {selectedCar?.category}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-lg" style={{ background: "var(--bg-primary)" }}>
                        <h4 className="font-orbitron text-xs font-semibold text-electric-cyan mb-2">
                          PICKUP
                        </h4>
                        <p className="font-inter text-sm" style={{ color: "var(--text-primary)" }}>
                          {formData.pickupDate}
                        </p>
                        <p className="font-inter text-xs mt-1" style={{ color: "var(--text-secondary)" }}>
                          {formData.pickupLocation}
                        </p>
                      </div>
                      <div className="p-4 rounded-lg" style={{ background: "var(--bg-primary)" }}>
                        <h4 className="font-orbitron text-xs font-semibold text-electric-cyan mb-2">
                          RETURN
                        </h4>
                        <p className="font-inter text-sm" style={{ color: "var(--text-primary)" }}>
                          {formData.returnDate}
                        </p>
                        <p className="font-inter text-xs mt-1" style={{ color: "var(--text-secondary)" }}>
                          {formData.pickupLocation}
                        </p>
                      </div>
                    </div>

                    <div className="p-4 rounded-lg" style={{ background: "var(--bg-primary)" }}>
                      <h4 className="font-orbitron text-xs font-semibold text-electric-cyan mb-2">
                        CONTACT
                      </h4>
                      <p className="font-inter text-sm" style={{ color: "var(--text-primary)" }}>
                        {formData.firstName} {formData.lastName}
                      </p>
                      <p className="font-inter text-xs" style={{ color: "var(--text-secondary)" }}>
                        {formData.email} &bull; {formData.phone}
                      </p>
                    </div>

                    <div className="p-4 bg-gradient-brand rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="font-inter text-theme-primary font-medium">
                          Total Amount
                        </span>
                        <span className="font-orbitron text-2xl font-bold text-theme-primary">
                          Rs. {calculateTotal().toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* WhatsApp Notice */}
                  <div className="p-4 bg-electric-cyan/10 border border-electric-cyan/20 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Phone className="w-5 h-5 text-electric-cyan mt-0.5" />
                      <div>
                        <h4 className="font-inter text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                          WhatsApp Confirmation
                        </h4>
                        <p className="font-inter text-xs mt-1" style={{ color: "var(--text-secondary)" }}>
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
              "flex items-center gap-2 px-6 py-3 rounded-lg font-inter text-sm font-medium transition-colors",
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
                (currentStep === 1 && !formData.carId) ||
                (currentStep === 2 &&
                  (!formData.pickupDate || !formData.returnDate || !formData.pickupLocation)) ||
                (currentStep === 3 &&
                  (!formData.firstName || !formData.lastName || !formData.email || !formData.phone))
              }
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next Step
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          ) : (
            <button onClick={handleSubmit} className="btn-primary">
              <Check className="w-4 h-4 mr-2" />
              Confirm Booking
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
