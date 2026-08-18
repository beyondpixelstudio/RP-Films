# M1 — AI CRM

| | |
|---|---|
| **Class** | BUILD |
| **Batch** | 2 |
| **Depends on** | F1, F2, F3, F4, F5, F10, F11 |
| **Replaces** | **Maglo CRM** (Makunai); Notion `Clients` database |
| **Build estimate** | 5 weeks |
| **Status** | Draft |

## 1. Purpose & Scope

The system of record for every person and organisation BPS deals with — prospects, clients, contacts, vendors — and the pipeline through which work is won.

**In scope:** companies, contacts, leads, deal pipeline, activity timeline, notes, tasks, segmentation, lead scoring, retainer tracking, duplicate management, import/migration.

**Not in scope:** proposals and contracts (M3), invoicing (Fin1), project delivery (O1), messaging transport (M10, M11).

**M1 is the spine of the commercial modules.** M2, M3, M9, M10, M11, M12, Fin1 and Fin4 all reference the client record defined here.

## 2. Business Context

BPS currently runs client data in two places, neither adequate.

**Notion `Clients` database** — the working system of record. Schema is minimal: Client name, Email, Phone, Industry, Point of Contact, Notes, Status (Active / Paused / Churned / Prospect). No deal pipeline, no activity history, no revenue tracking. BPS itself is entered as an internal client for self-marketing tracking — a sound practice M1 preserves.

**Maglo CRM (Makunai)** — purchased 18 March 2026 (GLO Plan, PO MG/PO/2026/00019), onboarded from 1 April 2026, subscription active 15 April 2026. Multiple onboarding calls through May and June 2026. This is a paid subscription M1 replaces, alongside Babbler which M10 replaces.

**Known client base**, from Notion and correspondence:

| Client | Type | Engagement |
|---|---|---|
| Aryan Public School | School | Monthly digital marketing retainer |
| Takshashila Residential School | School | Monthly retainer; has had overdue payments |
| Detailing Devils, Bhubaneswar | Local business | Social media management |
| Sagar Business Ventures | Corporate | Event live streaming |
| Resonate Pro | Corporate | Event coverage |
| Assotech / Heartspace | Corporate | Website / project work |
| SPVBS | — | Website development |
| Mech Auto Bros | Local business | 1-year digital marketing, security deposit paid |
| Beyond Pixel Studio (Internal) | Internal | Self-marketing tracking |

Two structural facts shape the design. First, **retainer revenue is the core business** — schools on monthly contracts — so M1 must model recurring engagements, not just one-off deals. Second, **payment behaviour varies materially by client**, and that history should inform tone in reminders (Fin4, M10). Takshashila required a payment-reminder email; that context belongs on the client record.

## 3. Personas & Roles

| Persona | Role | What they do here |
|---|---|---|
| Rajesh | `owner` | Full pipeline visibility, forecasting, client health |
| Silu (manager) | `manager` | Manages accounts, logs activity, chases payment |
| Marketing staff | `member` | Works assigned clients only |
| Department lead | `dept_lead` | Sees clients relevant to their department |
| Agent | `service` | Enriches, scores, summarises, drafts |

## 4. Functional Requirements

### Companies & contacts

| ID | Requirement | Priority |
|---|---|---|
| FR-M1-01 | The system shall maintain company records with name, industry, type, status, address, GSTIN and website. | Must |
| FR-M1-02 | The system shall maintain contact records linked to a company, with role, email, phone, WhatsApp number and preferred channel. | Must |
| FR-M1-03 | The system shall support company status: Prospect, Active, Paused, Churned — preserving the existing Notion vocabulary. | Must |
| FR-M1-04 | The system shall support an internal company flag, so BPS can track itself as a client. | Must |
| FR-M1-05 | The system shall normalise phone numbers to E.164 while retaining raw input, per FR-F2-19. | Must |
| FR-M1-06 | The system shall detect potential duplicates on create and offer merge. | Must |
| FR-M1-07 | The system shall support merging records without losing activity history from either. | Must |
| FR-M1-08 | The system shall support custom fields per company and contact. | Should |

