"use client";

import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";

/* ── data ─────────────────────────────────────────────────── */

interface Review {
  name: string;
  rating: number;
  reviewCount: string;
  time: string;
  text: string;
}

const REVIEWS: Review[] = [
  {
    name: "Hammad Khan",
    rating: 5,
    reviewCount: "8 reviews · 2 photos",
    time: "2 months ago",
    text: "I recently had a great experience with Apex Royale Drives. Their service was professional, reliable, and very well managed from start to finish. The staff was cooperative, communication was smooth, and the overall experience felt premium and comfortable. The vehicles were clean and well-maintained, making the ride safe and enjoyable. I would definitely recommend them to anyone looking for a trustworthy and high-quality driving service.",
  },
  {
    name: "Hamza Ibrar",
    rating: 5,
    reviewCount: "2 reviews",
    time: "2 months ago",
    text: "Apex Royal Drives provides a professional and reliable car rental service with well-maintained vehicles and cooperative staff. The booking process is smooth, prices are reasonable, and the overall customer experience is excellent. Highly recommended for comfortable and hassle-free travel in Islamabad.",
  },
  {
    name: "Areej Komal",
    rating: 5,
    reviewCount: "2 reviews · 2 photos",
    time: "3 months ago",
    text: "Used them last week for a family trip and honestly 10/10. Car drove like new, no hidden charges, and the team was really accommodating with timing. Made the whole trip stress-free. Already told my friends about them!",
  },
  {
    name: "Muhammad Ali",
    rating: 5,
    reviewCount: "1 review",
    time: "2 months ago",
    text: "Best rent a car service in Islamabad. Very good rates and excellent service. Highly recommended to everyone for travel and trips.",
  },
  {
    name: "Oliver Jj",
    rating: 5,
    reviewCount: "2 reviews",
    time: "2 months ago",
    text: "Very comfortable and decent drivers, honest and loyal owners, well mannered people.",
  },
];

/* ── helpers ──────────────────────────────────────────────── */

const AVATAR_COLORS = [
  "from-electric-cyan to-deep-ocean",
  "from-deep-ocean to-midnight-navy",
  "from-electric-cyan to-accent-glow",
  "from-midnight-navy to-deep-ocean",
  "from-accent-glow to-electric-cyan",
];

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

/* ── sub-components ───────────────────────────────────────── */

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          aria-hidden="true"
          className={`w-4 h-4 ${
            i < count
              ? "fill-yellow-400 text-yellow-400"
              : "text-gunmetal"
          }`}
        />
      ))}
    </div>
  );
}

function ReviewCard({ review, index }: { review: Review; index: number }) {
  return (
    <div className="card-dark p-6 h-full flex flex-col hover:border-electric-cyan/30 transition-all duration-300">
      {/* Quote icon */}
      <Quote className="w-7 h-7 text-electric-cyan/25 mb-3 flex-shrink-0" aria-hidden="true" />

      {/* Stars + time */}
      <div className="flex items-center gap-3 mb-3">
        <StarRating count={review.rating} />
        <span className="font-sans text-xs" style={{ color: "var(--text-secondary)" }}>
          {review.time}
        </span>
      </div>

      {/* Review text */}
      <p
        className="font-sans text-sm leading-relaxed mb-5 flex-1"
        style={{ color: "var(--text-secondary)" }}
      >
        &ldquo;{review.text}&rdquo;
      </p>

      {/* Author */}
      <div
        className="flex items-center gap-3 pt-4 border-t"
        style={{ borderColor: "var(--border-primary)" }}
      >
        <div
          className={`w-10 h-10 rounded-full bg-gradient-to-br ${
            AVATAR_COLORS[index % AVATAR_COLORS.length]
          } flex items-center justify-center flex-shrink-0`}
        >
          <span className="font-playfair text-xs font-bold text-white">
            {getInitials(review.name)}
          </span>
        </div>
        <div className="min-w-0">
          <h4
            className="font-sans text-sm font-semibold truncate"
            style={{ color: "var(--text-primary)" }}
          >
            {review.name}
          </h4>
          <p className="font-sans text-xs" style={{ color: "var(--text-secondary)" }}>
            {review.reviewCount}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ── main component ───────────────────────────────────────── */

export default function GoogleReviews() {
  const [page, setPage] = useState(0);
  const [visibleCount, setVisibleCount] = useState(3);

  // responsive visible count
  useEffect(() => {
    function update() {
      const w = window.innerWidth;
      setVisibleCount(w >= 1024 ? 3 : w >= 768 ? 2 : 1);
    }
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const maxPage = Math.max(0, REVIEWS.length - visibleCount);

  const prev = useCallback(() => setPage((p) => Math.max(0, p - 1)), []);
  const next = useCallback(
    () => setPage((p) => Math.min(maxPage, p + 1)),
    [maxPage],
  );

  // auto-advance every 5s, pause on hover
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      setPage((p) => (p >= maxPage ? 0 : p + 1));
    }, 5000);
    return () => clearInterval(id);
  }, [paused, maxPage]);

  return (
    <section className="py-24" style={{ background: "var(--bg-tertiary)" }}>
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center space-y-4"
        >
          <span className="font-sans text-sm text-electric-cyan font-medium tracking-wider uppercase">
            Reviews
          </span>
          <h2
            className="font-playfair text-3xl sm:text-4xl font-bold"
            style={{ color: "var(--text-primary)" }}
          >
            WHAT OUR <span className="text-gradient">CLIENTS</span> SAY
          </h2>
          <p
            className="font-sans max-w-2xl mx-auto"
            style={{ color: "var(--text-secondary)" }}
          >
            Real feedback from real customers on Google. Rated 5.0 out of 5.
          </p>
        </motion.div>

        {/* Carousel */}
        <div
          className="relative mt-4"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* Arrow – left */}
          <button
            onClick={prev}
            disabled={page === 0}
            aria-label="Previous reviews"
            className="absolute -left-4 lg:-left-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-gunmetal/80 border border-electric-cyan/15 flex items-center justify-center text-electric-cyan transition hover:bg-electric-cyan/15 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Arrow – right */}
          <button
            onClick={next}
            disabled={page >= maxPage}
            aria-label="Next reviews"
            className="absolute -right-4 lg:-right-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-gunmetal/80 border border-electric-cyan/15 flex items-center justify-center text-electric-cyan transition hover:bg-electric-cyan/15 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Track */}
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(-${page * (100 / visibleCount)}%)`,
              }}
            >
              {REVIEWS.map((review, i) => (
                <div
                  key={review.name}
                  className="flex-shrink-0 px-3"
                  style={{ width: `${100 / visibleCount}%` }}
                >
                  <ReviewCard review={review} index={i} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: maxPage + 1 }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                i === page
                  ? "bg-electric-cyan w-6"
                  : "bg-gunmetal hover:bg-electric-cyan/40"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
