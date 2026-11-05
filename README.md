# Tiny Launch Machine — website (handoff for Rakesh)

A one-page static site for **tinylaunchmachine.com**. No framework, no build step, no npm.

```
index.html      all content and sections
styles.css      all styling (colour tokens at the top, dark mode included)
main.js         form handling + small behaviours (form endpoint is set at the top)
assets/logo/    final logo, favicon, Open Graph image (do not redraw or edit)
assets/photos/  placeholder images. Replace these with KK's real photos
content/        the filled intake sheet the copy came from (not needed on the server)
TODO.md         things KK still has to give or confirm
```

## Run it locally

```bash
cd tiny-launch-machine-website
python3 -m http.server 8000
```
Then open http://localhost:8000.

## The 3 things to set before going live

### 1. Query form endpoint (`main.js`, line ~17)
```js
const FORM_ENDPOINT = "";
```
- **Formspree (works on any host):** create a free form at formspree.io sending to `contact@travellikesme.com`, then paste the endpoint, e.g. `"https://formspree.io/f/abcdwxyz"`.
- **Netlify Forms (only on Netlify):** set it to `"netlify"`, then turn on Forms in the Netlify dashboard (Site → Forms → Enable). The `<form>` already has `data-netlify="true"` and a honeypot.
- **Left empty:** the form still works but opens the visitor's email app with the message filled in. Fine for a soft launch, not ideal.

Success and error messages are already built in.

### 2. Booking calendar (`index.html`, section `id="book"`)
It uses KK's Google Calendar appointment page (30-min free call). The link appears **twice** in that section: the `<iframe src>` and the "Open the booking page" fallback link. Search for `appointments/schedules` to find both. If KK switches to Calendly or Cal.com, replace both URLs.

### 3. Photos (`assets/photos/`)
Four marked placeholders are in use. Replace them with real photos (WebP or JPG, max 1600px wide, slightly warm and desaturated per DESIGN.md), then update the `src` in `index.html`:

| Placeholder | Where | Shape |
|---|---|---|
| `hero-kk.svg` | Hero, right side | portrait 4:5 (cropped square on phones) |
| `about-kk.svg` | About KK | portrait 4:5 |
| `tlm-bags.svg` | Proof section | landscape 3:2 |
| `factory-visit.svg` | Sourcing (dark) band | landscape 3:2 |

HEIC from iPhone: convert first, e.g. on a Mac `sips -s format jpeg -Z 1600 IMG_1234.HEIC --out hero-kk.jpg`.

## Deploy

Upload the whole `tiny-launch-machine-website` folder. There is no build command and the publish directory is the folder root. You can leave `content/` out.

**Netlify:** Add new site → Deploy manually → drag the folder in. Or connect the Git repo with build command empty and publish directory `.`.

**Vercel:** New Project → import the repo (or `npx vercel` inside the folder). Framework preset: "Other". Build command: none. Output directory: `.`.

**Cloudflare Pages:** Create project → Direct upload (or connect Git). Build command: none. Output directory: `/`.

### Connect the domain (tinylaunchmachine.com)
1. In the host's dashboard, add the custom domain `tinylaunchmachine.com` and `www.tinylaunchmachine.com`.
2. At the domain registrar, either switch nameservers to the host (simplest on Cloudflare/Netlify), or add the DNS records the host shows (usually an `A`/`ALIAS` record for the root and a `CNAME` for `www`).
3. Turn on HTTPS (automatic on all three hosts) and redirect `www` → root (or the other way, just pick one).
4. `index.html` already uses `https://tinylaunchmachine.com/` for the canonical URL and the Open Graph image. If the final domain is different, search-and-replace it.

### After deploy, check
- Share the URL in WhatsApp/LinkedIn: the link preview should show the black TLM card.
- Send one test query through the form and confirm it arrives.
- Book a test slot on the calendar, then cancel it.
- On a phone: the bottom bar shows "Book a call" + "WhatsApp" and hides when the booking section is on screen.

## Editing notes
- Colours, fonts and spacing are CSS variables at the top of `styles.css` (light and dark). Use the variables, not raw hex values, so dark mode keeps working.
- Fonts: Archivo Black (headings) and Inter (text) from Google Fonts.
- Logo rules are in `assets/logo/LOGO-RULES.md`: use the SVGs as they are, sea-blue dot on light, lemon dot on dark, min width 120px (the TLM square icon takes over under 360px screens).
- Copy rule from KK: never add numbers, names, testimonials or prices that aren't in the intake sheet.
- WhatsApp number is in the sticky bar link near the bottom of `index.html` (`wa.me/919836566665`).
- A Testimonials section was left out on purpose: there are no approved quotes yet. When there are, add it between "How we work" and the FAQ.
