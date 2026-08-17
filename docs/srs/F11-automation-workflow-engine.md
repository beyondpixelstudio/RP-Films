# F11 — Automation & Workflow Engine

| | |
|---|---|
| **Class** | WRAP (Activepieces) + BUILD (simplified operator layer) |
| **Batch** | 1 |
| **Depends on** | F1, F2, F4, F5 |
| **Replaces** | Make / Zapier class tooling; manual follow-up and reminder work |
| **Build estimate** | 4 weeks (embed + templates), +4 weeks (operator layer, deferrable) |
| **Status** | Draft |

## 1. Purpose & Scope

Runs deterministic, multi-step business logic that a human should be able to read, understand and modify — the automations that sit between "someone remembers to do it" and "an AI decides to do it."

**In scope:** embedded Activepieces engine, BPS piece (connector bridge to F4), workflow templates encoding BPS processes, trigger sources, execution history, error handling, the simplified operator layer.

**Not in scope:** agent reasoning (F3), external system access (F4 provides it), notification delivery (F5).

**Choosing between F11 and F3 is the most consequential design decision in day-to-day development.** The rule from `01-architecture.md` §5: if the logic is deterministic and an operator should be able to see and change it, it belongs here. If a judgement call is required, it belongs in F3. When in doubt, put it here — deterministic logic a human can read beats an agent decision nobody can audit.

## 2. Business Context

Several BPS processes are currently "someone remembers." The clearest is payment chasing: an invoice goes out from manager@, and a reminder follows days or weeks later depending on whether anyone noticed. The Takshashila payment-reminder email in the record is exactly this — manual, late, and dependent on attention.

Content delivery has the same shape. The Detailing Devils pipeline moves through calendar → scripts → captions → shoot → publish, with each handoff triggered by a person noticing the previous stage finished.

These are not AI problems. They are workflow problems, and treating them as AI problems would make them less reliable, not more.

### Why Activepieces rather than n8n

**n8n's Sustainable Use License prohibits embedding it in a product you sell, white-labeling it to customers, and letting external users trigger workflows as part of a paid service.** BPS intends both to resell modules to clients and eventually to sell the platform. That makes n8n a licensing dead end regardless of its technical merits.

Activepieces is MIT-licensed at its core with ~700 integrations, making it embeddable and resellable. Full assessment: [`docs/04-licensing.md`](../04-licensing.md).

n8n remains usable by BPS staff internally, with no client access, and never in the shipped product.

### What is copied from Make.com

Make's canvas is more approachable than n8n's for non-technical operators, which matters given F8's promise. The concepts worth reproducing:

| Make concept | Purpose |
|---|---|
| **Router** | Conditional branching into multiple paths |
| **Iterator** | Process an array item by item |
| **Aggregator** | Collect results back into one item |
| **Error handler branch** | Explicit failure path per step |
| **Data store** | Persistent state between runs |
| **Execution history** | Per-step input/output inspection — the single most useful debugging feature Make has |
| **Template library** | Common automations as one click, not a build |

Activepieces provides branching, loops and error handling natively. Data stores and the template library are BPS additions.

## 3. Personas & Roles

| Persona | Role | What they do here |
|---|---|---|
| Owner | `owner` | Approves automations affecting money or clients |
| Manager | `manager` | Enables templates, monitors failures |
| Department lead | `dept_lead` | Builds and edits automations for own department |
| Staff member | `member` | Triggers automations; sees results. Does not edit. |
| Agent | `service` | May trigger a workflow as a tool call |

## 4. Functional Requirements

### Engine & embedding

| ID | Requirement | Priority |
|---|---|---|
| FR-F11-01 | The system shall run Activepieces as a separate self-hosted service, unmodified. | Must |
| FR-F11-02 | The system shall authenticate operators into Activepieces via SSO from F1, with no separate login. | Must |
| FR-F11-03 | The system shall depend only on MIT-licensed Activepieces features; any feature outside the MIT core shall be verified before use. | Must |
| FR-F11-04 | The system shall provide a BPS piece exposing F4 tools as workflow steps, so connectors are defined once. | Must |
| FR-F11-05 | The BPS piece shall respect F4 tool classification — a `consequential` step in an automation shall route through F3's approval queue unless the automation itself was human-approved at activation. | Must |
| FR-F11-06 | The system shall pass org context to every workflow execution, and workflows shall not access data outside their org. | Must |

### Triggers

| ID | Requirement | Priority |
|---|---|---|
| FR-F11-07 | The system shall support schedule triggers (cron and interval). | Must |
| FR-F11-08 | The system shall support event triggers from the F5 event bus. | Must |
| FR-F11-09 | The system shall support webhook triggers with signature verification. | Must |
| FR-F11-10 | The system shall support manual triggers invoked by an operator. | Must |
| FR-F11-11 | The system shall support agent-invoked triggers, recording the invoking execution. | Must |
| FR-F11-12 | The system shall prevent a workflow from triggering itself recursively beyond a configurable depth. | Must |

