# F8 — Guided Mode & Onboarding

| | |
|---|---|
| **Class** | BUILD |
| **Batch** | 2 |
| **Depends on** | F1, F2, F3, F4, F10 |
| **Replaces** | Vendor onboarding calls; tribal knowledge held in one person's head |
| **Build estimate** | 4 weeks |
| **Status** | Draft |

## 1. Purpose & Scope

The layer that makes the platform usable by someone who did not build it. Every module declares its guided-mode requirements; F8 provides the mechanism that renders them.

**In scope:** first-run setup, contextual explanation, next-best-action surfacing, guardrail presentation, in-app help, the platform assistant, progressive disclosure.

**Not in scope:** module-specific content — each SRS writes its own §12; F8 renders it.

**This is a first-class requirement, not polish.** The stated goal is that a small business owner with basic knowledge can be guided, understand the system, and get value from it. A platform only its builder can operate has failed regardless of feature completeness.

## 2. Business Context

BPS pays for vendor onboarding today. Makunai ran repeated calls through April, May and June 2026 — "Pre onboarding sheet", "Maglo CRM", "Maglo + Babbler", "Babbler Discussion" — spanning months for two products. That is what commercial software does to compensate for interfaces that cannot explain themselves.

Two BPS-specific pressures make this harder than usual:

**Staff turnover in a small agency.** Institutional knowledge concentrated in one person is a business risk. F4 skill packs capture *how BPS does the work*; F8 captures *how the platform does it*.

**The platform is intended to become a product.** Every small business owner who eventually uses it will arrive with less context than Rajesh has. If guided mode is retrofitted, it will be retrofitted badly — the affordances it needs (declared next-best-actions, structured explanations) have to exist in each module from the start. That is why every SRS carries a §12.

## 3. Personas & Roles

| Persona | Role | What they do here |
|---|---|---|
| Rajesh | `owner` | Runs first-time setup; configures for staff |
| New staff member | `member` | Learns the platform without a trainer |
| Occasional user | `member` | Returns after weeks; needs re-orientation |
| Client contact | `client_guest` | Uses M12 with no training at all |

The **occasional user** is the hardest case and the most common. A DOP who opens the platform twice a month has forgotten the vocabulary each time.

## 4. Functional Requirements

### First-run setup

| ID | Requirement | Priority |
|---|---|---|
| FR-F8-01 | The system shall provide a setup checklist covering organisation, departments, users, connectors and first client. | Must |
| FR-F8-02 | The checklist shall be resumable, showing progress and remaining steps. | Must |
| FR-F8-03 | Each step shall state what it enables, so the user understands why it matters. | Must |
| FR-F8-04 | The checklist shall order steps by dependency, never offering a step whose prerequisites are unmet. | Must |
| FR-F8-05 | The system shall support skipping optional steps and returning later. | Must |
| FR-F8-06 | Modules shall register their own setup steps, so the checklist grows with the platform. | Must |

### Contextual explanation

| ID | Requirement | Priority |
|---|---|---|
| FR-F8-07 | The system shall provide an explain-this affordance on any term or screen carrying a registered explanation. | Must |
| FR-F8-08 | Explanations shall be written in plain language, grounded in a concrete BPS example. | Must |
| FR-F8-09 | Explanations shall be authored content, not model-generated at read time. | Must |
| FR-F8-10 | The system shall support screen-level orientation: what this screen is for, and what to do first. | Must |
| FR-F8-11 | Explanations shall be editable by the `owner`, so BPS vocabulary can replace generic terms. | Should |

FR-F8-09 matters more than it appears. A model-generated explanation of a safety-critical concept — what an approval gate does, what an autonomy level means — could be subtly wrong on any given render. **Explanations of how the platform behaves are authored, reviewed and stable.**

### Next-best-action

| ID | Requirement | Priority |
|---|---|---|
| FR-F8-12 | Modules shall register next-best-action providers returning ranked, actionable items. | Must |
| FR-F8-13 | The system shall present a consolidated action surface on the home screen, filtered by the user's role and departments. | Must |
| FR-F8-14 | Each action shall state what it is, why it matters, and link directly to where it is resolved. | Must |
| FR-F8-15 | The system shall rank actions by urgency and consequence, not by module order. | Must |
| FR-F8-16 | The system shall allow dismissing an action, with a record so it is not re-raised immediately. | Must |
| FR-F8-17 | Actions shall never exceed a configurable display limit, defaulting to seven. | Must |
| FR-F8-18 | The system shall surface pending F3 approvals with the highest priority available. | Must |

FR-F8-17 exists because an action list of forty items is a backlog, not guidance — and is ignored exactly like one.

### Guardrails

