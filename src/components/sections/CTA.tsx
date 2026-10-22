import PageSection from "@/components/layout/PageSection";
import Button from "@/components/ui/Button";
import { whatsappLink } from "@/lib/constants";
import { WhatsAppIcon } from "@/components/ui/SocialIcons";
import { Reveal } from "@/components/motion/Reveal";
import { MagneticLink } from "@/components/motion/Magnetic";

export default function CTA() {
  return (
    <PageSection aria-labelledby="cta-heading">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="panel bg-surface-2 overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-6 lg:gap-8 items-center p-5 sm:p-8 lg:p-10">
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

                >
                  <WhatsAppIcon className="w-4 h-4" />
                  Message us instead
                </Button>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </PageSection>
  );
}
