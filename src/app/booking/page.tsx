import type { Metadata } from "next";
import BookingView from "./BookingView";
import { getCar } from "@/lib/cars";

export const metadata: Metadata = {
  title: "Book Your Ride",
  description:
    "Book your premium car rental with Apex Royale Drives. Select your vehicle, choose dates, and confirm — quick and easy online booking in Islamabad.",
  alternates: {
    canonical: "/booking",
  },
  openGraph: {
    title: "Book Your Ride | Apex Royale Drives",
    description:
      "Book your premium car rental — select vehicle, choose dates, and confirm online.",
  },
};

export default async function BookingPage({
  searchParams,
}: {
  searchParams: Promise<{ car?: string | string[] }>;
}) {
  const raw = (await searchParams).car;
  const requested = Array.isArray(raw) ? raw[0] : raw;

  // Only pre-select when the id actually resolves to a real vehicle.
  const initialCarId = requested && getCar(requested) ? requested : null;

  return <BookingView initialCarId={initialCarId} />;
}