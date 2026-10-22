import type { ReactNode } from "react";

/** Consistent, announced validation feedback with theme-aware contrast. */
export default function FieldError({ id, children }: { id: string; children?: ReactNode }) {
  if (!children) return null;
  return <p id={id} role="alert" className="field-error">{children}</p>;
}
