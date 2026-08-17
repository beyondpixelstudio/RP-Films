# 06 — Build Order

> **Status: not yet written.**
>
> This document is the final output of the specification phase. It is written **after** all 46 SRS documents are drafted and reviewed, because sequencing decisions depend on the build estimates and dependencies each SRS produces.
>
> Writing it earlier would mean guessing at effort — which is precisely what the SRS set exists to remove.

## What this document will contain

1. **Recommended sequence** — phases, with the modules in each
2. **Justification per phase** — dependency necessity, ROI, and which subscription each phase cancels
3. **Critical path** — what blocks what, and where parallelism is possible
4. **First shippable increment** — the smallest set that delivers standalone value
5. **Revenue-generating modules** — which can be resold to existing clients, and when
6. **Risk register** — what could derail each phase and the mitigation
7. **Decision points** — where to stop and re-evaluate rather than continue by momentum

## Inputs required before writing

| Input | Source |
|---|---|
| Build estimate per module | Each SRS header |
| Dependency graph, validated acyclic | `02-module-map.md` |
| Actual monthly SaaS spend per tool | `00-vision.md` open questions |
| Volume figures for AI cost projection | `00-vision.md` open questions |
| Infrastructure budget | `00-vision.md` open questions |
| Owner review of each batch | Rajesh |

## Sequencing principles agreed in advance

Recorded now so the eventual recommendation is judged against criteria set before the answer was known:

1. **Foundation before features.** F1, F2, F3, F4, F10, F11 precede everything. No shortcuts.
2. **Cancel a subscription per phase.** Each phase should retire a real recurring cost, so progress is financially visible rather than only architectural.
3. **Revenue-generating modules early.** M10 and M7 are resellable to existing clients. Modules that pay for the build should not be scheduled last.
4. **Smallest useful increment first.** A module that ships and is used beats two that are half-built.
5. **Highest manual burden first, among equals.** Where two modules are otherwise tied, the one removing the most manual labour wins — invoicing is the leading candidate.
6. **Nothing client-facing until the approval gates are proven.** F3's safety enforcement must be working before any agent touches a client.
