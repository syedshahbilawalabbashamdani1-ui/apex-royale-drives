import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CarDetailView from "./CarDetailView";
import { cars, getCar } from "@/lib/cars";
import { formatPKR } from "@/lib/pricing";
import { SITE_NAME } from "@/lib/constants";

type Props = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return cars.map((car) => ({ id: car.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const car = getCar(id);

  if (!car) {
    return {
      title: "Car Not Found",
      description: "The requested vehicle could not be found.",
    };
  }

  const title = `${car.name} — Rent in Islamabad`;
  const description = `Rent the ${car.name} (${car.year}) in Islamabad with ${SITE_NAME}. ${car.engine}, ${car.seats} seats, ${car.fuel}. From ${formatPKR(car.pricePerDay)} per day with a professional driver.`;

  return {
    title,
    description,
    alternates: {
      canonical: `/car/${car.id}`,
    },
    keywords: [
      `rent ${car.name.toLowerCase()}`,
      `${car.brand.toLowerCase()} rental Islamabad`,
      `${car.category.toLowerCase()} rental Pakistan`,
      `rent car with driver Islamabad`,
      `${car.name} price Pakistan`,
    ],
    openGraph: {
      title: `${car.name} | ${SITE_NAME}`,
      description,
      images: car.images.map((src) => ({ url: src, alt: car.name })),
    },
    twitter: {
      card: "summary_large_image",
      title: `${car.name} | ${SITE_NAME}`,
      description,
      images: car.images,
    },
  };
}

export default async function CarDetailPage({ params }: Props) {
  const { id } = await params;
  const car = getCar(id);

  if (!car) notFound();

  return <CarDetailView car={car} />;
}