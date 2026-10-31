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

Theme preference and saved vehicles use browser storage. Theme switching also works for the current session when storage is blocked. Booking drafts (including contact details and the current step) use tab-scoped session storage and survive refreshes and navigation. Clear draft resets the form. Restored drafts discard unavailable vehicles and return to the appropriate step when dates or contact details need correction. A vehicle selected through a booking link is added to the draft and opens the date step. When storage is blocked, booking still works in memory.

The header and footer use transparent SVG tracings of the supplied `Apex Royale Luxury Car Logo.png`: `public/brand/logo.svg` has silver details for dark mode, and `logo-light.svg` has charcoal details for light mode. Both retain the red accents and switch with the selected site theme. To regenerate the vectors with Python and Pillow, run `python scripts/trace-logo.py`.

After changing logo components or theme classes, rebuild with `npm run build` and restart `npm start`. The production server serves the compiled `.next` application; updating files in `src` does not update that bundle. Updating public SVGs alone can leave old production markup displaying the silver logo on a light surface.

## Validation

Run `npm test`, `npm run lint`, `npx tsc --noEmit` and `npm run build`.

On Windows installations where Node reports `EPERM` resolving the user directory, set `$env:NODE_OPTIONS='--preserve-symlinks --preserve-symlinks-main'` in PowerShell before these commands.

Tests use Node's test runner and the installed TypeScript compiler to exercise pricing, calendar validation, contact validation, custom quotes and draft restoration. Server-rendered component checks cover route metadata, the navigation menu, fleet category filtering, initial booking steps and closed request dialogs.

For browser coverage, run a production server (`npm run build`, then `npm start`) and run `npm run test:browser` in another terminal. Chrome or Edge must be installed; set `CHROME_PATH` for other installations and `TEST_BASE_URL` for a different server URL. The runner uses Chrome DevTools through Next's bundled WebSocket client, so no additional test package is needed. It checks the complete request flow and WhatsApp message, refresh/navigation recovery, corrupt and blocked session storage, date/contact errors, custom dialog reset and keyboard focus, and responsive SVG loading in both themes. Screenshots are saved under `test-results/`. Use a production server because the Next development overlay itself accesses session storage and can report errors during the blocked-storage check. Actual WhatsApp delivery still requires manual verification.
