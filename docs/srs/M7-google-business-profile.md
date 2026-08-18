# M7 — Google Business Profile Agent

| | |
|---|---|
| **Class** | BUILD |
| **Batch** | 3 |
| **Depends on** | F1, F2, F3, F4, F5, F10, F11, M1, M8 |
| **Replaces** | Dhanda-class GMB tooling; manual GMB posting |
| **Build estimate** | 5 weeks |
| **Status** | Draft |

## 1. Purpose & Scope

Manages Google Business Profiles for BPS and its clients: profile health scoring, gap analysis, AI-generated posts with images, one-click multi-platform publishing, and a seasonal content library built for the Indian calendar.

**In scope:** profile connection and sync, completeness scoring, actionable insights, post creation and scheduling, photo management, Q&A, local performance tracking, seasonal content library.

**Not in scope:** review response (M8 owns it — GMB reviews flow there), organic web SEO (M6), social publishing transport (M5).

## 2. Business Context

**Reference product: [Dhanda AI](https://dhanda.app/)** — 10,000+ Indian local businesses, 50,000+ reviews managed. Its proposition is worth reproducing because it is correct for this market: a busy local business owner will not learn GMB optimisation. They want a score, a list of what to fix, and one button that posts everywhere.

What is worth copying:

| Dhanda capability | M7 equivalent |
|---|---|
| Profile performance score | FR-M7-06 |
| Gap analysis with actionable insights | FR-M7-08 |
| AI-generated images and captions | `M7.post_composer` |
| Simultaneous FB + Instagram + GMB posting | FR-M7-18 |
| Pre-built festival and promotional library | FR-M7-24 |
| Visibility progress over time | FR-M7-28 |

**BPS is already doing the seasonal part by hand.** Its own WhatsApp account carries templates named `guru_purnima`, `independence_day` and `independence_day_fb`. That is a festival content library being maintained manually, one approved template at a time. FR-M7-24 systematises what is already practice.

**Why this module matters commercially:** BPS's client base — schools, a detailing studio, local businesses in Bhubaneswar — is precisely the segment Dhanda targets. GMB is the highest-leverage channel for a local business and the one most often neglected. M7 is directly resellable, and unlike Dhanda it arrives bundled with the content production BPS already sells.

## 3. Personas & Roles

| Persona | Role | What they do here |
|---|---|---|
| Rajesh | `owner` | Connects profiles, approves posts |
| Marketing staff | `member` | Runs profiles for assigned clients |
| Client contact | `client_guest` | Sees local performance in M12 |
| Agent | `service` | Scores, drafts, recommends — never publishes unapproved |

## 4. Functional Requirements

### Profile management

| ID | Requirement | Priority |
|---|---|---|
| FR-M7-01 | The system shall connect Google Business Profile locations via OAuth and associate each with a client in M1. | Must |
| FR-M7-02 | The system shall support multiple locations per client. | Must |
| FR-M7-03 | The system shall sync profile attributes — name, category, hours, address, phone, website, description, services, attributes. | Must |
| FR-M7-04 | The system shall detect and alert on unauthorised external edits to a managed profile. | Must |
| FR-M7-05 | The system shall support editing profile attributes, with changes gated by approval. | Must |

### Scoring & insights

| ID | Requirement | Priority |
|---|---|---|
| FR-M7-06 | The system shall compute a **profile performance score** from completeness, posting frequency, photo volume and recency, review count and rating, Q&A coverage, and response rate. | Must |
| FR-M7-07 | The score's components and weights shall be visible, so the number is explainable rather than magical. | Must |
| FR-M7-08 | The system shall produce **ranked actionable insights** — each stating the gap, its impact, and the specific action to close it. | Must |
| FR-M7-09 | Insights shall be actionable in one step from where they are displayed. | Must |
| FR-M7-10 | The system shall track score over time and show trend. | Must |
| FR-M7-11 | The system shall compare a client's profile against category norms where data permits. | Should |

### Posts

| ID | Requirement | Priority |
|---|---|---|
| FR-M7-12 | The system shall create GMB posts of each supported type — update, offer, event, product. | Must |
| FR-M7-13 | The system shall draft post copy tailored to the client's business and category. | Must |
| FR-M7-14 | The system shall attach images from the client's asset library (O4) or generate them. | Must |
| FR-M7-15 | The system shall schedule posts and publish on schedule. | Must |
| FR-M7-16 | Every post shall require human approval before publication. | Must |
| FR-M7-17 | The system shall enforce GMB content limits — length, CTA types, image dimensions — before submission. | Must |
| FR-M7-18 | The system shall support **one-click publishing of a single composition to GMB, Facebook and Instagram simultaneously**, adapting format per platform. | Must |
| FR-M7-19 | The system shall track post performance — views, clicks, CTA actions. | Must |
| FR-M7-20 | The system shall alert on posts rejected by Google, with the reason and a correction path. | Must |

### Photos & Q&A

| ID | Requirement | Priority |
|---|---|---|
| FR-M7-21 | The system shall upload and categorise photos — logo, cover, interior, exterior, team, product. | Must |
| FR-M7-22 | The system shall flag profiles with insufficient or stale photos. | Must |
| FR-M7-23 | The system shall monitor Q&A, draft answers, and publish them on approval. | Must |

### Seasonal content library

| ID | Requirement | Priority |
|---|---|---|
| FR-M7-24 | The system shall maintain a **library of Indian festival and seasonal content occasions**, with date, relevance by business category, and template content. | Must |
| FR-M7-25 | The library shall cover national and Odisha-regional observances — including Raja Parba, Rath Yatra, Durga Puja, Kartik Purnima, Odia New Year — alongside pan-Indian festivals. | Must |
| FR-M7-26 | The system shall surface upcoming relevant occasions with sufficient lead time to produce content. | Must |
| FR-M7-27 | The library shall be extensible, so BPS's existing hand-built templates migrate into it. | Must |

### Local performance

| ID | Requirement | Priority |
|---|---|---|
| FR-M7-28 | The system shall track profile views, searches, direction requests, calls and website clicks over time. | Must |
| FR-M7-29 | The system shall distinguish discovery from direct search. | Should |
| FR-M7-30 | The system shall surface the search queries surfacing the profile, where the API provides them. | Should |
| FR-M7-31 | The system shall feed local performance into M12 client reports. | Must |

## 5. AI & Agent Capabilities

### `M7.profile_auditor`

| | |
|---|---|
| **Goal** | Score a profile and produce ranked, actionable gap analysis |
| **Skills** | `marketing.gmb_optimisation`, `marketing.local_seo` |
| **Connectors** | `google.gbp` (read) |
| **Model tier** | T1 (`enrich`); scoring itself is deterministic, not model-derived |
| **Autonomy** | `suggest` |
| **Approval gates** | none — analysis only |
| **Token budget** | 15k per audit; 600k per month |
| **Failure mode** | Score still computes; narrative insight is absent |

**The score is computed, not generated.** A model asked to produce a number would produce a different one each run. The model explains and prioritises; arithmetic produces the score.

### `M7.post_composer`

| | |
|---|---|
| **Goal** | Draft GMB post copy and select or generate imagery |
| **Skills** | `marketing.gmb_post_style`, `creative.brand_voice`, `marketing.seasonal_calendar_india` |
| **Connectors** | O4 (asset read) |
| **Model tier** | T2 (`draft-client-facing`) |
| **Autonomy** | `act_with_approval` |
| **Approval gates** | **Every post approved by a human before publication.** Publishing on a client's profile is publishing publicly under their brand. |
| **Token budget** | 8k per post; 1.5M per month |
| **Failure mode** | Manual composition available |

### `M7.qa_responder`

| | |
|---|---|
| **Goal** | Draft answers to questions asked on a client's profile |
| **Skills** | `marketing.gmb_qa`, `creative.brand_voice` |
| **Connectors** | `google.gbp` (read), O9 (knowledge base) |
| **Model tier** | T2 (`draft-client-facing`) |
| **Autonomy** | `act_with_approval` |
| **Approval gates** | Human approves before publication |
| **Token budget** | 4k per answer; 300k per month |
| **Failure mode** | Questions queue unanswered and are flagged |

**On AI image generation (FR-M7-14):** generated imagery is acceptable for generic seasonal greetings. It is **not** acceptable as a depiction of a real client's premises, staff, products or work — that would misrepresent the business. The distinction is enforced by requiring generated images to be labelled at review, so the approver knows what they are approving.

## 6. Automations

| Name | Trigger | Steps | Consequential |
|---|---|---|---|
| Weekly profile audit | Weekly per client | Sync → score → generate insights → notify if score dropped | No |
| Unauthorised edit alert | Sync detects external change | Compare → alert account owner with the diff | No |
| Seasonal occasion lead | 10 days before a relevant occasion | Identify eligible clients → draft posts → queue for approval | No |
| Post publication | Scheduled time reached | Verify approval → publish to selected platforms → record IDs | Yes — publishes publicly |
| Stale profile flag | No post in 30 days | Flag → suggest content from seasonal library | No |
| Post rejection handling | Google rejects a post | Alert owner with reason and correction path | No |

## 7. Data Model

```sql
CREATE TABLE m7_profiles (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id          uuid NOT NULL REFERENCES organisations(id),
  company_id      uuid NOT NULL REFERENCES m1_companies(id),
  location_id     text NOT NULL,                -- Google location resource
  credential_id   uuid REFERENCES f4_credentials(id),
  title           text NOT NULL,
  primary_category text,
  address         jsonb,
  phone           text,
  website         text,
  hours           jsonb,
  attributes      jsonb,
  is_verified     boolean,
  synced_at       timestamptz,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now(),
  UNIQUE (org_id, location_id)
);

CREATE TABLE m7_scores (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id            uuid NOT NULL REFERENCES organisations(id),
  profile_id        uuid NOT NULL REFERENCES m7_profiles(id),
  score             integer NOT NULL CHECK (score BETWEEN 0 AND 100),
  components        jsonb NOT NULL,             -- per-factor scores and weights
  computed_at       timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE m7_insights (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id        uuid NOT NULL REFERENCES organisations(id),
  profile_id    uuid NOT NULL REFERENCES m7_profiles(id),
  insight_key   text NOT NULL,
  title         text NOT NULL,
  detail        text NOT NULL,
  impact        text NOT NULL CHECK (impact IN ('high','medium','low')),
  action_type   text,                           -- add_photos|create_post|answer_qa|...
  status        text NOT NULL DEFAULT 'open'
                CHECK (status IN ('open','actioned','dismissed')),
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE m7_posts (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id          uuid NOT NULL REFERENCES organisations(id),
  profile_id      uuid NOT NULL REFERENCES m7_profiles(id),
  content_item_id uuid,                         -- M4 link when part of a package
  post_type       text NOT NULL CHECK (post_type IN ('update','offer','event','product')),
  summary         text NOT NULL,
  cta_type        text,
  cta_url         text,
  event_start     timestamptz,
  event_end       timestamptz,
  asset_ids       uuid[] NOT NULL DEFAULT '{}',
  image_is_generated boolean NOT NULL DEFAULT false,
  is_ai_draft     boolean NOT NULL DEFAULT false,
  also_publish_to text[] NOT NULL DEFAULT '{}', -- facebook|instagram
  status          text NOT NULL DEFAULT 'draft'
                  CHECK (status IN ('draft','awaiting_approval','scheduled',
                                    'published','rejected','failed')),
  approved_by     uuid REFERENCES users(id),
  scheduled_for   timestamptz,
  published_at    timestamptz,
  external_post_id text,
  rejection_reason text,
  created_by      uuid REFERENCES users(id),
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE m7_occasions (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id            uuid NOT NULL REFERENCES organisations(id),
  occasion_key      text NOT NULL,              -- 'raja_parba', 'independence_day'
  name              text NOT NULL,
  observed_on       date NOT NULL,
  is_recurring      boolean NOT NULL DEFAULT true,
  region            text,                       -- 'india' | 'odisha'
  relevant_categories text[] NOT NULL DEFAULT '{}',
  template_copy     text,
  template_asset_ids uuid[] NOT NULL DEFAULT '{}',
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now(),
  UNIQUE (org_id, occasion_key, observed_on)
);

CREATE TABLE m7_performance (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id            uuid NOT NULL REFERENCES organisations(id),
  profile_id        uuid NOT NULL REFERENCES m7_profiles(id),
  period_date       date NOT NULL,
  views_search      bigint,
  views_maps        bigint,
  searches_direct   bigint,
  searches_discovery bigint,
  actions_website   bigint,
  actions_directions bigint,
  actions_phone     bigint,
  collected_at      timestamptz NOT NULL DEFAULT now(),
  UNIQUE (org_id, profile_id, period_date)
);
```

Standard `org_id`, RLS, indexes and triggers per F2.

## 8. Connectors & Integrations

| System | Via | Auth | Rate limits | Failure mode |
|---|---|---|---|---|
| Google Business Profile API | `google.gbp` (F4) | OAuth 2.0 | Quota per project; conservative daily caps | Queue and retry; alert on sustained failure |
| Meta Graph | `meta.graph` (F4) | OAuth 2.0 | Per-app | Cross-post fails independently; GMB post still succeeds |
| O4 DAM | Internal | — | — | Post without image, or block if image required |

**Cross-posting must fail independently per platform.** A Facebook API error must not prevent the GMB post it was bundled with. Partial success is reported explicitly rather than treated as failure.

## 9. Screens & UX Flows

| Screen | Purpose |
|---|---|
| **Profile dashboard** | Score, trend, ranked insights, recent posts, performance |
| Profile list | All managed profiles with score and health at a glance |
| Post composer | Type, copy, image, CTA, cross-post targets, schedule |
| Post calendar | Scheduled and published posts per profile |
| **Seasonal calendar** | Upcoming occasions with lead time and eligible clients |
| Q&A inbox | Open questions with drafted answers |
| Photo manager | Photos by category with staleness indicators |
| Performance | Views, searches, actions over time |

The profile dashboard should answer, in one screen and without scrolling: how healthy is this profile, what are the top three things to fix, and when did we last post.

## 10. Non-Functional Requirements

| Aspect | Requirement |
|---|---|
| Performance | Dashboard ≤ 1.5 s; score computation ≤ 5 s |
| Security | Client GMB access is delegated authority — scope minimally and revoke on offboarding |
| Availability | Post scheduling must survive restarts; missed publish windows alert rather than silently skip |
| Data retention | Performance data 24 months for year-on-year comparison |
| Scale | 30 profiles, 200 posts/month |

## 11. Compliance

- **Google Business Profile guidelines** — prohibited content, review-solicitation rules, accurate representation. Violations risk profile suspension, which for a local business is severe.
- **Accurate representation** — generated imagery must never depict a real business's premises or work falsely. Enforced at review by labelling generated images.
- **Delegated access** — BPS acts on client profiles under delegated authority. FR-F4-18 revocation on staff offboarding is a contractual obligation to those clients.
- **DPDP Act 2023** — Q&A and review content may contain personal data.

## 12. Guided Mode Requirements

- **First-run:** connect a profile, run the first audit, action the highest-impact insight. Demonstrating a score improvement in the first session is what makes the module stick.
- **Explain-this:** "profile score", "discovery vs direct search", "GMB post type". A local business owner has no reason to know these; the module's value depends on explaining them well.
- **Next-best-action:** high-impact open insights; profiles with no post in 30 days; unanswered questions; upcoming seasonal occasions with eligible clients.
- **Guardrails:** publishing requires approval showing the exact rendered post per platform. Editing profile attributes warns that changes are visible publicly and may trigger Google re-verification. Generated images are labelled at approval.

## 13. Acceptance Criteria

1. Given a connected profile, when an audit runs, then a 0–100 score is produced with visible component weights.
2. Given the same profile data, when the audit runs twice, then the score is identical — it is computed, not generated.
3. Given a profile missing photos, when insights are produced, then a photo insight appears ranked by impact with a one-step action.
4. Given a drafted post, when publication is attempted without approval, then it is blocked.
5. Given a post with cross-post targets, when published and Facebook fails, then the GMB post still succeeds and partial failure is reported.
6. Given a post exceeding GMB length limits, when submitted, then it is rejected client-side with the specific limit named.
7. Given Raja Parba is 10 days away, when the seasonal automation runs, then eligible clients are identified and drafts queued.
8. Given a profile is edited outside the platform, when sync runs, then the account owner is alerted with the diff.
9. Given Google rejects a published post, then the owner is alerted with the reason and a correction path.
10. Given a generated image is attached, when the approver reviews, then it is clearly labelled as generated.

## 14. Dependencies

| Module | What is needed |
|---|---|
| F3 | Agent runtime, approval gates |
| F4 | `google.gbp` and `meta.graph` connectors |
| F10 | T2 routing for client-facing copy |
| F11 | Audit, seasonal and publication automations |
| M1 | Client association |
| M8 | Review handling — GMB reviews route there |
| O4 | Asset library |
| M12 | Client-visible local performance |

## 15. Out of Scope / Future

| Excluded | Reasoning |
|---|---|
| Review response | M8 owns it; splitting review handling across two modules would fragment it |
| Local rank grid tracking | Requires paid third-party data; assess with M6's data budget |
| GMB messaging | Low adoption in this market; WhatsApp is the channel that matters |
| Bulk profile management for chains | No current client has multiple locations |
| Google Ads integration | M9 owns advertising |

## 16. Open Questions

| # | Question | Blocks | Owner |
|---|---|---|---|
| 1 | Which clients currently have GMB profiles BPS manages, and is access already delegated? | Rollout | Rajesh |
| 2 | Is GMB management currently sold as a service line, or bundled into the digital marketing retainer? | Pricing/packaging | Rajesh |
| 3 | Which Odisha-regional observances matter most to the current client base? FR-M7-25 lists an assumed set. | Seasonal library | Rajesh |
| 4 | Should the seasonal library be shared across clients or per-client? Sharing risks two clients posting similar festival creative. | FR-M7-24 | Rajesh |
| 5 | Is AI image generation acceptable to clients at all, or should imagery always be BPS-produced? | FR-M7-14 | Rajesh |
