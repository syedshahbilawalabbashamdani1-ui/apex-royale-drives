# Apex UI improvements

## 1. Consistent page styling

- [x] Review Fleet, Booking, About, Contact and FAQ against the homepage.
- [x] Add reusable PageHeader and Heading components.
- [x] Migrate all five page introductions to sentence-case, medium-weight headings.
- [x] Align section headings and remove the About page's decorative glows and redundant labels.
- [x] Verify types, lint and existing regression tests (all five pass; lint uses the sandbox workaround).
- [ ] Verify rendered desktop/mobile pages in both themes when browser access is available.

Production build attempted: blocked by sandbox EPERM while resolving `C:\Users\syeds`.

## Later high-priority changes (separate steps)

- [x] Reduce mobile hero spacing and remove the full-screen minimum height.
- [x] Standardize section whitespace with PageSection and shared responsive tokens.
- [x] Add tablet fleet columns.
- [x] Preserve compact dropdown navigation at all sizes, per user preference.
- [x] Shorten the booking introduction through the shared PageHeader spacing.

## ALPHA palette and compact layout pass

- [x] Apply ALPHA brand red, monochrome surfaces and muted gray tokens.
- [x] Keep small labels readable with neutral theme ink; use the single reference red for primary actions and selections.
- [x] Tighten section headings, card gutters, stats, footer and page content spacing.
- [x] Replace the isolated green contact button with shared monochrome WhatsAppLink.
- [x] Compile Tailwind CSS and verify the palette utilities and spacing tokens.
- [ ] Inspect rendered desktop/mobile pages in both themes (browser verification unavailable).

## Tech_and_Stack.md palette alignment

- [x] Read section 3 and map exact light/dark colors to shared CSS tokens.
- [x] Use #E8391D primary buttons and selection fills with black foregrounds.
- [x] Add reference token aliases and field hover surfaces.
- [x] Remove alternate brand red shades and outdated blue-gray dialog fallbacks.

## FAQ, Booking and Privacy consistency

- [x] Apply neutral reference surfaces site-wide; retain restrained red actions and focus states.
- [x] Migrate Privacy to shared PageHeader and Heading, with consistent section gaps.
- [x] Fix Booking calendar theme inheritance, control corners and field hover styling.
- [x] Add reusable, announced FieldError feedback for Booking, Contact and custom requests.
- [x] Standardize FAQ panel corners and preserve visible keyboard focus.
- [x] Align booking dialog typography and sentence-case labels.
- [ ] Verify rendered desktop/mobile pages in both themes when browser access is available.
