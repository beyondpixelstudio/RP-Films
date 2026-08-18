# M10 — WhatsApp Business Platform

| | |
|---|---|
| **Class** | BUILD |
| **Batch** | 2 |
| **Depends on** | F1, F2, F3, F4, F5, F10, F11, M1 |
| **Replaces** | **Makunai Babbler** (current WhatsApp platform); Wati / AiSensy class tooling |
| **Build estimate** | 6 weeks |
| **Status** | Draft |

## 1. Purpose & Scope

A self-hosted WhatsApp Business Platform: shared team inbox, template management, broadcast campaigns, automated flows, and an AI assistant that drafts replies. Used by BPS for its own marketing and sales, and resold to clients as a service.

**In scope:** WABA and phone-number management, message send/receive, template lifecycle, contact and opt-in management, broadcasts with rate governance, conversation assignment, chatbot flows, catalogue, analytics, cost tracking.

**Not in scope:** the underlying agent runtime (F3), general CRM (M1 — contacts sync bidirectionally), general shared inbox for email (O8/Chatwoot).

## 2. Business Context

**BPS already owns two provisioned WhatsApp Business Accounts.** This is the single most valuable asset for this module — the verification and approval process that normally gates building a Wati competitor is already complete.

| WABA ID | Name | State |
|---|---|---|
| `1270372887860442` | Beyond Pixel Studio Makunai Global (Babbler) API | Active; billed ₹133.41 for 26 May – 29 Jul 2026; **message delivery currently failing** |
| `1469300394010777` | Beyond Pixel Studio API | BPS's own direct account; ₹10.96 for Aug–Oct 2025; largely dormant |

**Current vendor:** Makunai Global Technologies supplies *Babbler* (WhatsApp platform) and *Maglo CRM*. Onboarding began 1 April 2026; GLO Plan purchased 18 March 2026 (PO MG/PO/2026/00019); subscription active from 15 April 2026. M10 and M1 together replace both products, making Makunai the largest single subscription this platform retires.

**Live operational problem, evidenced:** Meta issued three delivery-failure notices on 15 August 2026 and one on 23 May 2026 — *"A payment or account setup issue for your WhatsApp Business account Beyond Pixel Studio Makunai Global (Babbler) API is preventing messages from being delivered to your customers."* Recurring billing failure with no monitoring is itself a requirement driver: FR-M10-46 exists because of it.

**Existing approved templates on the BPS WABA** — these migrate rather than being rebuilt:

| Category | Templates |
|---|---|
| Wedding | `wedding_coverage`, `full_wedding_coverage`, `pre_or_post_wedding`, `ritual_or_proposal_event` |
| Events | `stage_event`, `strm` (streaming), `loc` |
| Production | `ptgrphy` (photography), `drn` / `drone_and_aerial_solution` |
| Services | `srvc`, `dgtmrktng`, `wbdvlpmt`, `wbsz` |
| Seasonal | `guru_purnima`, `independence_day`, `independence_day_fb` |
| Utility | `greeting`, `greeting_template`, `broadcast_1`, `broadcast_t`, `dt`, `test` |

Meta has repeatedly recategorised these from UTILITY to MARKETING, which **increases per-conversation cost**. Category drift monitoring is therefore a cost-control requirement, not an administrative nicety.

## 3. Personas & Roles

| Persona | Role | What they do here |
|---|---|---|
| Rajesh | `owner` | Manages WABAs, approves broadcasts, monitors spend |
| Silu (manager) | `manager` | Approves campaigns, oversees inbox coverage |
| Marketing staff | `member` | Handles conversations, drafts campaigns |
| Client contact | external | Receives messages; may reply |
| Client (reseller) | `client_guest` | *(Future)* manages own WhatsApp via M12 |
| Agent | `service` | Drafts replies, classifies intent, never sends unapproved |

## 4. Functional Requirements

### Account & number management

