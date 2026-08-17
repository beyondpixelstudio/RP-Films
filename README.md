# Beyond Pixel Studio — Platform

A self-hosted, AI-guided business operating system for Beyond Pixel Studio (BPS), Bhubaneswar.

One platform covering **Marketing, Human Resources, Operations and Finance** — replacing a stack of paid SaaS subscriptions with owned infrastructure, and architected so it can later be sold to other small businesses.

---

## Current status

**Specification phase.** No application code exists yet. This repository currently contains the requirements documentation set that will drive implementation.

| Phase | State |
|---|---|
| SRS authoring | In progress — see `docs/02-module-map.md` |
| Build order decision | Pending SRS review |
| Implementation | Not started |

---

## Documentation

| Document | Purpose |
|---|---|
| [`docs/00-vision.md`](docs/00-vision.md) | Business context, cost analysis, subscription kill-list |
| [`docs/01-architecture.md`](docs/01-architecture.md) | Stack, deployment topology, the `org_id`/RLS contract |
| [`docs/02-module-map.md`](docs/02-module-map.md) | All 46 modules, classification, dependency graph |
| [`docs/03-srs-template.md`](docs/03-srs-template.md) | The structure every SRS document follows |
| [`docs/04-licensing.md`](docs/04-licensing.md) | OSS license audit — what may be embedded and resold |
| [`docs/05-ai-model-strategy.md`](docs/05-ai-model-strategy.md) | Model tiering, routing, cost governance |
| [`docs/06-build-order.md`](docs/06-build-order.md) | Recommended build sequence (written after SRS review) |
| [`docs/srs/`](docs/srs/) | One SRS per module, named by module ID |

---

## Core decisions

| Decision | Choice |
|---|---|
| Build philosophy | **Hybrid** — self-host mature OSS for commodity capability, build only the differentiators |
| Stack | TypeScript end-to-end: Next.js (App Router), Postgres, Drizzle, Docker Compose on VPS |
| Tenancy | BPS-only scope in v1, but `org_id` on every table from commit one |
| Automation engine | **Activepieces** (MIT) — *not* n8n, which forbids embedding in a resold product |
| Connectors | **MCP** (Model Context Protocol) servers; skills are department-scoped capability packs |
| AI | Multi-model router — free/local for bulk work, frontier models reserved for reasoning |

Full reasoning for each is in `docs/01-architecture.md` and `docs/04-licensing.md`.

---

## Two rules that are never waived

1. **`org_id` on every table, every query, from the first commit.** v1 serves one organisation, but retrofitting multi-tenancy later is a full rewrite.
2. **No AI agent spends money, contacts a client, or publishes publicly without human approval.** Autonomy levels and approval gates are declared in every module SRS.
