export interface Car {
  id: string;
  name: string;
  brand: string;
  category: CarCategory;
  year: number;
  pricePerDay: number;
  seats: number;
  luggage: number;
  transmission: "Automatic" | "Manual";
  fuel: "Petrol" | "Diesel";
  engine: string;
  horsepower: number;
  topSpeed: string;
  acceleration: string;
  features: string[];
  images: string[];
  available: boolean;
  popular?: boolean;
  description: string;
}

export type CarCategory = "Sedan" | "SUV" | "Luxury";

export interface BookingFormData {
  carIds: string[];
  customCarNames: string[];
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
  transmission: "All" | "Automatic" | "Manual";
  fuel: "All" | "Petrol" | "Diesel";
  sortBy: "price-asc" | "price-desc" | "newest";
}
