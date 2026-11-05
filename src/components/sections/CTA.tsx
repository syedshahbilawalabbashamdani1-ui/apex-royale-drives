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
          <div className="panel w-full min-w-0 rounded-control sm:rounded-panel bg-surface-2 overflow-hidden">
            <div className="grid min-w-0 grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,15rem)] gap-6 lg:gap-10 items-center px-5 py-6 sm:p-8 lg:p-10">
              <div className="min-w-0">
                <h2
                  id="cta-heading"
                  className="text-[clamp(1.75rem,5vw,2.25rem)] sm:text-4xl lg:text-5xl font-medium tracking-[-0.03em] leading-[1.1] lg:leading-[1.05] max-w-[16ch]"
                >
                  Get a quote in minutes
                </h2>
                <p className="mt-4 sm:mt-6 text-base sm:text-lg text-muted leading-relaxed max-w-[46ch]">
                  Pick your dates and we will confirm availability and the final
                  price on WhatsApp. No payment is taken through this website.
                </p>
              </div>

              <div className="grid min-w-0 grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-1 [&>div]:min-w-0 [&>div]:w-full">
                <MagneticLink href="/booking" strength={0.18} className="min-h-11 w-full min-w-0 px-4 sm:px-7 lg:min-h-12">
                  Start a booking
                </MagneticLink>
                <Button variant="ghost"
                  className="min-h-11 w-full min-w-0 px-4 sm:px-7 lg:min-h-12"
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
