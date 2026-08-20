# RP Films — pitch site

Single-page demo for RP Films (Delta Square, Bhubaneswar): video production,
camera equipment on rent, and film crew services across Odisha.

```
r-films/
  index.html               markup, SEO head, JSON-LD, icon sprite,
                           the logo and 20 equipment drawings as <symbol>s
  assets/css/style.css     tokens → base → components → motion
  assets/js/main.js        inventory data, the rental list, WebGL hero, showreel canvases
```

Build the portable copies (no server, no assets to fetch except Google Fonts):

```bash
python3 build-rfilms.py
```

→ `dist/r-films-standalone.html` and `dist/r-films-artifact.html`, ~105 KB each.

## No image files

Every visual is generated at runtime: the hero is a WebGL fragment shader, the
showreel frames are canvas-drawn colour grades, the logo and all the equipment
drawings are vector. That keeps the page around 100 KB and means nothing 404s when
it is emailed or opened from a USB stick.

## Editing the inventory

`assets/js/main.js` → `GEAR`. One row per line item:

```js
['cam', 'Sony FX6', 'Full-frame 4K · dual base ISO · internal ND', 4, [['Flagship','flag'],['E-mount','cool']]]
//  ^group  ^name     ^spec line                                    ^qty  ^chips: [label, tone]
```

Tones are `flag` (crimson), `warm` (tungsten, 3200K), `cool` (daylight, 5600K).
Groups are declared in `GROUPS` just above.

Everything downstream is derived — category chips and their counts, search, the
kit tray, the WhatsApp message, **and which drawing appears beside the row**
(`artFor()` picks it from the group and the name). Adding a lens needs no other edit.

**The tally strip in `index.html` is the one place that is hard-coded**, so if stock
changes, update those six `data-count` values:

| Figure | Derivation |
|---|---|
| 25 camera bodies | sum of `cam` |
| 106 lenses | `cine` + `sony` + `canon` |
| 43 lighting fixtures | sum of `lite`, excluding the battery row |
| 17 monitors | sum of `mon`, excluding the wireless-video row |
| 5 aerial units | sum of `air` |
| 20 walkie-talkies | the `comm` handset row |

## Equipment drawings

Twenty symbols, `#g-cine` through `#g-headset`. To add one, copy an existing symbol
(viewBox `0 0 96 64`), then add a branch to `artFor()`.

Two rules, learned the hard way:

- **Style with presentation attributes, not classes.** `<use>` builds a shadow tree
  that outside CSS selectors cannot match. `stroke="currentColor"` on the group works
  because `color` inherits; a `.class` in the stylesheet does not.
- The crimson accent uses `style="fill:var(--crimson-text)"` inline — custom
  properties inherit into the shadow tree, so the accent still follows the theme.

## SEO

The page is written against what Bhubaneswar actually returns on Google. See
`design-system/r-films/MASTER.md §6` for the research and the rules applied.

If you change copy, keep these intact:

- Exactly one `<h1>`, and it keeps "Camera Rental" and "Bhubaneswar" in it
- `<title>` under 60 characters, `meta description` under 160
- Model names stay as **text**, never baked into an image — they are the long-tail
- The JSON-LD `FAQPage` answers must keep matching the visible FAQ text, word for word.
  If you edit one, edit the other, or the rich result is dropped.

## Before the meeting

- [ ] **Confirm the rental terms in the FAQ.** Minimum period, deposit, ID and payment
      terms are written as sensible defaults, *not* from the client. Four answers to
      check: cost, minimum period, booking requirements, drone permissions.
- [ ] Swap the six showreel titles and descriptions for real projects (`#work`)
- [ ] Confirm the inventory line by line — quantities change weekly
- [ ] Point the Instagram and YouTube links in the footer at the real accounts
- [ ] Confirm which of the two numbers should receive WhatsApp (`WA_NUMBER` in main.js)
- [ ] Replace `https://rpfilms.in/` in the canonical, `og:url` and JSON-LD once the
      real domain is decided
- [ ] Ask about real Google reviews — `aggregateRating` was deliberately left out of
      the schema rather than invented, and it is worth having for real
- [ ] Open it once on the presenting phone, then switch to airplane mode and reload —
      the only external request is Google Fonts

## What the demo deliberately does not do

The quote form validates and confirms but sends nothing; the showreel frames are
generated stand-ins; there is no CMS behind the inventory. Each of those is a line
item in the engagement, not an oversight.