| ID | Requirement | Priority |
|---|---|---|
| FR-F8-19 | The system shall provide a consistent confirmation pattern for consequential actions, stating what will happen and what cannot be undone. | Must |
| FR-F8-20 | Blocked actions shall explain why they are blocked and what would unblock them. | Must |
| FR-F8-21 | The system shall distinguish blocked (impossible) from warned (discouraged) and never present one as the other. | Must |
| FR-F8-22 | High-consequence confirmations shall require typed confirmation rather than a single click. | Must |
| FR-F8-23 | Error messages shall state the cause and the next step, never a bare code or a raw provider error. | Must |

### Platform assistant

| ID | Requirement | Priority |
|---|---|---|
| FR-F8-24 | The system shall provide an assistant answering questions about how to use the platform. | Must |
| FR-F8-25 | The assistant shall answer from authored documentation and the current screen's context. | Must |
| FR-F8-26 | The assistant shall state when it does not know, rather than inferring platform behaviour. | Must |
| FR-F8-27 | The assistant shall be able to navigate the user to the relevant screen. | Should |
| FR-F8-28 | The assistant shall not perform actions on the user's behalf. | Must |

FR-F8-28 is deliberate. An assistant that acts is an agent, and belongs under F3's approval regime. Keeping the help system read-only removes a whole class of confusion about what just happened and who did it.

### Progressive disclosure

| ID | Requirement | Priority |
|---|---|---|
| FR-F8-29 | The system shall hide advanced configuration behind explicit disclosure. | Should |
| FR-F8-30 | The system shall support a simplified view per module for non-specialist users. | Should |
| FR-F8-31 | The system shall not surface a module in navigation until its prerequisites are configured. | Should |

## 5. AI & Agent Capabilities

### `F8.platform_assistant`

| | |
|---|---|
| **Goal** | Answer "how do I…" questions about the platform |
| **Skills** | `platform.user_guide` |
| **Connectors** | none — retrieves authored documentation only |
| **Model tier** | T1 (`summarise-short`); T0 for retrieval |
| **Autonomy** | `suggest` |
| **Approval gates** | none — it cannot act |
| **Token budget** | 8k per question; 1M per month |
| **Failure mode** | Falls back to documentation search |

**Retrieval is restricted to authored platform documentation.** It does not read client data, and it does not answer business questions — "how do I create a broadcast" is in scope; "should I raise my prices" is not. Keeping that boundary sharp is what makes its answers trustworthy.

## 6. Automations

| Name | Trigger | Steps | Consequential |
|---|---|---|---|
| Setup progress nudge | Checklist incomplete after 7 days | Notify owner with remaining steps and what they unlock | No |
| Stale action cleanup | Nightly | Expire dismissed actions past their re-raise window | No |
| Unused module flag | Module configured but unused for 30 days | Suggest a starting action or offer to hide it | No |

## 7. Data Model

```sql
CREATE TABLE f8_setup_steps (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id        uuid NOT NULL REFERENCES organisations(id),
  step_key      text NOT NULL,
  module_id     text,
  title         text NOT NULL,
  description   text NOT NULL,           -- what this enables, plain language
  depends_on    text[] NOT NULL DEFAULT '{}',
  is_optional   boolean NOT NULL DEFAULT false,
  sort_order    integer NOT NULL DEFAULT 100,
  UNIQUE (org_id, step_key)
);

CREATE TABLE f8_setup_progress (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id        uuid NOT NULL REFERENCES organisations(id),
  step_key      text NOT NULL,
  status        text NOT NULL DEFAULT 'pending'
                CHECK (status IN ('pending','completed','skipped')),
  completed_by  uuid REFERENCES users(id),
  completed_at  timestamptz,
  UNIQUE (org_id, step_key)
);

CREATE TABLE f8_explanations (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id        uuid NOT NULL REFERENCES organisations(id),
  term_key      text NOT NULL,           -- 'approval_gate', 'service_window'
  module_id     text,
  title         text NOT NULL,
  body          text NOT NULL,           -- plain language, BPS example
  is_customised boolean NOT NULL DEFAULT false,
  embedding     vector(1024),
  updated_by    uuid REFERENCES users(id),
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now(),
  UNIQUE (org_id, term_key)
);

CREATE TABLE f8_action_dismissals (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id        uuid NOT NULL REFERENCES organisations(id),
  user_id       uuid NOT NULL REFERENCES users(id),
  action_key    text NOT NULL,
  subject_id    uuid,
  re_raise_after timestamptz,
  created_at    timestamptz NOT NULL DEFAULT now(),
  UNIQUE (org_id, user_id, action_key, subject_id)
);
```

Standard `org_id`, RLS, indexes and triggers per F2.

