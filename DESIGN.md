# Apex design reference

Reference: `C:/Users/syeds/Desktop/ALPHA` and `C:/Users/syeds/Desktop/Tech_And_Stack.md`.

- Use ALPHA's Neue Montreal, 18px desktop / 16px through 1024px, 1.45 line height.
- White/black surfaces, muted gray text, and ALPHA's #E8391D brand red. Use darker red on light surfaces and lighter red on dark surfaces for readable text and selection states.
- Follow the actual ALPHA implementation for monochrome pill actions and a compact inverse dropdown menu at all screen sizes. Use the technical reference for theme tokens and responsive sizing.
- Header and footer remain dark in both page themes, per the user's branding preference. Share the scoped brand-shell tokens so logos, links, theme controls and menus stay readable without affecting page colors.
- BrandLogo preserves the original transparent artwork, with theme-aware lettering and stars. Its viewBox trims only transparent margins, keeping every original foreground pixel. Keep useful navigation and footer links on mobile.
- Reuse Button, NavigationMenu, Dialog, FilterGroup and QuoteSummary. Preserve keyboard access, touch targets, focus states and reduced motion.
- Keep Next.js App Router and existing routes. ALPHA's Vite, AI APIs and image-gallery backend are outside this rental site's scope.
- Business content comes from https://apex-royale-drives.vercel.app when reachable. Keep existing content until verified; never invent rental prices or availability.
- Rentals use daily pricing only: vehicle daily rate multiplied by rental days. Do not add weekly/monthly rates or duration discounts.