### Engagements & pipeline

| ID | Requirement | Priority |
|---|---|---|
| FR-M1-09 | The system shall model deals with value, stage, expected close date, owner and service line. | Must |
| FR-M1-10 | The system shall support configurable pipeline stages, defaulting to: Enquiry → Qualified → Proposal Sent → Negotiation → Won → Lost. | Must |
| FR-M1-11 | The system shall model **retainers** distinctly from one-off deals, with monthly value, start date, term and renewal date. | Must |
| FR-M1-12 | The system shall record service line per deal — live streaming, wedding, photography, drone, web development, digital marketing, studio rental, editing. | Must |
| FR-M1-13 | The system shall record lost reason on lost deals. | Must |
| FR-M1-14 | The system shall alert on retainer renewal at a configurable lead time, defaulting to 30 days. | Must |
| FR-M1-15 | The system shall compute pipeline value by stage, owner and service line. | Must |
| FR-M1-16 | The system shall track monthly recurring revenue across active retainers. | Must |

### Activity & timeline

| ID | Requirement | Priority |
|---|---|---|
| FR-M1-17 | The system shall maintain a unified activity timeline per company and contact. | Must |
| FR-M1-18 | The timeline shall include emails, WhatsApp conversations, calls, meetings, notes, deal changes, invoices and deliverables. | Must |
| FR-M1-19 | The system shall ingest Gmail threads involving known contacts and attach them to the timeline. | Must |
| FR-M1-20 | The system shall ingest Google Calendar meetings involving known contacts. | Should |
| FR-M1-21 | The system shall support manual activity logging with type, date and outcome. | Must |
| FR-M1-22 | The system shall support tasks with due date, owner and linked record. | Must |
| FR-M1-23 | The system shall flag clients with no activity beyond a configurable threshold. | Must |

### Leads & scoring

| ID | Requirement | Priority |
|---|---|---|
| FR-M1-24 | The system shall accept leads from M2, M10, M11 and manual entry, recording source. | Must |
| FR-M1-25 | The system shall deduplicate incoming leads against existing contacts. | Must |
| FR-M1-26 | The system shall assign leads by configurable rules — service line, department, round-robin. | Must |
| FR-M1-27 | The system shall compute a lead score from engagement signals, fit and recency, showing its reasoning. | Should |
| FR-M1-28 | The system shall track time-to-first-response per lead. | Should |

### Client health & context

| ID | Requirement | Priority |
|---|---|---|
| FR-M1-29 | The system shall surface a client summary: active engagements, revenue to date, outstanding invoices, recent activity, open issues. | Must |
| FR-M1-30 | The system shall record **payment behaviour history**, consumable by Fin4 and M10 for reminder tone selection. | Must |
| FR-M1-31 | The system shall record client contacts' preferred channel and language. | Should |
| FR-M1-32 | The system shall support client tagging and saved segments for targeting. | Must |

### Migration

| ID | Requirement | Priority |
|---|---|---|
| FR-M1-33 | The system shall import companies and contacts from CSV with field mapping and a dry-run preview. | Must |
| FR-M1-34 | The system shall import the Notion `Clients` database preserving all existing fields. | Must |
| FR-M1-35 | The system shall export all CRM data in an open format, so BPS is never locked into its own platform. | Must |

## 5. AI & Agent Capabilities

### `M1.contact_enricher`

| | |
|---|---|
| **Goal** | Extract and normalise contact details from email signatures and correspondence |
| **Skills** | `marketing.contact_extraction` |
| **Connectors** | `google.workspace` (read) |
| **Model tier** | T0 (`extract`) — routed to local inference, as this handles personal data |
| **Autonomy** | `act_with_approval` for writes to existing records; `draft` for new |
| **Approval gates** | Overwriting an existing field requires confirmation |
| **Token budget** | 2k per contact; 300k per month |
| **Failure mode** | Manual entry unaffected |

