import Button from "@/components/ui/Button";
import { whatsappLink } from "@/lib/constants";
import { WhatsAppIcon } from "@/components/ui/SocialIcons";
import { Reveal } from "@/components/motion/Reveal";
import { MagneticLink } from "@/components/motion/Magnetic";

export default function CTA() {
  return (
    <section className="py-24" aria-labelledby="cta-heading">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="panel bg-surface-2 overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-8 lg:gap-16 items-center p-8 sm:p-12 lg:p-16">
              <div>
                <h2
                  id="cta-heading"
                  className="text-3xl sm:text-4xl lg:text-5xl font-medium tracking-[-0.03em] leading-[1.05] max-w-[16ch]"
                >
                  Get a quote in minutes
                </h2>
                <p className="mt-6 text-lg text-muted leading-relaxed max-w-[46ch]">
                  Pick your dates and we will confirm availability and the final
                  price on WhatsApp. No payment is taken through this website.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col lg:items-start">
                <MagneticLink href="/booking" strength={0.18}>
                  Start a booking
                </MagneticLink>
                <Button variant="ghost"
                  href={whatsappLink("Hi, I want to rent a car in Islamabad")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className=""
                >
                  <WhatsAppIcon className="w-4 h-4" />
                  Message us instead
                </Button>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}