import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const labels = ["Select car", "Dates & location", "Personal info", "Review"];

export default function BookingSteps({ current }: { current: number }) {
  return (
    <ol aria-label="Booking progress" className="grid grid-cols-4 gap-2 mb-6">
      {labels.map((label, index) => (
        <li key={label} aria-current={current === index + 1 ? "step" : undefined}
          className="flex flex-col items-center gap-2 text-center min-w-0">
          <span className={cn("w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold",
            current > index ? "bg-accent text-accent-contrast" : "bg-surface-2 text-muted")}>
            {current > index + 1 ? <Check className="w-5 h-5" aria-hidden="true" /> : index + 1}
          </span>
          <span className="text-xs sm:text-sm text-muted">{label}</span>
        </li>
      ))}
    </ol>
  );
}
