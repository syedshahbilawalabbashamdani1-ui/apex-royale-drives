import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "ghost";
type Props = { variant?: Variant } & (
  | (ComponentProps<"button"> & { href?: never })
  | (Omit<ComponentProps<typeof Link>, "ref"> & { href: string })
);

export function buttonClass(variant: Variant = "primary", className?: string) {
  return cn("btn", variant === "primary" ? "btn-primary" : "btn-ghost", className);
}

export default function Button({ variant, className, ...props }: Props) {
  const classes = buttonClass(variant, className);
  if (typeof props.href === "string") {
    const { href, ...rest } = props;
    return <Link href={href} className={classes} {...rest} />;
  }
  return <button type="button" className={classes} {...props} />;
}
