export const SITE_NAME = "Apex Royale Drives";
export const SITE_DESCRIPTION =
  "Trusted rent-a-car service in Islamabad and Rawalpindi. Luxury and affordable vehicles with professional drivers, 24/7 support. Airport transfers, weddings, business trips.";
export const SITE_URL = "https://apexroyaledrives.com";

export const CONTACT = {
  phone: "+923045255558",
  email: "apexroyaledrives@gmail.com",
  address: "F-10 Markaz F 10/4, F-10, Islamabad 44000",
  whatsapp: "923045255558",
};

export const SOCIAL_LINKS = {
  instagram: "https://instagram.com/apex_royale_drives",
  tiktok: "https://tiktok.com/@apex.royale.drives",
};

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Fleet", href: "/fleet" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

/** Matches the reviews published in GoogleReviews.tsx. */
export const RATING = {
  value: "5.0",
  reviewCount: 5,
};

/** Accept plain text; URL encoding belongs exclusively here. */
export function whatsappLink(message: string): string {
  return `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(message)}`;
}
