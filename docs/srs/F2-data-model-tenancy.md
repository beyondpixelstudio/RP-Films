# F2 — Data Model & Tenancy Conventions

| | |
|---|---|
| **Class** | BUILD |
| **Batch** | 1 |
| **Depends on** | F1 |
| **Replaces** | n/a — foundational contract |
| **Build estimate** | 1 week (conventions + tooling), ongoing enforcement |
| **Status** | Draft |

## 1. Purpose & Scope

Defines the schema conventions every module obeys. This document is a **contract, not a feature** — it produces migration tooling, lint rules and CI checks rather than screens.

Its purpose is to make 45 modules built over months by a small team look as if one person designed them in one sitting, and to make multi-tenancy a configuration change rather than a rewrite.

**In scope:** tenancy enforcement, naming, common columns, key strategy, money and time handling, soft deletion, enums, migrations, referential rules, automated compliance checking.

**Not in scope:** module-specific entities — each SRS defines its own.

## 2. Business Context

BPS's data lives across Notion databases, Odoo, Google Sheets and email attachments, with no shared conventions. The same client appears as a Notion `Clients` row, an Odoo contact, and a string in an email subject line, with no reliable join between them.

Consolidation only works if there is one shape of truth. Without conventions fixed up front, 45 modules produce 45 dialects — and the reporting layer (F9), which must read across all of them, becomes impossible to build.

## 3. Personas & Roles

| Persona | Role | What they do here |
|---|---|---|
| Builder | `owner` / `dept_lead` | Writes migrations against these conventions |
| CI | `service` | Enforces them mechanically |

No end-user surface.

## 4. Functional Requirements

### Tenancy

| ID | Requirement | Priority |
|---|---|---|
| FR-F2-01 | Every table except `organisations` shall have `org_id uuid NOT NULL REFERENCES organisations(id)`. | Must |
| FR-F2-02 | Every such table shall have RLS enabled and an isolation policy on `org_id`. | Must |
| FR-F2-03 | Every table shall have an index with `org_id` as the leading column. | Must |
| FR-F2-04 | Application code shall not filter by `org_id` manually — RLS is the enforcement, so an omission fails closed. | Must |
| FR-F2-05 | Every request shall set `app.current_org` inside the transaction before any query runs. | Must |
| FR-F2-06 | Foreign keys shall never cross an org boundary; a CI check shall verify referenced rows share `org_id`. | Must |
| FR-F2-07 | CI shall fail any migration introducing a table without `org_id`, RLS and the leading index. | Must |

### Common columns

| ID | Requirement | Priority |
|---|---|---|
| FR-F2-08 | Every table shall have `id uuid PRIMARY KEY DEFAULT gen_random_uuid()`. | Must |
| FR-F2-09 | Every table shall have `created_at` and `updated_at` as `timestamptz NOT NULL DEFAULT now()`. | Must |
| FR-F2-10 | `updated_at` shall be maintained by trigger, not application code. | Must |
| FR-F2-11 | Business entities shall have `created_by uuid REFERENCES users(id)`; nullable to permit system-created rows. | Should |
| FR-F2-12 | Tables holding recoverable business records shall have `deleted_at timestamptz` and be filtered by a default-excluding view. | Must |

### Types

| ID | Requirement | Priority |
|---|---|---|
| FR-F2-13 | Money shall be stored as `bigint` in the currency's minor unit (paise for INR), never as float or decimal. | Must |
| FR-F2-14 | Every money column shall be accompanied by a `currency char(3)` column defaulting to `'INR'`. | Must |
| FR-F2-15 | All timestamps shall be `timestamptz` stored in UTC; display converts to Asia/Kolkata. | Must |
| FR-F2-16 | Dates without a time component shall use `date`. | Must |
| FR-F2-17 | Enumerated values shall be `text` with a `CHECK` constraint, not Postgres `ENUM` types. | Must |
| FR-F2-18 | Email addresses shall use `citext`. | Must |
| FR-F2-19 | Phone numbers shall be stored E.164-normalised as `text`, with the raw input preserved separately. | Must |
| FR-F2-20 | Embeddings shall use `vector` (pgvector) with the dimension fixed per model and recorded in a metadata column. | Must |

### Naming

| ID | Requirement | Priority |
|---|---|---|
| FR-F2-21 | Tables shall be `snake_case` plural; columns `snake_case` singular. | Must |
| FR-F2-22 | Foreign keys shall be `<singular_referenced_table>_id`. | Must |
| FR-F2-23 | Booleans shall read as assertions — `is_active`, `has_gst`, never `active_flag`. | Must |
| FR-F2-24 | Module-owned tables shall be prefixed with the lowercase module ID where a name would otherwise collide, e.g. `m10_templates`. | Should |
| FR-F2-25 | Indexes shall be named `<table>_<columns>_idx`; constraints `<table>_<rule>_chk`. | Should |

### Migrations

| ID | Requirement | Priority |
|---|---|---|
| FR-F2-26 | All schema changes shall be forward-only, timestamped migration files under version control. | Must |
| FR-F2-27 | Migrations shall never be edited after being applied to production. | Must |
| FR-F2-28 | Destructive changes shall be two-phase: deploy code tolerating both shapes, then remove the old shape in a later migration. | Must |
| FR-F2-29 | Every migration shall be tested against a restored production backup copy before production application. | Must |

## 5. AI & Agent Capabilities

None. F2 defines structure; it does not act.