### Control flow

| ID | Requirement | Priority |
|---|---|---|
| FR-F11-13 | Workflows shall support conditional branching on step output. | Must |
| FR-F11-14 | Workflows shall support iteration over arrays with per-item error isolation. | Must |
| FR-F11-15 | Workflows shall support aggregation of iterated results. | Must |
| FR-F11-16 | Workflows shall support an explicit error branch per step. | Must |
| FR-F11-17 | Workflows shall support delay and wait-until steps. | Must |
| FR-F11-18 | Workflows shall support a human-approval step that suspends execution pending a decision. | Must |
| FR-F11-19 | The system shall provide data stores — named key-value state persisting across runs, scoped by org. | Should |

### Execution & history

| ID | Requirement | Priority |
|---|---|---|
| FR-F11-20 | The system shall record every execution with per-step inputs, outputs, duration and status. | Must |
| FR-F11-21 | Execution history shall be inspectable step by step, showing exactly what data entered and left each step. | Must |
| FR-F11-22 | The system shall support replaying a failed execution from its point of failure. | Should |
| FR-F11-23 | The system shall retry transient step failures with backoff, respecting F4 idempotency rules. | Must |
| FR-F11-24 | The system shall never automatically retry a consequential step without an idempotency key. | Must |
| FR-F11-25 | The system shall alert the workflow owner on failure, in plain language stating what did not happen. | Must |
| FR-F11-26 | The system shall enforce an execution timeout, defaulting to 15 minutes. | Must |
| FR-F11-27 | The system shall disable a workflow automatically after a configurable number of consecutive failures, and notify. | Must |

### Templates

| ID | Requirement | Priority |
|---|---|---|
| FR-F11-28 | The system shall ship a library of templates encoding BPS processes, activatable without building. | Must |
| FR-F11-29 | Templates shall declare their required connectors and prompt for any missing ones at activation. | Must |
| FR-F11-30 | Templates shall be parameterised — client, timing, message content — without editing the workflow. | Must |
| FR-F11-31 | Activating a template that includes a consequential step shall require explicit confirmation naming that step. | Must |
| FR-F11-32 | Modules shall be able to ship templates as part of their own delivery. | Must |

### Operator layer *(deferrable — see §15)*

| ID | Requirement | Priority |
|---|---|---|
| FR-F11-33 | The system shall provide a simplified view listing active automations in plain language, with enable/disable and parameter editing, without exposing the canvas. | Should |
| FR-F11-34 | The simplified view shall show, for each automation, when it last ran, whether it succeeded, and what it did. | Should |
| FR-F11-35 | Operators without `dept_lead` shall be able to use the simplified view but not the canvas. | Should |

## 5. AI & Agent Capabilities

| | |
|---|---|
| **Agent** | `F11.workflow_explainer` |
| **Goal** | Describe what a workflow does, and why a specific run failed, in plain language |
| **Skills used** | `platform.diagnostics`, `platform.workflow_authoring` |
| **Connectors** | none — reads definitions and execution history |
| **Model tier** | T1 |
| **Autonomy** | `suggest` |
| **Approval gates** | none — explanation only |
| **Token budget** | 25k per invocation; 500k per month |
| **Failure mode** | Falls back to raw execution history |

**No agent may create, edit, enable or disable a workflow.** Automations run unattended and repeatedly; an agent-authored automation with a subtle error would repeat that error at machine speed against real clients. Workflow authorship is a human act.

An agent *may* propose a workflow as a draft for a human to review, build and activate. That is a suggestion, not an action.

## 6. Automations

The templates F11 ships. These encode the BPS processes currently held together by memory.

| Name | Trigger | Steps | Consequential? |
|---|---|---|---|
| **Invoice reminder ladder** | Invoice overdue 3 / 7 / 14 days | Check payment status → select tone from client history → draft reminder → **approval** → send via WhatsApp or email → log to CRM | Yes — sends to client |
| **Content pipeline handoff** | Stage marked complete (M4) | Notify next owner → create next-stage task → update calendar → alert if stage overdue | No |
| **New lead intake** | Webhook from form or Meta lead ad | Create CRM contact → deduplicate → assign by department rules → notify assignee → start follow-up timer | No |
| **Shoot day preparation** | 48 hours before scheduled shoot (O2) | Verify crew confirmed → verify equipment reserved → generate call sheet → notify crew → flag gaps to manager | No |
| **Client monthly report** | Month end | Gather metrics across channels → generate report → **approval** → deliver via portal → notify client | Yes — client-facing |
| **Review response** | New review received (M8) | Classify sentiment → draft response → **approval** → publish → notify if negative | Yes — publishes publicly |
| **Retainer renewal warning** | 30 days before retainer end | Compile delivery summary → notify owner → create renewal task | No |
| **Equipment return check** | Return date passed (O3) | Check status → notify holder → escalate to manager after 24 hours | No |
| **Onboarding checklist** | New employee record (H6) | Create accounts → assign skill pack → schedule check-ins → notify manager | No |

