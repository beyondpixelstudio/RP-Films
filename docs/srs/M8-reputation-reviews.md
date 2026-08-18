# M8 — Reputation & Review Management

| | |
|---|---|
| **Class** | BUILD |
| **Batch** | 3 |
| **Depends on** | F1, F2, F3, F4, F5, F10, F11, M1, M7 |
| **Replaces** | Manual review monitoring; Dhanda-class review handling |
| **Build estimate** | 4 weeks |
| **Status** | Draft |

## 1. Purpose & Scope

Monitors, responds to, and generates reviews across Google, Facebook and other platforms for BPS and its clients.

**In scope:** review ingestion, sentiment classification, response drafting and publication, review request campaigns, reputation scoring, competitor rating comparison, escalation of serious complaints.

**Not in scope:** GMB profile management (M7), support ticketing (O8), social comments (M5).

**Reviews and local ranking are inseparable** — review count, rating and response rate are direct inputs to M7's profile score and to local search visibility. M8 is specified separately because review *handling* is a distinct workflow with its own tone requirements and its own risk of causing harm.

## 2. Business Context

Dhanda AI advertises 50,000+ reviews managed across its base of Indian local businesses — evidence that review handling is the recurring operational need for this segment, not a one-off setup task.

BPS's clients — schools, a detailing studio, local businesses — live and die on local reputation. For a school, a visible unanswered complaint during admissions season is materially damaging. Review response is therefore a service BPS can sell alongside GMB management.

**The asymmetry that shapes this module:** a good review response earns modest goodwill; a bad one is screenshotted and shared. Every response is public, permanent and attributed to the client's brand. That is why nothing here publishes without a human.

## 3. Personas & Roles

| Persona | Role | What they do here |
|---|---|---|
| Marketing staff | `member` | Reviews drafts, publishes responses |
| Silu (manager) | `manager` | Approves responses to negative reviews |
| Rajesh | `owner` | Sees reputation across clients |
| Client contact | `client_guest` | Sees rating and trend in M12 |
| Agent | `service` | Classifies, drafts, escalates — never publishes |

## 4. Functional Requirements

### Ingestion & monitoring

| ID | Requirement | Priority |
|---|---|---|
| FR-M8-01 | The system shall ingest reviews from Google Business Profile for every managed location. | Must |
| FR-M8-02 | The system shall ingest Facebook Page recommendations. | Should |
| FR-M8-03 | The system shall support manual entry of reviews from platforms without an API. | Should |
| FR-M8-04 | The system shall detect new reviews within 30 minutes of posting. | Must |
| FR-M8-05 | The system shall detect edited and deleted reviews and record the change. | Must |
| FR-M8-06 | The system shall alert immediately on any review at or below a configurable rating threshold, defaulting to 2 stars. | Must |

### Classification & routing

| ID | Requirement | Priority |
|---|---|---|
| FR-M8-07 | The system shall classify each review by sentiment and by theme — service quality, pricing, staff, timeliness, facilities. | Must |
| FR-M8-08 | The system shall detect reviews describing a serious issue — safety, legal, discrimination, child welfare — and escalate to the owner without drafting a response. | Must |
| FR-M8-09 | The system shall flag suspected fake or spam reviews for human assessment. | Should |
| FR-M8-10 | The system shall aggregate themes over time to show recurring complaint patterns. | Must |

### Response

| ID | Requirement | Priority |
|---|---|---|
| FR-M8-11 | The system shall draft responses matched to sentiment, theme and the client's brand voice. | Must |
| FR-M8-12 | **Every response shall require human approval before publication.** No autonomy level permits autonomous publication. | Must |
| FR-M8-13 | Responses to reviews at or below the alert threshold shall require `manager` or `owner` approval specifically. | Must |
| FR-M8-14 | The system shall never draft a response to a review flagged under FR-M8-08. | Must |
| FR-M8-15 | The system shall publish approved responses to the source platform. | Must |
| FR-M8-16 | The system shall track response rate and median time to respond. | Must |
| FR-M8-17 | The system shall support response templates per theme, editable per client. | Should |
| FR-M8-18 | The system shall warn when a drafted response contains details not present in the review, since a response inventing facts is worse than none. | Must |

### Review generation

| ID | Requirement | Priority |
|---|---|---|
| FR-M8-19 | The system shall run review request campaigns to selected contacts via WhatsApp (M10) or email (M11). | Must |
| FR-M8-20 | The system shall enforce platform review-solicitation rules — no incentives, no selective targeting by expected sentiment, no bulk gating. | Must |
| FR-M8-21 | The system shall exclude contacts already asked within a configurable cooling-off period. | Must |
| FR-M8-22 | The system shall track request-to-review conversion. | Should |
| FR-M8-23 | Review request campaigns shall require human approval before dispatch. | Must |

FR-M8-20 is not optional politeness. **Review gating — soliciting only from customers expected to leave positive reviews — violates Google's policies and can remove a client's reviews entirely.** The system must make the compliant path the only available one.