| ID | Requirement | Priority |
|---|---|---|
| FR-M10-01 | The system shall support multiple WABAs, each with its own credentials and phone numbers. | Must |
| FR-M10-02 | The system shall record for each WABA its display name, verification status, quality rating and messaging limit tier. | Must |
| FR-M10-03 | The system shall associate each WABA with an owning entity — BPS or a specific client. | Must |
| FR-M10-04 | The system shall alert when a phone number's quality rating drops or its messaging tier changes. | Must |
| FR-M10-05 | The system shall support migrating a phone number between BSPs, given BPS is moving off Babbler. | Should |

### Messaging

| ID | Requirement | Priority |
|---|---|---|
| FR-M10-06 | The system shall send and receive text, image, video, document, audio, location, sticker and interactive messages. | Must |
| FR-M10-07 | The system shall receive inbound messages via webhook with signature verification. | Must |
| FR-M10-08 | The system shall track message status — sent, delivered, read, failed — and record failure reasons. | Must |
| FR-M10-09 | The system shall enforce the 24-hour customer service window, permitting free-form messages only inside it. | Must |
| FR-M10-10 | The system shall require an approved template for any message outside the 24-hour window. | Must |
| FR-M10-11 | The system shall display the remaining service window on every open conversation. | Must |
| FR-M10-12 | The system shall queue outbound messages and respect Meta's per-number rate limits. | Must |
| FR-M10-13 | The system shall support interactive replies — buttons and list messages. | Must |
| FR-M10-14 | The system shall support media upload to Meta with local retention in F6. | Must |

### Templates

| ID | Requirement | Priority |
|---|---|---|
| FR-M10-15 | The system shall manage the template lifecycle: draft, submit, approved, rejected, paused, disabled. | Must |
| FR-M10-16 | The system shall import existing approved templates from a connected WABA rather than requiring re-creation. | Must |
| FR-M10-17 | The system shall validate template syntax and variable count before submission. | Must |
| FR-M10-18 | The system shall record each template's category and **alert when Meta recategorises it**, stating the cost impact. | Must |
| FR-M10-19 | The system shall support template variables mapped to CRM fields, with a preview using real contact data. | Must |
| FR-M10-20 | The system shall support multi-language template variants — English, Hindi and Odia at minimum. | Should |
| FR-M10-21 | The system shall prevent sending a template that is not in approved state. | Must |

### Contacts & consent

| ID | Requirement | Priority |
|---|---|---|
| FR-M10-22 | The system shall maintain WhatsApp contacts synchronised bidirectionally with M1. | Must |
| FR-M10-23 | The system shall record opt-in state per contact with source, timestamp and evidence. | Must |
| FR-M10-24 | The system shall refuse to include a contact without recorded opt-in in a marketing broadcast. | Must |
| FR-M10-25 | The system shall process opt-out requests automatically, including free-text intent such as "STOP" or "unsubscribe". | Must |
| FR-M10-26 | The system shall honour an opt-out permanently until explicit re-opt-in. | Must |
| FR-M10-27 | The system shall support contact tagging and segmentation for targeting. | Must |
| FR-M10-28 | The system shall support bulk contact import with per-row opt-in evidence, rejecting rows without it. | Must |

### Broadcasts

| ID | Requirement | Priority |
|---|---|---|
| FR-M10-29 | The system shall create broadcast campaigns targeting a segment with a chosen template. | Must |
| FR-M10-30 | The system shall estimate recipient count and **conversation cost before sending**. | Must |
| FR-M10-31 | Every broadcast shall require human approval via F3 before dispatch, regardless of who or what created it. | Must |
| FR-M10-32 | The system shall throttle dispatch to stay within the number's messaging tier. | Must |
| FR-M10-33 | The system shall support scheduled broadcasts. | Must |
| FR-M10-34 | The system shall support pausing and cancelling an in-flight broadcast. | Must |
| FR-M10-35 | The system shall report per-broadcast delivery, read, reply and opt-out rates, and actual cost. | Must |
| FR-M10-36 | The system shall halt a broadcast automatically if the opt-out rate exceeds a configurable threshold. | Must |

### Team inbox

