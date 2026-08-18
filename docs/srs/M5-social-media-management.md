# M5 — Social Media Management

| | |
|---|---|
| **Class** | BUILD (UX + AI) + WRAP (Postiz transport) |
| **Batch** | 3 |
| **Depends on** | F1, F2, F3, F4, F5, F6, F10, F11, M1, M4, O4 |
| **Replaces** | Buffer / Hootsuite class tooling; manual per-platform posting |
| **Build estimate** | 6 weeks |
| **Status** | Draft |

## 1. Purpose & Scope

Publishing and engagement across every social channel BPS manages, for itself and its clients.

**In scope:** channel connection, posting-slot schedules and queues, an ideas board, per-channel composition, approval, publishing, engagement inbox, analytics, link-in-bio.

**Not in scope:** content strategy and production (M4 owns the pipeline; M5 is transport and engagement), GMB (M7), WhatsApp (M10), paid advertising (M9).

**The division with M4 matters.** M4 decides *what* gets made and carries it through approval. M5 gets it published and reports what happened. Blurring them would produce two competing content systems.

## 2. Business Context

**Reference product: [Buffer](https://buffer.com/)** — its model suits an agency better than a calendar-first tool. Buffer's insight is the **posting schedule**: define when a channel posts (e.g. Instagram at 09:00 and 18:00 on weekdays), then queue content into slots rather than picking a datetime per post. For BPS, publishing 30 items a month per client across four platforms, that difference is hours of work.

What is worth copying:

| Buffer concept | M5 equivalent |
|---|---|
| Channels with per-channel posting schedules | FR-M5-05 |
| Queue — content fills the next available slot | FR-M5-08 |
| Ideas board — capture before committing | FR-M5-13 |
| Per-channel customisation of one composition | FR-M5-16 |
| Engagement inbox | FR-M5-24 |
| Analytics per channel and post | FR-M5-28 |
| Start Page / link-in-bio | FR-M5-33 |

BPS currently manages social for Detailing Devils, Aryan Public School, Takshashila and itself, publishing to Instagram, Facebook, YouTube and LinkedIn. The Detailing Devils "Publish & Track — Month 1 Content Rollout" Notion page is the manual version of this module.

**On Postiz:** used as publishing transport only. It is AGPL v3, run as a separate unmodified service behind an API — see [`docs/04-licensing.md`](../04-licensing.md). That containment is why FR-M5-04 requires a transport abstraction: if legal review objects before resale, the transport can be swapped for direct platform API clients without touching the rest of the module.

## 3. Personas & Roles

| Persona | Role | What they do here |
|---|---|---|
| Marketing staff | `member` | Queues content, handles engagement |
| Silu (manager) | `manager` | Approves, oversees schedules |
| Rajesh | `owner` | Connects channels, sees cross-client performance |
| Client contact | `client_guest` | Sees performance in M12 |
| Agent | `service` | Drafts replies, classifies engagement, never publishes unapproved |

## 4. Functional Requirements

### Channels

| ID | Requirement | Priority |
|---|---|---|
| FR-M5-01 | The system shall connect channels for Instagram, Facebook Page, YouTube, LinkedIn (personal and page), X, Threads and Pinterest. | Must |
| FR-M5-02 | Each channel shall be associated with a client in M1, or with BPS itself. | Must |
| FR-M5-03 | The system shall record per-channel capabilities and constraints — media types, caption limits, aspect ratios, posting frequency caps. | Must |
| FR-M5-04 | The system shall route publishing through a **transport abstraction**, so the underlying provider can be replaced without changing module logic. | Must |
| FR-M5-05 | The system shall support a **posting schedule per channel** — named time slots per weekday. | Must |
| FR-M5-06 | The system shall alert when a channel's connection expires or fails. | Must |
| FR-M5-07 | The system shall support both BPS-owned and client-owned channel credentials. | Must |

### Queue & scheduling

| ID | Requirement | Priority |
|---|---|---|
| FR-M5-08 | The system shall maintain a **queue per channel**, assigning each queued post to the next available slot. | Must |
| FR-M5-09 | The system shall support reordering the queue by drag, recomputing slot assignment. | Must |
| FR-M5-10 | The system shall support pinning a post to a specific datetime, overriding slot assignment. | Must |
| FR-M5-11 | The system shall show a calendar view across all channels for a client. | Must |
| FR-M5-12 | The system shall warn when a queue will empty within a configurable horizon. | Must |

### Ideas & composition

| ID | Requirement | Priority |
|---|---|---|
| FR-M5-13 | The system shall provide an **ideas board** for capturing content concepts before scheduling. | Should |
| FR-M5-14 | Ideas shall be promotable to M4 content items or directly to queued posts. | Should |
| FR-M5-15 | The system shall compose a post once and target multiple channels. | Must |
| FR-M5-16 | The system shall support **per-channel customisation** of a shared composition — caption, hashtags, crop, first comment. | Must |
| FR-M5-17 | The system shall validate per-channel constraints before queueing and state the specific violation. | Must |
| FR-M5-18 | The system shall render an accurate per-channel preview. | Must |
| FR-M5-19 | The system shall support first-comment hashtag placement for Instagram. | Should |
| FR-M5-20 | The system shall pull approved content and assets directly from M4 and O4. | Must |

### Publishing

| ID | Requirement | Priority |
|---|---|---|
| FR-M5-21 | The system shall publish queued posts at their slot time. | Must |
| FR-M5-22 | The system shall never publish content originating from M4 that lacks client approval. | Must |
| FR-M5-23 | The system shall retry transient publish failures with idempotency, and alert on permanent failure with the platform's reason. | Must |

### Engagement

| ID | Requirement | Priority |
|---|---|---|
| FR-M5-24 | The system shall provide an **engagement inbox** of comments, mentions and DMs across connected channels, where the platform API permits. | Must |
| FR-M5-25 | The system shall support replying from the inbox, with approval for client-owned channels. | Must |
| FR-M5-26 | The system shall classify engagement sentiment and flag items needing attention. | Should |
| FR-M5-27 | The system shall route items indicating a complaint to O8, and a sales enquiry to M1 as a lead. | Should |

### Analytics

| ID | Requirement | Priority |
|---|---|---|
| FR-M5-28 | The system shall collect per-post metrics — impressions, reach, engagement, saves, shares, video views. | Must |
| FR-M5-29 | The system shall collect per-channel metrics — follower count and growth, profile views. | Must |
| FR-M5-30 | The system shall feed per-item performance back to M4. | Must |
| FR-M5-31 | The system shall identify best-performing posting times per channel from observed data. | Should |
| FR-M5-32 | The system shall feed channel performance into M12 client reports. | Must |

### Link-in-bio

| ID | Requirement | Priority |
|---|---|---|
| FR-M5-33 | The system shall host a link-in-bio page per client with configurable links and branding. | Should |
| FR-M5-34 | The system shall track link-in-bio clicks per link. | Should |

## 5. AI & Agent Capabilities

### `M5.engagement_responder`

| | |
|---|---|
| **Goal** | Draft replies to comments and messages |
| **Skills** | `creative.brand_voice`, `marketing.engagement_tone` |
| **Connectors** | M1 (read) |
| **Model tier** | T2 (`draft-client-facing`) |
| **Autonomy** | `draft` |
| **Approval gates** | Staff sends. On client-owned channels, approval is required per FR-M5-25. |
| **Token budget** | 4k per reply; 1M per month |
| **Failure mode** | Inbox works without drafts |

### `M5.engagement_classifier`

| | |
|---|---|
| **Goal** | Classify sentiment and intent; route complaints and leads |
| **Skills** | `marketing.engagement_taxonomy` |
| **Connectors** | none |
| **Model tier** | T0 (`classify`) |
| **Autonomy** | `act` — routing is internal and reversible |
| **Approval gates** | none |
| **Token budget** | 1k per item; 400k per month |
| **Failure mode** | Items remain unclassified in the inbox |

### `M5.timing_analyst`

| | |
|---|---|
| **Goal** | Recommend posting-slot changes from observed performance |
| **Skills** | `marketing.performance_interpretation` |
| **Connectors** | none |
| **Model tier** | T1 |
| **Autonomy** | `suggest` — **cannot change a schedule** |
| **Approval gates** | none; recommendations only |
| **Token budget** | 10k per analysis; 200k per month |
| **Failure mode** | Schedules unchanged |

**Publishing on a client's channel is publishing publicly under their brand.** No agent holds publish capability in this module; the publish action is triggered by the schedule against content a human approved.

## 6. Automations

| Name | Trigger | Steps | Consequential |
|---|---|---|---|
| Slot publish | Slot time reached | Verify approval → publish via transport → record ID → notify on failure | Yes — publishes publicly |
| Metrics collection | 24 h and 7 days after publish | Collect → store → feed M4 | No |
| Queue empty warning | Queue below horizon | Alert account owner → suggest items from M4 | No |
| Channel token expiry | 7 days before expiry | Alert owner naming the channel and client | No |
| Engagement triage | New engagement item | Classify → route complaints to O8, leads to M1 → notify | No |

## 7. Data Model

```sql
CREATE TABLE m5_channels (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id         uuid NOT NULL REFERENCES organisations(id),
  company_id     uuid REFERENCES m1_companies(id),   -- null = BPS's own
  platform       text NOT NULL,                      -- instagram|facebook|youtube|linkedin|...
  external_id    text NOT NULL,
  handle         text NOT NULL,
  display_name   text,
  credential_id  uuid REFERENCES f4_credentials(id),
  credential_owner text NOT NULL DEFAULT 'bps'
                 CHECK (credential_owner IN ('bps','client')),
  capabilities   jsonb NOT NULL DEFAULT '{}',
  transport      text NOT NULL DEFAULT 'postiz',
  status         text NOT NULL DEFAULT 'active'
                 CHECK (status IN ('active','expired','failed','disconnected')),
  created_at     timestamptz NOT NULL DEFAULT now(),
  updated_at     timestamptz NOT NULL DEFAULT now(),
  UNIQUE (org_id, platform, external_id)
);

CREATE TABLE m5_posting_slots (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id      uuid NOT NULL REFERENCES organisations(id),
  channel_id  uuid NOT NULL REFERENCES m5_channels(id),
  weekday     smallint NOT NULL CHECK (weekday BETWEEN 0 AND 6),
  time_of_day time NOT NULL,
  is_active   boolean NOT NULL DEFAULT true,
  UNIQUE (org_id, channel_id, weekday, time_of_day)
);

CREATE TABLE m5_posts (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id            uuid NOT NULL REFERENCES organisations(id),
  channel_id        uuid NOT NULL REFERENCES m5_channels(id),
  content_item_id   uuid,                        -- M4 item, when from the pipeline
  caption           text,
  hashtags          text[],
  first_comment     text,
  asset_ids         uuid[] NOT NULL DEFAULT '{}',
  queue_position    integer,
  scheduled_for     timestamptz,
  is_pinned_time    boolean NOT NULL DEFAULT false,
  status            text NOT NULL DEFAULT 'queued'
                    CHECK (status IN ('idea','queued','scheduled','publishing',
                                      'published','failed','cancelled')),
  requires_client_approval boolean NOT NULL DEFAULT false,
  published_at      timestamptz,
  external_post_id  text,
  external_url      text,
  failure_reason    text,
  created_by        uuid REFERENCES users(id),
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX m5_posts_queue_idx ON m5_posts (org_id, channel_id, queue_position);
CREATE INDEX m5_posts_schedule_idx ON m5_posts (org_id, scheduled_for)
  WHERE status IN ('queued','scheduled');

CREATE TABLE m5_ideas (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id      uuid NOT NULL REFERENCES organisations(id),
  company_id  uuid REFERENCES m1_companies(id),
  title       text NOT NULL,
  note        text,
  asset_ids   uuid[] NOT NULL DEFAULT '{}',
  promoted_to uuid,                              -- m4_items or m5_posts
  created_by  uuid REFERENCES users(id),
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE m5_engagement (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id         uuid NOT NULL REFERENCES organisations(id),
  channel_id     uuid NOT NULL REFERENCES m5_channels(id),
  post_id        uuid REFERENCES m5_posts(id),
  external_id    text NOT NULL,
  kind           text NOT NULL CHECK (kind IN ('comment','mention','dm','reply')),
  author_handle  text,
  body           text,
  sentiment      text CHECK (sentiment IN ('positive','neutral','negative')),
  intent         text,                           -- complaint|enquiry|praise|spam
  status         text NOT NULL DEFAULT 'open'
                 CHECK (status IN ('open','replied','ignored','routed')),
  assigned_to    uuid REFERENCES users(id),
  occurred_at    timestamptz NOT NULL,
  created_at     timestamptz NOT NULL DEFAULT now(),
  UNIQUE (org_id, channel_id, external_id)
);

CREATE TABLE m5_post_metrics (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id        uuid NOT NULL REFERENCES organisations(id),
  post_id       uuid NOT NULL REFERENCES m5_posts(id),
  impressions   bigint,
  reach         bigint,
  engagements   bigint,
  likes         bigint,
  comments      bigint,
  shares        bigint,
  saves         bigint,
  video_views   bigint,
  collected_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE m5_channel_metrics (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id         uuid NOT NULL REFERENCES organisations(id),
  channel_id     uuid NOT NULL REFERENCES m5_channels(id),
  period_date    date NOT NULL,
  followers      bigint,
  follower_delta bigint,
  profile_views  bigint,
  collected_at   timestamptz NOT NULL DEFAULT now(),
  UNIQUE (org_id, channel_id, period_date)
);
```

Standard `org_id`, RLS, indexes and triggers per F2.

## 8. Connectors & Integrations

| System | Via | Auth | Failure mode |
|---|---|---|---|
| Postiz | `postiz` (F4) | API key | Publishing halts; queue preserved; alert raised |
| Meta Graph | `meta.graph` (F4) | OAuth 2.0 | Used directly for Instagram/Facebook insights Postiz does not expose |
| YouTube Data | `youtube.data` (F4) | OAuth 2.0 | Video publishing and analytics |
| LinkedIn Marketing | `linkedin.marketing` (F4) | OAuth 2.0 | Page publishing |
| O4 DAM | Internal | — | Post blocked when required media is unavailable |

**The transport abstraction (FR-M5-04) is a licensing requirement as much as an architectural one.** Postiz is AGPL; the abstraction is what keeps replacing it a contained change rather than a rewrite.

## 9. Screens & UX Flows

| Screen | Purpose |
|---|---|
| **Queue** | Per-channel queue with slot assignment, drag to reorder |
| **Calendar** | All channels for a client, by date |
| Composer | Compose once, customise per channel, preview each |
| Ideas board | Captured concepts, promotable |
| **Engagement inbox** | Comments, mentions, DMs with sentiment and assignment |
| Channel settings | Connections, posting schedules, credential ownership |
| Analytics | Per channel and post, with best-time insight |
| Link-in-bio editor | Links, ordering, branding |

The queue is the primary working surface. Buffer's insight — **content flows into slots rather than being individually scheduled** — is what makes 120 posts a month across four clients manageable.

## 10. Non-Functional Requirements

| Aspect | Requirement |
|---|---|
| Performance | Queue view ≤ 1 s; composer preview ≤ 500 ms |
| Security | Client-owned credentials isolated per FR-M5-07; publishing scoped to assigned clients |
| Availability | Missed slot must alert, never silently skip — an unpublished client post is a service failure |
| Data retention | Post metrics 24 months; engagement 12 months |
| Scale | 40 channels, 600 posts/month, 5,000 engagement items/month |

## 11. Compliance

- **Platform terms** — Meta, YouTube, LinkedIn and X each restrict automated posting and API use; violation risks losing client channel access.
- **Rate and frequency caps** — exceeding platform posting limits can trigger throttling on a client's account.
- **Disclosure** — sponsored or promotional content must be marked per platform rules and Indian advertising guidelines.
- **DPDP Act 2023** — engagement content contains personal data of third parties who never contracted with BPS; retain minimally.

## 12. Guided Mode Requirements

- **First-run:** connect one channel, define its posting schedule, queue one post. The schedule concept must be taught first — everything else depends on it.
- **Explain-this:** "posting slot", "queue", "reach vs impressions", "first comment". Reach versus impressions confuses almost everyone and appears in every client report.
- **Next-best-action:** queues emptying; channels with expiring tokens; unanswered engagement beyond SLA; failed publishes.
- **Guardrails:** publishing M4 content without client approval is blocked. Deleting a posting slot warns which queued posts are displaced. Disconnecting a channel warns what is queued and will not publish.

## 13. Acceptance Criteria

1. Given a channel with weekday slots at 09:00 and 18:00, when three posts are queued, then they occupy the next three slots in order.
2. Given a queued post is dragged to first position, when reordering completes, then slot assignments recompute for all affected posts.
3. Given a composition targeting Instagram and LinkedIn, when customised per channel, then each publishes with its own caption and crop.
4. Given a caption exceeding a platform's limit, when queueing, then it is rejected naming the platform and the limit.
5. Given M4 content without client approval, when its slot arrives, then publishing is blocked and the owner alerted.
6. Given a publish fails transiently, when retried with an idempotency key, then exactly one post appears on the platform.
7. Given a post is published, when 24 hours pass, then metrics are collected and fed back to M4.
8. Given a comment indicating a complaint, when classified, then it is routed to O8 and the account owner notified.
9. Given Postiz is unavailable, when a slot time arrives, then the post remains queued, an alert is raised, and nothing is lost.
10. Given the transport is switched from Postiz to direct API for one platform, then module logic and stored posts are unchanged.

## 14. Dependencies

| Module | What is needed |
|---|---|
| F3 | Agent runtime, approval for client-channel replies |
| F4 | Postiz, Meta, YouTube, LinkedIn connectors |
| F6 / O4 | Media assets |
| F10 | T2 routing for client-facing replies |
| F11 | Publishing, collection and alert automations |
| M1 | Client and channel ownership |
| M4 | Approved content and performance feedback |
| M12 | Client-visible performance |

## 15. Out of Scope / Future

| Excluded | Reasoning |
|---|---|
| Content strategy | M4 owns it |
| Paid promotion / boosting | M9 owns advertising |
| Competitor benchmarking | Assess with M6/M8 |
| Social listening beyond own channels | Requires paid data; no current need |
| TikTok | No current client presence; connector exists in Postiz if needed |

## 16. Open Questions

| # | Question | Blocks | Owner |
|---|---|---|---|
| 1 | Is a Buffer-class tool currently subscribed, or is posting fully manual today? Affects the kill-list and urgency. | `00-vision.md` | Rajesh |
| 2 | Which client channels are BPS-owned versus client-owned? Determines how much of FR-M5-07 is needed at v1. | Credential model | Rajesh |
| 3 | Do clients approve individual posts, or approve the monthly batch in M4 and trust publishing? | FR-M5-22 scope | Rajesh |
| 4 | Is engagement (comments, DMs) currently part of the retainer, or does the client handle it? | Engagement inbox priority | Rajesh |
| 5 | Postiz is AGPL — is legal review needed before any client-facing resale? | Licensing | Rajesh |
