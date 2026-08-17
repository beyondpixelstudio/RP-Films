# F4 — Connector & Skills Registry (MCP)

| | |
|---|---|
| **Class** | BUILD |
| **Batch** | 1 |
| **Depends on** | F1, F2 |
| **Replaces** | Per-tool API integrations scattered across modules; manual credential handling |
| **Build estimate** | 5 weeks |
| **Status** | Draft |

## 1. Purpose & Scope

The single gateway between the platform and every external system, and the mechanism by which AI capability is packaged per department.

Two things live here, deliberately together:

- **Connectors** — MCP servers wrapping external systems (Meta, Google, WhatsApp, Razorpay, Frappe HR, ERPNext…). They expose *tools*.
- **Skills** — versioned, department-scoped bundles of instructions plus tool access that agents load on demand. They expose *competence*.

A connector says "you can post to Instagram." A skill says "here is how BPS writes an Instagram caption for a school client, and these are the tools you may use to do it."

**In scope:** MCP server registry, tool registry and classification, credential vault, OAuth lifecycle, rate limiting, retries, health monitoring, skill definition and versioning, department skill packs.

**Not in scope:** agent execution (F3), model selection (F10), deterministic multi-step business logic (F11).

## 2. Business Context

BPS operates across Meta Business Manager (two ad accounts), WhatsApp Business API (two WABAs), Google Workspace, Google Business Profile, Razorpay, Hostinger and Notion. Every one is accessed manually today, through a browser, with credentials held by individuals.

Two consequences: nobody can enumerate what the business has access to, and when a staff member leaves, revocation is a memory exercise. F1's FR-F1-22 promises token revocation on offboarding — F4 is what makes that promise executable.

**On the skills idea:** the instinct to "introduce AI skills and use them for various departments" maps exactly onto how this session's own tooling works — versioned capability packs, loaded on demand, scoped to a domain. MCP is an open standard, so connectors written here are portable rather than locked to one AI vendor. This is the right architecture, and it is the reason the platform can change model providers without rewriting its integrations.

## 3. Personas & Roles

| Persona | Role | What they do here |
|---|---|---|
| Owner | `owner` | Connects accounts, authorises OAuth, manages credentials |
| Department lead | `dept_lead` | Curates their department's skill pack |
| Staff member | `member` | Uses skills indirectly through agents |
| Agent | `service` | Resolves and invokes tools |

## 4. Functional Requirements

### Connector registry

| ID | Requirement | Priority |
|---|---|---|
| FR-F4-01 | The system shall maintain a registry of connectors, each identified by a stable key (e.g. `meta.graph`, `google.gbp`). | Must |
| FR-F4-02 | Connectors shall be implemented as MCP servers, communicating over the Model Context Protocol. | Must |
| FR-F4-03 | The system shall support connectors running in-process and as separate network services. | Must |
| FR-F4-04 | The system shall discover a connector's tools from the MCP server rather than a hand-maintained list. | Must |
| FR-F4-05 | The system shall record connector version and record the version used on every invocation. | Must |
| FR-F4-06 | The system shall allow the `owner` to disable a connector instantly, making its tools unavailable platform-wide. | Must |

### Tool registry & classification

| ID | Requirement | Priority |
|---|---|---|
| FR-F4-07 | The system shall maintain a registry of every tool with its connector, schema, description and consequence classification. | Must |
| FR-F4-08 | Every tool shall be classified `consequential` or `safe`. | Must |
| FR-F4-09 | A tool shall be classified `consequential` if it spends money, contacts an external party, publishes publicly, modifies payroll, or deletes data. | Must |
| FR-F4-10 | Tools shall default to `consequential` when classification is absent or ambiguous — the safe default is friction, not silence. | Must |
| FR-F4-11 | Classification shall be recorded in the registry, not inferred at runtime from the tool name. | Must |
| FR-F4-12 | The system shall present a review screen listing every tool and its classification, so the safety surface is auditable in one place. | Must |
| FR-F4-13 | Changing a tool's classification from `consequential` to `safe` shall require `owner` role and be recorded in the audit log. | Must |

### Credentials & OAuth

