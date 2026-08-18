# M4 — Content Delivery Pipeline

| | |
|---|---|
| **Class** | BUILD |
| **Batch** | 2 |
| **Depends on** | F1, F2, F3, F4, F5, F6, F10, F11, M1, O4 |
| **Replaces** | The manual Notion content pipeline; per-client Notion page duplication |
| **Build estimate** | 6 weeks |
| **Status** | Draft |

## 1. Purpose & Scope

Encodes how BPS produces and delivers content for retainer clients, from monthly strategy through to published-and-reported. **This is the module that turns the agency's core service into a system.**

**In scope:** monthly content packages, strategy and calendar generation, script drafting, caption and copy drafting, poster/design briefs, production scheduling handoff, internal review, client approval, publishing handoff, performance reporting, content library.

**Not in scope:** publishing transport (M5), shoot logistics (O2), asset storage and media review (O4), the client-facing approval surface (M12 renders it; M4 owns the state).

## 2. Business Context

The pipeline already exists — in Notion, executed by hand, duplicated per client per month. The Detailing Devils engagement is the reference implementation, and its Notion pages map one-to-one onto the stages this module automates:

| Notion page | Pipeline stage |
|---|---|
| Content Calendar — Month 1 Finalized draft (20 Reels + 10 Posters) | Strategy & calendar |
| Batch Draft Scripts — Reels 1 to 10 / 11 to 20 | Scripting |
| Batch Draft Captions & Copy — All 20 Reels + 10 Posters | Copy |
| Design Posters 1 to 10 \| Ratio 3:4 | Design briefs |
| Production Shoot — All 10 Reel | Production |
| Publish & Track — Month 1 Content Rollout | Publish & report |

**The unit of work is the monthly content package** — for Detailing Devils, 20 reels plus 10 posters. BPS runs the same shape for Aryan Public School (`APS AUG REEL - 8`, `APS REEL AUG - 5`) and for itself (`BPS Studio - Reel 1: Free Software vs Paid Setup`, `Poster 3: Commercial Photography Rate Card`).

Individual content items already carry structured fields in Notion — concept, hook, location, format. Example, from Detailing Devils Reel 1: *"Studio Grand Reveal — a cinematic walkthrough of the detailing studio showing the space, equipment, and branding to build first impressions of professionalism."* Example, from BPS Studio Reel 1: `Location: Studio or any client setup — Studio preferred, full control of frame`.

**Why this is the highest-value module:** every retainer client multiplies this work linearly today. Roughly thirty content items per client per month, each passing through six manual stages, with handoffs triggered by someone noticing the previous stage finished. M4 is where the tenth retainer becomes cheaper to serve than the first.

## 3. Personas & Roles

| Persona | Role | What they do here |
|---|---|---|
| Rajesh | `owner` | Approves strategy, resolves escalations |
| Silu (manager) | `manager` | Runs the pipeline, manages client approval |
| Content strategist | `member` (Digital Marketing) | Builds calendars, reviews AI drafts |
| Scriptwriter / copywriter | `member` (Creative) | Writes and refines scripts and captions |
| Designer | `member` (Video Editing & Graphics) | Executes poster and graphic briefs |
| DOP / production | `member` (DOP & Operations) | Shoots scheduled content |
| Client contact | `client_guest` | Reviews and approves via M12 |
| Agent | `service` | Drafts strategy, scripts, captions; never publishes |

## 4. Functional Requirements

### Content packages

| ID | Requirement | Priority |
|---|---|---|
| FR-M4-01 | The system shall model a content package scoped to one client and one period, with a target mix by content type. | Must |
| FR-M4-02 | The system shall support package templates encoding a client's standard monthly deliverable, e.g. 20 reels + 10 posters. | Must |
| FR-M4-03 | The system shall derive the package's default mix from the client's retainer terms in M1. | Should |
| FR-M4-04 | The system shall track package-level progress by stage and flag packages behind schedule. | Must |
| FR-M4-05 | The system shall support duplicating a prior package as the starting point for the next period. | Must |

### Content items & stages

