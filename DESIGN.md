# Apex design reference

Reference: `C:/Users/syeds/Desktop/ALPHA` and `C:/Users/syeds/Desktop/Tech_And_Stack.md`.

- Use ALPHA's Neue Montreal, 18px desktop / 16px through 1024px, 1.45 line height.
- White/black surfaces, muted gray text, and ALPHA's #E8391D brand red. Use the exact red for primary actions and selection states, with black foreground text. Small labels use neutral theme text.
- Follow the technical reference for red primary pill actions and a compact inverse dropdown menu at all screen sizes. Use the technical reference for theme tokens and responsive sizing.
- Header and footer remain dark in both page themes, per the user's branding preference. Share the scoped brand-shell tokens so logos, links, theme controls and menus stay readable without affecting page colors.
- BrandLogo preserves the original transparent artwork, with theme-aware lettering and stars. Its viewBox trims only transparent margins, keeping every original foreground pixel. Keep useful navigation and footer links on mobile.
- Reuse Button, NavigationMenu, Dialog, FilterGroup and QuoteSummary. Preserve keyboard access, touch targets, focus states and reduced motion.
- Secondary page introductions use `PageHeader`; page and section typography uses `Heading`. Use sentence case, medium weight, neutral text and tight tracking. Keep card labels compact with the card/label sizes. Page introductions stay visible without entrance animations. Use plain theme surfaces instead of decorative gradients or blurred glows.
- Keep Next.js App Router and existing routes. ALPHA's Vite, AI APIs and image-gallery backend are outside this rental site's scope.
- Business content comes from https://apex-royale-drives.vercel.app when reachable. Keep existing content until verified; never invent rental prices or availability.
- Rentals use daily pricing only: vehicle daily rate multiplied by rental days. Do not add weekly/monthly rates or duration discounts.

## Compact spacing and palette

- Use `PageSection` for major sections: 32px vertical padding on phones, 40px from 768px, 48px from 1025px. Use `.section-heading` for the 24/28/32px heading-to-content gap.
- `PageHeader` uses `.page-intro` (28/36/40px). Route content uses `.page-body` (24/28/32px). Avoid stacking large Tailwind padding values on these primitives.
- The homepage hero is content-height, with compact responsive padding and a wider mobile image area; do not restore a full-viewport minimum height.
- ALPHA palette: white/#111111/#555555 in light mode, black/#010101/white/#A5A5A5 in dark mode, #E8391D brand accent in both modes. Primary buttons use #E8391D with black labels; header and footer retain their dark branding.
- `accent` is the exact brand red for decoration and borders. `accent-ink` follows the neutral theme text for readable small labels. Use `accent` with black `accent-contrast` for filled selection controls.

## Palette authority

Use section 3 of `C:/Users/syeds/Desktop/Tech_and_Stack.md` as the palette source. Theme tokens include `primary`, `nav-border`, `create-surface`, and `create-surface-hover` aliases. Field hover surfaces are #F3F4F6 light / #2A2A2A dark. Theme-aware glass header tokens match the reference; the branded header/footer keep their existing dark treatment.

## FAQ and Privacy as the site-wide surface reference

- Page introductions use the shared neutral secondary surface. Content uses white/black backgrounds, neutral panels, gray borders and muted copy. Keep the single red accent for primary actions, active borders and focus indicators.
- Decorative badges, information notices and booking totals use neutral surfaces instead of red washes or solid accent fills. Vehicle selection uses inverse monochrome controls and an active border.
- Use `FieldError` for validation messages and associate it through `aria-describedby` and `aria-invalid`. Inputs inherit native color scheme and shared `.field` hover/background settings; avoid inline overrides.
- FAQ uses `.accordion-item` and `.accordion-trigger` with panel radii and an inset focus outline. Privacy uses PageHeader and Heading, with readable content visible without animation.