### `M1.client_briefer`

| | |
|---|---|
| **Goal** | Produce a plain-language client summary before a call or meeting |
| **Skills** | `marketing.account_summary`, `finance.payment_history_reading` |
| **Connectors** | none — reads platform data |
| **Model tier** | T1 (`summarise-short`) |
| **Autonomy** | `suggest` |
| **Approval gates** | none — internal reading only |
| **Token budget** | 10k per brief; 800k per month |
| **Failure mode** | Raw client record remains available |

### `M1.lead_scorer`

| | |
|---|---|
| **Goal** | Score and rank inbound leads |
| **Skills** | `marketing.lead_qualification` |
| **Connectors** | none |
| **Model tier** | T0 (`classify`) |
| **Autonomy** | `act` — scoring is internal, reversible and advisory |
| **Approval gates** | none; a score never auto-rejects a lead |
| **Token budget** | 1k per lead; 200k per month |
| **Failure mode** | Leads queue unscored |

**A score must never silently drop a lead.** Scoring ranks the queue; a human decides what to ignore. In a business where one school retainer is material revenue, an automated dismissal is an expensive failure mode.

## 6. Automations

| Name | Trigger | Steps | Consequential |
|---|---|---|---|
| Lead intake | New lead from any source | Deduplicate → enrich → score → assign → notify → start response timer | No |
| Retainer renewal warning | 30 days before renewal | Compile delivery summary → notify owner → create renewal task | No |
| Dormant client flag | No activity in 60 days | Flag → notify account owner → suggest re-engagement | No |
| Email ingestion | Gmail thread with known contact | Attach to timeline → extract new contacts → flag action items | No |
| Post-meeting follow-up | Calendar meeting ends | Prompt for outcome → create follow-up task | No |

## 7. Data Model

