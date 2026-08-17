# F10 — AI Model Router & Cost Governor

| | |
|---|---|
| **Class** | BUILD |
| **Batch** | 1 |
| **Depends on** | F1, F2 |
| **Replaces** | Individual AI subscriptions; uncontrolled per-seat AI spend |
| **Build estimate** | 4 weeks |
| **Status** | Draft |

## 1. Purpose & Scope

Every AI call in the platform passes through F10. It decides which model serves a request, enforces budgets, applies caching, and accounts for cost.

**In scope:** provider registry, task-class routing, tier policy, caching, token accounting, budget enforcement, fallback chains, cost attribution, telemetry.

**Not in scope:** agent behaviour (F3), tool access (F4), prompt content (module SRSs and F4 skills).

**The governing design rule:** modules never name a model. They declare a *task class*, and F10 maps that to a tier and a provider. This indirection is what allows the entire platform to be re-tiered as prices and models change — which they will, repeatedly.

## 2. Business Context

The stated requirement was to integrate popular AI models across departments, "optimised to run efficiently with zero cost."

Zero is not achievable for quality work. But the requirement behind it is sound, and F10 is the honest answer to it: **spend that scales with value, not with volume.** Roughly 80% of AI calls in a platform like this are classification, extraction, tagging, embedding and short summarisation — work that runs at zero marginal cost on local or free-tier models. The remaining 20% is strategy and client-facing output, where paying for a frontier model is the correct decision.

BPS already holds an Anthropic subscription and has trialled several AI bundle tools, at least one now expired. Consolidating that spend behind one router — with per-department and per-client attribution — turns an unmanaged cost into a measured one.

Full strategy, tier definitions and honest cost expectations: [`docs/05-ai-model-strategy.md`](../05-ai-model-strategy.md).

## 3. Personas & Roles

| Persona | Role | What they do here |
|---|---|---|
| Owner | `owner` | Sets budgets, configures providers, reviews spend |
| Manager | `manager` | Monitors departmental spend |
| Department lead | `dept_lead` | Reviews own department's usage |
| Agent | `service` | Consumes routing transparently |

## 4. Functional Requirements

### Provider registry

| ID | Requirement | Priority |
|---|---|---|
| FR-F10-01 | The system shall maintain a registry of model providers with endpoint, auth, supported models, tier and per-token pricing. | Must |
| FR-F10-02 | Provider and model configuration shall be data, changeable without a deploy. | Must |
| FR-F10-03 | The system shall support at least two viable providers per tier at all times. | Must |
| FR-F10-04 | The system shall allow the `owner` to enable or disable any provider instantly. | Must |
| FR-F10-05 | Model identifiers shall not appear anywhere outside this registry. | Must |
| FR-F10-06 | The system shall record which model actually served each request. | Must |

### Task-class routing

| ID | Requirement | Priority |
|---|---|---|
| FR-F10-07 | Every AI request shall declare a task class from a defined vocabulary. | Must |
| FR-F10-08 | The system shall map task class → tier → provider, in that order. | Must |
| FR-F10-09 | The system shall reject a request with an unrecognised task class rather than guessing a tier. | Must |
| FR-F10-10 | The system shall route all task classes producing client-visible output to T2, with no cost-based downgrade available. | Must |
| FR-F10-11 | The system shall route requests marked as containing personal or financial data to local T0 inference where the task class permits. | Must |
| FR-F10-12 | Routing rules shall be configurable by the `owner` without a deploy. | Should |

**Task-class vocabulary:**

| Class | Tier | Client-visible |
|---|---|---|
| `embed` | T0 | No |
| `classify` | T0 | No |
| `extract` | T0 | No |
| `summarise-short` | T0/T1 | No |
| `draft-bulk` | T1 | No |
| `enrich` | T1 | No |
| `translate` | T1 | No |
| `draft-client-facing` | **T2** | **Yes** |
| `strategy` | **T2** | **Yes** |
| `agent-multistep` | **T2** | Varies |
| `code` | **T2** | No |

### Caching

| ID | Requirement | Priority |
|---|---|---|
| FR-F10-13 | The system shall use provider-native prompt caching for stable system prompts and skill definitions where supported. | Must |
| FR-F10-14 | The system shall implement semantic caching — embed the request, return a cached response above a configurable similarity threshold. | Should |
| FR-F10-15 | Semantic caching shall be disabled by default for `draft-client-facing` and `strategy`, where near-duplicate output across clients is a quality failure. | Must |
| FR-F10-16 | Cache entries shall be scoped by org and client; a cached response shall never cross a client boundary. | Must |
| FR-F10-17 | The system shall record cache hit rate per task class. | Must |
| FR-F10-18 | The system shall allow cache invalidation by task class, client or time range. | Should |