| ID | Requirement | Priority |
|---|---|---|
| FR-M10-37 | The system shall present a shared inbox of conversations across all connected numbers. | Must |
| FR-M10-38 | The system shall support assigning a conversation to a user, with reassignment and unassignment. | Must |
| FR-M10-39 | The system shall support internal notes on a conversation, never visible to the contact. | Must |
| FR-M10-40 | The system shall support conversation labels, status (open, pending, resolved) and filtering. | Must |
| FR-M10-41 | The system shall support canned replies scoped by department. | Should |
| FR-M10-42 | The system shall show CRM context — client, deals, invoices, recent activity — alongside the conversation. | Must |
| FR-M10-43 | The system shall prevent two users replying simultaneously by showing typing/lock state. | Should |

### Flows & automation

| ID | Requirement | Priority |
|---|---|---|
| FR-M10-44 | The system shall support rule-based auto-replies — greeting, away message, keyword routing. | Must |
| FR-M10-45 | The system shall support multi-step conversational flows with branching, invoking F11 workflows. | Should |

### Health & cost

| ID | Requirement | Priority |
|---|---|---|
| FR-M10-46 | The system shall monitor WABA health and **alert immediately on a delivery-blocking billing or account issue**, naming the affected account and the remedy. | Must |
| FR-M10-47 | The system shall track conversation cost by category and attribute it to client and campaign. | Must |
| FR-M10-48 | The system shall report cost per conversation category monthly, with trend. | Must |
| FR-M10-49 | The system shall alert when spend exceeds a configured monthly threshold. | Should |

## 5. AI & Agent Capabilities

### `M10.reply_drafter`

| | |
|---|---|
| **Goal** | Draft a contextually appropriate reply to an inbound message |
| **Skills** | `marketing.whatsapp_tone`, `creative.brand_voice`, `finance.payment_reminder_tone` |
| **Connectors** | `meta.whatsapp` (read), M1 (read) |
| **Model tier** | T2 (`draft-client-facing`) — contact-visible output |
| **Autonomy** | `draft` |
| **Approval gates** | Staff member reviews and sends. **No autonomous send.** |
| **Token budget** | 8k per draft; 2M per month |
| **Failure mode** | Inbox works normally without drafts |

### `M10.intent_classifier`

| | |
|---|---|
| **Goal** | Classify inbound intent — enquiry, booking, complaint, payment, spam — and route |
| **Skills** | `marketing.enquiry_taxonomy` |
| **Connectors** | none |
| **Model tier** | T0 (`classify`) |
| **Autonomy** | `act` — routing is internal and reversible |
| **Approval gates** | none; misrouting is corrected by reassignment |
| **Token budget** | 1k per message; 500k per month |
| **Failure mode** | Falls back to unassigned queue |

### `M10.campaign_composer`

| | |
|---|---|
| **Goal** | Draft broadcast copy and propose a target segment |
| **Skills** | `marketing.campaign_strategy`, `creative.brand_voice` |
| **Connectors** | M1 (read) |
| **Model tier** | T2 (`draft-client-facing`) |
| **Autonomy** | `act_with_approval` |
| **Approval gates** | **Owner or manager approves every broadcast.** Approval shows recipient count, estimated cost, template and full message. |
| **Token budget** | 15k per campaign; 500k per month |
| **Failure mode** | Manual composition remains available |

**A broadcast is the highest-consequence action in the platform** — it reaches hundreds of real people under a client's brand, costs money per conversation, and cannot be recalled. FR-M10-31 admits no exception, and F3 offers no bulk approval.

## 6. Automations

| Name | Trigger | Steps | Consequential |
|---|---|---|---|
| WABA health monitor | Every 15 min | Poll account status → detect delivery block → alert owner with remedy | No |
| Template category watch | Meta webhook | Detect recategorisation → compute cost impact → notify owner | No |
| Opt-out processing | Inbound message matching opt-out intent | Mark opted out → confirm to contact → update M1 | Yes — sends confirmation |
| Enquiry auto-response | Inbound outside business hours | Send away template → create CRM lead → assign next morning | Yes — sends |
| Payment reminder | From Fin4 ladder | Select tone by client history → draft → **approval** → send | Yes |
| Broadcast opt-out circuit-breaker | Opt-out rate exceeds threshold mid-broadcast | Pause → alert owner → require re-approval to resume | No |

