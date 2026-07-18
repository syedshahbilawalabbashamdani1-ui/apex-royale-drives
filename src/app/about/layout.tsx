import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Apex Royale Drives is a trusted rent-a-car service in Islamabad and Rawalpindi, founded in 2026. 5.0 Google rating from 30+ reviews. Luxury and affordable vehicles with professional drivers.",
  openGraph: {
    title: "About Us | Apex Royale Drives",
    description:
      "Trusted rent-a-car service in Islamabad and Rawalpindi. 5.0 Google rating. Luxury and affordable vehicles.",
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
