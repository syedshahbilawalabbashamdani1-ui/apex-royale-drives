import type { ReactNode } from "react";
import { whatsappLink } from "@/lib/constants";
import Button from "./Button";

export default function WhatsAppLink({ message, children, className }: {
  message: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Button href={whatsappLink(message)} target="_blank" rel="noopener noreferrer" className={className}>
      {children}
    </Button>
  );
}