## 7. Data Model

```sql
CREATE TABLE m10_wabas (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id            uuid NOT NULL REFERENCES organisations(id),
  waba_id           text NOT NULL,              -- Meta WABA id
  name              text NOT NULL,
  owner_kind        text NOT NULL CHECK (owner_kind IN ('bps','client')),
  client_id         uuid,                       -- when owner_kind = 'client'
  credential_id     uuid REFERENCES f4_credentials(id),
  verification_status text,
  health_status     text NOT NULL DEFAULT 'unknown',
  health_detail     text,
  is_active         boolean NOT NULL DEFAULT true,
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now(),
  UNIQUE (org_id, waba_id)
);

CREATE TABLE m10_phone_numbers (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id          uuid NOT NULL REFERENCES organisations(id),
  waba_id         uuid NOT NULL REFERENCES m10_wabas(id),
  phone_number_id text NOT NULL,
  display_number  text NOT NULL,
  display_name    text,
  quality_rating  text,                         -- GREEN | YELLOW | RED
  messaging_tier  text,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now(),
  UNIQUE (org_id, phone_number_id)
);

CREATE TABLE m10_contacts (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id          uuid NOT NULL REFERENCES organisations(id),
  wa_id           text NOT NULL,                -- E.164 without +
  crm_contact_id  uuid,                         -- M1
  client_id       uuid,
  display_name    text,
  opt_in_status   text NOT NULL DEFAULT 'unknown'
                  CHECK (opt_in_status IN ('unknown','opted_in','opted_out')),
  opt_in_source   text,
  opt_in_evidence text,
  opt_in_at       timestamptz,
  opt_out_at      timestamptz,
  tags            text[] NOT NULL DEFAULT '{}',
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now(),
  UNIQUE (org_id, wa_id)
);

CREATE TABLE m10_conversations (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id            uuid NOT NULL REFERENCES organisations(id),
  phone_number_id   uuid NOT NULL REFERENCES m10_phone_numbers(id),
  contact_id        uuid NOT NULL REFERENCES m10_contacts(id),
  status            text NOT NULL DEFAULT 'open'
                    CHECK (status IN ('open','pending','resolved')),
  assigned_to       uuid REFERENCES users(id),
  labels            text[] NOT NULL DEFAULT '{}',
  window_expires_at timestamptz,                -- 24-hour service window
  last_message_at   timestamptz,
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE m10_messages (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id           uuid NOT NULL REFERENCES organisations(id),
  conversation_id  uuid NOT NULL REFERENCES m10_conversations(id),
  wa_message_id    text,
  direction        text NOT NULL CHECK (direction IN ('inbound','outbound')),
  message_type     text NOT NULL,
  body             text,
  media_file_id    uuid,                        -- F6
  template_id      uuid,
  template_params  jsonb,
  status           text CHECK (status IN ('queued','sent','delivered','read','failed')),
  failure_reason   text,
  sent_by          uuid REFERENCES users(id),
  drafted_by_agent boolean NOT NULL DEFAULT false,
  approved_by      uuid REFERENCES users(id),
  broadcast_id     uuid,
  conversation_category text,                   -- marketing|utility|authentication|service
  cost_minor       bigint,
  currency         char(3) DEFAULT 'INR',
  created_at       timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX m10_messages_conv_idx ON m10_messages (org_id, conversation_id, created_at);

CREATE TABLE m10_templates (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id         uuid NOT NULL REFERENCES organisations(id),
  waba_id        uuid NOT NULL REFERENCES m10_wabas(id),
  template_name  text NOT NULL,
  language       text NOT NULL DEFAULT 'en',
  category       text NOT NULL,                 -- MARKETING|UTILITY|AUTHENTICATION
  previous_category text,
  category_changed_at timestamptz,
  status         text NOT NULL,                 -- APPROVED|PENDING|REJECTED|PAUSED|DISABLED
  components     jsonb NOT NULL,
  variable_map   jsonb,                         -- variable index -> CRM field
  external_id    text,
  synced_at      timestamptz,
  created_at     timestamptz NOT NULL DEFAULT now(),
  updated_at     timestamptz NOT NULL DEFAULT now(),
  UNIQUE (org_id, waba_id, template_name, language)
);

CREATE TABLE m10_broadcasts (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id           uuid NOT NULL REFERENCES organisations(id),
  name             text NOT NULL,
  phone_number_id  uuid NOT NULL REFERENCES m10_phone_numbers(id),
  template_id      uuid NOT NULL REFERENCES m10_templates(id),
  client_id        uuid,
  segment          jsonb NOT NULL,
  recipient_count  integer,
  estimated_cost_minor bigint,
  actual_cost_minor    bigint,
  currency         char(3) NOT NULL DEFAULT 'INR',
  status           text NOT NULL DEFAULT 'draft'
                   CHECK (status IN ('draft','awaiting_approval','scheduled',
                                     'sending','paused','completed','cancelled','halted')),
  approved_by      uuid REFERENCES users(id),
  approved_at      timestamptz,
  scheduled_for    timestamptz,
  opt_out_count    integer NOT NULL DEFAULT 0,
  created_by       uuid REFERENCES users(id),
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now()
);
```

