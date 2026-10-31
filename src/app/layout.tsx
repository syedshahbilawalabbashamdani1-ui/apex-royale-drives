import type { Metadata, Viewport } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { SITE_NAME, SITE_URL, SITE_DESCRIPTION, CONTACT, RATING } from "@/lib/constants";
import { cars } from "@/lib/cars";
import MotionProvider from "@/components/motion/MotionProvider";

const prices = cars.map((c) => c.pricePerDay);

export const viewport: Viewport = { themeColor: "#000000" };

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
    longitude: 73.061,
  },
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ],
    opens: "00:00",
    closes: "23:59",
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: RATING.value,
    reviewCount: RATING.reviewCount,
  },
  priceRange: `PKR ${Math.min(...prices)} - PKR ${Math.max(...prices)}`,
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
      { "@type": "Offer", itemOffered: { "@type": "Product", name: "Airport Transfers" } },
      { "@type": "Offer", itemOffered: { "@type": "Product", name: "Wedding & Event Cars" } },
    ],
  },
  sameAs: [
    `https://wa.me/${CONTACT.whatsapp}`,
    "https://instagram.com/apex_royale_drives",
    "https://tiktok.com/@apex.royale.drives",
  ],
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
        url: `${SITE_URL}/brand/social-card.png`,
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
    images: [`${SITE_URL}/brand/social-card.png`],
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

/*
  Resolves the theme before first paint so the page never flashes the wrong
  mode. Stored choice wins; otherwise fall back to the OS preference.
*/
const themeBoot = `(function(){try{var s=localStorage.getItem("theme");var t=(s==="light"||s==="dark")?s:(window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light");var e=document.documentElement;e.classList.remove("dark","light");e.classList.add(t);}catch(_){}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="preload"
          href="/fonts/NeueMontreal-Regular.otf"
          as="font"
          type="font/otf"
          crossOrigin="anonymous"
        />
        <script dangerouslySetInnerHTML={{ __html: themeBoot }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />
      </head>
      <body className="antialiased min-h-[100dvh] flex flex-col">
        <ThemeProvider>
          <MotionProvider>
          <Navbar />
          <main className="flex-1 pt-[var(--header-h)]">{children}</main>
          <Footer />
          <WhatsAppButton />
                  </MotionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
