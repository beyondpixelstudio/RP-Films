# 04 — Open Source Licensing Audit

**No dependency ships without a verdict in this document.**

BPS intends to (a) resell modules such as WhatsApp and Google Business Profile to clients, and (b) eventually sell the platform to other businesses. Both make licensing a **product constraint, not a legal footnote**. A permissive-looking tool with a commercial-use restriction can invalidate the business model after the code is written.

> This is an engineering assessment, not legal advice. Before commercial resale begins, have a lawyer review this table.

---

## Verdict scale

| Verdict | Meaning |
|---|---|
| ✅ **Clear** | May be embedded, white-labeled and resold |
| ⚠️ **Conditional** | Usable, but with obligations that must be actively honoured |
| 🚫 **Internal only** | May be used by BPS internally; must never ship in a resold product |
| ❌ **Rejected** | Not used |

---

## Core dependencies

| Component | License | Verdict | Notes |
|---|---|---|---|
| PostgreSQL | PostgreSQL License | ✅ Clear | Permissive, BSD-like |
| Next.js | MIT | ✅ Clear | |
| Drizzle ORM | Apache 2.0 | ✅ Clear | |
| Better-Auth | MIT | ✅ Clear | |
| pg-boss | MIT | ✅ Clear | |
| MinIO | **AGPL v3** | ⚠️ Conditional | Used as a **separate S3 service over the network**, never linked into application code. Under this deployment the copyleft does not reach BPS source. If MinIO code is ever modified or linked, this verdict is void. S3-compatible API means migration to a permissive alternative or hosted S3 remains open. |
| Ollama | MIT | ✅ Clear | |
| OpenTelemetry | Apache 2.0 | ✅ Clear | |

---

## Automation engine — the decisive one

### 🚫 n8n — rejected as embedded engine

n8n is **fair-code, not open source**. The [Sustainable Use License](https://docs.n8n.io/sustainable-use-license/) permits use *unless* you sell a product or service whose value derives substantially from n8n functionality. Prohibited without a separate commercial agreement:

- embedding n8n inside a product you sell
- white-labeling it and offering it to customers for money
- letting external users trigger workflows as part of a paid service
- using it as the engine of a platform you charge for

Both stated business goals fall squarely inside these prohibitions.

**Permitted:** BPS staff using n8n internally, with no client access, to run BPS's own operations. Also permitted: offering consulting or workflow-building services. If n8n is used at all, it is in that internal-only capacity and **never in the shipped product**.

### Alternatives assessed

| Engine | License | Verdict | Assessment |
|---|---|---|---|
| **Activepieces** | MIT (core) | ✅ **Chosen** | Closest like-for-like replacement, ~700+ pieces, embeddable and resellable, mature self-hosting. **Action required:** confirm at implementation which features sit in the MIT core versus a separate enterprise license, and depend only on the MIT core. |
| Windmill | AGPL v3 | ❌ Rejected | Genuine copyleft. The network-service clause is a live risk for a proprietary SaaS. Excellent engine, wrong license for this business model. |
| Kestra | Apache 2.0 | ⚠️ Fallback | Cleanest license of the three. Engineering-oriented; weaker visual builder for non-technical operators, which conflicts with F8. Holds as fallback if Activepieces' MIT core proves too limited. |
| n8n | Sustainable Use | 🚫 Internal only | See above |

Sources: [n8n Docs](https://docs.n8n.io/sustainable-use-license/) · [n8n licensing explained](https://www.fatcamel.ai/blog/n8n-licensing-101-understanding-commercial-embed-and-sustainable-use-licenses) · [Scalevise](https://scalevise.com/resources/n8n-automation-license-commercial-use/) · [Composio comparison](https://composio.dev/content/top-n8n-alternatives)

---

## Wrapped systems

These run as separate services. The distinction between *wrapping over a network API* and *linking into the application* is what keeps copyleft obligations contained — and it is why architecture rule §6.1 (never modify upstream source) is a licensing rule as much as a maintenance one.

| System | License | Verdict | Notes |
|---|---|---|---|
| **Frappe HR / ERPNext** | GPL v3 | ⚠️ Conditional | Separate service, integrated over REST. BPS code is not a derivative work under this deployment. **Never fork or modify upstream** — extend via documented app mechanisms. Reselling *hosting and access* is permitted; upstream source must remain available to users who receive it. |
| **Chatwoot** | MIT (Community Edition) | ✅ Clear | **Enterprise Edition is separately licensed and must not be used.** Verify the deployed image is CE. |
| **Postiz** | AGPL v3 | ⚠️ Conditional | Network-service copyleft. Used as a **separate publishing service behind an API**, never linked. If BPS modifies Postiz and offers it as a service, modified source must be published. Contained by the adapter pattern. **Flagged for legal review before resale.** |
| **Listmonk** | AGPL v3 | ⚠️ Conditional | Same containment as Postiz. Unmodified, separate service. |

**Postiz carries the highest residual risk in this set.** M5's SRS must document a transport-swap path — publishing to platform APIs directly — so the module is not hostage to one AGPL dependency if legal review objects.

---

## Paid dependencies — cannot be self-hosted

| Service | Why unavoidable | Owning module |
|---|---|---|
| Ahrefs / DataForSEO | Sell **rank and keyword data**, not software. No open-source equivalent exists at any price. | M6 |
| Meta Graph / WhatsApp Business API | Only route to Facebook, Instagram and WhatsApp. Per-conversation fees are Meta's, not a vendor markup. | M5, M7, M9, M10 |
| Google Business Profile API | Only route to GMB. | M7 |
| Razorpay | Payment gateway. Fees are a percentage of collections. | Fin1, Fin4 |
| Google Workspace | Deliberately retained — self-hosted email destroys deliverability. | — |
| LLM providers | Frontier-tier reasoning. Mitigated by F10 routing, not eliminated. | F10 |

---

## Rules for adding a dependency

1. **Check the license before writing code against it.** Reversing a dependency after integration is expensive.
2. **Record it here with a verdict** before it reaches `main`.
3. **Treat AGPL as usable only behind a network boundary** — separate service, unmodified, accessed over an API. Never linked, never forked.
4. **Treat "open core" and "fair code" as commercial software** until proven otherwise. n8n is the cautionary example: it reads as open source in every casual description.
5. **Prefer MIT and Apache 2.0** for anything that will ship inside the product.
6. **Re-audit on every major upgrade.** Licenses change — usually in the restrictive direction, and usually at the point a project seeks revenue.

## Review triggers

Revisit this document when: a new dependency is proposed; any upstream changes its license; before the first paid client is onboarded onto any module; and before the platform is offered to any organisation other than BPS.