Every template with a consequential step routes through F3's approval queue. **The automation prepares; a human releases.**

## 7. Data Model

BPS owns orchestration metadata and templates; Activepieces owns workflow definitions and execution internals. Per `01-architecture.md` §6.3, upstream remains the system of record for its own domain.

```sql
CREATE TABLE f11_workflows (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id            uuid NOT NULL REFERENCES organisations(id),
  external_system   text NOT NULL DEFAULT 'activepieces',
  external_id       text NOT NULL,            -- Activepieces flow id
  name              text NOT NULL,
  description       text,
  department_id     uuid REFERENCES departments(id),
  module_id         text,                     -- owning module, if shipped by one
  template_key      text,                     -- source template, if instantiated
  trigger_kind      text NOT NULL CHECK (trigger_kind IN
                      ('schedule','event','webhook','manual','agent')),
  has_consequential_step boolean NOT NULL DEFAULT false,
  is_enabled        boolean NOT NULL DEFAULT false,
  activated_by      uuid REFERENCES users(id),
  activated_at      timestamptz,
  consecutive_failures integer NOT NULL DEFAULT 0,
  synced_at         timestamptz,
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now(),
  UNIQUE (org_id, external_id)
);

CREATE TABLE f11_templates (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id            uuid NOT NULL REFERENCES organisations(id),
  template_key      text NOT NULL,
  name              text NOT NULL,
  description       text NOT NULL,            -- plain language, for operators
  module_id         text,
  definition        jsonb NOT NULL,           -- Activepieces flow definition
  required_connectors text[] NOT NULL DEFAULT '{}',
  parameters        jsonb NOT NULL DEFAULT '[]',
  has_consequential_step boolean NOT NULL DEFAULT false,
  version           integer NOT NULL DEFAULT 1,
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now(),
  UNIQUE (org_id, template_key, version)
);

CREATE TABLE f11_executions (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id         uuid NOT NULL REFERENCES organisations(id),
  workflow_id    uuid NOT NULL REFERENCES f11_workflows(id),
  external_run_id text,
  trigger_kind   text NOT NULL,
  triggered_by   uuid REFERENCES users(id),
  agent_execution_id uuid,                    -- F3 execution, if agent-triggered
  status         text NOT NULL CHECK (status IN
                   ('running','succeeded','failed','timeout','awaiting_approval','cancelled')),
  step_count     integer NOT NULL DEFAULT 0,
  error          text,
  started_at     timestamptz NOT NULL DEFAULT now(),
  finished_at    timestamptz,
  created_at     timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE f11_data_stores (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id      uuid NOT NULL REFERENCES organisations(id),
  store_key   text NOT NULL,
  entry_key   text NOT NULL,
  value       jsonb NOT NULL,
  expires_at  timestamptz,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (org_id, store_key, entry_key)
);
```

Standard `org_id`, RLS, indexes and triggers per F2.

**Per-step execution detail lives in Activepieces**, surfaced through its API rather than duplicated. Copying it would double storage of client data under a second retention policy.

## 8. Connectors & Integrations

| System | Via | Auth | Failure mode |
|---|---|---|---|
| Activepieces | REST API + webhooks | Service token | Engine down → triggers queue in F5 and replay on recovery |
| F4 Connector Registry | BPS piece | Internal | Tool unavailable → step fails to its error branch |
| F5 Event Bus | Subscription | Internal | Event trigger delivery is at-least-once; workflows must be idempotent |
| F1 | OIDC SSO | — | SSO failure blocks canvas access, not execution |

**At-least-once delivery has a design consequence worth stating:** any workflow with a consequential step must be idempotent, or it will eventually double-send. FR-F11-24's idempotency requirement is what prevents a duplicate event from sending a client two payment reminders.

## 9. Screens & UX Flows

| Screen | Purpose |
|---|---|
| **Automation list** | All automations in plain language — what it does, when it last ran, whether it worked |
| Template library | Browsable templates by department, with plain-language descriptions |
| Template activation | Select template → connect missing connectors → set parameters → confirm consequential steps → activate |
| Workflow canvas | Embedded Activepieces builder, `dept_lead` and above |
| Execution history | Runs with status, filterable; drill into per-step input/output |
| Execution detail | Step-by-step data inspection — the Make feature worth copying most |
| Data stores | View and edit persistent workflow state |

### Two audiences, two surfaces