| ID | Requirement | Priority |
|---|---|---|
| FR-F4-14 | The system shall store all external credentials encrypted at rest in a dedicated vault, never in plaintext columns or environment files. | Must |
| FR-F4-15 | The system shall implement OAuth 2.0 authorisation code flow with PKCE for connectors that support it. | Must |
| FR-F4-16 | The system shall refresh OAuth tokens automatically before expiry. | Must |
| FR-F4-17 | The system shall alert the `owner` when a token cannot be refreshed, naming the affected connector and what will stop working. | Must |
| FR-F4-18 | The system shall revoke all tokens held on behalf of a user when that user is suspended, per FR-F1-22. | Must |
| FR-F4-19 | The system shall never expose a raw credential through the UI or API, including to the `owner`. | Must |
| FR-F4-20 | The system shall record which credential was used for every invocation, without recording its value. | Must |

### Invocation

| ID | Requirement | Priority |
|---|---|---|
| FR-F4-21 | The system shall validate tool arguments against the tool's schema before invocation. | Must |
| FR-F4-22 | The system shall enforce per-connector rate limits matching each provider's published limits. | Must |
| FR-F4-23 | The system shall queue rather than drop calls that would breach a rate limit. | Must |
| FR-F4-24 | The system shall retry transient failures with exponential backoff and jitter, to a configurable maximum. | Must |
| FR-F4-25 | The system shall never retry a `consequential` tool call automatically without idempotency protection. | Must |
| FR-F4-26 | The system shall support idempotency keys on consequential calls, so a retry cannot double-send or double-charge. | Must |
| FR-F4-27 | The system shall enforce a per-invocation timeout, defaulting to 30 seconds. | Must |
| FR-F4-28 | The system shall return structured errors distinguishing auth failure, rate limit, validation error, provider outage and timeout. | Must |

### Skills

| ID | Requirement | Priority |
|---|---|---|
| FR-F4-29 | The system shall maintain a registry of skills, each with a stable key (e.g. `marketing.caption_writing`), description, instruction content and permitted tool keys. | Must |
| FR-F4-30 | Skills shall be versioned; executions shall record the version used. | Must |
| FR-F4-31 | Skills shall be assignable to one or more departments, forming that department's skill pack. | Must |
| FR-F4-32 | A skill's permitted tools shall be a subset of the tools available to the agent loading it — a skill can never widen access. | Must |
| FR-F4-33 | The system shall support skills that reference other skills, resolved acyclically. | Should |
| FR-F4-34 | The system shall allow a `dept_lead` to create and edit skills for their own department. | Must |
| FR-F4-35 | Skills shall support attached reference material (brand voice, rate cards, SOPs) retrievable during execution. | Must |
| FR-F4-36 | The system shall allow skills to be tested against a sample input before activation. | Should |
| FR-F4-37 | Skill content shall be treated as platform instruction, and reference material attached to a skill shall be treated as data — the distinction from FR-F3-34 is preserved. | Must |

### Health

| ID | Requirement | Priority |
|---|---|---|
| FR-F4-38 | The system shall health-check every connector on a schedule and record availability. | Must |
| FR-F4-39 | The system shall surface connector status in plain language: what is broken, what stops working, what to do. | Must |
| FR-F4-40 | The system shall alert when a connector's error rate exceeds a threshold. | Should |

## 5. AI & Agent Capabilities

| | |
|---|---|
| **Agent** | `F4.connector_troubleshooter` |
| **Goal** | Diagnose a failing connector and state the remedy in plain language |
| **Skills used** | `platform.diagnostics` |
| **Connectors** | none — reads health and error records only |
| **Model tier** | T1 |
| **Autonomy** | `suggest` |
| **Approval gates** | none — diagnostic output only |
| **Token budget** | 15k per invocation; 300k per month |
| **Failure mode** | Falls back to raw error display |

F4 hosts no agent capable of acting. **A registry that could modify itself under model control would undermine every guarantee built on top of it.** Connector configuration and tool classification are changed by humans only.

### Department skill packs

The initial packs, mapped to BPS's existing departments:

