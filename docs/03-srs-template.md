# 03 — SRS Template

Every module SRS follows this structure. Consistency is what makes 46 documents reviewable.

**File naming:** `docs/srs/<ID>-<kebab-case-name>.md` — e.g. `M10-whatsapp-business-platform.md`

**WRAP and HOST modules** fill in only the extension surface and integration contract for sections 4, 6 and 7, pointing to upstream documentation for base functionality. They still complete every other section — especially 5, 11 and 12.

---

## Template

````markdown
# <ID> — <Module Name>

| | |
|---|---|
| **Class** | BUILD / WRAP / HOST |
| **Batch** | 1–6 |
| **Depends on** | comma-separated module IDs |
| **Replaces** | subscription or manual process, or "n/a" |
| **Build estimate** | weeks of AI-assisted solo work |
| **Status** | Draft / Reviewed / Approved |

## 1. Purpose & Scope

What this module does, in two or three sentences. What it explicitly does not do.

## 2. Business Context

The exact BPS process or subscription this replaces, **with evidence** — a named client,
an observed invoice, a Notion database, a real workflow. If no evidence exists, say so;
a module justified only by speculation is a candidate for deferral.

## 3. Personas & Roles

| Persona | Role (F1) | What they do here |
|---|---|---|

## 4. Functional Requirements

Numbered `FR-<ID>-nn`. Each independently testable — a pass/fail test must be writable
from the text without further interpretation.

| ID | Requirement | Priority |
|---|---|---|
| FR-<ID>-01 | The system shall … | Must / Should / Could |

Group under sub-headings where a module has distinct areas.

## 5. AI & Agent Capabilities

For every agent in this module:

| | |
|---|---|
| **Agent** | name |
| **Goal** | what it is trying to achieve |
| **Skills used** | F4 skill pack IDs |
| **Connectors** | MCP servers required |
| **Model tier** | T0 / T1 / T2 per task class (see F10) |
| **Autonomy** | Suggest / Draft / Act-with-approval / Act |
| **Approval gates** | which actions require a human, and who |
| **Token budget** | per invocation and per month |
| **Failure mode** | what happens when the model is unavailable or wrong |

**Autonomy levels:**

| Level | Meaning |
|---|---|
| Suggest | Surfaces a recommendation. No state change. |
| Draft | Creates unpublished/unsent content. Reversible, invisible externally. |
| Act-with-approval | Prepares a consequential action, blocks on human confirmation. |
| Act | Executes autonomously. **Permitted only for internally reversible actions.** |

**Never `Act`:** spending money, contacting a client, publishing publicly, modifying
payroll, deleting data. No exceptions, no override flag.

## 6. Automations

Workflows shipped as F11 templates.

| Name | Trigger | Steps | Editable by operator? |
|---|---|---|---|

## 7. Data Model

Entities, key fields, relationships. **Every table shows `org_id`.**

```sql
-- or a table per entity
```

Note which data is owned here versus read from another module or an upstream system.

## 8. Connectors & Integrations

| System | Via | Auth | Rate limits | Failure mode |
|---|---|---|---|---|

## 9. Screens & UX Flows

Screen inventory with purpose. Key flows as numbered steps or a diagram.
Note the empty state and the error state for each — these are where non-technical
users are actually lost, and they are routinely under-specified.

## 10. Non-Functional Requirements

| Aspect | Requirement |
|---|---|
| Performance | |
| Security | |
| Availability | |
| Data retention | |
| Scale assumption | volumes this is designed for |

## 11. Compliance

Applicable: India GST, DPDP Act 2023, Meta Platform Policy, WhatsApp Business Policy,
Google Business Profile guidelines, Indian labour law. State "none applicable" if true —
do not leave blank.

## 12. Guided Mode Requirements

Per F8. How a non-technical operator is walked through this module.

- **First-run:** what setup guidance appears
- **Explain-this:** which concepts need plain-language explanation
- **Next-best-action:** what the system suggests when the user is idle here
- **Guardrails:** what a novice could break, and how they are prevented from doing so

## 13. Acceptance Criteria

Given/When/Then, or a checklist. The module is done when these pass.

## 14. Dependencies

| Module | What is needed from it |
|---|---|

## 15. Out of Scope / Future

Explicitly excluded, with reasoning. Prevents scope re-litigation later.

## 16. Open Questions

| # | Question | Blocks | Owner |
|---|---|---|---|
````

---

## Writing standards

**Requirements**
- "The system shall" — one testable statement per requirement
- No "user-friendly", "fast", "robust" without a number attached
- Every FR gets a priority; if everything is Must, nothing is

**Evidence**
- Cite real BPS artefacts — named clients, observed invoices, actual Notion databases
- Where a requirement is speculative, mark it and say so

**Honesty**
- Record what a module *cannot* do alongside what it can
- If a self-hosted replacement is worse than the SaaS it replaces, write that down
- Open questions stay open until answered; never resolved by assumption

**Estimates**
- Weeks of AI-assisted solo work, not ideal-world effort
- **Any module over ~6 weeks must be split.** Large specs do not survive contact with a solo builder.
