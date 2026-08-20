# Design System — AURA Kitchen & Terrace
**Project:** Client pitch landing page · Raghunathpur, Bhubaneswar
**Author:** Beyond Pixel Studio · **Status:** pitch demo (content is placeholder)

Derived from `ui-ux-pro-max` searches (`--design-system`, `--domain style|color|typography|landing|gsap|ux`),
then adjusted where the raw DB match was wrong for this brand. Adjustments are recorded below.

---

## 1. Direction

**Dark & Cinematic.** Deep warm-black canvas, full-bleed food and ambience photography,
a single antique-gold accent. The restaurant sells *atmosphere* first and food second, so
the page is built to feel like the room, not like a menu card.

### Deviations from the raw search output
| Search returned | Used instead | Why |
|---|---|---|
| Style: *Vibrant & Block-based* | **Dark cinematic** (blend of *Parallax Storytelling* + *Editorial Grid*) | "Vibrant & Block-based" is tagged for startups/gaming/youth-consumer. It reads QSR, not aesthetic dining. |
| Palette: `#DC2626` appetising red on `#FEF2F2` | **Warm-black + antique gold** | The red/cream pair is the fast-food convention. An ambience-led restaurant needs low-luminance surfaces so photography carries the page. |
| Pattern: *Funnel (3-step)* | **Hero → proof → story → menu → gallery → testimonials → reservation** | Funnel's problem/solution framing doesn't apply to dining. Section order is taken from `hero-testimonials-cta` (social proof immediately before the CTA). |
| Typography: Playfair Display SC + Karla | **Playfair Display + Karla** (kept) | Direct DB match for "restaurants, cafes, hospitality". Non-SC used because all-small-caps hurts long headline legibility. |

---

## 2. Colour tokens

All pairs measured against `--bg` or `--surface`. WCAG results verified, not assumed.

| Token | Hex | Role | Contrast |
|---|---|---|---|
| `--bg` | `#0E0C0B` | Page canvas (warm near-black) | — |
| `--bg-elev` | `#17130F` | Alternating band | — |
| `--surface` | `#211B14` | Cards, menu rows, form fields | — |
| `--text` | `#F4EDE3` | Primary text | 16.79:1 on bg · AAA |
| `--text-muted` | `#A99C8B` | Secondary text | 7.26:1 on bg · AAA |
| `--accent` | `#C9A227` | Antique gold — CTA, rules, active state | 8.07:1 on bg · AAA |
| `--accent-soft` | `#E3C566` | Hover / focus lift | 11.56:1 on bg · AAA |
| `--on-accent` | `#0E0C0B` | Text on gold buttons | 8.07:1 · AAA |
| `--ember` | `#D9704A` | Terracotta — spice markers only | 5.92:1 on bg · AA |
| `--border` | `rgba(244,237,227,.12)` | Hairlines | decorative |

**Rule:** gold is the only accent. Nothing else competes with the CTA.

## 3. Typography

- Heading — **Playfair Display** 400/500/600, fallback `Georgia, 'Times New Roman', serif`
- Body — **Karla** 300–700, fallback `-apple-system, 'Segoe UI', sans-serif`
- Eyebrow/label — Karla 600, `letter-spacing:.22em`, uppercase, 12px
- Body base **17px**, line-height **1.65** (spacious dial = 2/10)
- Fluid headings via `clamp()`; no fixed px display sizes

## 4. Spacing & layout (density 2/10 — spacious)

`--s-1:8 · --s-2:16 · --s-3:24 · --s-4:40 · --s-5:64 · --s-6:96 · --s-7:140`
Container `1180px`, gutter `clamp(20px, 5vw, 40px)`. Section rhythm `--s-6`/`--s-7`.
Breakpoints: **375 / 768 / 1024 / 1440**.

## 5. Motion (dial 5/10 — standard)

From `--domain gsap`, implemented with IntersectionObserver + CSS transitions
(no external library — the page must stay self-contained).

| Element | Spec |
|---|---|
| Scroll reveal | `opacity 0→1`, `translateY 14px→0`, 500ms, `cubic-bezier(.22,.61,.36,1)`, trigger `top 88%`, fires once |
| Stagger | 60ms per child, grid order |
| Hero parallax | background `translateY` ≤ 8% of scroll, **decorative layer only — never text** |
| Hover | 200–260ms, image `scale(1.05)` inside `overflow:hidden` |

`prefers-reduced-motion: reduce` → all reveals render in their final state immediately; parallax off.

## 6. Non-negotiables (pre-delivery checklist)

- [ ] SVG icons only (Phosphor set) — no emoji as icons
- [ ] Every input has a real `<label>`; errors render **next to the field**, `aria-live` announced
- [ ] Touch targets ≥ 44×44, ≥ 8px apart
- [ ] `:focus-visible` ring on every interactive element — never removed
- [ ] Text contrast ≥ 4.5:1 (table above)
- [ ] Images: explicit `width`/`height` + `loading="lazy"` below the fold → CLS < 0.1
- [ ] No horizontal scroll at 375px
- [ ] Sticky mobile CTA bar clears the iOS safe area

## 7. Anti-patterns to avoid (from search)

- Low-quality imagery — the whole direction collapses without good photography
- Outdated hours — hours must be a single source of truth in the footer + reservation block
- Placeholder-only form labels
- Parallax on body copy (motion sickness)
- Hover-only affordances