| ID | Requirement | Priority |
|---|---|---|
| FR-M4-06 | The system shall model content items with type (reel, poster, story, carousel, long-form video, blog), concept, hook, format and target platforms. | Must |
| FR-M4-07 | The system shall record production attributes per item — location, talent, props, shot notes, aspect ratio. | Must |
| FR-M4-08 | The system shall move items through defined stages: Idea → Scripted → Copy Drafted → Internal Review → Client Approval → Production → Post-Production → Scheduled → Published → Reported. | Must |
| FR-M4-09 | The system shall permit stage configuration per client, since not every item type needs every stage. | Must |
| FR-M4-10 | The system shall record stage owner, entry time and exit time, to expose where work stalls. | Must |
| FR-M4-11 | The system shall block advancement past Client Approval without recorded approval. | Must |
| FR-M4-12 | The system shall support returning an item to an earlier stage with a reason. | Must |
| FR-M4-13 | The system shall support batch operations across items — batch scripting, batch copy, batch approval submission — mirroring how BPS already works. | Must |

### Strategy & calendar

| ID | Requirement | Priority |
|---|---|---|
| FR-M4-14 | The system shall generate a monthly content strategy from client brief, service lines, past performance and seasonal context. | Must |
| FR-M4-15 | The strategy shall be presented for human review and editing before items are created. | Must |
| FR-M4-16 | The system shall generate a content calendar assigning items to publish dates across platforms. | Must |
| FR-M4-17 | The calendar shall incorporate **Indian festival and seasonal dates** relevant to the client's sector. | Must |
| FR-M4-18 | The calendar shall respect per-platform posting cadence configured per client. | Must |
| FR-M4-19 | The system shall detect calendar conflicts — too many items on one day, gaps beyond a threshold. | Should |

### Drafting

| ID | Requirement | Priority |
|---|---|---|
| FR-M4-20 | The system shall draft scripts for video items, structured as hook, body and call to action. | Must |
| FR-M4-21 | The system shall draft captions and copy per item, customised per target platform. | Must |
| FR-M4-22 | The system shall draft design briefs for poster and graphic items, including ratio and key message. | Must |
| FR-M4-23 | All drafts shall be generated against the client's brand voice held in the F4 skill pack. | Must |
| FR-M4-24 | All AI-generated content shall be visibly marked as such until a human edits or approves it. | Must |
| FR-M4-25 | The system shall support regenerating a draft with human direction. | Must |
| FR-M4-26 | The system shall support batch drafting across a set of items, matching the existing "Reels 1 to 10" working pattern. | Must |
| FR-M4-27 | The system shall support hashtag and alt-text generation per item. | Should |

### Review & approval

| ID | Requirement | Priority |
|---|---|---|
| FR-M4-28 | The system shall support internal review with comments per item before client submission. | Must |
| FR-M4-29 | The system shall submit an approval batch to the client through M12. | Must |
| FR-M4-30 | The system shall record client decisions per item: approved, changes requested, rejected — with comments. | Must |
| FR-M4-31 | The system shall notify the responsible owner when a client requests changes. | Must |
| FR-M4-32 | The system shall track approval turnaround time per client. | Should |
| FR-M4-33 | The system shall support approval reminders to the client after a configurable delay. | Should |

### Production & publishing handoff

| ID | Requirement | Priority |
|---|---|---|
| FR-M4-34 | The system shall create production requirements consumable by O2 — items needing a shoot, grouped by location and date. | Must |
| FR-M4-35 | The system shall link items to their media assets in O4. | Must |
| FR-M4-36 | The system shall hand approved, scheduled items to M5 for publishing. | Must |
| FR-M4-37 | The system shall never publish an item lacking client approval. | Must |
| FR-M4-38 | The system shall record publish outcome and platform post identifiers. | Must |

### Reporting & library

| ID | Requirement | Priority |
|---|---|---|
| FR-M4-39 | The system shall collect per-item performance from M5 after publication. | Must |
| FR-M4-40 | The system shall produce a period report per client showing delivered volume against commitment, and performance by content type. | Must |
| FR-M4-41 | The system shall maintain a searchable content library across all clients and periods. | Must |
| FR-M4-42 | The system shall surface top-performing past content as reference when generating new strategy. | Should |
| FR-M4-43 | The system shall flag when delivered volume falls short of the retainer commitment. | Must |

## 5. AI & Agent Capabilities

### `M4.content_strategist`

| | |
|---|---|
| **Goal** | Produce a monthly content strategy and calendar for a client |
| **Skills** | `marketing.content_strategy`, `marketing.calendar_planning`, `creative.brand_voice`, `marketing.seasonal_calendar_india` |
| **Connectors** | M5 (past performance), M1 (client context) |
| **Model tier** | T2 (`strategy`) |
| **Autonomy** | `draft` |
| **Approval gates** | Strategist reviews and edits before items are created |
| **Token budget** | 60k per package; 3M per month |
| **Failure mode** | Manual calendar construction remains available |