**Next-best-actions are computed at read time, never stored.** A persisted action list goes stale, and stale guidance is worse than none — it teaches the user to ignore the surface.

## 8. Connectors & Integrations

None external. F8 consumes registrations from every module through internal interfaces:

| Interface | Provided by | Purpose |
|---|---|---|
| Setup step registration | Every module | Contributes to the checklist |
| Next-best-action provider | Every module | Contributes ranked actions |
| Explanation registration | Every module | Contributes authored terms |

**These three interfaces are the reason F8 must be specified in Batch 2 rather than late.** Modules built before the interfaces exist will not implement them, and retrofitting guidance across forty modules is exactly the failure this ordering avoids.

## 9. Screens & UX Flows

| Screen | Purpose |
|---|---|
| **Home / action surface** | Ranked next-best-actions for this user, approvals first |
| Setup checklist | Progress, remaining steps, what each unlocks |
| Explain-this overlay | Inline definition with a BPS example, on any registered term |
| Assistant panel | Question and answer, with navigation links |
| Help centre | Browsable authored documentation |

The home screen is the platform's answer to "what should I do now". For an owner running six departments, that question is the whole reason to open the system.

## 10. Non-Functional Requirements

| Aspect | Requirement |
|---|---|
| Performance | Action surface ≤ 500 ms; explain-this overlay ≤ 100 ms |
| Security | Actions respect the user's permissions — never surface an action they cannot perform |
| Availability | F8 failure must degrade gracefully; the platform stays usable without guidance |
| Data retention | Dismissals 90 days; explanations indefinitely |
| Scale | 50 registered action providers |

## 11. Compliance

- **Accessibility** — WCAG 2.1 AA for explanation overlays and the action surface. A guidance layer that cannot be read by everyone fails its own purpose.
- **DPDP Act 2023** — the assistant must not surface personal data in help responses; retrieval is restricted to authored documentation.

## 12. Guided Mode Requirements

F8's own guided-mode requirements are recursive but real:

- **First-run:** explain what guided mode is, in one sentence, then get out of the way.
- **Explain-this:** the affordance must be discoverable without explanation — a consistent, visible marker.
- **Next-best-action:** the empty state is a success state. "Nothing needs your attention" should feel good, not broken.
- **Guardrails:** dismissing an action must not be mistakable for completing it.

## 13. Acceptance Criteria

1. Given a fresh installation, when the owner logs in, then a setup checklist appears with dependency-ordered steps.
2. Given a step's prerequisites are unmet, when the checklist renders, then that step is not offered as actionable.
3. Given a screen with registered terms, when explain-this is invoked, then an authored plain-language definition with a BPS example appears.
4. Given a user with pending F3 approvals, when the home screen loads, then those appear above all other actions.
5. Given more than seven actions qualify, when the surface renders, then only the top seven by urgency and consequence are shown.
6. Given a user lacks permission for an action, when the surface renders, then that action is absent.
7. Given a blocked action, when attempted, then the message states why and what would unblock it.
8. Given the assistant is asked something outside authored documentation, then it states it does not know rather than inferring.
9. Given the assistant is asked to perform an action, then it declines and navigates to where the user can do it.
10. Given F8 is unavailable, when any module is used, then it remains fully functional without guidance.

## 14. Dependencies

| Module | What is needed |
|---|---|
| F1 | Users, roles, permissions for action filtering |
| F2 | Schema conventions, pgvector for explanation retrieval |
| F3 | Pending approvals for the action surface |
| F4 | `platform.user_guide` skill |
| F10 | Model routing for the assistant |

Downstream: every module registers setup steps, actions and explanations with F8.

## 15. Out of Scope / Future

| Excluded | Reasoning |
|---|---|
| Interactive product tours | High build cost, low retention; explain-this serves the same need on demand |
| Video tutorials | Content production cost; revisit at product stage |
| Model-generated explanations | FR-F8-09 — safety-relevant explanations must be stable and reviewed |
| Assistant that performs actions | That is an agent; belongs under F3's approval regime |
| Per-user personalised onboarding paths | Premature; role-based filtering is sufficient |

## 16. Open Questions

| # | Question | Blocks | Owner |
|---|---|---|---|
| 1 | Should explanations be available in Odia or Hindi for staff, or is English sufficient? | Content authoring | Rajesh |
| 2 | Who writes the authored explanations — Rajesh, or drafted and reviewed? | Content ownership | Rajesh |
| 3 | Which staff will realistically use the platform daily versus occasionally? Shapes how aggressive progressive disclosure should be. | FR-F8-30 | Rajesh |
| 4 | Should the assistant be available to `client_guest` users in M12? | Portal scope | Rajesh |
