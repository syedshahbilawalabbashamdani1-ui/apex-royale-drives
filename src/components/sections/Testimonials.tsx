"use client";

import { motion } from "framer-motion";
import { testimonials } from "@/lib/cars";
import { Star, Quote } from "lucide-react";

export default function Testimonials() {
  return (
    <section className="py-24" style={{ background: "var(--bg-primary)" }}>
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16 space-y-4"
        >
          <span className="font-inter text-sm text-electric-cyan font-medium tracking-wider uppercase">
            Testimonials
          </span>
          <h2 className="font-orbitron text-3xl sm:text-4xl font-bold" style={{ color: "var(--text-primary)" }}>
            WHAT OUR <span className="text-gradient">CLIENTS</span> SAY
          </h2>
          <p className="font-inter max-w-2xl mx-auto" style={{ color: "var(--text-secondary)" }}>
            Don&apos;t just take our word for it. Hear from our satisfied
            customers who have experienced the Apex Royale difference.
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.slice(0, 3).map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <div className="card-dark p-6 h-full hover:border-electric-cyan/30 transition-all duration-300">
                {/* Quote Icon */}
                <div className="mb-4">
                  <Quote className="w-8 h-8 text-electric-cyan/30" />
                </div>

                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < testimonial.rating
                          ? "fill-electric-cyan text-electric-cyan"
                          : "text-gunmetal"
                      }`}
                    />
                  ))}
                </div>

                {/* Comment */}
                <p className="font-inter text-sm leading-relaxed mb-6" style={{ color: "var(--text-secondary)" }}>
                  &quot;{testimonial.comment}&quot;
                </p>

                {/* Author */}
                <div className="flex items-center gap-3 pt-4 border-t" style={{ borderColor: "var(--border-primary)" }}>
                  {/* Avatar placeholder */}
                  <div className="w-10 h-10 rounded-full bg-gradient-brand flex items-center justify-center">
                    <span className="font-orbitron text-sm font-bold text-theme-primary">
                      {testimonial.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-inter text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                      {testimonial.name}
                    </h4>
                    <p className="font-inter text-xs" style={{ color: "var(--text-secondary)" }}>
                      Rented {testimonial.carRented}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