### `M4.script_writer`

| | |
|---|---|
| **Goal** | Draft video scripts as hook / body / CTA |
| **Skills** | `creative.script_structure`, `creative.brand_voice` |
| **Connectors** | none |
| **Model tier** | T2 (`draft-client-facing`) |
| **Autonomy** | `draft` |
| **Approval gates** | Human edit and internal review before client submission |
| **Token budget** | 12k per script; 4M per month |
| **Failure mode** | Manual writing unaffected |

### `M4.copywriter`

| | |
|---|---|
| **Goal** | Draft captions and copy per platform |
| **Skills** | `creative.caption_style`, `creative.brand_voice`, `marketing.platform_conventions` |
| **Connectors** | none |
| **Model tier** | T2 (`draft-client-facing`) |
| **Autonomy** | `draft` |
| **Approval gates** | Human review; client approval before publish |
| **Token budget** | 6k per item; 3M per month |
| **Failure mode** | Manual writing unaffected |

### `M4.performance_analyst`

| | |
|---|---|
| **Goal** | Explain what performed and why, feeding next period's strategy |
| **Skills** | `marketing.performance_interpretation` |
| **Connectors** | M5 (read) |
| **Model tier** | T1 (`summarise-short`) |
| **Autonomy** | `suggest` |
| **Approval gates** | none — internal analysis |
| **Token budget** | 20k per report; 800k per month |
| **Failure mode** | Raw metrics remain available |

**Every drafting agent is `draft`, never `act`.** Content carries a client's brand into public view. FR-M4-24's visible AI marking exists so a reviewer knows what has and has not had human attention — the failure mode being guarded against is a plausible-sounding draft passing review unread on a busy day.

**Semantic caching is disabled for these task classes** (per FR-F10-15). Two clients receiving near-identical captions because a cache hit crossed a similarity threshold would be a serious quality failure in an agency serving competitors in the same sector.

## 6. Automations

| Name | Trigger | Steps | Consequential |
|---|---|---|---|
| Monthly package creation | Configurable date per client | Duplicate template → generate strategy → notify strategist | No |
| Stage handoff | Item stage changes | Notify next owner → create task → update package progress | No |
| Approval submission | Batch marked ready | Compile batch → publish to M12 → notify client → start timer | Yes — client-facing |
| Approval reminder | No client response in N days | Remind client contact → escalate to manager | Yes — client-facing |
| Stalled item alert | Item in one stage beyond threshold | Notify owner → escalate to manager after 48 h | No |
| Production requirements | Items reach Production stage | Group by location and date → create O2 shoot requirement | No |
| Post-publish collection | 7 days after publish | Collect metrics from M5 → attach to item → update report | No |
| Commitment shortfall | 5 days before period end | Compare delivered against retainer commitment → alert manager | No |

## 7. Data Model

