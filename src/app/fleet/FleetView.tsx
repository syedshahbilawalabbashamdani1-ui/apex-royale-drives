"use client";

import PageHeader from "@/components/layout/PageHeader";
import Heading from "@/components/ui/Heading";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  cars,
  getCategories,
  getFuels,
  getTransmissions,
} from "@/lib/cars";
import Button from "@/components/ui/Button";
import FilterGroup from "@/components/ui/FilterGroup";
import FleetPreviewCard from "@/components/sections/FleetPreviewCard";
import CustomFleetCard from "@/components/sections/CustomFleetCard";
import { CarCategory, FilterOptions } from "@/types";
import {
  Search,
  SlidersHorizontal,
  X,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/motion/Reveal";

const sortOptions: { value: FilterOptions["sortBy"]; label: string }[] = [
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "newest", label: "Newest First" },
];

export default function FleetView({
  initialCategory,
  carCount,
}: {
  initialCategory: CarCategory | "All";
  carCount: number;
}) {
  const router = useRouter();

  const categories = getCategories();
  const transmissions = getTransmissions();
  const fuels = getFuels();

  const [category, setCategory] = useState<CarCategory | "All">(initialCategory);
  const [filters, setFilters] = useState<Omit<FilterOptions, "category">>({
    transmission: "All",
    fuel: "All",
    sortBy: "price-asc",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Remember which server value we rendered with, so a back/forward navigation
  // re-seeds the filter without an effect.
  const [seededCategory, setSeededCategory] = useState(initialCategory);
  if (seededCategory !== initialCategory) {
    setSeededCategory(initialCategory);
    setCategory(initialCategory);
  }

  const updateCategory = (next: CarCategory | "All") => {
    setCategory(next);
    router.replace(next === "All" ? "/fleet" : `/fleet?category=${next}`, {
      scroll: false,
    });
  };

  const filteredCars = useMemo(() => {
    let result = [...cars];

    if (searchQuery.trim()) {
      const query = searchQuery.trim().toLowerCase();
      result = result.filter(
        (car) =>
          car.name.toLowerCase().includes(query) ||
          car.brand.toLowerCase().includes(query) ||
          car.category.toLowerCase().includes(query)
      );
    }

    if (category !== "All") {
      result = result.filter((car) => car.category === category);
    }

    if (filters.transmission !== "All") {
      result = result.filter((car) => car.transmission === filters.transmission);
    }

    if (filters.fuel !== "All") {
      result = result.filter((car) => car.fuel === filters.fuel);
    }

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

  const resetFilters = () => {
    setFilters({ transmission: "All", fuel: "All", sortBy: "price-asc" });
    setSearchQuery("");
    updateCategory("All");
  };
  const hasFilters = activeFilterCount > 0 || searchQuery.trim().length > 0;

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-primary)" }}>
      <PageHeader title="Our fleet" description="Every vehicle comes with a professional driver. Rentals are charged per day at the rate shown for each vehicle." breadcrumb="Fleet" />

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 page-body">
        {/* Search */}
        <div className="flex flex-col gap-4 mb-8">
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-theme-secondary" />
            <input
              type="text"
              aria-label="Search cars"
              placeholder="Search cars..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="field w-full pl-12 pr-4 py-3 rounded-control font-sans text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent transition-colors"
            />
          </div>

          <div className="flex gap-3">
            <div className="relative flex-1">
              <select
                aria-label="Sort cars"
                value={filters.sortBy}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    sortBy: e.target.value as FilterOptions["sortBy"],
                  })
                }
                className="field appearance-none w-full pl-4 pr-10 py-3 rounded-control font-sans text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent transition-colors cursor-pointer"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-theme-secondary pointer-events-none" />
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              aria-expanded={showFilters}
              aria-controls="fleet-filters"
              className={cn(
                "flex items-center gap-2 px-4 py-3 rounded-lg font-sans text-sm font-medium transition-colors whitespace-nowrap",
                showFilters || activeFilterCount > 0
                  ? "bg-surface-2 text-accent-ink border border-electric-cyan/30"
                  : "text-theme-secondary border hover:border-line"
              )}
              style={
                !(showFilters || activeFilterCount > 0)
                  ? {
                      background: "var(--bg-secondary)",
                      borderColor: "var(--border-primary)",
                    }
                  : undefined
              }
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filters</span>
              {activeFilterCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-electric-cyan text-accent-contrast text-xs font-bold flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>
        </div>

        <section id="fleet-filters" hidden={!showFilters} className="panel p-5 sm:p-6 space-y-6 mb-8">
          <FilterGroup label="Category" options={categories} value={category} onChange={updateCategory} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FilterGroup label="Transmission" options={transmissions} value={filters.transmission}
              onChange={(transmission) => setFilters({ ...filters, transmission })} />
            <FilterGroup label="Fuel type" options={fuels} value={filters.fuel}
              onChange={(fuel) => setFilters({ ...filters, fuel })} />
          </div>
          {hasFilters && <Button variant="ghost" onClick={resetFilters}><X className="w-4 h-4" />Clear search and filters</Button>}
        </section>

        {/* Results Count */}
        <div className="mb-6">
          <p className="font-sans text-sm" role="status" style={{ color: "var(--text-secondary)" }}>
            Showing{" "}
            <span className="font-medium" style={{ color: "var(--text-primary)" }}>
              {filteredCars.length}
            </span>{" "}
            of {carCount} {carCount === 1 ? "vehicle" : "vehicles"}
          </p>
        </div>

        {/* Car Grid */}
        {filteredCars.length > 0 ? (
          <div className="grid grid-cols-1 gap-x-6 gap-y-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredCars.map((car) => (
              <Reveal key={car.id} className="min-w-0"><FleetPreviewCard car={car} /></Reveal>
            ))}
            <Reveal key="custom-fleet" className="min-w-0"><CustomFleetCard /></Reveal>
          </div>
        ) : (
          <div className="text-center page-intro">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
              style={{ background: "var(--bg-secondary)" }}
            >
              <Search className="w-10 h-10 opacity-50" style={{ color: "var(--text-secondary)" }} />
            </div>
            <Heading as="h3" size="subsection" className="mb-2">
              No vehicles found
            </Heading>
            <p className="font-sans" style={{ color: "var(--text-secondary)" }}>
              Try adjusting your filters or search query.
            </p>
            {hasFilters && <Button onClick={resetFilters} className="mt-6">Clear search and filters</Button>}
          </div>
        )}
      </div>
    </div>
  );
}