Standard `org_id`, RLS, indexes and triggers per F2.

## 8. Connectors & Integrations

| System | Via | Auth | Rate limits | Failure mode |
|---|---|---|---|---|
| WhatsApp Cloud API | `meta.whatsapp` (F4) | System user token | Per messaging tier; 80 msg/s default cap | Queue and retry; never drop |
| Meta webhooks | HTTPS endpoint | Signature verification | — | Missed webhooks reconciled by polling |
| M1 CRM | Internal | — | — | Inbox works with degraded context |
| F6 Storage | Internal | — | — | Media send fails explicitly |

**Idempotency is mandatory** on every send (per FR-F4-26). A retried broadcast message that double-sends costs money and damages the recipient relationship.

## 9. Screens & UX Flows

| Screen | Purpose |
|---|---|
| **Team inbox** | Conversation list, thread view, CRM context panel, assignment, notes |
| Contact detail | Profile, opt-in state and evidence, tags, history |
| Template library | Templates with status, category, category-change alerts |
| Template editor | Compose, variable mapping, live preview with real contact data |
| **Broadcast composer** | Segment → template → preview → **recipient count and estimated cost** → submit for approval |
| Broadcast detail | Live progress, delivery/read/reply/opt-out, actual cost |
| WABA settings | Accounts, numbers, quality ratings, health status |
| Analytics | Volume, response time, cost by category and client |

The broadcast composer must show **recipient count and estimated cost before the approval request is raised**, not after. A manager approving a send needs to know it reaches 340 people and costs ₹X — that is the entire content of the decision.

## 10. Non-Functional Requirements

| Aspect | Requirement |
|---|---|
| Performance | Inbound webhook to inbox ≤ 3 s; inbox loads ≤ 1 s |
| Security | Webhook signature verification mandatory; tokens in F4 vault; message content is personal data |
| Availability | Webhook endpoint must not drop inbound messages during deploys — queue first, process after |
| Data retention | Messages 24 months; opt-in evidence retained indefinitely as consent proof |
| Scale | 10,000 messages/month initially; broadcasts to 5,000 recipients |

## 11. Compliance

- **WhatsApp Business Messaging Policy** — opt-in required before marketing messages; templates must be approved; opt-out must be honoured. Violation risks losing the WABA, which would end this revenue line outright.
- **Meta Commerce & Business Policies** — restricted content categories apply.
- **DPDP Act 2023** — phone numbers and message content are personal data. Opt-in evidence (FR-M10-23) serves as consent record.
- **TRAI / Indian telecom regulation** — WhatsApp Business messaging is not currently governed by DLT registration as SMS is, but this is worth re-checking before any bulk campaign, as regulation in this area moves.

