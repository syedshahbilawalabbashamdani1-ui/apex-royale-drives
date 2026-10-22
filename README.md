# Apex Royale Drives

Car rental website for Islamabad and Rawalpindi, built with Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4 and Framer Motion.

## Development

Use Node.js 20.9 or later. From this directory, run `npm ci` and `npm run dev`, then open http://localhost:3000. Production commands: `npm run build` and `npm start`.

## Booking workflow

Customers select vehicles, dates, pickup location and contact details. The site calculates a daily estimate and prepares a WhatsApp message. Customers must send the message themselves; reservations require confirmation from the team. Custom vehicle requests are quoted separately.

There is no database, payment integration, reservation API or live availability feed. Set each vehicle's `available` flag manually. Unavailable vehicles remain visible but cannot be selected for booking. A professional driver is included; fuel, tolls and parking are charged separately at cost.

## Code map

- `src/app`: pages, route metadata, sitemap and robots.
- `src/lib/cars.ts`: vehicle specifications, prices, availability and pickup locations.
- `src/lib/constants.ts`: domain, business details, social links and WhatsApp destination.
- `src/lib/pricing.ts`, `quote.ts`, `bookingDates.ts`, `phone.ts`: estimates and validation. Dates use Pakistan time and require at least one rental day.
- `src/components`: navigation, sections, dialogs, motion and shared controls.
- `public/Images` and `public/fonts`: local assets.

Theme preference and saved vehicles use browser storage. Theme switching also works for the current session when storage is blocked. Booking form state lasts while the booking component is mounted.

## Validation

Run `npm test`, `npm run lint`, `npx tsc --noEmit` and `npm run build`.

Tests use Node's test runner and the installed TypeScript compiler to exercise pricing, calendar validation, phone validation and custom quotes. Browser interactions and WhatsApp delivery require manual verification.
