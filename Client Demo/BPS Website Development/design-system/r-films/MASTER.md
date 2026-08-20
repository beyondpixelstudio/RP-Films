# Design System — RP Films
**Project:** Client pitch site · Video production, equipment rental, crew · Delta Square, Bhubaneswar
**Author:** Beyond Pixel Studio · **Status:** pitch demo (inventory is real, showreel and rental terms are placeholder)

---

## 1. Direction

**The anodised barrel.** The client's world is black anodised aluminium with white
engraving on it — lens barrels, matte boxes, flight cases. The page is built out of
that material rather than out of "video website" conventions: blue-black grounds,
engraved white type, one lacquer crimson taken straight off their mark, and technical
data set in mono the way a focus scale is.

The mark itself supplied two motifs that run through the whole page:

| Motif | Where it appears |
|---|---|
| The nine-blade iris | Preloader, the WebGL hero barrel, the bokeh shape in every showreel frame |
| The engraved focus scale | Left rail (0.6 m → ∞) tracking scroll depth, mono quantities in the rental list |

### Deliberate departures from the obvious
| The obvious move | Used instead | Why |
|---|---|---|
| Full-bleed showreel video hero | **Generated 3D aperture barrel** | We have no footage from this client yet. A hero that depends on assets we do not have is a hero that breaks in the meeting. |
| Near-black + a single acid accent | **Blue-biased black + crimson + two colour-temperature accents** | Tungsten `#F2A65A` and daylight `#6E9BD1` are the client's own vocabulary (3200K / 5600K). They encode kit data; crimson stays the only persuasive colour. |
| Fade-up scroll reveal | **Rack focus** — `blur(9px) → 0` | A camera company's page should come into focus, not slide. |
| Numbered section markers | **Focus-distance rail** | Numbering implies sequence. Scroll depth is continuous, so it gets a continuous scale. `01–05` is used only on the process steps, which genuinely are a sequence. |
| Contact form as the only path | **Kit builder → WhatsApp** | Rental enquiries in this market arrive on WhatsApp with a list. The page produces exactly that message. |
| Product photography of the gear | **Technical line drawings** | See §7. |

---

## 2. Colour tokens

Measured against `--void` unless noted. Verified, not assumed.

| Token | Hex | Role | Contrast |
|---|---|---|---|
| `--void` | `#08090C` | Page ground (black, blue-biased) | — |
| `--barrel` | `#0D0F14` | Alternating band | — |
| `--plate` | `#141821` | Cards, kit rows, form fields | — |
| `--plate-2` | `#1B202B` | Hover / checked surface | — |
| `--engrave` | `#E8E6E3` | Primary text | 15.99:1 · AAA |
| `--muted` | `#8B919E` | Secondary text, equipment line art | 6.29:1 · AAA |
| `--dim` | `#5C6270` | **Tick marks and rules only** | 3.26:1 — never body text |
| `--crimson` | `#C8102E` | Brand fill: buttons, rules, active chip | 3.39:1 — **fills only**, white on it is 5.88:1 |
| `--crimson-lit` | `#E8213C` | Button hover | — |
| `--crimson-text` | `#FF4D62` | Crimson as *text*: eyebrows, links, icons, art accents | 6.13:1 · AAA |
| `--tungsten` | `#F2A65A` | 3200K kit chips | 9.85:1 · AAA |
| `--daylight` | `#6E9BD1` | 5600K / mount chips | 6.87:1 · AAA |

**Rules.** Crimson never carries small text — that is what `--crimson-text` is for.
Tungsten and daylight are data colours; they may never be used to persuade.

**Theme.** Single-theme by intent — a cinema surface, not a document. Every colour and
the `body` background are painted explicitly so the page never borrows a host ground.

## 3. Typography