## 12. Guided Mode Requirements

- **First-run:** connect a WABA, import existing templates, import contacts with opt-in evidence, send a test message. Explain the 24-hour window early — it is the single most confusing rule for new operators.
- **Explain-this:** "24-hour service window", "template category", "opt-in", "messaging tier", "quality rating". Each has direct cost or deliverability consequences.
- **Next-best-action:** flag contacts without opt-in; flag templates recategorised to MARKETING; flag conversations unanswered beyond SLA; **flag a delivery-blocking account issue with the fix**.
- **Guardrails:** cannot send a marketing broadcast to contacts without opt-in — blocked, not warned. Cannot send an unapproved template. Broadcast approval requires typed confirmation of recipient count. Deleting a template in use by an active automation is blocked.

## 13. Acceptance Criteria

1. Given a contact without recorded opt-in, when added to a marketing broadcast, then they are excluded and the reason is shown.
2. Given a conversation whose 24-hour window has expired, when a user attempts a free-form message, then it is blocked and templates are offered.
3. Given a broadcast is composed, when submitted, then approval is required and shows recipient count, estimated cost, template and full rendered message.
4. Given a broadcast is sending and opt-out rate exceeds threshold, then it pauses automatically and the owner is alerted.
5. Given an inbound message contains "STOP", when processed, then the contact is opted out, confirmed, and M1 is updated.
6. Given Meta recategorises a template from UTILITY to MARKETING, when the webhook arrives, then the owner is alerted with the cost impact.
7. Given a WABA has a delivery-blocking billing issue, when health monitoring runs, then the owner is alerted within 15 minutes with the specific remedy.
8. Given a send is retried after a network failure, when the idempotency key matches, then the recipient receives exactly one message.
9. Given an agent drafts a reply, when it is not approved by a human, then nothing is sent.
10. Given existing approved templates on a connected WABA, when import runs, then they appear without re-submission to Meta.

## 14. Dependencies

| Module | What is needed |
|---|---|
| F1 | Users, roles, assignment |
| F3 | Approval queue for broadcasts and sends |
| F4 | `meta.whatsapp` connector, credential vault, idempotency |
| F5 | Alerts for health, approvals, assignment |
| F10 | Model routing for drafting and classification |
| F11 | Flow execution, reminder ladders |
| M1 | Contact sync, CRM context in inbox |
| F6 | Media storage |

## 15. Out of Scope / Future

| Excluded | Reasoning |
|---|---|
| WhatsApp Pay | Not generally available for this use case in India; Razorpay links serve the need |
| Client self-service management | M12 concern; requires per-client credential isolation (F4 §15) |
| Voice and video calling | Not part of the Business Platform offering being replaced |
| Full chatbot builder UI | FR-M10-45 delegates to F11 rather than building a second flow builder |
| Instagram / Messenger unified inbox | Chatwoot (O8) covers this; avoid building two inboxes |

## 16. Open Questions

| # | Question | Blocks | Owner |
|---|---|---|---|
| 1 | **The Babbler WABA delivery failure — is this resolved?** Meta flagged it on 15 Aug 2026 and 23 May 2026. | Live client work | Rajesh |
| 2 | What is the Makunai contract term and notice period? Determines when M10 must be production-ready to avoid overlap. | Build scheduling | Rajesh |
| 3 | Which WABA becomes primary — migrate off Babbler to the direct BPS account, or move the Babbler number? | FR-M10-05 | Rajesh |
| 4 | Do any clients want their own WABA under BPS management? This pulls per-client credentials forward from "future" to v1. | F4 scope | Rajesh |
| 5 | Are Hindi and Odia template variants actually needed, or is English sufficient for the current client base? | FR-M10-20 | Rajesh |
| 6 | What is the current monthly Makunai cost across Babbler and Maglo CRM? Needed for the subscription kill-list. | `00-vision.md` | Rajesh |
