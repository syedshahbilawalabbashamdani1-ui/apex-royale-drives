import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Apex Royale Drives. Call 0304-5255558 or WhatsApp us for instant booking. Located in Blue Area, F-8 Markaz, Islamabad. 24/7 available.",
  openGraph: {
    title: "Contact Us | Apex Royale Drives",
    description:
      "Get in touch with Apex Royale Drives. Call 0304-5255558 or WhatsApp for instant booking.",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