- Display — **Anton**, single weight, `line-height:.92–.98`, `letter-spacing:-.01em`.
  Chosen because the headlines are now keyword-led and long ("Camera Rental & Video
  Production in Bhubaneswar"); a condensed heavy face carries that in three lines
  where a Didone needed five, and it reads as a title card rather than a fashion
  masthead. Anton has no italic, so heading emphasis is carried by colour alone
  (`h1 em, h2 em → --crimson-text`).
- UI / body — **Archivo** 400–700, fallback `-apple-system, 'Segoe UI', sans-serif`
- Data — **JetBrains Mono** 400/700 for quantities, timecode, phone numbers, the focus
  scale. Anything engraved on real kit is monospaced here.
- The mark's `R` and `P` are set in Georgia, not the display face — the logo is a
  Didone-flavoured serif monogram and must not drift with the heading font.
- Body base **17px** / 1.62. Eyebrows: Archivo 700, `.26em`, uppercase, 11px.

**To change the display face:** one token, `--font-display` in `style.css §1`. Nothing
else references it.

## 4. Spacing & layout

`--s-1:8 · --s-2:16 · --s-3:24 · --s-4:40 · --s-5:64 · --s-6:96 · --s-7:140`
Container `1240px`, gutter `clamp(20px, 5vw, 48px)`.
Breakpoints: **375 / 400 / 560 / 640 / 900 / 960 / 1100 / 1280**.
The rental list is the one high-density block on an otherwise spacious page — that
contrast is the point: everything else breathes so the inventory can be dense.

## 5. Motion (dial 7/10)

No animation library. WebGL for the hero, canvas for the showreel, IntersectionObserver
and CSS transitions for everything else.

| Element | Spec |
|---|---|
| Boot | Iris rotates, mark scales in, bar counts to 100, letterbox opens (900ms), headline lines unmask on a 110ms stagger |
| Scroll reveal | Rack focus: `blur(9px)→0`, `opacity 0→1`, `translateY 20px→0`, 700ms `cubic-bezier(.22,.61,.36,1)`, 70ms stagger, fires once |
| Hero barrel | 16 nine-gon rings wrapped through a modulo; vanishing point offset right on wide screens so it frames rather than fights the headline; DPR capped at 1.5 (1.0 under 700px) |
| Card tilt | Pointer-tracked `rotateX/Y` ≤ 9°, written as custom properties so it composes with the reveal instead of overwriting it |
| Showreel | Static plate until hover/focus, then bokeh rolls and timecode runs |
| FAQ | `<details>` accordion; the plus rotates 45° to a cross |

`prefers-reduced-motion: reduce` → reveals render final, tilt off, grain and ticker
static, hero falls back to the CSS gradient, showreel stays on its static plate.

## 6. SEO

Grounded in what Bhubaneswar actually returns on Google, not on generic best practice.

**What the search results showed.** Local results are dominated by directories
(Justdial, Sulekha, IndiaMart) and hobbyist/DSLR-and-drone renters. The serious cine
houses — Primes & Zooms, Gadget Rental India — are all Mumbai, Pune and Delhi. Nobody
in Odisha has a page that names PL-mount cine glass. RP Films' inventory is therefore
the differentiator *and* the ranking asset: 92 model names on one indexable page.

**Applied rules**

| Rule | Implementation |
|---|---|
| One H1, keyword-led | `Camera Rental & Video Production in Bhubaneswar` |
| Title ≤ 60 chars, keyword first, brand last | 59 chars |
| Meta description ≤ 160 with a call to action | 154 chars, ends with the phone number |
| H2s carry secondary intents | camera rental · film crew hire · video production work · FAQ · quotes |
| Long-tail capture | Every model name (`Sony FX6`, `Zeiss CP.3 85mm`, `Mavic 3 Cine`) is real page text, not an image |
| Structured data | `LocalBusiness` + `ProfessionalService`, `WebSite`, `FAQPage`, `hasOfferCatalog`, `areaServed` for seven Odisha cities |
| Local relevance | Bhubaneswar, Cuttack, Puri, Konark, Chilika, Berhampur, Sambalpur, Rourkela named in copy, not just in schema |
| Crawlable | `canonical`, `robots`, `og:` and `geo.` tags, `lang="en-IN"` |

**Deliberately absent:** no `aggregateRating`. Inventing a star rating and review count
is the one schema abuse Google actually penalises, and the client has real reviews to
collect instead.

## 7. Equipment illustrations

Twenty technical line drawings (`#g-cine`, `#g-zoom`, `#g-tube` …) sit beside every
rental row. They are drawings rather than photographs on purpose:

- We do not have photographs of *this* client's kit, and stock product shots would be
  showing gear that is not theirs.
- They stay sharp at any size, add about 4 KB total, and survive being emailed.
- They inherit the theme: `color` on the outer `<svg>` drives `currentColor`, and the
  single crimson accent on each is set with an inline `style` using a custom property.
  **Class-based CSS cannot reach inside a `<use>` shadow tree** — presentation
  attributes and inherited custom properties are the only things that cross.

The drawing is chosen by `artFor()` from the item's group and name, so adding a lens to
`GEAR` never means remembering to pick an illustration.

When the client supplies real photographs of their own kit, swap `.kit__art` to an
`<img>` and keep everything else. That shoot is an upsell, not a fix.

## 8. Non-negotiables (pre-delivery checklist)

- [x] SVG icons and illustrations only — no emoji as icons
- [x] `[hidden]{display:none !important}` sits above component `display` rules
- [x] Every input has a real `<label>`; errors render next to the field
- [x] Touch targets ≥ 44×44
- [x] `:focus-visible` ring on every interactive element
- [x] Informational text ≥ 4.5:1; `--dim` restricted to rules and ticks
- [x] No horizontal scroll at 375px; category chips scroll in their own strip
- [x] Kit tray clears the iOS safe area and adds body padding so it hides nothing
- [x] `<noscript>` undoes every style that waits on JS
- [x] Canvas sizing guards against a zero-width first paint
- [x] Exactly one H1; heading order never skips a level

## 9. Anti-patterns avoided

- Stock "videographer with a camera" photography
- Autoplaying audio or a video hero that costs 40 MB on a Bhubaneswar mobile connection
- Keyword stuffing — every keyword sits in a sentence a human would say out loud
- Fake `aggregateRating` schema
- A quote form as the only route to a human on a business that runs on WhatsApp
- Inventing footage, clients or awards the client has not actually got
