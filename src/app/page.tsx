import Hero from "@/components/sections/Hero";
import Stats from "@/components/sections/Stats";
import FleetGrid from "@/components/sections/FleetGrid";
import Features from "@/components/sections/Features";
import GoogleReviews from "@/components/sections/GoogleReviews";
import CTA from "@/components/sections/CTA";

export default function Home() {
  return (
    <>
      <Hero />
      <Stats />
      <FleetGrid />
      <Features />
      <GoogleReviews />
      <CTA />
    </>
  );
}