### Reputation reporting

| ID | Requirement | Priority |
|---|---|---|
| FR-M8-24 | The system shall compute a reputation summary per client — average rating, volume, trend, response rate. | Must |
| FR-M8-25 | The system shall compare a client's rating against local competitors in the same category, where data is available. | Should |
| FR-M8-26 | The system shall feed reputation data into M7's profile score and M12 client reports. | Must |

## 5. AI & Agent Capabilities

### `M8.review_classifier`

| | |
|---|---|
| **Goal** | Classify sentiment, theme and severity |
| **Skills** | `marketing.review_taxonomy` |
| **Connectors** | none |
| **Model tier** | T0 (`classify`) |
| **Autonomy** | `act` — classification is internal and reversible |
| **Approval gates** | none; escalation is additive and never suppresses a review |
| **Token budget** | 1k per review; 200k per month |
| **Failure mode** | Reviews queue unclassified and are still alerted on rating |

### `M8.response_drafter`

| | |
|---|---|
| **Goal** | Draft a review response |
| **Skills** | `marketing.review_response`, `creative.brand_voice` |
| **Connectors** | M1 (read) |
| **Model tier** | T2 (`draft-client-facing`) |
| **Autonomy** | `act_with_approval` |
| **Approval gates** | Always. Reviews ≤ threshold require `manager` or `owner`. |
| **Token budget** | 4k per response; 400k per month |
| **Failure mode** | Manual drafting available |

**Guardrails specific to this agent:**

- It must not invent facts. FR-M8-18's check exists because a plausible-sounding "we have refunded you in full" that never happened converts a complaint into a public dispute.
- It must not admit liability on the client's behalf.
- It must not disclose personal details of the reviewer or of any incident.
- It must not respond at all to serious-issue reviews (FR-M8-14) — those need a person, and possibly a lawyer.

## 6. Automations

| Name | Trigger | Steps | Consequential |
|---|---|---|---|
| Review ingestion | Every 30 min | Poll platforms → detect new/edited → classify → alert if low-rated | No |
| Negative review alert | Review ≤ threshold | Notify manager and account owner immediately with full text | No |
| Serious issue escalation | FR-M8-08 match | Notify owner directly → suppress drafting → create task | No |
| Response publication | Approval granted | Publish to platform → record → update response rate | Yes — publishes publicly |
| Unanswered review reminder | Review unanswered 48 h | Remind account owner → escalate at 96 h | No |
| Review request campaign | Manual, after delivery milestone | Select eligible contacts → **approval** → send via M10/M11 → track | Yes — contacts clients |

## 7. Data Model

```sql
CREATE TABLE m8_reviews (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id           uuid NOT NULL REFERENCES organisations(id),
  company_id       uuid NOT NULL REFERENCES m1_companies(id),
  profile_id       uuid REFERENCES m7_profiles(id),
  platform         text NOT NULL,                -- google|facebook|manual
  external_id      text,
  author_name      text,
  rating           smallint CHECK (rating BETWEEN 1 AND 5),
  body             text,
  posted_at        timestamptz NOT NULL,
  sentiment        text CHECK (sentiment IN ('positive','neutral','negative')),
  themes           text[] NOT NULL DEFAULT '{}',
  severity         text NOT NULL DEFAULT 'normal'
                   CHECK (severity IN ('normal','serious')),
  is_suspected_fake boolean NOT NULL DEFAULT false,
  edited_at        timestamptz,
  deleted_at       timestamptz,
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now(),
  UNIQUE (org_id, platform, external_id)
);

CREATE TABLE m8_responses (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id        uuid NOT NULL REFERENCES organisations(id),
  review_id     uuid NOT NULL REFERENCES m8_reviews(id),
  body          text NOT NULL,
  is_ai_draft   boolean NOT NULL DEFAULT false,
  status        text NOT NULL DEFAULT 'draft'
                CHECK (status IN ('draft','awaiting_approval','published','failed')),
  approved_by   uuid REFERENCES users(id),
  approved_at   timestamptz,
  published_at  timestamptz,
  created_by    uuid REFERENCES users(id),
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE m8_review_requests (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id        uuid NOT NULL REFERENCES organisations(id),
  company_id    uuid NOT NULL REFERENCES m1_companies(id),
  contact_id    uuid REFERENCES m1_contacts(id),
  channel       text NOT NULL CHECK (channel IN ('whatsapp','email')),
  campaign_id   uuid,
  sent_at       timestamptz,
  resulted_in_review_id uuid REFERENCES m8_reviews(id),
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE m8_reputation_snapshots (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id         uuid NOT NULL REFERENCES organisations(id),
  company_id     uuid NOT NULL REFERENCES m1_companies(id),
  snapshot_date  date NOT NULL,
  average_rating numeric(2,1),
  review_count   integer,
  response_rate  numeric(5,2),
  median_response_hours numeric(6,2),
  created_at     timestamptz NOT NULL DEFAULT now(),
  UNIQUE (org_id, company_id, snapshot_date)
);
```