```sql
CREATE TABLE m1_companies (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id         uuid NOT NULL REFERENCES organisations(id),
  name           text NOT NULL,
  industry       text,
  company_type   text,                          -- school|corporate|local_business|individual
  status         text NOT NULL DEFAULT 'Prospect'
                 CHECK (status IN ('Prospect','Active','Paused','Churned')),
  is_internal    boolean NOT NULL DEFAULT false,
  website        text,
  gstin          text,
  address        jsonb,
  notes          text,
  payment_behaviour text CHECK (payment_behaviour IN
                    ('prompt','usually_on_time','slow','repeat_late','unknown')),
  owner_id       uuid REFERENCES users(id),
  tags           text[] NOT NULL DEFAULT '{}',
  custom_fields  jsonb NOT NULL DEFAULT '{}',
  created_by     uuid REFERENCES users(id),
  deleted_at     timestamptz,
  created_at     timestamptz NOT NULL DEFAULT now(),
  updated_at     timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE m1_contacts (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id            uuid NOT NULL REFERENCES organisations(id),
  company_id        uuid REFERENCES m1_companies(id),
  name              text NOT NULL,
  role_title        text,
  email             citext,
  phone_e164        text,
  phone_raw         text,
  whatsapp_e164     text,
  preferred_channel text CHECK (preferred_channel IN ('whatsapp','email','phone')),
  preferred_language text DEFAULT 'en',
  is_primary        boolean NOT NULL DEFAULT false,
  custom_fields     jsonb NOT NULL DEFAULT '{}',
  deleted_at        timestamptz,
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE m1_deals (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id           uuid NOT NULL REFERENCES organisations(id),
  company_id       uuid NOT NULL REFERENCES m1_companies(id),
  name             text NOT NULL,
  deal_kind        text NOT NULL DEFAULT 'project'
                   CHECK (deal_kind IN ('project','retainer')),
  service_line     text NOT NULL,
  stage            text NOT NULL,
  value_minor      bigint NOT NULL DEFAULT 0,
  currency         char(3) NOT NULL DEFAULT 'INR',
  -- retainer fields
  monthly_value_minor bigint,
  term_months      integer,
  starts_on        date,
  renews_on        date,
  -- lifecycle
  expected_close   date,
  closed_at        timestamptz,
  lost_reason      text,
  owner_id         uuid REFERENCES users(id),
  created_by       uuid REFERENCES users(id),
  deleted_at       timestamptz,
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE m1_activities (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id        uuid NOT NULL REFERENCES organisations(id),
  company_id    uuid REFERENCES m1_companies(id),
  contact_id    uuid REFERENCES m1_contacts(id),
  deal_id       uuid REFERENCES m1_deals(id),
  activity_type text NOT NULL,                  -- email|whatsapp|call|meeting|note|
                                                -- deal_change|invoice|deliverable
  subject       text,
  body          text,
  occurred_at   timestamptz NOT NULL,
  source_system text,                           -- gmail|m10|manual|...
  source_ref    text,
  created_by    uuid REFERENCES users(id),
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX m1_activities_timeline_idx
  ON m1_activities (org_id, company_id, occurred_at DESC);

CREATE TABLE m1_leads (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id           uuid NOT NULL REFERENCES organisations(id),
  name             text,
  email            citext,
  phone_e164       text,
  company_name     text,
  source           text NOT NULL,               -- m2_form|meta_lead_ad|m10|referral|manual
  source_detail    jsonb,
  message          text,
  service_interest text,
  score            integer,
  score_reasoning  text,
  status           text NOT NULL DEFAULT 'new'
                   CHECK (status IN ('new','contacted','qualified','converted','rejected')),
  assigned_to      uuid REFERENCES users(id),
  converted_company_id uuid REFERENCES m1_companies(id),
  first_response_at    timestamptz,
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE m1_tasks (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id      uuid NOT NULL REFERENCES organisations(id),
  title       text NOT NULL,
  company_id  uuid REFERENCES m1_companies(id),
  deal_id     uuid REFERENCES m1_deals(id),
  assigned_to uuid REFERENCES users(id),
  due_on      date,
  status      text NOT NULL DEFAULT 'open' CHECK (status IN ('open','done','cancelled')),
  created_by  uuid REFERENCES users(id),
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);
```

Standard `org_id`, RLS, indexes and triggers per F2. Company and contact tables are marked `data_sensitivity: personal` per FR-F2 §5, routing extraction to local T0 inference.

## 8. Connectors & Integrations

| System | Via | Auth | Failure mode |
|---|---|---|---|
| Gmail | `google.workspace` (F4) | OAuth 2.0 | Timeline degrades; manual logging works |
| Google Calendar | `google.workspace` | OAuth 2.0 | Meeting capture lost; no data loss |
| M10 WhatsApp | Internal | — | Conversations unlinked but retained |
| Fin1 Invoicing | Internal | — | Invoice status absent from client summary |
| Notion | One-time export | — | Migration only; not an ongoing sync |

**Notion is migrated once, not synced.** A permanent two-way sync would keep Notion alive as a parallel system of record and defeat the consolidation goal.

## 9. Screens & UX Flows

| Screen | Purpose |
|---|---|
| Company list | Filterable, segmentable, with status and health indicators |
| **Company detail** | Summary, contacts, deals, timeline, invoices, deliverables, notes |
| Contact detail | Profile, channel preferences, activity, linked company |
| **Pipeline board** | Kanban by stage, drag to move, value per column |
| Retainer view | Active retainers, monthly value, renewal dates, MRR total |
| Lead inbox | Scored and ranked, with source and response timer |
| Task list | Own and team tasks by due date |
| Import wizard | CSV/Notion mapping with dry-run preview |

The company detail screen is where staff spend their time. It must answer, without scrolling: what are we doing for them, do they owe us money, when did we last speak, and is anything wrong.

## 10. Non-Functional Requirements

