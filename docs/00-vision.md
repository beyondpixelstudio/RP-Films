# 00 — Vision, Business Context & Cost Analysis

## 1. The business

**Beyond Pixel Studio (BPS)** — Nandan Vihar, Bhubaneswar, Odisha 751024.
A creative and digital agency run by Rajesh Kumar Gouda, with a small core team.

| Address | Role |
|---|---|
| admin@beyondpixel.online | Rajesh Kumar Gouda — owner |
| manager@beyondpixel.online | Silu Behera — manager |
| marketing@beyondpixel.online | Marketing |
| lead.tech@beyondpixel.online | Technical lead |

### Revenue lines

| Line | Model | Evidence |
|---|---|---|
| Digital marketing retainers | Monthly recurring | Aryan Public School, Takshashila Residential School — monthly invoices |
| Event live-streaming & coverage | Per-project, advance + balance | Sagar Business Ventures, Resonate Pro, Ganjam Cricket League, school annual functions |
| Wedding photography & videography | Per-project | Album design, cinematography, teasers, invitation design |
| Commercial photography & drone | Per-project / rate card | Rate card and drone showcase exist as published collateral |
| Website & application development | Per-project | Assotech, Heartspace, SPVBS |
| Studio rental | Hourly / daily rate card | Studio rental price card published |
| Video editing & graphics design | Retainer + per-project | Dedicated department |
| Social media management | Monthly retainer | Detailing Devils, schools |

### How work actually flows today

The Detailing Devils engagement is the clearest picture of the delivery pipeline, and it is entirely manual in Notion:

```
Client brief
  → Content calendar (Month 1: 20 reels + 10 posters)
    → Batch draft scripts (reels 1–10, then 11–20)
      → Batch draft captions & copy (all 20 reels + 10 posters)
        → Production shoot (all 10 reels)
          → Publish & track (Month 1 content rollout)
```

**This pipeline is the product.** Module M4 exists to encode it.

### Current organisational structure (Notion)

`BPS Project Management` → `Projects` database, where each department is a project:

- DOP & Operations
- Digital Marketing & Management
- HR & Marketing Management
- Website Development
- Video Editing & Graphics Designer
- BPS Creative Department & Management
- Other / Miscellaneous

Supported by `Tasks`, `Clients`, `Sprints`, `Goals Tracker`, `Meetings`, and `Brainstorm Session` databases. BPS itself is entered in `Clients` as an internal client for self-marketing tracking — a sound instinct that the platform should preserve.

---

## 2. The problem

Three distinct costs, in increasing order of severity:

1. **Subscription bleed.** A dozen-plus recurring SaaS charges, several overlapping, some expired and still nagging for renewal.
2. **Manual process.** Invoices are hand-built as PDFs and emailed; payment chasing is manual follow-up email; content pipelines are Notion pages copied per client per month.
3. **No leverage.** Every new client multiplies manual work linearly. There is no system that makes the tenth retainer cheaper to serve than the first.

Problem 3 is the real one. Subscriptions are the visible symptom; the absence of a repeatable, instrumented delivery system is the constraint on growth.

---

## 3. Vision

One self-hosted platform that:

- **Runs the business** — marketing, HR, operations and finance in one system with one data model
- **Guides the operator** — usable by someone with basic computer literacy, not just by its builder
- **Applies AI where it compounds** — drafting, analysis, routing and reporting, with human approval on anything consequential
- **Owns its infrastructure** — no vendor can raise a price or change terms on the core
- **Can become a product** — architected from commit one so other small businesses can be served on it

---

## 4. Subscription kill-list

Every current subscription maps to the module that replaces it, or to the "cannot replace" list. **Any subscription with no owning module is a coverage gap in the SRS set.**

> **Amounts marked `TBC` must be filled in from actual billing records before the build-order decision.** Only figures with direct evidence are stated; nothing here is estimated.

### Replaceable

| Subscription | Replaced by | Monthly cost | Evidence |
|---|---|---|---|
| Notion | O1 (projects/tasks), M1 (CRM), O9 (knowledge base) | TBC | Primary system of record today |
| Odoo | Fin1–Fin6 via ERPNext | ~₹897 per invoice observed | Invoice SJO/2026/05/0702, May 2026 |
| **Makunai — Babbler** (WhatsApp platform) | M10 WhatsApp Business Platform | TBC | WABA `1270372887860442` named "Beyond Pixel Studio Makunai Global (Babbler) API" |
| **Makunai — Maglo CRM** | M1 AI CRM | TBC | GLO Plan, PO MG/PO/2026/00019, 18 Mar 2026; onboarded 1 Apr; live 15 Apr 2026 |
| Buffer / Hootsuite class | M5 Social Media Management | TBC | Confirm whether currently subscribed |
| Frame.io / WeTransfer / Dropbox class | O4 DAM & Media Review, F6 Storage | TBC | Confirm current file-delivery tooling |
| Keka class HRMS | H1–H7 via Frappe HR | TBC | Named as the target to replace |
| WPForms | M2 Lead Capture | TBC | Active — vendor emails observed |
| Akismet | Retired with WordPress migration | TBC | Receipt #117273265, May 2026 |
| eBundleTools | F10 model router + M6 SEO | Expired | Repeated renewal nags; plan lapsed |
| Emergent | Retired once platform exists | ₹249/mo | Razorpay sub_TIuYwipjyl0y8u, Jul 2026 |

