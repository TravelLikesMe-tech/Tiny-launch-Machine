# v2 design update — 6 Nov 2026

Built on the live code (includes Rakesh's Netlify form + scroll fixes; main.js unchanged).

**Files changed:** `index.html`, `styles.css`, `README.md`, `TODO.md`
**Files added:** `assets/photos/workbench.webp`, `assets/photos/sample-room.webp`
**Files removed:** `assets/photos/hero-kk.svg`, `about-kk.svg`, `factory-visit.svg`, `tlm-bags.svg`

What changed:
- No personal photos. Hero = AI workbench flat-lay with a small "One sample. A small first batch." tag. About = AI sample-room scene.
- Proof section: drawn product spec sheet (replaces the bag photo slot).
- Sourcing band: drawn route chart (designers UK/India/Japan, factories India/China/Vietnam, export to USA).
- Removed the small grey labels above every heading (reads as template/AI-made); hero byline moved under the buttons.
- Route call-to-action boxes are now solid ink bands with a lemon button (no side stripe).
- "The honest part" is a pull quote; marketplaces are a large typographic list instead of pills.
- Bigger hero headline on desktop; lemon highlight sweeps across "tiny." on load (off for reduced-motion users).
- Themed text selection, form caret and scrollbar.
- Checked at 375 / 768 / 1280 px, light and dark. Impeccable design detector: 11 findings → 2 (Inter font is required by the brand brief; FAQ flag is a false positive).