Standard `org_id`, RLS, indexes and triggers per F2.

## 8. Connectors & Integrations

| System | Via | Auth | Failure mode |
|---|---|---|---|
| Google Business Profile | `google.gbp` (F4) | OAuth 2.0 | Ingestion pauses; alert raised; no data loss |
| Meta Graph | `meta.graph` (F4) | OAuth 2.0 | Facebook recommendations unavailable |
| M10 / M11 | Internal | — | Review requests cannot dispatch |

## 9. Screens & UX Flows

| Screen | Purpose |
|---|---|
| **Review inbox** | All reviews across clients, filterable by rating, sentiment, response state |
| Review detail | Full text, classification, drafted response, publish action |
| Reputation dashboard | Per client: rating, trend, volume, response rate, theme breakdown |
| Theme analysis | Recurring complaint patterns over time |
| Review request campaign | Eligible contacts, channel, compliance checks, approval |

The review inbox must sort by **urgency, not recency** — a two-star review from yesterday outranks a five-star from an hour ago.

## 10. Non-Functional Requirements

| Aspect | Requirement |
|---|---|
| Performance | Inbox ≤ 1 s; new review detected within 30 min |
| Security | Responses publish under client identity; approval identity recorded permanently |
| Availability | Ingestion gaps must be backfilled on recovery, never skipped |
| Data retention | Reviews and responses retained indefinitely — they are a public record |
| Scale | 30 client locations, 500 reviews/month |

## 11. Compliance

- **Google review policies** — response content rules; **prohibition on review gating and incentivised reviews**. Violation can strip a client's entire review history.
- **Meta Page policies** — equivalent restrictions on recommendations.
- **Consumer Protection Act 2019 (India)** — misleading representations in responses carry real exposure.
- **DPDP Act 2023** — reviewer names and review content are personal data of third parties.
- **Defamation risk** — responses disputing a reviewer's account carry legal risk; FR-M8-13's manager approval exists partly for this.

## 12. Guided Mode Requirements

- **First-run:** connect a location, ingest history, respond to one review end to end.
- **Explain-this:** "review gating" and why it is prohibited; "response rate" and why it affects ranking; "sentiment vs theme".
- **Next-best-action:** unanswered reviews ordered by rating then age; serious-issue escalations; clients with declining rating trend.
- **Guardrails:** publishing a response requires approval showing the exact public text. Review request campaigns block any attempt to filter recipients by expected sentiment, with an explanation of why. Responses containing facts absent from the review are flagged before approval.

## 13. Acceptance Criteria

1. Given a new 1-star review, when ingestion runs, then the manager and account owner are alerted within 30 minutes with the full text.
2. Given a review describing a safety incident, when classified, then it is escalated to the owner and **no response is drafted**.
3. Given a drafted response, when publication is attempted without approval, then it is blocked.
4. Given a 2-star review, when a `member` attempts approval, then approval is refused and routed to `manager`.
5. Given a drafted response asserting a refund not mentioned in the review, then it is flagged before approval.
6. Given a review request campaign, when the operator attempts to target only contacts expected to leave positive reviews, then it is blocked with an explanation of the policy.
7. Given a contact was asked for a review within the cooling-off period, when a new campaign runs, then they are excluded.
8. Given ingestion was interrupted for six hours, when it resumes, then reviews posted during the gap are backfilled.
9. Given a review is edited by its author, when detected, then the change is recorded and the account owner notified.
10. Given reputation data exists, when M7 computes a profile score, then review count, rating and response rate contribute to it.

## 14. Dependencies

| Module | What is needed |
|---|---|
| F3 | Agent runtime, tiered approval routing |
| F4 | `google.gbp`, `meta.graph` connectors |
| F10 | T2 routing for public-facing responses |
| F11 | Ingestion, alert, escalation automations |
| M1 | Client and contact records |
| M7 | Profile association; score consumes reputation data |
| M10 / M11 | Review request dispatch |

## 15. Out of Scope / Future

| Excluded | Reasoning |
|---|---|
| Review removal requests | Manual platform process; cannot be automated |
| Third-party review platforms (Justdial, Sulekha) | Assess if clients raise them; no APIs assumed |
| Employee reviews (Glassdoor, AmbitionBox) | HR concern, not client reputation |
| Full competitor reputation monitoring | Requires paid data; assess with M6 budget |

## 16. Open Questions

| # | Question | Blocks | Owner |
|---|---|---|---|
| 1 | Is review management currently sold, or would it be a new service line? | Packaging | Rajesh |
| 2 | Who should approve responses to negative reviews for a school client — BPS, or the school? | FR-M8-13 routing | Rajesh |
| 3 | Do any clients have existing negative reviews needing attention at migration? | Rollout | Rajesh |
| 4 | Should clients see their own reputation dashboard in M12, including negative trends? | FR-M8-26 | Rajesh |