```sql
CREATE TABLE m4_packages (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id          uuid NOT NULL REFERENCES organisations(id),
  company_id      uuid NOT NULL REFERENCES m1_companies(id),
  deal_id         uuid REFERENCES m1_deals(id),        -- the retainer
  name            text NOT NULL,                        -- 'Detailing Devils — Month 1'
  period_start    date NOT NULL,
  period_end      date NOT NULL,
  target_mix      jsonb NOT NULL,                       -- {"reel": 20, "poster": 10}
  status          text NOT NULL DEFAULT 'planning'
                  CHECK (status IN ('planning','in_progress','delivered','closed')),
  owner_id        uuid REFERENCES users(id),
  created_from    uuid REFERENCES m4_packages(id),      -- duplicated from
  created_by      uuid REFERENCES users(id),
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE m4_items (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id           uuid NOT NULL REFERENCES organisations(id),
  package_id       uuid NOT NULL REFERENCES m4_packages(id),
  sequence_no      integer,                             -- 'Reel 1', 'Poster 3'
  item_type        text NOT NULL,                       -- reel|poster|story|carousel|
                                                        -- long_video|blog
  title            text NOT NULL,
  concept          text,
  hook             text,
  -- production attributes
  location         text,
  talent           text,
  props            text,
  shot_notes       text,
  aspect_ratio     text,                                -- '3:4', '9:16'
  -- content
  script           text,
  script_is_ai_draft boolean NOT NULL DEFAULT false,
  design_brief     text,
  -- workflow
  stage            text NOT NULL DEFAULT 'idea',
  stage_entered_at timestamptz NOT NULL DEFAULT now(),
  stage_owner_id   uuid REFERENCES users(id),
  target_platforms text[] NOT NULL DEFAULT '{}',
  scheduled_for    timestamptz,
  published_at     timestamptz,
  -- approval
  client_decision  text CHECK (client_decision IN ('approved','changes_requested','rejected')),
  client_comment   text,
  client_decided_at timestamptz,
  client_decided_by uuid,
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX m4_items_package_idx ON m4_items (org_id, package_id, sequence_no);
CREATE INDEX m4_items_stage_idx   ON m4_items (org_id, stage, stage_entered_at);

CREATE TABLE m4_item_copy (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id       uuid NOT NULL REFERENCES organisations(id),
  item_id      uuid NOT NULL REFERENCES m4_items(id),
  platform     text NOT NULL,                           -- instagram|facebook|youtube|linkedin
  caption      text,
  hashtags     text[],
  alt_text     text,
  is_ai_draft  boolean NOT NULL DEFAULT false,
  edited_by    uuid REFERENCES users(id),
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now(),
  UNIQUE (org_id, item_id, platform)
);

CREATE TABLE m4_item_assets (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id      uuid NOT NULL REFERENCES organisations(id),
  item_id     uuid NOT NULL REFERENCES m4_items(id),
  asset_id    uuid NOT NULL,                            -- O4 DAM asset
  role        text NOT NULL,                            -- raw|edited|final|thumbnail
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE m4_stage_history (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id       uuid NOT NULL REFERENCES organisations(id),
  item_id      uuid NOT NULL REFERENCES m4_items(id),
  from_stage   text,
  to_stage     text NOT NULL,
  reason       text,
  moved_by     uuid REFERENCES users(id),
  created_at   timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE m4_approval_batches (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id        uuid NOT NULL REFERENCES organisations(id),
  package_id    uuid NOT NULL REFERENCES m4_packages(id),
  name          text NOT NULL,
  item_ids      uuid[] NOT NULL,
  submitted_at  timestamptz,
  submitted_by  uuid REFERENCES users(id),
  responded_at  timestamptz,
  status        text NOT NULL DEFAULT 'draft'
                CHECK (status IN ('draft','submitted','partially_responded','completed')),
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE m4_item_performance (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id        uuid NOT NULL REFERENCES organisations(id),
  item_id       uuid NOT NULL REFERENCES m4_items(id),
  platform      text NOT NULL,
  external_post_id text,
  impressions   bigint,
  reach         bigint,
  engagements   bigint,
  saves         bigint,
  shares        bigint,
  collected_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (org_id, item_id, platform, collected_at)
);
```

Standard `org_id`, RLS, indexes and triggers per F2.

## 8. Connectors & Integrations

| System | Via | Auth | Failure mode |
|---|---|---|---|
| M5 Social | Internal | — | Items stay Scheduled; no publish, no loss |
| O4 DAM | Internal | — | Items lack assets; workflow continues |
| O2 Production | Internal | — | Shoot requirements created manually |
| M12 Portal | Internal | — | Approval falls back to email |
| M1 CRM | Internal | — | Client context degraded |

## 9. Screens & UX Flows

| Screen | Purpose |
|---|---|
| Package list | All client packages by period, with progress and health |
| **Package board** | Items as cards across stage columns — the primary working view |
| Package calendar | Items by publish date, per platform |
| **Item detail** | Concept, hook, script, copy per platform, production attributes, assets, history |
| Batch drafting | Select items → generate scripts or copy in bulk → review in a list |
| Approval batch builder | Select items → preview as client sees → submit |
| Content library | Cross-client, cross-period search with performance |
| Package report | Delivered vs committed, performance by type |

### The batch view matters more than it looks

BPS already works in batches — "Reels 1 to 10", "All 20 Reels + 10 Posters". A per-item-only interface would be slower than the Notion pages it replaces, and the module would be abandoned. **Batch drafting and batch review are primary interactions, not bulk-edit conveniences.**

## 10. Non-Functional Requirements

