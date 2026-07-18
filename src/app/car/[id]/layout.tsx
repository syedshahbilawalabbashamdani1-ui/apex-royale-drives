import type { Metadata } from "next";
import { cars } from "@/lib/cars";
import { SITE_NAME } from "@/lib/constants";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const car = cars.find((c) => c.id === id);

  if (!car) {
    return {
      title: "Car Not Found",
      description: "The requested vehicle could not be found.",
    };
  }

  const title = `${car.name} — Rent in Islamabad`;
  const description = `Rent ${car.name} (${car.year}) in Islamabad with ${SITE_NAME}. ${car.engine}, ${car.seats} seats. PKR ${car.pricePerDay.toLocaleString()}/day with professional driver.`;

  return {
    title,
    description,
    keywords: [
      `rent ${car.name.toLowerCase()}`,
      `${car.brand.toLowerCase()} rental Islamabad`,
      `${car.category.toLowerCase()} rental Pakistan`,
      `rent car with driver Islamabad`,
      `${car.name} price`,
    ],
    openGraph: {
      title: `${car.name} | ${SITE_NAME}`,
      description,
      images: car.images?.length ? [{ url: car.images[0], width: 1200, height: 630, alt: car.name }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: `${car.name} | ${SITE_NAME}`,
      description,
    },
  };
}

export default function CarDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
