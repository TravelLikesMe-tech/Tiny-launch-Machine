# v3 motion update — 6 Nov 2026

Builds on v2 (v2 is not live yet; upload v3 instead, it contains everything).

**Files changed:** `index.html`, `styles.css`, `main.js`
**Files added:** `assets/video/hero-route.webm`, `assets/video/hero-route.mp4`, `assets/video/hero-route-poster.webp`
**Files removed:** `assets/photos/workbench.webp` (now a scene inside the film); also delete the 4 old placeholder SVGs if still on the server.

What changed:
- **Hero film (17 s, silent, loops):** the problem statement first ("Just an idea? Selling offline? Both hit the same wall"), then 01 Start tiny → 02 Source it right (route map) → 03 Launch and sell (listing → Order #1) → "Start tiny. Launch smart." Made with HyperFrames; source project is `TLM-hero-film/` next to this folder.
  - Plays muted, pauses when off screen or the tab is hidden, has a Pause/Play button.
  - Visitors with "reduce motion" turned on see the still poster (the problem statement) and can press Play.
  - Screen readers get the full script of the film.
- **New audience:** hero line now speaks to people starting a D2C brand *and* offline businesses going after a new market. New "Where are you right now?" option: "I sell offline and want a new market → Start at 06". New form option: "I sell offline, want a new market".
- **Motion on proof and sourcing:** the spec sheet draws itself and the sourcing routes draw (export arc last) when they scroll into view, once. The route timeline line fills as you scroll through the 11 stops.
- `styles.css?v=3` and `main.js?v=3` in index.html so returning visitors don't get the old cached files. Bump the number on future CSS/JS changes.

Checked at 375 / 1280 px; film plays, Pause works, drawings complete, no sideways scroll.
