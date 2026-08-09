export interface Car {
  id: string;
  name: string;
  brand: string;
  category: CarCategory;
  year: number;
  pricePerDay: number;
  pricePerWeek?: number;
  pricePerMonth?: number;
  seats: number;
  luggage: number;
  transmission: "Automatic" | "Manual";
  fuel: "Petrol" | "Diesel" | "Electric" | "Hybrid";
  engine: string;
  horsepower: number;
  topSpeed: string;
  acceleration: string;
  features: string[];
  images: string[];
  color: string;
  available: boolean;
  popular?: boolean;
  description: string;
}

export type CarCategory =
  | "Sedan"
  | "SUV"
  | "Luxury"
  | "Sports"
  | "Economy"
  | "Electric";

export interface BookingFormData {
  carId: string;
  pickupDate: string;
  returnDate: string;
  pickupLocation: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message?: string;
}

export interface FilterOptions {
  category: CarCategory | "All";
  priceRange: [number, number];
  transmission: "All" | "Automatic" | "Manual";
  fuel: "All" | "Petrol" | "Diesel" | "Electric" | "Hybrid";
  sortBy: "price-asc" | "price-desc" | "newest";
}
