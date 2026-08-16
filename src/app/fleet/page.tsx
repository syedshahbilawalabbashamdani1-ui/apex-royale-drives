"use client";

import { useState, useMemo, Suspense } from "react";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { cars } from "@/lib/cars";
import CarCard from "@/components/sections/CarCard";
import CustomFleetCard from "@/components/sections/CustomFleetCard";
import { CarCategory, FilterOptions } from "@/types";
import {
  Search,
  SlidersHorizontal,
  X,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

const categories: (CarCategory | "All")[] = [
  "All",
  "Sedan",
  "SUV",
  "Luxury",
  "Economy",
];

const sortOptions: { value: FilterOptions["sortBy"]; label: string }[] = [
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "newest", label: "Newest First" },
];

export default function FleetPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg-primary)" }}>
        <div className="w-12 h-12 border-4 border-electric-cyan/20 border-t-electric-cyan rounded-full animate-spin" />
      </div>
    }>
      <FleetContent />
    </Suspense>
  );
}

function FleetContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const urlCategory = searchParams.get("category");
  const category: CarCategory | "All" =
    urlCategory && categories.includes(urlCategory as CarCategory | "All")
      ? (urlCategory as CarCategory | "All")
      : "All";

  const [filters, setFilters] = useState<Omit<FilterOptions, "category">>({
    priceRange: [0, 200000],
    transmission: "All",
    fuel: "All",
    sortBy: "newest",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const setCategory = (next: CarCategory | "All") => {
    const params = new URLSearchParams(searchParams.toString());
    if (next === "All") params.delete("category");
    else params.set("category", next);
    router.replace(`/fleet${params.toString() ? `?${params.toString()}` : ""}`, {
      scroll: false,
    });
  };

  const filteredCars = useMemo(() => {
    let result = [...cars];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (car) =>
          car.name.toLowerCase().includes(query) ||
          car.brand.toLowerCase().includes(query) ||
          car.category.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (category !== "All") {
      if (category === "Economy") {
        result = result.filter((car) => car.pricePerDay < 20000);
      } else {
        result = result.filter((car) => car.category === category);
      }
    }

    // Transmission filter
    if (filters.transmission !== "All") {
      result = result.filter(
        (car) => car.transmission === filters.transmission
      );
    }

    // Fuel filter
    if (filters.fuel !== "All") {
      result = result.filter((car) => car.fuel === filters.fuel);
    }

    // Price filter
    result = result.filter(
      (car) =>
        car.pricePerDay >= filters.priceRange[0] &&
        car.pricePerDay <= filters.priceRange[1]
    );

    // Sort
    switch (filters.sortBy) {
      case "price-asc":
        result.sort((a, b) => a.pricePerDay - b.pricePerDay);
        break;
      case "price-desc":
        result.sort((a, b) => b.pricePerDay - a.pricePerDay);
        break;
      case "newest":
        result.sort((a, b) => b.year - a.year);
        break;
    }

    return result;
  }, [filters, searchQuery, category]);

  const activeFilterCount =
    (category !== "All" ? 1 : 0) +
    (filters.transmission !== "All" ? 1 : 0) +
    (filters.fuel !== "All" ? 1 : 0);

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
              OUR <span className="text-gradient">FLEET</span>
            </h1>
            <p className="font-sans max-w-2xl mx-auto" style={{ color: "var(--text-secondary)" }}>
              Browse our extensive collection of premium vehicles. From economy
              sedans to luxury SUVs, find the perfect car for your journey.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Search and Filter Bar */}
        <div className="flex flex-col gap-4 mb-8">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-theme-secondary" />
            <input
              type="text"
              aria-label="Search cars"
              placeholder="Search cars..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-lg font-sans text-sm placeholder:opacity-50 focus:outline-none transition-colors"
              style={{ background: "var(--bg-secondary)", color: "var(--text-primary)", borderColor: "var(--border-primary)" }}
            />
          </div>

          {/* Sort and Filter Row */}
          <div className="flex gap-3">
            {/* Sort */}
            <div className="relative flex-1">
              <select
                aria-label="Sort cars"
                value={filters.sortBy}
                onChange={(e) =>
                  setFilters({ ...filters, sortBy: e.target.value as FilterOptions["sortBy"] })
                }
                className="appearance-none w-full pl-4 pr-10 py-3 rounded-lg font-sans text-sm focus:outline-none transition-colors cursor-pointer"
                style={{ background: "var(--bg-secondary)", color: "var(--text-primary)", borderColor: "var(--border-primary)" }}
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-theme-secondary pointer-events-none" />
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                "flex items-center gap-2 px-4 py-3 rounded-lg font-sans text-sm font-medium transition-colors whitespace-nowrap",
                showFilters || activeFilterCount > 0
                  ? "bg-electric-cyan/10 text-electric-cyan border border-electric-cyan/30"
                  : "text-theme-secondary border hover:border-electric-cyan/20"
              )}
              style={!(showFilters || activeFilterCount > 0) ? { background: "var(--bg-secondary)", borderColor: "var(--border-primary)" } : undefined}
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filters</span>
              {activeFilterCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-electric-cyan text-carbon-black text-xs font-bold flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Filter Panel */}
        <div
          className={cn(
            "transition-all duration-300 overflow-hidden",
            showFilters ? "max-h-96 opacity-100 mb-8" : "max-h-0 opacity-0"
          )}
        >
          <div className="card-dark p-6 space-y-6">
            {/* Categories */}
            <div>
              <h4 className="font-general-sans text-sm font-semibold mb-3" style={{ color: "var(--text-primary)" }}>
                CATEGORY
              </h4>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setCategory(cat)}
                      className={cn(
                        "px-4 py-2 rounded-lg font-sans text-sm font-medium transition-colors",
                        category === cat
                          ? "bg-electric-cyan text-carbon-black"
                          : "text-theme-secondary hover:opacity-80 border"
                      )}
                      style={category !== cat ? { background: "var(--bg-secondary)", borderColor: "var(--border-primary)" } : undefined}
                    >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Transmission & Fuel */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-general-sans text-sm font-semibold mb-3" style={{ color: "var(--text-primary)" }}>
                  TRANSMISSION
                </h4>
                <div className="flex gap-2">
                  {["All", "Automatic", "Manual"].map((option) => (
                    <button
                      key={option}
                      onClick={() =>
                        setFilters({
                          ...filters,
                          transmission: option as FilterOptions["transmission"],
                        })
                      }
                      className={cn(
                        "px-4 py-2 rounded-lg font-sans text-sm font-medium transition-colors",
                        filters.transmission === option
                          ? "bg-electric-cyan text-carbon-black"
                          : "text-theme-secondary hover:opacity-80 border"
                      )}
                      style={filters.transmission !== option ? { background: "var(--bg-secondary)", borderColor: "var(--border-primary)" } : undefined}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-general-sans text-sm font-semibold mb-3" style={{ color: "var(--text-primary)" }}>
                  FUEL TYPE
                </h4>
                <div className="flex flex-wrap gap-2">
                  {["All", "Petrol", "Diesel"].map(
                    (option) => (
                      <button
                        key={option}
                        onClick={() =>
                          setFilters({
                            ...filters,
                            fuel: option as FilterOptions["fuel"],
                          })
                        }
                        className={cn(
                          "px-4 py-2 rounded-lg font-sans text-sm font-medium transition-colors",
                          filters.fuel === option
                            ? "bg-electric-cyan text-carbon-black"
                            : "text-theme-secondary hover:opacity-80 border"
                        )}
                        style={filters.fuel !== option ? { background: "var(--bg-secondary)", borderColor: "var(--border-primary)" } : undefined}
                      >
                        {option}
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>

            {/* Clear Filters */}
            {activeFilterCount > 0 && (
              <button
                onClick={() => {
                  setFilters({
                    priceRange: [0, 200000],
                    transmission: "All",
                    fuel: "All",
                    sortBy: "newest",
                  });
                  setCategory("All");
                }}
                className="flex items-center gap-2 text-sm text-electric-cyan font-sans hover:underline"
              >
                <X className="w-4 h-4" />
                Clear all filters
              </button>
            )}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="font-sans text-sm" style={{ color: "var(--text-secondary)" }}>
            Showing{" "}
            <span className="font-medium" style={{ color: "var(--text-primary)" }}>
              {filteredCars.length}
            </span>{" "}
            {filteredCars.length === 1 ? "vehicle" : "vehicles"}
          </p>
        </div>

        {/* Car Grid */}
        {filteredCars.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCars.map((car, index) => (
              <CarCard key={car.id} car={car} index={index} />
            ))}
            <CustomFleetCard key="custom-fleet" />
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: "var(--bg-secondary)" }}>
              <Search className="w-10 h-10 opacity-50" style={{ color: "var(--text-secondary)" }} />
            </div>
            <h3 className="font-general-sans text-xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>
              No vehicles found
            </h3>
            <p className="font-sans" style={{ color: "var(--text-secondary)" }}>
              Try adjusting your filters or search query.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
