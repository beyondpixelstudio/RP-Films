# 01 — Architecture

## 1. Guiding constraints

The architecture is shaped by four hard realities, not by preference:

1. **One primary builder.** Rajesh, driving Claude Code, with lead.tech@ assisting. Anything requiring a platform team is wrong by definition.
2. **Self-hosted.** No managed service the business cannot survive losing.
3. **Non-technical operators.** Staff and eventually clients use this. Complexity must live in the code, not in the UI.
4. **Must survive becoming a product.** v1 serves BPS only, but no decision may foreclose multi-tenancy.

---

## 2. Stack

| Layer | Choice | Reasoning |
|---|---|---|
| Language | **TypeScript**, end to end | One language across UI, API, jobs and agents. Best AI-assisted coding support. No context-switching tax on a solo builder. |
| Framework | **Next.js** (App Router) | Server Components reduce API surface; one deployable for UI and backend. |
| API | **tRPC** + Server Actions | End-to-end type safety without maintaining a schema layer by hand. |
| Database | **PostgreSQL 16+** | Row-Level Security is the tenancy enforcement mechanism. Also gives JSONB, full-text search, and `pgvector` for embeddings — three services avoided. |
| ORM | **Drizzle** | SQL-shaped, no hidden query generation. Migrations are readable and reviewable. |
| Queue / jobs | **pg-boss** (Postgres-backed) | Avoids running Redis until load justifies it. Revisit at scale. |
| Cache | Postgres → Redis only when measured need arises | Do not add infrastructure speculatively. |
| Object storage | **MinIO** (S3-compatible) | Media is core to this business. S3 API means a hosted fallback stays available. |
| Auth | **Better-Auth** | TypeScript-native, self-hosted, supports org/member modelling out of the box. |
| Automation engine | **Activepieces** (MIT) | Embeddable and resellable. See `04-licensing.md`. |
| Search | Postgres FTS → dedicated engine only if it fails | |
| Deployment | **Docker Compose** on a VPS | Kubernetes is unjustifiable at this scale. |
| Observability | OpenTelemetry + self-hosted collector | |

### Explicitly rejected

| Rejected | Why |
|---|---|
| Microservices | A solo builder cannot operate a distributed system. Modular monolith instead. |
| Kubernetes | Operational cost exceeds any benefit at this scale. |
| n8n as embedded engine | License forbids embedding in a resold product. See `04-licensing.md`. |
| Self-hosted email sending | Deliverability collapse. Invoices in spam cost more than Google Workspace saves. |
| Separate services per department | Departments share too much data. One schema, enforced module boundaries. |

---

## 3. Shape: modular monolith

One deployable application, internally partitioned into modules that communicate through explicit interfaces rather than by reaching into each other's tables.

```
┌─────────────────────────────────────────────────────────┐
│                     Next.js application                 │
│                                                         │
│  ┌───────────┐  ┌───────────┐  ┌───────────┐            │
│  │ Marketing │  │    Ops    │  │  Finance  │  Modules   │
│  │  M1–M12   │  │   O1–O9   │  │ Fin1–Fin6 │            │
│  └─────┬─────┘  └─────┬─────┘  └─────┬─────┘            │
│        │              │              │                  │
│  ┌─────┴──────────────┴──────────────┴─────┐            │
│  │          Foundation layer  F1–F11        │            │
│  │  auth · agents · connectors · router ·   │            │
│  │  events · storage · automation · BI      │            │
│  └─────┬────────────────────────────────────┘            │
└────────┼────────────────────────────────────────────────┘
         │
    ┌────┴─────┬──────────┬──────────┬──────────┐
    │ Postgres │  MinIO   │Activepcs │  Ollama  │
    │  + RLS   │  media   │automation│  local   │
    └──────────┘──────────┘──────────┘──────────┘
         │
    ┌────┴──────────────────────────────────────┐
    │  Wrapped OSS: Frappe HR · ERPNext ·        │
    │  Postiz · Chatwoot · Listmonk              │
    └───────────────────────────────────────────┘
```

### Module boundary rules

1. A module owns its tables. No other module reads them directly.
2. Cross-module reads go through the owning module's exported service functions.
3. Cross-module writes are **events** (F5), never direct calls — this keeps modules independently replaceable.
4. Foundation modules (F1–F11) may be imported by anyone. They import no business module.
5. Every module declares its dependencies in its SRS. `02-module-map.md` must stay acyclic.

Rule 3 is what makes the WRAP modules swappable. If Frappe HR is ever replaced, only the H-module adapters change.

---

## 4. The `org_id` contract

**The single most important architectural rule in this repository.**

v1 serves one organisation. The schema does not assume that.

### Required of every table

```sql
CREATE TABLE example (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id      uuid NOT NULL REFERENCES organisations(id),
  -- ... module columns ...
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX example_org_idx ON example (org_id);

ALTER TABLE example ENABLE ROW LEVEL SECURITY;

CREATE POLICY example_org_isolation ON example
  USING (org_id = current_setting('app.current_org')::uuid);
```

