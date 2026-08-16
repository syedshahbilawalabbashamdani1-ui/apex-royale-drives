import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Fleet",
  description:
    "Browse Apex Royale Drives' fleet — Land Cruiser ZX, LC 300, Prado, G Wagon, Mercedes S Class, Audi A6, Corolla Altis, Honda Civic, Kia Sportage. Luxury and affordable cars with driver in Islamabad.",
  alternates: {
    canonical: "/fleet",
  },
  openGraph: {
    title: "Our Fleet | Apex Royale Drives",
    description:
      "Land Cruiser, Mercedes, Audi, Corolla, Civic, Sportage — luxury and affordable cars with driver.",
  },
};

export default function FleetLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
