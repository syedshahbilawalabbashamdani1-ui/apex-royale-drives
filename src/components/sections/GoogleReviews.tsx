"use client";

import PageSection from "@/components/layout/PageSection";
import { useCallback, useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { RATING } from "@/lib/constants";
import { Reveal } from "@/components/motion/Reveal";
import { cn } from "@/lib/utils";

interface Review {
  name: string;
  rating: number;
  reviewCount: string;
  time: string;
  /* Snippet only. Full review text lives on the Google Business profile. */
  text: string;
}

const REVIEWS: Review[] = [
  {
    name: "Hammad Khan",
    rating: 5,
    reviewCount: "8 reviews",
    time: "2 months ago",
    text: "Professional, reliable and very well managed from start to finish. Vehicles were clean and well maintained.",
  },
  {
    name: "Hamza Ibrar",
    rating: 5,
    reviewCount: "2 reviews",
    time: "2 months ago",
    text: "Booking was smooth, prices were reasonable, and the whole experience was hassle free.",
  },
  {
    name: "Areej Komal",
    rating: 5,
    reviewCount: "2 reviews",
    time: "3 months ago",
    text: "Used them for a family trip. Car drove like new, no hidden charges, and the team was accommodating on timing.",
  },
  {
    name: "Muhammad Ali",
    rating: 5,
    reviewCount: "1 review",
    time: "2 months ago",
    text: "Best rent a car service in Islamabad. Very good rates and excellent service.",
  },
  {
    name: "Oliver Jj",
    rating: 5,
    reviewCount: "2 reviews",
    time: "2 months ago",
    text: "Comfortable cars, decent drivers, honest owners and well mannered people.",
  },
];

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-1" aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          aria-hidden="true"
          className={cn(
            "w-3.5 h-3.5",
            i < count ? "fill-current text-accent-ink" : "text-line"
          )}
        />
      ))}
    </div>
  );
}

function initials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function GoogleReviews() {
  const reduce = useReducedMotion();
  const [page, setPage] = useState(0);
  const [visibleCount, setVisibleCount] = useState(3);

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
  /*
    Derived during render rather than synced in an effect: a wider viewport
    shows fewer valid pages, so without this the track can translate past the
    last review and show a blank panel.
  */
  const activePage = Math.min(page, maxPage);

  const prev = useCallback(() => setPage((p) => Math.max(0, Math.min(p, maxPage) - 1)), [maxPage]);
  const next = useCallback(
    () => setPage((p) => Math.min(maxPage, p + 1)),
    [maxPage]
  );

  return (
    <PageSection aria-labelledby="reviews-heading">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="section-heading">
          <h2
            id="reviews-heading"
            className="text-4xl sm:text-5xl font-medium tracking-[-0.03em] leading-[1.05]"
          >
            What clients say
          </h2>
          <div className="mt-6 flex items-center gap-3">
            <Stars count={5} />
            <span className="text-sm text-muted">
              {RATING.value} from {RATING.reviewCount} Google reviews
            </span>
          </div>
        </Reveal>

        <div
          className="relative"
          role="region"
          aria-roledescription="carousel"
          aria-label="Customer reviews"
        >
          <button
            onClick={prev}
            disabled={activePage === 0}
            aria-label="Previous reviews"
            className="absolute -left-3 lg:-left-5 top-1/2 -translate-y-1/2 z-[var(--z-base)] w-10 h-10 rounded-full bg-surface border border-line flex items-center justify-center text-muted transition-colors hover:text-text disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            onClick={next}
            disabled={activePage >= maxPage}
            aria-label="Next reviews"
            className="absolute -right-3 lg:-right-5 top-1/2 -translate-y-1/2 z-[var(--z-base)] w-10 h-10 rounded-full bg-surface border border-line flex items-center justify-center text-muted transition-colors hover:text-text disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <div className="overflow-hidden">
            <div
              className={cn(
                "flex",
                reduce ? "" : "transition-transform duration-500 ease-out"
              )}
              style={{
                transform: `translateX(-${activePage * (100 / visibleCount)}%)`,
              }}
            >
              {REVIEWS.map((review, index) => (
                <div
                  key={review.name}
                  className="flex-shrink-0 px-3"
                  style={{ width: `${100 / visibleCount}%` }}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${index + 1} of ${REVIEWS.length}`}
                  aria-hidden={index < activePage || index >= activePage + visibleCount}
                >
                  <figure className="h-full panel p-6 flex flex-col">
                    <Stars count={review.rating} />
                    <blockquote className="mt-6 flex-1 text-[0.9375rem] leading-relaxed">
                      <p>{review.text}</p>
                    </blockquote>
                    <figcaption className="mt-6 pt-6 border-t border-line flex items-center gap-3">
                      <span
                        className="w-9 h-9 rounded-full bg-surface-2 flex items-center justify-center text-xs font-medium text-muted shrink-0"
                        aria-hidden="true"
                      >
                        {initials(review.name)}
                      </span>
                      <span className="min-w-0">
                        <span className="block text-sm font-medium truncate">
                          {review.name}
                        </span>
                        <span className="block text-xs text-muted">
                          {review.time}
                        </span>
                      </span>
                    </figcaption>
                  </figure>
                </div>
              ))}
            </div>
          </div>
        </div>

        <p className="sr-only" role="status" aria-atomic="true">
          Showing reviews {activePage + 1} to {Math.min(activePage + visibleCount, REVIEWS.length)} of {REVIEWS.length}.
        </p>
        <div className="mt-8 flex justify-center gap-2">
          {Array.from({ length: maxPage + 1 }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i)}
              aria-label={`Go to review slide ${i + 1}`}
              aria-current={i === activePage}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                i === activePage ? "w-8 bg-text" : "w-1.5 bg-line hover:bg-muted"
              )}
            />
          ))}
        </div>
      </div>
    </PageSection>
  );
}
