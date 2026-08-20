# AURA Kitchen & Terrace — landing page demo

A pitch deliverable, not a live site. Built to win the full website-development
engagement for a restaurant in Raghunathpur, Bhubaneswar.

## What is here

```
aura-restaurant/
  index.html              the page
  assets/css/style.css    tokens + components, no framework
  assets/js/main.js       ~220 lines, no dependencies
  assets/img/             15 photographs
dist/
  aura-restaurant-standalone.html   one portable file — email it, open it offline
  aura-restaurant-artifact.html     same, formatted for Artifact publishing
design-system/aura-restaurant/MASTER.md   the design decisions and why
```

## Run it

```bash
cd aura-restaurant && python3 -m http.server 8940
```

Then open `http://localhost:8940`. Rebuild the single-file versions after any edit:

```bash
python3 build-standalone.py
```

## What the client has to replace

Everything below is placeholder and is flagged as such in the ribbon at the top
of the page.

| Item | Where |
|---|---|
| Brand name, wordmark, tagline | `.logo` in the header, footer and drawer; `<title>`; JSON-LD |
| All 15 photographs | `assets/img/` — currently Unsplash stock |
| Menu: 9 dishes, copy, prices | `#menu`, three tab panels |
| Reviews (3) | `#reviews` — replace with real Google reviews |
| Address, phone, hours | `#reserve`, footer, JSON-LD, all `tel:`/`wa.me` links |
| Counts in the proof strip | `.proof` |

## Deliberately not built

- **No backend.** The reservation form validates fully and shows a confirmation,
  then stops. A live build would POST it and fire the WhatsApp confirmation
  through the Business API account BPS already holds.
- **No CMS.** Menu items are markup. If the client wants to edit prices
  themselves, that is a scoped addition, not a rewrite.
- **No real Google Maps embed** — the address block is text and a `tel:` link.

## Technical notes

- No framework, no build step, no external JS. The page is three files.
- Fonts are the only external request (Google Fonts). Everything else is local.
- Accessibility verified: labelled inputs, visible focus, WCAG AA+ contrast on
  every text pair, keyboard-operable tabs and drawer, `prefers-reduced-motion`
  honoured, no emoji used as icons.
- All images carry intrinsic `width`/`height` and lazy-load below the fold.
