import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Apex Royale Drives is a rent-a-car service in Islamabad and Rawalpindi, founded in 2026. Seven vehicles with professional drivers, 24/7 support and a 5.0 Google rating.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About Us | Apex Royale Drives",
    description:
      "A rent-a-car service in Islamabad and Rawalpindi with professional drivers and 24/7 support.",
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}