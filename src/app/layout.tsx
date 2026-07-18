import type { Metadata } from "next";
import { Orbitron, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { SITE_NAME, SITE_URL, SITE_DESCRIPTION, CONTACT } from "@/lib/constants";

const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-orbitron",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "CarRental",
  name: SITE_NAME,
  description: SITE_DESCRIPTION,
  url: SITE_URL,
  telephone: CONTACT.phone,
  email: CONTACT.email,
  foundingDate: "2026",
  address: {
    "@type": "PostalAddress",
    streetAddress: "F-10 Markaz F 10/4",
    addressLocality: "Islamabad",
    postalCode: "44000",
    addressCountry: "PK",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 33.7109,
    longitude: 73.0610,
  },
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    opens: "00:00",
    closes: "23:59",
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "5.0",
    reviewCount: "30",
  },
  priceRange: "PKR 12000 - PKR 110000",
  areaServed: [
    { "@type": "City", name: "Islamabad" },
    { "@type": "City", name: "Rawalpindi" },
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Premium Car Rental Fleet",
    itemListElement: [
      { "@type": "Offer", itemOffered: { "@type": "Product", name: "Luxury SUVs" } },
      { "@type": "Offer", itemOffered: { "@type": "Product", name: "Premium Sedans" } },
      { "@type": "Offer", itemOffered: { "@type": "Product", name: "Family Cars" } },
      { "@type": "Offer", itemOffered: { "@type": "Product", name: "Airport Transfers" } },
      { "@type": "Offer", itemOffered: { "@type": "Product", name: "Wedding & Event Cars" } },
    ],
  },
  sameAs: Object.values({
    whatsapp: CONTACT.whatsapp ? `https://wa.me/${CONTACT.whatsapp}` : undefined,
    instagram: "https://instagram.com/apex_royale_drives",
    tiktok: "https://tiktok.com/@apex.royale.drives",
  }).filter(Boolean),
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | Premium Car Rental Islamabad & Pakistan`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "car rental Islamabad",
    "rent a car Islamabad",
    "rent a car Rawalpindi",
    "luxury car rental Pakistan",
    "SUV rental Islamabad",
    "wedding car rental Islamabad",
    "airport transfer Islamabad",
    "corporate car rental",
    "Land Cruiser rental Islamabad",
    "Mercedes rental Pakistan",
    "Audi rental Islamabad",
    "G Wagon rental",
    "Prado rental Islamabad",
    "car leasing service Islamabad",
    "24/7 car rental",
  ],
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  formatDetection: { telephone: true, email: true },
  openGraph: {
    type: "website",
    locale: "en_PK",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} | Premium Car Rental Islamabad & Pakistan`,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/Images/Homepage/logo.png",
        width: 1200,
        height: 630,
        alt: SITE_NAME,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | Premium Car Rental Islamabad & Pakistan`,
    description: SITE_DESCRIPTION,
    images: ["/Images/Homepage/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: SITE_URL,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${orbitron.variable} ${inter.variable} antialiased min-h-screen flex flex-col`}
      >
        <ThemeProvider>
          <Navbar />
          <main className="flex-1 pt-20">{children}</main>
          <Footer />
          <WhatsAppButton />
        </ThemeProvider>
      </body>
    </html>
  );
}