| Aspect | Requirement |
|---|---|
| Performance | Package board ≤ 1 s with 50 items; batch draft of 10 items ≤ 60 s |
| Security | Client assignment restricts visibility; client sees only own content via M12 |
| Availability | Pipeline stall blocks delivery — tier-1 for retainer clients |
| Data retention | Content and performance retained indefinitely; the library is a compounding asset |
| Scale | 20 active packages, 600 items/month, 10,000 library items |

## 11. Compliance

- **Platform content policies** — Meta, YouTube and LinkedIn each restrict content types; violations risk client account standing.
- **Client confidentiality** — BPS serves competing clients in the same sector. Strategy and performance must never cross client boundaries, enforced by FR-F3-16 memory scoping and FR-F10-16 cache scoping.
- **Copyright** — music, stock and talent likeness rights are recorded per item. Wedding and event content carries additional consent considerations for identifiable individuals.
- **DPDP Act 2023** — content featuring identifiable people requires a lawful basis; consent evidence is attached at the asset level in O4.

## 12. Guided Mode Requirements

- **First-run:** build one package end to end with a real client, explaining each stage against the Detailing Devils example.
- **Explain-this:** "content package", "stage", "approval batch", "hook". Ground each in a real BPS artefact rather than a definition.
- **Next-best-action:** items stalled beyond threshold; approval batches awaiting client response; packages behind commitment with the period ending; items scheduled without assets attached.
- **Guardrails:** publishing an item without client approval is blocked, not warned. Deleting an item with published performance data is blocked. Advancing a batch to client approval warns about any item still marked as an unedited AI draft.

## 13. Acceptance Criteria

1. Given a client with a 20 reels + 10 posters retainer, when a package is created from template, then the target mix matches and progress tracks against it.
2. Given a package in planning, when the strategist agent runs, then a strategy and calendar are produced for human editing before any item is created.
3. Given ten items selected, when batch script drafting runs, then ten scripts are produced and presented in one reviewable list.
4. Given an AI-drafted caption, when displayed, then it is visibly marked as AI-generated until a human edits or approves it.
5. Given an approval batch is submitted, when the client responds with changes on one item, then only that item returns to an earlier stage and its owner is notified.
6. Given an item lacks client approval, when publishing is attempted, then it is blocked with the reason.
7. Given an item is published, when 7 days pass, then performance metrics are attached automatically.
8. Given a package is 5 days from period end with delivery below commitment, then the manager is alerted with the shortfall.
9. Given content for client A, when the strategist agent runs for client B, then no client A content or performance appears in context.
10. Given a prior package, when duplicated, then structure and template carry over while content and approvals do not.

## 14. Dependencies

| Module | What is needed |
|---|---|
| F3 | Agent runtime, client-scoped memory isolation |
| F4 | Brand voice and caption-style skill packs |
| F6 | Asset storage |
| F10 | T2 routing for client-facing drafting; caching disabled for those classes |
| F11 | Stage handoff, reminder and shortfall automations |
| M1 | Client, retainer terms, commitment volumes |
| O4 | Media assets and review |
| M5 | Publishing and performance collection |
| M12 | Client approval surface |
| O2 | Production scheduling |

## 15. Out of Scope / Future

| Excluded | Reasoning |
|---|---|
| Video editing | Craft tools stay outside the platform; M4 manages workflow, not editing |
| AI image and video generation | Assess separately; quality bar for client-facing brand work is not yet met reliably |
| Direct publishing | M5 owns transport; two publishing paths would diverge |
| Influencer management | No current business need |
| Competitor content monitoring | Interesting, but belongs with M6/M8 rather than here |

## 16. Open Questions

| # | Question | Blocks | Owner |
|---|---|---|---|
| 1 | Is 20 reels + 10 posters the standard package, or does it vary by client? Needed for template design. | FR-M4-02 | Rajesh |
| 2 | Do clients currently approve content formally, or is it informal over WhatsApp? Determines how much of FR-M4-28/33 is new process versus captured process. | Approval design | Rajesh |
| 3 | Which stages genuinely apply to posters versus reels? FR-M4-09 assumes they differ. | Stage config | Rajesh |
| 4 | Who writes scripts today — Rajesh, the creative team, or freelancers? Shapes where AI drafting helps most. | Agent design | Rajesh |
| 5 | Should the seasonal calendar be BPS-wide or per-client-sector? Schools and detailing studios have different relevant dates. | FR-M4-17 | Rajesh |
| 6 | Is content performance currently reported to clients, and in what form? | FR-M4-40 | Rajesh |
