import Button from "./Button";

export default function FilterGroup<T extends string>({ label, options, value, onChange }: {
  label: string;
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <fieldset>
      <legend className="text-sm font-semibold mb-3">{label}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <Button key={option} variant="ghost" aria-pressed={value === option}
            onClick={() => onChange(option)}
            className={value === option ? "px-4 py-2 bg-accent text-accent-contrast border-accent" : "px-4 py-2"}>
            {option}
          </Button>
        ))}
      </div>
    </fieldset>
  );
}