### Non-negotiables

- Every table has `org_id NOT NULL`. No exceptions, including join tables.
- Every table has RLS enabled with an isolation policy.
- Every request sets `app.current_org` in the transaction before any query runs.
- No query filters on `org_id` in application code — **RLS is the enforcement**, so a forgotten filter fails closed rather than leaking.
- Foreign keys never cross an org boundary.

### Why this is not deferrable

Adding tenancy later means: a migration touching every table, backfilling every row, auditing every query in the codebase, and re-testing every feature — against a live business running on the system. Doing it now costs a column and a policy per table.

**Any pull request adding a table without `org_id` and RLS is rejected.**

### What v1 does *not* build

Multi-tenancy readiness is not multi-tenancy. Out of scope for v1: tenant signup, subscription billing, plan limits and metering, client self-serve accounts, per-tenant customisation, tenant-aware backup and restore. These are deliberate, and they are what "BPS-only first" means.

---

## 5. Integration architecture

Three distinct mechanisms — used for different purposes, never interchangeably.

| Mechanism | Purpose | Module |
|---|---|---|
| **MCP connectors** | AI agents reaching external systems | F4 |
| **Automation workflows** | Deterministic multi-step business logic | F11 |
| **Direct API clients** | High-volume or latency-sensitive paths | Per module |

### Choosing between them

- **MCP connector** — when an *agent* decides whether and how to act. Publishing a post it drafted, reading analytics to write a report.
- **Automation workflow** — when the logic is deterministic and an operator should be able to see and modify it. "Invoice overdue 7 days → send WhatsApp reminder → notify manager."
- **Direct client** — when volume or latency makes the above wasteful. WhatsApp webhook ingestion, media uploads.

Getting this wrong is the most likely source of architectural mess: agents wrapping deterministic logic, or workflows making judgement calls. When in doubt, deterministic logic belongs in F11 where a human can read it.

---

## 6. Wrapping open-source systems

WRAP modules run the upstream system in its own container, with BPS owning the UI and the AI layer.

```
BPS UI  →  BPS adapter  →  upstream REST API  →  Frappe HR / ERPNext / …
   ↑            │
   └── agents ──┘   (via MCP connector, F4)
```

### Rules

1. **Never modify upstream source.** Extend through its documented API and app/plugin mechanisms only. A forked upstream cannot be upgraded, and unpatched upstream is a security liability.
2. **The adapter is the only thing that talks to upstream.** One module owns each integration.
3. **Upstream is the system of record for its domain.** Do not duplicate the employee master or the general ledger into BPS tables. Cache for reads; never fork the truth.
4. **Identity is bridged, not duplicated.** SSO from F1 into each upstream system.
5. **Adapters are versioned against upstream API versions**, with an upgrade test before any upstream bump.

Rule 3 has a consequence worth stating plainly: `org_id` isolation applies to BPS-owned tables. Upstream systems have their own tenancy models, and reconciling them is a **multi-tenancy blocker documented per WRAP module** — not a v1 problem, but not one to discover later either.

---

## 7. AI architecture

Detailed in `05-ai-model-strategy.md`; summarised here for completeness.

```
Module needs AI
      ↓
F3 Agent Layer          — runtime, memory, autonomy, approval gates
      ↓
F10 Model Router        — task class → tier → provider, with fallback
      ↓
┌─────────┬──────────────┬─────────────┐
│ T0 local│ T1 cheap API │ T2 frontier │
│ Ollama  │ Qwen/DeepSeek│ Claude/GPT  │
└─────────┴──────────────┴─────────────┘
      ↓
F4 Connectors (MCP)     — tools and skills the agent may use
```

**The safety rule, stated once and inherited everywhere:** no agent spends money, contacts a client, or publishes publicly without explicit human approval. Every module SRS declares its autonomy level against this.

---

## 8. Environments

| Environment | Purpose |
|---|---|
| Local | Docker Compose, seeded fixtures, no production credentials, no live client data |
| Staging | Mirrors production, sandbox credentials for Meta/Razorpay/WhatsApp |
| Production | Single VPS initially; media on MinIO with off-site backup |

### Data protection

- Nightly encrypted Postgres backup, off-site, **with a restore test on a schedule** — an untested backup is not a backup
- Object storage versioning on media buckets
- Secrets in environment files, never committed; `.env.example` documents required keys
- OAuth tokens encrypted at rest in the F4 token vault, never in plaintext columns

---

## 9. Decisions deferred

Recorded so they are re-examined deliberately rather than by accident:

| Decision | Trigger for revisiting |
|---|---|
| Redis | When Postgres-backed queue or cache is measurably the bottleneck |
| Dedicated search | When Postgres FTS quality becomes a user complaint |
| GPU instance for local inference | When F10 telemetry shows T0 volume justifies the monthly cost |
| Read replicas | When reporting queries degrade transactional performance |
| Splitting a module into a service | When one module's scaling profile genuinely diverges — expected: media processing first |