### Budgets

| ID | Requirement | Priority |
|---|---|---|
| FR-F10-19 | The system shall enforce per-agent budgets, per invocation and per month, as defined in F3. | Must |
| FR-F10-20 | The system shall enforce a platform-wide monthly budget. | Must |
| FR-F10-21 | Exceeding an invocation budget shall halt the request with an explicit error, never silently truncate context or output. | Must |
| FR-F10-22 | Exceeding a monthly budget shall alert at 80% and 100%; behaviour at 100% shall be configurable between alert-only and hard stop. | Must |
| FR-F10-23 | A hard stop shall never block an in-flight approval decision or a safety-critical path. | Must |
| FR-F10-24 | The system shall support per-client budgets, so a retainer's AI cost can be measured against its fee. | Should |

### Fallback

| ID | Requirement | Priority |
|---|---|---|
| FR-F10-25 | The system shall define an ordered fallback chain per tier. | Must |
| FR-F10-26 | On provider failure or rate limit, the system shall try the next provider in the same tier. | Must |
| FR-F10-27 | The system shall never silently downgrade a T2 request to a lower tier. | Must |
| FR-F10-28 | Where no provider in the required tier is available, the system shall fail explicitly and queue for retry. | Must |
| FR-F10-29 | The system shall record every fallback event. | Must |

### Accounting & telemetry

| ID | Requirement | Priority |
|---|---|---|
| FR-F10-30 | The system shall record input tokens, output tokens, cached tokens, model, latency and computed cost for every request. | Must |
| FR-F10-31 | Every request shall be attributed to module, agent, invoking user, and client where applicable. | Must |
| FR-F10-32 | The system shall compute cost in INR using configured rates, storing the rate used so historical figures remain reproducible. | Must |
| FR-F10-33 | The system shall expose spend aggregates by module, department, client, agent, tier and period. | Must |
| FR-F10-34 | The system shall report call volume per tier per month, as the evidence base for the local-inference decision. | Must |

## 5. AI & Agent Capabilities

| | |
|---|---|
| **Agent** | `F10.spend_analyst` |
| **Goal** | Explain spend changes and identify routing inefficiency |
| **Skills used** | `platform.cost_analysis` |
| **Connectors** | none — reads own telemetry |
| **Model tier** | T1 |
| **Autonomy** | `suggest` |
| **Approval gates** | none — analysis only; **cannot alter routing rules** |
| **Token budget** | 30k per invocation; 400k per month |
| **Failure mode** | Falls back to the raw spend dashboard |

The agent may recommend that a task class be re-tiered. It cannot make the change. A system that could cheapen its own routing under model control would, given a cost objective, eventually route client-facing work to a cheap model — which is precisely the failure FR-F10-10 exists to prevent.

## 6. Automations

| Name | Trigger | Steps | Editable |
|---|---|---|---|
| Budget threshold alert | 80% / 100% of monthly budget | Compute spend → notify owner with breakdown by module and client | Yes |
| Provider health probe | Every 5 minutes | Probe each enabled provider → mark unhealthy → reorder fallback | No |
| Monthly cost report | 1st of month | Aggregate prior month → per-client and per-department breakdown → deliver to owner | Yes |
| Local-inference review | Quarterly | Compare T0/T1 volume against GPU instance cost → recommend or defer | Yes |

## 7. Data Model

