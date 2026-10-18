import {
  ShieldCheck,
  Clock,
  Wallet,
  Headphones,
  MapPin,
  Plane,
} from "lucide-react";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";

/*
  Ruled two-column list rather than a card grid. Per the layout rules a grid of
  three or six identical cards reads as a template, and this section carries no
  imagery of its own.
*/
const features = [
  {
    icon: ShieldCheck,
    title: "Professional driver with every car",
    body: "Driver time, fuel handling and vehicle wear are all inside the rate. No separate chauffeur charge to negotiate.",
  },
  {
    icon: Wallet,
    title: "Clear daily pricing",
    body: "Your rental price is the daily rate multiplied by the number of days. The booking form calculates the amount for you.",
  },
  {
    icon: Clock,
    title: "Booked and confirmed in minutes",
    body: "The booking form hands your summary straight to WhatsApp. We reply day or night.",
  },
  {
    icon: Headphones,
    title: "Vehicles we do not list yet",
    body: "Ask for any make or model. If we can source it and the dates work, we will quote it.",
  },
  {
    icon: MapPin,
    title: "Islamabad and Rawalpindi pickups",
    body: "The airport, F-10 Markaz, Blue Area, DHA Phase 5, Rawalpindi Saddar, or an address of your own.",
  },
  {
    icon: Plane,
    title: "Airport transfers and northern trips",
    body: "Send your flight number and the driver meets arrivals with a name board. Murree, Naran and Swat quoted as a whole trip.",
  },
];

export default function Features() {
  return (
    <section className="py-24" aria-labelledby="features-heading">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="max-w-2xl mb-16">
          <h2
            id="features-heading"
            className="text-4xl sm:text-5xl font-medium tracking-[-0.03em] leading-[1.05]"
          >
            How booking works
          </h2>
        </Reveal>

        <RevealGroup className="grid grid-cols-1 md:grid-cols-2 gap-x-16">
          {features.map((feature) => (
            <RevealItem
              key={feature.title}
              className="py-8 border-t border-line flex gap-6"
            >
              <feature.icon
                className="w-6 h-6 shrink-0 text-muted mt-1"
                aria-hidden="true"
              />
              <div>
                <h3 className="text-lg font-medium tracking-[-0.01em]">
                  {feature.title}
                </h3>
                <p className="mt-2 text-[0.9375rem] text-muted leading-relaxed max-w-[44ch]">
                  {feature.body}
                </p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}