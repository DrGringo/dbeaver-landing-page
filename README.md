# DBeaver Landing Page

An animated marketing landing page for DBeaver, built from the Figma design with
**Vite + vanilla JS + GSAP** (ScrollTrigger) and **Lenis** smooth scroll.

Covers **navigation, hero, logo strip, AI webinar banner, product selector,
how-it-works, and personas ("Who is it for?")**. The remaining sections (secure
data hub, user management, ecosystem, testimonials, newsletter, footer) are
planned for later iterations.

Note: the hero and character illustrations in the source Figma design are
hand-drawn line art decomposed into 35–50 individual vector fragments per
graphic. Reconstructing those pixel-for-pixel wasn't practical, so the
"How it works" cards and persona cards use clean custom icon illustrations
in the same brand colors instead of the original mascot artwork.

## Getting started

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build → dist/
npm run preview  # preview the production build
```

## Project structure

```
├── index.html                 # semantic markup for all sections
├── public/assets/             # SVGs exported from the Figma design
│   ├── dbeaver-logo.svg
│   ├── brand/                 # trusted-by company logos
│   ├── tech/                  # data-source badge icons (hero diagram)
│   └── icons/                 # marquee mark, button arrow
├── src/
│   ├── main.js                # Lenis + GSAP init, wires up section modules
│   ├── styles/
│   │   ├── tokens.css         # colors, spacing, radius, fonts (from Figma vars)
│   │   ├── base.css           # reset, fonts, typography helpers
│   │   └── sections.css       # layout for every section
│   └── animations/
│       ├── nav.js             # slide-in + scrolled state
│       ├── hero.js            # headline line-reveal, arc + badge intro, parallax
│       ├── splitLines.js      # masked line-split helper for headings
│       ├── logos.js           # staggered logo reveal
│       ├── aiBanner.js        # banner reveal
│       ├── productSelector.js # selector reveal + play-button pulse
│       ├── howItWorks.js      # feature card reveal (marquee is pure CSS)
│       └── roles.js           # persona cards drop-and-tilt onto the line
```

## Fonts

- **Lato** loads from Google Fonts (`index.html`).
- **Huben** is the custom brand display face. It is not bundled. To enable it:
  1. Drop the provided font file into `src/fonts/` (e.g. `huben-regular.woff2`).
  2. Uncomment the `@font-face` block at the top of `src/styles/base.css`.

  Until then, display headings gracefully fall back to Lato Black (see the
  `--font-display` stack in `src/styles/tokens.css`) — no other change needed.

## Accessibility

- Respects `prefers-reduced-motion`: smooth scroll and entrance animations are
  disabled and all content renders immediately.
- Content is visible without JS (a `.no-js` fallback keeps `[data-reveal]`
  elements at full opacity).

## Assets

The SVGs in `public/assets/` were exported from the source Figma file
([DBeaver – CloudBeaver UI kit / mocks](https://www.figma.com/design/Kj06CVZ9InZXddrjxAM46t/DBeaver---CloudBeaver-UI-kit--mocks?node-id=9081-7505)).
