import { describeQuote, type RentalQuote } from "@/lib/quote";

export default function QuoteSummary({ quote }: { quote: RentalQuote }) {
  const { label, value, note } = describeQuote(quote);
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap justify-between items-center gap-2 font-sans text-sm">
        <span className="font-semibold">{label}</span>
        <span className="font-bold">{value}</span>
      </div>
      {note && <p className="font-sans text-xs">{note}</p>}
    </div>
  );
}
