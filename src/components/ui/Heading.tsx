import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

type HeadingProps = ComponentPropsWithoutRef<"h2"> & {
  as?: "h1" | "h2" | "h3" | "h4";
  size?: "page" | "section" | "subsection" | "card" | "label";
};

const sizes = {
  page: "text-4xl sm:text-5xl lg:text-6xl leading-[1.05] tracking-[-0.03em]",
  section: "text-3xl sm:text-4xl leading-[1.1] tracking-[-0.03em]",
  subsection: "text-xl sm:text-2xl leading-tight tracking-[-0.02em]",
  card: "text-xl leading-tight tracking-[-0.02em]",
  label: "text-sm leading-snug tracking-normal",
};

/** Shared editorial typography; semantic level stays independent of visual size. */
export default function Heading({ as: Tag = "h2", size = "section", className, ...props }: HeadingProps) {
  return <Tag className={cn("font-sans font-medium text-text text-balance", sizes[size], className)} {...props} />;
}
