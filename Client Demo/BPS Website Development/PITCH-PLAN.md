# Pitch plan — restaurant landing page

**Goal:** convert a single-page demo into the full website-development engagement.
**Prospect:** aesthetic restaurant, Raghunathpur, Bhubaneswar.
**Asset:** `dist/aura-restaurant-standalone.html` + the published Artifact link.

---

## 1. Why this demo is built the way it is

The demo is not trying to look like every restaurant website. It is trying to
prove three things in about ninety seconds:

1. **We understood their positioning.** They sell atmosphere, so the page is dark,
   photography-led, and unhurried. A bright red-and-cream layout would have said
   "we ran a template."
2. **We understood their business.** Every scroll leads to one action — book a
   table. The sticky bar, the hero button, the header button and the WhatsApp
   fallback are all the same ask.
3. **We understood their market.** The copy names Infocity Square, the menu has
   an Odia mutton kassa on it, and the reviews read like Bhubaneswar reviews.

Point 3 is what actually closes. Anyone can show a nice layout.

---

## 2. How to run the meeting

**Open on the phone, not the laptop.** Most of their customers will arrive from
Instagram on a phone. Show the mobile view first — the hero, then thumb straight
to the sticky Reserve bar. Then hand them the laptop for the full-width version.

**Order of the walkthrough**

| Beat | What to show | What to say |
|---|---|---|
| 1 | Hero | "This is the first three seconds. The room sells itself, so the room is the page." |
| 2 | Sticky Reserve bar | "Booking is never more than one thumb away, on any screen." |
| 3 | Menu tabs | "Nine dishes, not eighty. Fast to browse, easy for you to update." |
| 4 | Reservation form | Fill it in live, badly, so they see the inline errors. Then correctly, so they see the confirmation. |
| 5 | WhatsApp line | "We already run a WhatsApp Business API account. Confirmations can go out automatically." |
| 6 | Demo ribbon | "Everything you are looking at is placeholder. Your photos and your menu go in the same slots." |

**Do not** apologise for the stock photography. Use it: *"this is what the page
looks like with good photography — a shoot is the highest-return thing you can
spend on, and we do that in-house."* That is an upsell, not an excuse.

---

## 3. The scope conversation

The demo deliberately stops short in three places. Each one is a line item.

| Gap in the demo | The engagement |
|---|---|
| Form validates but does not send | Reservation backend + WhatsApp confirmation + owner notification |
| Menu is hard-coded | Lightweight CMS so they change prices without calling us |
| One page | Full site: menu detail, gallery, private-dining/events, contact |
| Stock imagery | Food and interior photography shoot |
| Nothing measured | Analytics, Google Business Profile, review collection |

Anchor on the full build. The demo is the proof, not the product.

---

## 4. Before the meeting

- [ ] Swap in the real restaurant name and tagline (15 minutes — see the README table)
- [ ] Pull 3 real reviews from their Google listing into `#reviews`
- [ ] Replace 3–4 hero and gallery images with their actual Instagram photos
- [ ] Put their real phone number in the `tel:` and `wa.me` links
- [ ] Rebuild: `python3 build-standalone.py`
- [ ] Load the file once on the phone you will present from, then switch to airplane
      mode and confirm it still renders — the standalone build has no external
      dependencies except fonts

That checklist is the difference between "here is a template" and "here is your
website." It is under an hour of work.