| Department | Skill pack contents |
|---|---|
| Creative | Brand voice, script structure, shot-list conventions, caption style per platform |
| Digital Marketing | Campaign strategy, content calendar planning, ad copy, performance interpretation |
| DOP & Operations | Call-sheet construction, crew and equipment planning, shoot-day logistics |
| Website Development | Requirements capture, site structure, SEO on-page conventions |
| Video Editing & Graphics | Edit brief interpretation, delivery specifications per platform |
| HR | Policy Q&A, job description drafting, interview structure |
| Finance | Invoice interpretation, GST classification, payment-reminder tone by client history |

Each pack carries BPS's actual conventions — the Detailing Devils content structure, the studio rate card, the payment-reminder tone that differentiates a good client from a repeat late payer. **This is where institutional knowledge stops living in Rajesh's head and becomes reusable.**

## 6. Automations

| Name | Trigger | Steps | Editable |
|---|---|---|---|
| Token refresh | 24 hours before expiry | Refresh → verify → alert on failure | No |
| Connector health sweep | Every 15 minutes | Probe each connector → record → alert on newly failed | Yes — interval |
| Offboarding token revocation | User suspended (F1) | Revoke every token for that user → confirm → log | No — security critical |
| Rate-limit backoff | Provider returns 429 | Pause connector queue → resume with backoff → alert if sustained | No |

## 7. Data Model

```sql
CREATE TABLE f4_connectors (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id        uuid NOT NULL REFERENCES organisations(id),
  connector_key text NOT NULL,                -- 'meta.graph'
  name          text NOT NULL,
  transport     text NOT NULL CHECK (transport IN ('in_process','http','stdio')),
  endpoint      text,
  version       text NOT NULL,
  is_enabled    boolean NOT NULL DEFAULT true,
  health_status text NOT NULL DEFAULT 'unknown'
                CHECK (health_status IN ('healthy','degraded','failed','unknown')),
  health_checked_at timestamptz,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now(),
  UNIQUE (org_id, connector_key)
);

CREATE TABLE f4_tools (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id         uuid NOT NULL REFERENCES organisations(id),
  connector_id   uuid NOT NULL REFERENCES f4_connectors(id),
  tool_key       text NOT NULL,               -- 'meta.graph.publish_post'
  description    text NOT NULL,
  input_schema   jsonb NOT NULL,
  consequence    text NOT NULL DEFAULT 'consequential'
                 CHECK (consequence IN ('safe','consequential')),
  consequence_reason text,
  rate_limit_per_minute integer,
  timeout_ms     integer NOT NULL DEFAULT 30000,
  is_enabled     boolean NOT NULL DEFAULT true,
  created_at     timestamptz NOT NULL DEFAULT now(),
  updated_at     timestamptz NOT NULL DEFAULT now(),
  UNIQUE (org_id, tool_key)
);

CREATE TABLE f4_credentials (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id         uuid NOT NULL REFERENCES organisations(id),
  connector_id   uuid NOT NULL REFERENCES f4_connectors(id),
  label          text NOT NULL,               -- 'Main Ad Account'
  owner_user_id  uuid REFERENCES users(id),   -- for offboarding revocation
  auth_type      text NOT NULL CHECK (auth_type IN ('oauth2','api_key','basic','none')),
  secret_encrypted bytea NOT NULL,
  external_account_id text,                   -- e.g. Meta ad account id
  scopes         text[],
  expires_at     timestamptz,
  last_refreshed_at timestamptz,
  status         text NOT NULL DEFAULT 'active'
                 CHECK (status IN ('active','expired','revoked','refresh_failed')),
  created_at     timestamptz NOT NULL DEFAULT now(),
  updated_at     timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE f4_skills (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id        uuid NOT NULL REFERENCES organisations(id),
  skill_key     text NOT NULL,                -- 'marketing.caption_writing'
  name          text NOT NULL,
  description   text NOT NULL,
  version       integer NOT NULL DEFAULT 1,
  instructions  text NOT NULL,
  tool_keys     text[] NOT NULL DEFAULT '{}',
  includes      text[] NOT NULL DEFAULT '{}', -- referenced skill keys
  is_active     boolean NOT NULL DEFAULT true,
  created_by    uuid REFERENCES users(id),
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now(),
  UNIQUE (org_id, skill_key, version)
);

CREATE TABLE f4_skill_departments (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id        uuid NOT NULL REFERENCES organisations(id),
  skill_id      uuid NOT NULL REFERENCES f4_skills(id),
  department_id uuid NOT NULL REFERENCES departments(id),
  UNIQUE (org_id, skill_id, department_id)
);

CREATE TABLE f4_skill_references (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id      uuid NOT NULL REFERENCES organisations(id),
  skill_id    uuid NOT NULL REFERENCES f4_skills(id),
  title       text NOT NULL,
  content     text,
  file_id     uuid,                           -- F6 object reference
  embedding   vector(1024),
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE f4_invocations (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id         uuid NOT NULL REFERENCES organisations(id),
  tool_id        uuid NOT NULL REFERENCES f4_tools(id),
  credential_id  uuid REFERENCES f4_credentials(id),
  execution_id   uuid,                        -- F3 execution, null if direct
  idempotency_key text,
  status         text NOT NULL CHECK (status IN
                   ('succeeded','failed','rate_limited','timeout','auth_failed')),
  duration_ms    integer,
  error          text,
  created_at     timestamptz NOT NULL DEFAULT now(),
  UNIQUE (org_id, idempotency_key)
);
```

