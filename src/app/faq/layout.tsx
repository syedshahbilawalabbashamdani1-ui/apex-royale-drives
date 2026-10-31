import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ",
  alternates: { canonical: "/faq" },
};

export default function FAQLayout({ children }: { children: React.ReactNode }) {
  return children;
}