**One AI-relevant rule:** tables holding client personal data shall be marked with a `data_sensitivity` comment (`public` / `internal` / `personal` / `financial`). F10 uses this to decide whether a field may leave the network for inference — sensitive extraction routes to T0 local models. See `05-ai-model-strategy.md` §8.

## 6. Automations

| Name | Trigger | Steps | Editable |
|---|---|---|---|
| Schema compliance check | Every CI run | Scan schema → assert org_id, RLS, index, naming → fail build on violation | No |
| Cross-org FK audit | Nightly | Verify no FK references a row in another org → alert owner | No |
| Soft-delete purge | Monthly | Hard-delete rows soft-deleted beyond their retention window | Yes — retention is configurable |

## 7. Data Model

F2 owns only the shared primitives.

```sql
-- Applied to every table
CREATE OR REPLACE FUNCTION set_updated_at() RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- The standard table shape
CREATE TABLE <module>_<entity> (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id      uuid NOT NULL REFERENCES organisations(id),
  -- module columns --
  created_by  uuid REFERENCES users(id),
  deleted_at  timestamptz,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX <table>_org_idx ON <table> (org_id);

ALTER TABLE <table> ENABLE ROW LEVEL SECURITY;

CREATE POLICY <table>_org_isolation ON <table>
  USING (org_id = current_setting('app.current_org')::uuid);

CREATE TRIGGER <table>_updated_at
  BEFORE UPDATE ON <table>
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
```

### Money

```sql
amount_minor  bigint NOT NULL,           -- ₹1,250.50 stored as 125050
currency      char(3) NOT NULL DEFAULT 'INR'
```

Never float. Never decimal-as-text. A rounding error in an invoice is a client dispute.

### External references

Where a row mirrors an entity in a wrapped system:

```sql
external_system  text,        -- 'erpnext' | 'frappe_hr' | 'chatwoot' | 'postiz'
external_id      text,
synced_at        timestamptz
```

Per `01-architecture.md` §6.3, upstream remains the system of record. These columns are a **cache pointer, never a fork of the truth**.

## 8. Connectors & Integrations

None directly. F2 defines the `external_system` / `external_id` pattern that every WRAP adapter uses, ensuring wrapped-system records are traceable from BPS in a uniform way.

## 9. Screens & UX Flows

None. F2's deliverables are: Drizzle schema helpers encoding the standard shape, a migration template, CI lint rules, and the nightly cross-org audit job.

The **schema helper is the primary enforcement mechanism** — if the standard shape is the path of least resistance, compliance follows from convenience rather than discipline.

## 10. Non-Functional Requirements

| Aspect | Requirement |
|---|---|
| Performance | RLS adds negligible cost when `org_id` leads every index — FR-F2-03 is a performance requirement, not only a correctness one |
| Security | RLS is the last line of defence; it must hold even if application authorisation is bypassed |
| Availability | Migrations run without downtime; no long-held exclusive locks on large tables |
| Data retention | Soft-delete windows per module, defaulting to 90 days before purge |
| Scale | Designed for single-digit millions of rows per table |

## 11. Compliance

- **DPDP Act 2023** — the `data_sensitivity` marking makes personal data locatable, which is a precondition for honouring deletion and access requests. Without it, "delete everything about this person" cannot be answered.
- **Financial record retention** — Indian statute requires books retained 8 years. Financial tables are exempt from soft-delete purge; enforced by configuration, not convention.

## 12. Guided Mode Requirements

No end-user surface. The builder-facing equivalent:

- **Explain-this:** the migration template carries comments explaining why each standard column exists — this document will not be re-read at 2 a.m., but the template will be.
- **Guardrails:** CI rejects non-compliant migrations with a message naming the specific rule and linking here. Failure must teach, not just block.

## 13. Acceptance Criteria

1. Given a migration adding a table without `org_id`, when CI runs, then the build fails naming FR-F2-01.
2. Given two organisations exist in the database, when a query runs with `app.current_org` set to one, then no row from the other is returned — verified without any application-level filter.
3. Given a money value of ₹1,250.50, when stored and re-read, then it returns exactly ₹1,250.50 with no floating-point drift.
4. Given a row is soft-deleted, when queried through the default view, then it is absent; when queried directly, then it is present with `deleted_at` set.
5. Given a timestamp written from Asia/Kolkata, when read, then it is stored in UTC and displays correctly in IST.
6. Given the nightly audit runs, when any FK references a row in another org, then the owner is alerted.

## 14. Dependencies

| Module | What is needed |
|---|---|
| F1 | `organisations` and `users` tables — F2's conventions reference both |

Downstream: every module.

## 15. Out of Scope / Future

| Excluded | Reasoning |
|---|---|
| Schema-per-tenant isolation | RLS is sufficient and far simpler to operate at this scale |
| Event sourcing | Audit log (F7) provides history without the complexity |
| Multi-currency operations | Structure supports it; only INR is used. Revisit on the first foreign client. |
| Sharding | Wildly premature |

## 16. Open Questions

| # | Question | Blocks | Owner |
|---|---|---|---|
| 1 | Retention period for client media in O4 — storage cost scales directly with the answer | Soft-delete config | Rajesh |
| 2 | Do wedding archives need indefinite retention as a client-facing promise? | Retention policy | Rajesh |
| 3 | Is Asia/Kolkata the only display timezone required? | FR-F2-15 | Rajesh |
