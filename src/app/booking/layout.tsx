import type { Metadata } from "next";

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

export default function BookingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
