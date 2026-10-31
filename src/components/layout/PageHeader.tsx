import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Heading from "@/components/ui/Heading";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/motion/Reveal";

interface PageHeaderProps {
  title: string;
  description: ReactNode;
  breadcrumb?: string;
  width?: "wide" | "reading";
  align?: "center" | "left";
}

/** Shared page introduction with entrance motion and a Home breadcrumb. */
export default function PageHeader({ title, description, breadcrumb, width = "wide", align = "center" }: PageHeaderProps) {
  return (
    <header className="bg-surface-2 page-intro">
      <div className={cn("w-full mx-auto px-4 sm:px-6 lg:px-8", width === "reading" ? "max-w-4xl" : "max-w-7xl")}>
        {breadcrumb && (
          <nav aria-label="Breadcrumb" className="mb-3 text-sm text-muted">
            <ol className="flex items-center gap-2">
              <li><Link href="/" className="inline-flex min-h-11 items-center gap-1 hover:text-text hover:underline underline-offset-4"><ArrowLeft className="h-4 w-4" aria-hidden="true" />Home</Link></li>
              <li aria-hidden="true">/</li>
              <li aria-current="page">{breadcrumb}</li>
            </ol>
          </nav>
        )}
        <Reveal className={cn("max-w-3xl space-y-3", align === "center" && "mx-auto text-center")}>
          <Heading as="h1" size="page">{title}</Heading>
          <p className={cn("max-w-2xl text-lg text-muted leading-relaxed", align === "center" && "mx-auto")}>{description}</p>
        </Reveal>
      </div>
    </header>
  );
}