This is the core UX decision. A `dept_lead` building an automation needs the canvas. A manager who wants payment reminders to go out needs a list with a toggle and a plain-language description.

**Phase 1 ships the template library and the automation list.** The canvas is available to `dept_lead` and above via embedded Activepieces. The simplified operator layer (FR-F11-33/35) is a Phase 2 refinement — see §15.

## 10. Non-Functional Requirements

| Aspect | Requirement |
|---|---|
| Performance | Trigger to first step ≤ 5 s for event triggers; schedule accuracy within 60 s |
| Security | Workflows cannot access data outside their org; webhook triggers signature-verified; consequential steps gated |
| Availability | Engine restart must not lose queued triggers; in-flight executions resume or fail explicitly, never silently |
| Data retention | Execution history 6 months; templates indefinitely |
| Scale | 200 executions/day, 50 active workflows |

## 11. Compliance

- **Licensing** — Activepieces MIT core only. Using a feature outside the MIT core would reintroduce the exact problem that disqualified n8n. Verified at implementation and re-verified on upgrade.
- **WhatsApp Business Policy** — automated outbound messaging must respect template approval and opt-in rules, enforced at M10's tool level.
- **DPDP Act 2023** — automated communication to client contacts requires a lawful basis; consent state is checked by the M10/M11 tools the workflow calls, not by F11 itself.

## 12. Guided Mode Requirements

- **First-run:** present the template library rather than an empty canvas. An empty automation builder is the single most intimidating screen a non-technical operator can be shown.
- **Explain-this:** "trigger", "step", "branch", "workflow" — grounded in a concrete BPS example rather than abstract definitions.
- **Next-best-action:** suggest templates matching processes the platform can see are manual — e.g. offer the invoice reminder ladder once Fin1 shows overdue invoices.
- **Guardrails:** activating an automation with a consequential step requires typed confirmation naming that step. Disabling an automation states what stops happening. A workflow failing repeatedly disables itself rather than failing loudly forever.

## 13. Acceptance Criteria

1. Given a template with a consequential step, when activated, then explicit confirmation naming that step is required before it runs.
2. Given the invoice reminder ladder is active and an invoice is 7 days overdue, when it triggers, then a reminder is drafted and enqueued for approval — not sent.
3. Given an event is delivered twice, when a workflow with an idempotency key processes both, then exactly one effective action occurs.
4. Given a step fails, when the error branch is defined, then execution follows it rather than aborting.
5. Given a workflow fails on consecutive runs beyond threshold, then it is disabled automatically and the owner is notified.
6. Given an execution completes, when history is opened, then every step's input and output is inspectable.
7. Given an agent attempts to create or enable a workflow, then the action is refused.
8. Given Activepieces is unavailable, when an event trigger fires, then it queues and replays on recovery rather than being lost.
9. Given a `member` opens the automation area, then they see the plain-language list and cannot reach the canvas.
10. Given a workflow executes, then it accesses only data within its org, verified by RLS.

## 14. Dependencies

| Module | What is needed |
|---|---|
| F1 | SSO into Activepieces, roles for canvas access |
| F2 | Schema conventions |
| F4 | Tool registry and classification for the BPS piece |
| F5 | Event triggers and failure notification |
| F3 | Approval queue for consequential steps |

Downstream: every module shipping templates — M4, M10, M12, O2, O3, Fin1, Fin4, H6, M8.

## 15. Out of Scope / Future

| Excluded | Reasoning |
|---|---|
| **Custom visual canvas built from scratch** | Building a Make-quality canvas is months of work and would blow the six-week module rule. Embedding Activepieces' builder gets 90% of the value immediately. **This is the single largest scope saving in Batch 1.** |
| Simplified operator layer in Phase 1 | Genuinely valuable, but the template library covers the same need at a fraction of the cost. Deferred deliberately, not forgotten. |
| Client-facing automation building | Product-stage concern. Also a licensing question to re-check before exposing Activepieces to external users. |
| Agent-authored workflows | See §5. Agents may propose; humans build. |
| Workflow versioning and rollback | Activepieces provides some natively; assess before building anything. |

## 16. Open Questions

| # | Question | Blocks | Owner |
|---|---|---|---|
| 1 | Which Activepieces features sit outside the MIT core? Must be verified before any dependency is taken. | FR-F11-03 | Builder |
| 2 | Is n8n currently in use at BPS? If so, existing workflows need migrating or retiring. | Migration scope | Rajesh |
| 3 | What is the correct reminder ladder timing — 3/7/14 days is assumed, not evidenced. | Invoice template | Rajesh |
| 4 | Should reminder tone genuinely vary by client payment history, and who decides the categories? | Invoice template | Rajesh |
| 5 | Do department leads want to build automations, or should all authorship sit with Rajesh initially? | FR-F11-35 role model | Rajesh |
