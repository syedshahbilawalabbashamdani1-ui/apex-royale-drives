import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

/** Shared responsive section rhythm; inner content controls its own grouping. */
export default function PageSection({ className, ...props }: ComponentPropsWithoutRef<"section">) {
  return <section className={cn("section-space", className)} {...props} />;
}