Standard `org_id`, RLS, indexes and triggers per F2.

**Note on `f4_invocations`:** arguments and results are deliberately **not** stored here — they live in `f3_execution_steps` where retention and access are already governed. Duplicating them would create a second copy of client data with different retention rules.

## 8. Connectors & Integrations

The initial connector set, prioritised by what BPS already operates:

| Connector | Systems | Auth | Owning modules |
|---|---|---|---|
| `meta.graph` | Facebook, Instagram publishing and insights | OAuth 2.0 | M5, M9 |
| `meta.whatsapp` | WhatsApp Business Platform | System user token | M10 |
| `meta.ads` | Campaign management, insights | OAuth 2.0 | M9 |
| `google.gbp` | Google Business Profile | OAuth 2.0 | M7, M8 |
| `google.workspace` | Gmail, Drive, Calendar | OAuth 2.0 | M1, O1 |
| `google.search_console` | Search performance | OAuth 2.0 | M6 |
| `youtube.data` | Video publishing, analytics | OAuth 2.0 | M5 |
| `linkedin.marketing` | Page publishing | OAuth 2.0 | M5 |
| `razorpay` | Payments, subscriptions | API key | Fin1, Fin4 |
| `erpnext` | Accounting, GST | API key | Fin series |
| `frappe_hr` | HR records | API key | H series |
| `postiz` | Multi-channel publishing | API key | M5 |
| `chatwoot` | Shared inbox | API key | O8, M10 |
| `listmonk` | Email campaigns | API key | M11 |
| `dataforseo` | Rank and keyword data | API key | M6 |
| `shiprocket` | Logistics | API key | O7 |

Rate limits, failure modes and idempotency requirements are specified per connector in the owning module's SRS.

## 9. Screens & UX Flows

| Screen | Purpose |
|---|---|
| Connector directory | All connectors, health, credential status, owning modules |
| Connector detail | Tools exposed, credentials, recent errors, enable/disable |
| **Connect account** | OAuth flow — plain-language explanation of what access is granted and why |
| Credential list | Label, connector, owner, expiry, status. **Never the value.** |
| **Tool classification review** | Every tool and its consequence classification, on one screen |
| Skill library | All skills by department, version, last edited |
| Skill editor | Instructions, permitted tools, reference material, test-run |
| Department skill pack | Which skills a department holds |
| Connector health | Status board with plain-language impact statements |

### Connect-account flow

The moment a non-technical owner grants a third party access to their business accounts deserves care:

1. State plainly what is being connected and why the platform needs it
2. List the specific permissions requested and what each enables
3. Redirect to the provider's own consent screen — BPS never sees the password
4. Confirm success and state what now works
5. On failure, explain the cause and the fix, not a raw OAuth error code

**BPS never handles the user's password for an external service.** Authentication happens on the provider's domain. This is stated in the UI so the operator understands why.

## 10. Non-Functional Requirements

| Aspect | Requirement |
|---|---|
| Performance | Tool resolution ≤ 10 ms; invocation overhead ≤ 50 ms excluding provider time |
| Security | Credentials encrypted at rest with a key outside the database; never logged, never displayed, never returned by API |
| Availability | One connector failing must not degrade others; queued calls survive restart |
| Data retention | Invocation records 12 months; credentials until revoked |
| Scale | 10,000 invocations/day; 50 connectors; 200 tools |

