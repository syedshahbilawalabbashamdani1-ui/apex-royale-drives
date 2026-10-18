import Button from "@/components/ui/Button";
import { whatsappLink } from "@/lib/constants";

export default function NotFound() {
  return (
    <div className="min-h-[calc(100dvh-var(--header-h))] flex items-center justify-center px-4">
      <div className="max-w-md text-center">
        <p className="text-[7rem] sm:text-[9rem] font-medium leading-none tracking-[-0.04em] text-text">
          404
        </p>
        <h1 className="mt-4 text-2xl font-medium tracking-[-0.02em]">
          Page not found
        </h1>
        <p className="mt-4 text-lg text-muted leading-relaxed">
          The page you are looking for does not exist or has moved.
        </p>
        <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
          <Button href="/" className="">
            Go to homepage
          </Button>
          <Button variant="ghost"
            href={whatsappLink("Hi, I need help finding something on your website.")}
            target="_blank"
            rel="noopener noreferrer"
            className=""
          >
            Contact on WhatsApp
          </Button>
        </div>
      </div>
    </div>
  );
}
