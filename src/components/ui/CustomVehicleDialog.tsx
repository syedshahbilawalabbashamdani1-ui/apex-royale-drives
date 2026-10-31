"use client";

import Heading from "./Heading";
import FieldError from "./FieldError";
import { useId, useState } from "react";
import { X } from "lucide-react";
import Button from "./Button";
import Dialog from "./Dialog";

export default function CustomVehicleDialog({ open, onClose, onSubmit, submitLabel, note }: {
  open: boolean;
  onClose: () => void;
  onSubmit: (name: string) => void;
  submitLabel: string;
  note: string;
}) {
  const id = useId();
  const [name, setName] = useState("");
  const [error, setError] = useState(false);
  return (
    <Dialog open={open} onClose={onClose} titleId={`${id}-title`}>
      <div className="p-5 sm:p-8 space-y-6">
        <div className="flex items-start gap-3 justify-between">
          <div className="min-w-0">
            <Heading as="h2" size="subsection" id={`${id}-title`}>Request a custom vehicle</Heading>
            <p className="text-sm text-muted mt-2">Tell us which car you need. Our team will check availability and pricing.</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="min-w-11 min-h-11 flex items-center justify-center rounded-full hover:bg-surface-2 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form className="space-y-5" onSubmit={(event) => {
          event.preventDefault();
          const value = name.trim();
          setError(!value);
          if (value) {
            onSubmit(value);
            setName("");
            setError(false);
          }
        }}>
          <div>
            <label htmlFor={id} className="block text-sm mb-2">Which car are you looking for?</label>
            <input id={id} className="field" value={name} maxLength={120} data-autofocus
              placeholder="e.g. Toyota Land Cruiser LC 300"
              aria-invalid={error} aria-describedby={error ? `${id}-error` : undefined}
              onChange={(event) => { setName(event.target.value); setError(false); }} />
            {error && <FieldError id={`${id}-error`}>Enter a vehicle name.</FieldError>}
          </div>
          <Button type="submit" className="w-full">{submitLabel}</Button>
          <p className="text-xs text-muted">{note}</p>
        </form>
      </div>
    </Dialog>
  );
}