## 11. Compliance

- **Meta Platform Policy** — token storage, permitted scopes, data-use restrictions. Violation risks losing the ad accounts and the WABA, which would be materially damaging.
- **WhatsApp Business Policy** — governs messaging; enforced at M10's tool level.
- **Google API Services User Data Policy** — limited-use requirements on Workspace and Search Console data.
- **DPDP Act 2023** — credential owner records establish accountability for third-party data access.
- **Least privilege** — request the narrowest OAuth scopes that satisfy the module's stated requirements. Documented per connector.

## 12. Guided Mode Requirements

- **First-run:** guided sequence connecting the accounts BPS already uses, in dependency order, explaining what each unlocks.
- **Explain-this:** "connector", "tool", "skill", "OAuth", "scope", "token" — all need business-owner-level explanations. "A connector is how the platform talks to Instagram on your behalf" beats any accurate technical definition.
- **Next-best-action:** flag disconnected connectors blocking an active module; flag expiring tokens; flag departments with an empty skill pack.
- **Guardrails:** disabling a connector lists which modules stop working before confirming. Reclassifying a tool as `safe` shows exactly what becomes autonomously executable and requires typed confirmation. Deleting a skill in use by an active agent is blocked.

## 13. Acceptance Criteria

1. Given a new MCP connector is registered, when discovery runs, then its tools appear in the registry with schemas, defaulting to `consequential`.
2. Given a tool has no explicit classification, when an agent calls it, then it is treated as consequential and gated for approval.
3. Given an OAuth token nears expiry, when the refresh job runs, then it refreshes without user action.
4. Given a refresh fails, when the job completes, then the owner is alerted with the connector name and the affected functionality.
5. Given a user is suspended, when revocation runs, then every credential owned by them is revoked and marked.
6. Given a consequential call is retried, when an idempotency key is present, then the provider receives exactly one effective action.
7. Given a provider returns 429, when calls are queued, then they resume after backoff without loss.
8. Given a skill declares a tool its loading agent lacks, when loaded, then the tool remains unavailable.
9. Given any user including `owner` requests a credential value, when the API responds, then the value is not present.
10. Given a skill has attached reference material containing instruction-like text, when an agent uses it, then that text is treated as data, not instruction.

## 14. Dependencies

| Module | What is needed |
|---|---|
| F1 | Users, permissions, suspension events for token revocation |
| F2 | Schema conventions, pgvector for skill reference embeddings |
| F6 | Object storage for skill reference files *(soft — text-only references work without it)* |
| F7 | Audit log for classification changes and credential operations |

Downstream: F3 (all tool access), F11 (workflow steps), and every module with an external integration.

## 15. Out of Scope / Future

| Excluded | Reasoning |
|---|---|
| Public connector marketplace | Product-stage concern, not v1 |
| End-user authoring of MCP servers | Connectors are built by the builder; skills are the user-authorable layer |
| Per-client credential isolation | v1 uses BPS's own credentials on clients' behalf. **Becomes mandatory when clients self-serve via M12** — flagged as a multi-tenancy blocker. |
| Automatic tool classification by model | Safety classification is a human judgement. Delegating it to a model defeats its purpose. |

## 16. Open Questions

| # | Question | Blocks | Owner |
|---|---|---|---|
| 1 | Which of the two Meta ad accounts is authoritative for client work versus BPS's own? | `meta.ads` credential setup | Rajesh |
| 2 | Both WABA IDs are active — is one for BPS and one for a client, and does each need separate credentials? | M10 design | Rajesh |
| 3 | Do clients grant BPS access to their own Meta/Google assets, or does BPS operate its own? This determines whether per-client credentials are needed sooner than expected. | Credential model | Rajesh |
| 4 | Where is the vault encryption key held — environment, or a dedicated secret manager? | FR-F4-14 | Builder |
| 5 | Which existing BPS conventions should seed the initial skill packs? The Detailing Devils pipeline and studio rate card are the obvious first two. | Skill authoring | Rajesh |