```sql
CREATE TABLE f10_providers (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id       uuid NOT NULL REFERENCES organisations(id),
  provider_key text NOT NULL,                -- 'anthropic', 'google', 'groq', 'ollama_local'
  name         text NOT NULL,
  endpoint     text NOT NULL,
  credential_id uuid REFERENCES f4_credentials(id),
  is_enabled   boolean NOT NULL DEFAULT true,
  health_status text NOT NULL DEFAULT 'unknown',
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now(),
  UNIQUE (org_id, provider_key)
);

CREATE TABLE f10_models (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id            uuid NOT NULL REFERENCES organisations(id),
  provider_id       uuid NOT NULL REFERENCES f10_providers(id),
  model_key         text NOT NULL,
  tier              text NOT NULL CHECK (tier IN ('T0','T1','T2')),
  context_window    integer NOT NULL,
  supports_tools    boolean NOT NULL DEFAULT false,
  supports_caching  boolean NOT NULL DEFAULT false,
  price_in_per_mtok_minor  bigint NOT NULL,   -- INR paise per 1M input tokens
  price_out_per_mtok_minor bigint NOT NULL,
  currency          char(3) NOT NULL DEFAULT 'INR',
  fallback_order    integer NOT NULL DEFAULT 100,
  is_enabled        boolean NOT NULL DEFAULT true,
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now(),
  UNIQUE (org_id, provider_id, model_key)
);

CREATE TABLE f10_routing_rules (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id         uuid NOT NULL REFERENCES organisations(id),
  task_class     text NOT NULL,
  tier           text NOT NULL CHECK (tier IN ('T0','T1','T2')),
  is_client_visible boolean NOT NULL DEFAULT false,
  allow_semantic_cache boolean NOT NULL DEFAULT true,
  require_local  boolean NOT NULL DEFAULT false,
  created_at     timestamptz NOT NULL DEFAULT now(),
  updated_at     timestamptz NOT NULL DEFAULT now(),
  UNIQUE (org_id, task_class)
);

CREATE TABLE f10_requests (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id         uuid NOT NULL REFERENCES organisations(id),
  task_class     text NOT NULL,
  tier_requested text NOT NULL,
  model_id       uuid REFERENCES f10_models(id),
  module_id      text NOT NULL,
  agent_key      text,
  execution_id   uuid,
  user_id        uuid REFERENCES users(id),
  client_id      uuid,
  tokens_in      bigint NOT NULL DEFAULT 0,
  tokens_out     bigint NOT NULL DEFAULT 0,
  tokens_cached  bigint NOT NULL DEFAULT 0,
  cache_hit      boolean NOT NULL DEFAULT false,
  cost_minor     bigint NOT NULL DEFAULT 0,
  currency       char(3) NOT NULL DEFAULT 'INR',
  rate_snapshot  jsonb,                       -- prices used, for reproducibility
  latency_ms     integer,
  fallback_count integer NOT NULL DEFAULT 0,
  status         text NOT NULL CHECK (status IN
                   ('succeeded','failed','budget_exceeded','no_provider','timeout')),
  error          text,
  created_at     timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX f10_requests_attribution_idx
  ON f10_requests (org_id, created_at, module_id, client_id);

CREATE TABLE f10_budgets (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id        uuid NOT NULL REFERENCES organisations(id),
  scope         text NOT NULL CHECK (scope IN ('platform','module','agent','client')),
  scope_ref     text,
  period        text NOT NULL DEFAULT 'monthly',
  limit_minor   bigint NOT NULL,
  currency      char(3) NOT NULL DEFAULT 'INR',
  on_exceed     text NOT NULL DEFAULT 'alert' CHECK (on_exceed IN ('alert','hard_stop')),
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now(),
  UNIQUE (org_id, scope, scope_ref, period)
);

CREATE TABLE f10_semantic_cache (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id        uuid NOT NULL REFERENCES organisations(id),
  client_id     uuid,
  task_class    text NOT NULL,
  request_hash  text NOT NULL,
  embedding     vector(1024) NOT NULL,
  response      jsonb NOT NULL,
  model_key     text NOT NULL,
  hit_count     integer NOT NULL DEFAULT 0,
  expires_at    timestamptz NOT NULL,
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX f10_semantic_cache_lookup_idx
  ON f10_semantic_cache USING hnsw (embedding vector_cosine_ops);
```

Standard `org_id`, RLS, indexes and triggers per F2.

**`rate_snapshot` matters more than it appears.** Provider prices change. Without recording the rate applied at the time, last quarter's cost report silently rewrites itself when a price updates — and a client's billed AI cost becomes unreconcilable.

## 8. Connectors & Integrations

| System | Via | Auth | Notes |
|---|---|---|---|
| Anthropic | HTTPS API | API key via F4 vault | T2 |
| Google AI | HTTPS API | API key via F4 vault | T0 free tier and T2 |
| Groq / Cerebras | HTTPS API | API key via F4 vault | T0 free tier |
| OpenRouter | HTTPS API | API key via F4 vault | T1 aggregation, provider diversity |
| Ollama | Local HTTP | none | T0 local — embeddings and small classifiers |

**Start API-only, including T0.** Free tiers cover early volume with no infrastructure cost. FR-F10-34's telemetry is what later proves or disproves the GPU case. Provisioning a GPU before that evidence exists is speculative spending in the name of saving money.

## 9. Screens & UX Flows

| Screen | Purpose |
|---|---|
| **Spend dashboard** | Month-to-date total, trend, breakdown by module, department, client, tier |
| Provider settings | Registered providers, models, tiers, pricing, health, enable/disable |
| Routing rules | Task class → tier mapping, editable with impact warning |
| Budget settings | Platform, module, agent and client budgets with exceed behaviour |
| Request log | Filterable per-request telemetry for debugging |
| Cache performance | Hit rate by task class, estimated saving |

