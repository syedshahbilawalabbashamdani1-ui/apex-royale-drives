import Image from "next/image";
import { cn } from "@/lib/utils";

/** Transparent brand artwork with silver or charcoal details for each theme. */
export default function BrandLogo({ className }: { className?: string }) {
  return (
    <span className={cn("block w-full h-full", className)}>
      <Image
        src="/brand/logo.svg"
        width={1600}
        height={541}
        alt=""
        aria-hidden="true"
        unoptimized
        loading="eager"
        className="hidden dark:block w-full h-full object-contain"
      />
      <Image
        src="/brand/logo-light.svg"
        width={1600}
        height={541}
        alt=""
        aria-hidden="true"
        unoptimized
        loading="eager"
        className="block dark:hidden w-full h-full object-contain"
      />
    </span>
  );
}
