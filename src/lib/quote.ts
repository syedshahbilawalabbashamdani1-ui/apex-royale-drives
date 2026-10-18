import { formatPKR } from "./pricing";

export interface RentalQuote {
  /** null means no priced vehicles or no valid dates; zero is a known price. */
  knownSubtotal: number | null;
  pendingCustomQuotes: number;
}

export function describeQuote(quote: RentalQuote) {
  const pending = quote.pendingCustomQuotes > 0;
  return {
    label: pending && quote.knownSubtotal !== null ? "Known subtotal" : "Estimated rental amount",
    value: quote.knownSubtotal !== null
      ? formatPKR(quote.knownSubtotal)
      : pending ? "Quote on request" : "Select valid dates",
    note: pending ? "Custom vehicles quoted separately." : "",
  };
}

export function quoteMessage(quote: RentalQuote): string {
  const { label, value, note } = describeQuote(quote);
  return `${label}: ${value}${note ? `; ${note}` : ""}`;
}