The spend dashboard answers the question the owner actually has — *"is this costing me more than it saves?"* — with per-client attribution, so an AI cost can be set against the retainer fee it supports.

## 10. Non-Functional Requirements

| Aspect | Requirement |
|---|---|
| Performance | Routing decision ≤ 5 ms; cache lookup ≤ 20 ms |
| Security | Provider keys held only in the F4 vault; prompt content not logged for `personal`/`financial` sensitivity requests |
| Availability | No single provider is a hard dependency; T2 unavailability queues rather than downgrades |
| Data retention | Request telemetry 24 months (needed for year-on-year comparison); cache per TTL |
| Scale | 50,000 requests/month initially |

## 11. Compliance

- **DPDP Act 2023** — sending client personal data to a third-party provider requires a lawful basis and a processing record. `f10_requests` provides the record; FR-F10-11 keeps sensitive extraction local where possible.
- **Provider terms** — data-use and training-opt-out terms vary by provider and must be recorded per provider in the registry. A provider that trains on submitted data is unacceptable for client content.
- **Client confidentiality** — FR-F10-16's cache scoping prevents one client's cached output surfacing in another's request.

## 12. Guided Mode Requirements

- **First-run:** explain that the platform uses several AI models and picks the cheapest one adequate for each task; set an initial monthly budget with a suggested starting figure.
- **Explain-this:** "token", "tier", "task class", "cache hit" — a business owner should not need to learn what a token is to use this platform, but should be able to find out when a bill prompts the question.
- **Next-best-action:** flag budgets nearing exhaustion; surface task classes with unusually low cache hit rates; report when T0 volume would justify local inference.
- **Guardrails:** re-tiering a client-visible task class downward is blocked outright, not merely warned about. Reducing a budget below current month-to-date spend warns what will stop working. Disabling the last provider in a tier is refused.

## 13. Acceptance Criteria

1. Given a request with task class `draft-client-facing`, when routed, then a T2 model serves it, and no configuration can route it lower.
2. Given a request with an unrecognised task class, when submitted, then it is rejected with an error naming the valid classes.
3. Given the primary T2 provider is unavailable, when a T2 request arrives, then the next T2 provider serves it and a fallback event is recorded.
4. Given no T2 provider is available, when a T2 request arrives, then it fails explicitly and queues — it is never served by T1.
5. Given a cached response exists for client A, when client B submits a similar request, then the cache is not used.
6. Given an agent exceeds its invocation budget, when the limit is reached, then the request halts with an error and no truncated output is returned.
7. Given provider pricing changes, when a historical cost report is regenerated, then prior months show the rates in effect at the time.
8. Given a month of activity, when the spend dashboard is opened, then cost is attributable to module, department, client and agent.
9. Given a request marked `financial` sensitivity with task class `extract`, when routed, then a local T0 model serves it.
10. Given the `F10.spend_analyst` agent runs, when it recommends re-tiering, then no routing rule changes without a human edit.

## 14. Dependencies

| Module | What is needed |
|---|---|
| F1 | Users, permissions, org context |
| F2 | Schema conventions, pgvector, money handling, `data_sensitivity` marking |
| F4 | Credential vault for provider API keys |
| F5 | Budget alert delivery *(soft — direct notification acceptable initially)* |

Downstream: F3, and every module with AI capability.

## 15. Out of Scope / Future

| Excluded | Reasoning |
|---|---|
| Model fine-tuning | Skills (F4) achieve specialisation without training cost or lock-in |
| Automatic prompt optimisation | Opaque, hard to review, and risks silently changing client-facing output |
| Reselling AI capacity to clients as a metered product | Interesting revenue line; entirely a product-stage concern |
| Multi-region routing | No latency or residency requirement identified |

## 16. Open Questions

| # | Question | Blocks | Owner |
|---|---|---|---|
| 1 | What monthly AI budget is acceptable, and should 100% hard-stop or alert only? | FR-F10-20, FR-F10-22 | Rajesh |
| 2 | Which T0 embedding model, and therefore what vector dimension? Fixes the schema in F3 and F4. | Schema | Builder |
| 3 | Should AI cost be attributed to clients for margin analysis, or absorbed as overhead? | FR-F10-24 priority | Rajesh |
| 4 | Are any providers unacceptable on data-use grounds — specifically, any that train on submitted content? | Provider registry | Rajesh |
| 5 | What monthly infrastructure budget exists? Determines whether local T0 inference is viable at all. | Local inference decision | Rajesh |
