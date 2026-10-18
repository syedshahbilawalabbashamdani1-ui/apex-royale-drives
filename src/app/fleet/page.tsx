import type { Metadata } from "next";
import FleetView from "./FleetView";
import { cars, getCategories } from "@/lib/cars";

export const metadata: Metadata = {
  title: "Our Fleet",
  description:
    "Browse the Apex Royale Drives fleet in Islamabad and Rawalpindi: Toyota Revo, Land Cruiser Prado, Land Cruiser V8 ZX, Audi A6, Mercedes G63 AMG, Mercedes Maybach S-Class and Range Rover. Luxury and affordable cars with a professional driver.",
  alternates: {
    canonical: "/fleet",
  },
  openGraph: {
    title: "Our Fleet | Apex Royale Drives",
    description:
      "Land Cruiser, Mercedes, Range Rover and Audi rentals in Islamabad, with professional driver.",
  },
};

export default async function FleetPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string | string[] }>;
}) {
  const raw = (await searchParams).category;
  const requested = Array.isArray(raw) ? raw[0] : raw;
  const valid = getCategories();
  const initialCategory =
    requested && valid.includes(requested as (typeof valid)[number])
      ? (requested as (typeof valid)[number])
      : "All";

  return <FleetView initialCategory={initialCategory} carCount={cars.length} />;
}