| Aspect | Requirement |
|---|---|
| Performance | Company detail ≤ 800 ms including timeline; list views ≤ 500 ms |
| Security | Client assignment restricts `member` visibility per FR-F1-12; contact data is personal data |
| Availability | CRM unavailability blocks most commercial work — treat as tier-1 |
| Data retention | Client records retained while active plus 8 years (aligns with financial record statute) |
| Scale | 500 companies, 2,000 contacts, 100,000 activities |

## 11. Compliance

- **DPDP Act 2023** — contacts are data principals. Requires stated purpose, retention limit and deletion path. Deletion is reconciled with financial retention by anonymising personal fields while preserving transaction records.
- **GSTIN capture** (FR-M1-01) is required for compliant B2B invoicing in Fin2.
- **Consent** — M1 stores contact details; permission to *message* them is held in M10 and M11. **Presence in the CRM is never treated as consent to market.**

## 12. Guided Mode Requirements

- **First-run:** import the Notion `Clients` database, then walk through one company record explaining each section.
- **Explain-this:** "pipeline stage", "retainer vs project", "lead score", "MRR". Define MRR concretely against BPS's own school retainers rather than abstractly.
- **Next-best-action:** leads unanswered beyond SLA; retainers renewing within 30 days; clients dormant 60 days; deals with a past expected-close date.
- **Guardrails:** merging companies previews exactly what moves and what is lost, and is undoable for 24 hours. Deleting a company with active deals or unpaid invoices is blocked with the reason. Changing a client to Churned prompts to record a reason.

## 13. Acceptance Criteria

1. Given the Notion `Clients` export, when imported, then every company appears with name, industry, status, contact details and notes preserved.
2. Given a new contact whose email matches an existing record, when created, then a duplicate warning offers merge.
3. Given two companies are merged, when complete, then all activities, deals and invoices from both are present on the surviving record.
4. Given a retainer with a renewal date 30 days out, when the automation runs, then the owner is notified with a delivery summary.
5. Given an email arrives from a known contact, when ingestion runs, then it appears on that company's timeline.
6. Given a `member` assigned to two clients, when they open the company list, then only those two are visible.
7. Given a lead arrives from a Meta lead ad, when processed, then it is deduplicated, scored, assigned and the response timer starts.
8. Given a client has a history of late payment, when Fin4 composes a reminder, then it can read `payment_behaviour` from the client record.
9. Given a user requests a full export, when it completes, then all CRM data is present in an open format.
10. Given an agent proposes overwriting an existing phone number, then a human confirms before the write.

## 14. Dependencies

| Module | What is needed |
|---|---|
| F1 | Users, roles, client assignment |
| F3 | Agent runtime, approval for field overwrites |
| F4 | `google.workspace` connector |
| F5 | Notifications for renewals, dormancy, lead assignment |
| F10 | Model routing — local T0 for personal-data extraction |
| F11 | Lead intake and renewal automations |

Downstream: M2, M3, M9, M10, M11, M12, O1, Fin1, Fin4, O8.

## 15. Out of Scope / Future

| Excluded | Reasoning |
|---|---|
| Sales forecasting models | Deal volume is too low for statistical forecasting to beat judgement |
| Email sequences from CRM | M11 owns campaigns; avoid two sending paths |
| Territory management | Single-city operation |
| Quote generation | M3 owns proposals and quotations |
| Two-way Notion sync | Would perpetuate a parallel system of record |

## 16. Open Questions

| # | Question | Blocks | Owner |
|---|---|---|---|
| 1 | What does Maglo CRM cost monthly, and what is the notice period? Determines when M1 must be live. | Build scheduling | Rajesh |
| 2 | Is any data already in Maglo that needs migrating, or is Notion still the real system of record? | Migration scope | Rajesh |
| 3 | Are the pipeline stages listed in FR-M1-10 how BPS actually sells, or should they change? | Pipeline config | Rajesh |
| 4 | Should individual wedding clients be companies or a distinct record type? They behave differently from B2B accounts. | Data model | Rajesh |
| 5 | Which staff should see full pipeline value versus only their assigned clients? | Permission design | Rajesh |
