# Light-theme logo fix report

## Root cause and evidence

Two defects were confirmed locally:

1. **The generated SVGs lacked intrinsic dimensions.** They declared only a `viewBox`. Chromium reported a fallback natural width of 300 even though the artwork was designed at 1600 x 541. During responsive/theme changes, the mobile light logo could paint blank despite HTTP 200, `complete === true`, a nonzero layout box, and successful decoding. Adding explicit `width="1600" height="541"` to both SVG roots corrected the reproduced mobile failure on the same production server. The generator now preserves these dimensions.
2. **The existing production application was stale.** Source code included both variants, but the old compiled application's header and footer referenced only the transparent silver `/brand/logo.svg`. It never selected the charcoal `/brand/logo-light.svg`. This left silver artwork on white in light mode. A production rebuild corrected the markup.

The development server returned both SVG files successfully. This was not a missing-file or image-optimizer failure.

## Changes

- Added explicit dimensions to both transparent SVGs and their generation script.
- Rebuilt the production application so its header and footer include both theme variants.
- Documented that source/theme changes require a production rebuild and restart.
- Strengthened server-rendered and browser regression tests.

The artwork, transparent background, red accents, and charcoal/silver theme treatment are preserved.

## Why the earlier verification missed it

The previous browser check validated loading only on the first image, which was the dark asset. It also changed the root theme class directly instead of using the actual theme button. Even a successful load check was insufficient: the mobile light SVG could still paint blank.

The revised browser tests use the actual theme control, reload the page to verify persistence, check both header and footer, require the correct intrinsic dimensions, and inspect screenshot pixels for the logo's red accents and neutral lettering. They exercise desktop (1440px) and mobile (390px) layouts in both themes.

## Verification results

- 15 logic/component tests passed.
- Production browser suite passed, including screenshot-pixel checks for both themes at desktop and mobile sizes.
- Lint passed.
- Production build and its TypeScript check passed. The explicit SVG dimensions were then verified against the same production server, which serves the updated public assets directly.

## Deployment scope

The fixes and verification apply to this local project and its rebuilt production server. A separately hosted deployment was not inspected; it must use the updated application build and SVG files.