**Makunai Global Technologies is the single largest replacement target.** It supplies two products — Maglo CRM and Babbler — which M1 and M10 replace together. Contract term and notice period are unknown and must be established before build scheduling, since M1 and M10 need to be production-ready before the renewal date to avoid paying for both.

### Cannot be replaced — these are floors

| Cost | Why it stays |
|---|---|
| Meta ad spend | Pass-through media cost, client-billable. ₹5k–50k top-ups observed across two ad accounts. |
| WhatsApp conversation fees | Meta charges per conversation regardless of which software sends it. ₹133.41 observed for a ~2-month period. Client-billable. |
| LLM API tokens | The largest *new* recurring cost. Mitigated but not eliminated by F10 routing. |
| VPS / GPU / object storage / backups | Self-hosting relocates cost to infrastructure. A GPU instance for local inference is a real monthly line. |
| Domains & DNS (Hostinger) | Marginal, keep. |
| Razorpay gateway fees | Percentage of collections. Irreducible. |
| SEO rank & keyword data | Ahrefs/DataForSEO sell **data**, not software. Cannot be self-hosted at any price. |
| **Google Workspace** | **Deliberately retained.** Self-hosting business email destroys deliverability — invoices and client mail landing in spam would cost far more than the subscription saves. Do not attempt this. |

### Deliberate non-goals

| Tool | Verdict |
|---|---|
| Canva | **Partial replacement only.** AI generation and templates cover routine social assets (M7 content library), but human design work stays in a design tool. Do not pretend otherwise in the SRS. |
| Suno | Niche audio generation. Low spend, no module. Keep or drop on its own merits. |
| Adobe / editing suites | Out of scope entirely. The platform manages the production *workflow*, not the craft tools. |

---

## 5. Honest cost expectation

Self-hosting **shifts** cost; it does not delete it.

```
Today:    SaaS subscriptions + manual labour
After:    Infrastructure + LLM tokens + irreducible pass-through fees + build time
```

**Expected outcome: roughly a 70% reduction in the recurring software bill**, plus new revenue from reselling the WhatsApp (M10), Google Business Profile (M7) and client-portal (M12) modules to existing clients.

Not 100%. Any plan promising zero recurring cost is wrong, and the SRS set will not make that claim.

The larger return is not the saving. It is that the tenth retainer client becomes cheaper to serve than the first.

---

## 6. Strategic advantage already in hand

**BPS already owns a provisioned WhatsApp Business API account** (two WABA IDs observed in billing). This is significant:

- The approval and verification process — normally the slowest part of building a Wati/AiSensy competitor — is already complete
- M10 can therefore ship faster than any other client-facing module
- It is immediately resellable to the existing school and local-business client base as a new recurring revenue line

Two further assets worth naming: an established Meta advertising operation with real spend history across two ad accounts, and a client base of schools and local businesses in a tier-2 city — exactly the segment that Dhanda-class and Wati-class tools target, and exactly the segment BPS can reach without paid acquisition.

---

## 7. Open questions

These must be answered before the build-order decision:

> ⚠️ **Live operational issue, unresolved as of drafting.** Meta issued delivery-failure notices on 15 August 2026 (three) and 23 May 2026: *"A payment or account setup issue for your WhatsApp Business account Beyond Pixel Studio Makunai Global (Babbler) API is preventing messages from being delivered to your customers."* WhatsApp messaging to clients is broken until resolved in Meta Billing. This is a business problem now, not a platform problem — but it is also why FR-M10-46 (health monitoring with immediate alert) exists.

1. What is the actual total monthly SaaS spend? Every `TBC` above needs a real figure.
2. What are the Makunai contract terms — cost, term, and notice period — for Maglo CRM and Babbler? This sets the deadline for M1 and M10.
3. Is there a Buffer-class social tool and a Frame.io-class review tool currently subscribed, or is that work done manually today?
4. How many client social accounts are under management, and at what posting volume? This sizes the M5/M10 token budget.
5. What is the acceptable monthly infrastructure budget? This decides whether a GPU instance for local inference is viable, which materially changes the F10 design.
