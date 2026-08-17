# 05 — AI Model Strategy & Cost Governance

## 1. The honest position on "zero cost"

The stated goal was AI across the platform "optimised to run efficiently with zero cost."

**Zero is not achievable for quality agentic work.** But it is achievable for most of the *volume*, and that distinction is the entire strategy:

- Roughly **80% of AI calls** in a system like this are high-volume, low-complexity: classification, extraction, tagging, deduplication, embedding, routing, short summarisation. These can run at genuinely zero marginal cost on local or free-tier models.
- Roughly **20%** are strategy, client-facing copy, multi-step reasoning and code. These need frontier models, and paying for them is correct — a bad campaign strategy or an embarrassing client-facing post costs more than the tokens saved.

The goal is therefore not zero spend. It is **spend that scales with value, not with volume**.

> **A caution worth stating plainly:** cheap models are cheap for a reason. Routing client-facing copy to a T1 model to save a few rupees, and publishing something wrong under a client's brand, is a bad trade. F10 exists to route by *task class*, never by cost alone.

---

## 2. Tiering

| Tier | Marginal cost | Workload | Representative models |
|---|---|---|---|
| **T0** | Zero | Embeddings, classification, tagging, extraction, dedupe, routing, language detection, sentiment | Self-hosted Ollama (Qwen, Gemma, Llama); free tiers — Gemini Flash-Lite, Groq, Cerebras |
| **T1** | Very low | Bulk drafting, caption variants, first-pass summaries, data enrichment, translation | Qwen Flash, DeepSeek Flash and similar (~$0.01–0.15 per 1M tokens) |
| **T2** | Standard | Strategy, campaign planning, client-facing copy, code, complex multi-step agents, anything a client sees | Claude, Gemini Pro, GPT class |

Prices move constantly. **Verify current rates at implementation** and keep the F10 provider table configuration-driven, never hardcoded. Sources: [pricepertoken.com](https://pricepertoken.com/) · [CloudZero](https://www.cloudzero.com/blog/llm-api-pricing-comparison/) · [free tier rankings](https://ofox.ai/blog/free-llm-api-tiers-ranked-coding-2026/)

---

## 3. Routing by task class

Every AI call declares a **task class**. The router maps class → tier → provider. Modules never name a model directly — that indirection is what allows the whole platform to be re-tiered as prices and models change.

| Task class | Tier | Examples |
|---|---|---|
| `embed` | T0 | Semantic search over knowledge base, content dedupe |
| `classify` | T0 | Lead scoring signals, ticket routing, review sentiment |
| `extract` | T0 | Invoice line items, contact details from email |
| `summarise-short` | T0/T1 | Meeting notes, thread digests |
| `draft-bulk` | T1 | Caption variants, hashtag sets, alt text |
| `enrich` | T1 | Company data cleanup, tag normalisation |
| `translate` | T1 | Odia / Hindi / English content variants |
| `draft-client-facing` | **T2** | Proposals, campaign copy, client reports, anything published |
| `strategy` | **T2** | Content strategy, campaign planning, SEO briefs |
| `agent-multistep` | **T2** | Multi-tool agent runs |
| `code` | **T2** | Automation generation, schema work |

**Rule: any output a client will see is T2.** No cost-based downgrade.

---

## 4. Cost controls

| Control | Mechanism |
|---|---|
| **Prompt caching** | Provider-native caching for stable system prompts and skill definitions. Largest single saving on repeated agent runs. |
| **Semantic caching** | Embed the request; return a cached response above a similarity threshold. Effective for repeated client questions and content briefs. |
| **Batching** | Non-urgent T0/T1 work queued and batched rather than called per-item. |
| **Token budgets** | Per agent, per invocation and per month, with hard caps. Exceeding a cap raises an alert, never silently degrades output. |
| **Fallback chains** | Provider down or rate-limited → next provider in tier → escalate a tier if the task class demands it. Never silently downgrade a T2 task to T1. |
| **Cost attribution** | Every call tagged with module, agent, client and task class, so spend is attributable to a department and a client. |
| **Context discipline** | Retrieve narrowly. The cheapest token is the one not sent. |

---

## 5. Local inference — the honest arithmetic

Self-hosted inference is **not free**. It trades a per-token cost for a fixed monthly cost.

| Deployment | Viable for | Not viable for |
|---|---|---|
| **CPU-only VPS** | Embeddings, small classifiers, extraction with 1–3B models | Content generation. Latency and quality both fail. |
| **GPU instance** | Everything in T0 plus some T1 at usable speed | Justified only when T0/T1 volume is high enough to beat API pricing |

**Start API-only, including for T0.** Free tiers cover early volume with no infrastructure. F10 emits the telemetry — calls per tier per month — that later proves or disproves the GPU case. Provisioning a GPU before that data exists is speculative spending in the name of saving money.

The decision trigger is recorded in `01-architecture.md` §9.

---

## 6. Projected spend

Cannot be computed until these are known:

1. Number of client social accounts under management, and posting volume
2. WhatsApp conversation volume
3. Content pieces produced per month per client
4. Whether the platform serves clients directly (M12), which multiplies inference

These are open questions in `00-vision.md` §7. **Until they are answered, any total here would be fabrication.**

The structure once populated: `Σ (task class volume × tier rate × (1 − cache hit rate))`, plus fixed infrastructure. F10 must produce this as a live dashboard, not a spreadsheet estimate — projected spend is a guess, measured spend is a fact.

---

## 7. Provider independence

No module depends on a specific vendor. All calls route through F10's abstraction.

**Requirements:**
- Provider adapters are configuration, not code changes
- At least two viable providers per tier at all times
- Any provider can be disabled without a deploy
- Model names never appear outside F10's provider table
- Prompts avoid provider-specific syntax where a portable form exists

This matters because the AI provider landscape is the fastest-moving dependency in the stack. A platform that hardcodes one vendor inherits that vendor's pricing decisions permanently.

---

## 8. Safety, restated

From `01-architecture.md` §7, repeated because it is the rule most likely to erode under delivery pressure:

**No agent spends money, contacts a client, publishes publicly, modifies payroll, or deletes data without explicit human approval.**

There is no override flag and no autonomy level that permits it. Every module SRS declares its agents' autonomy against this rule, and the approval gate is enforced in F3, not in each module — so it cannot be forgotten by omission.

Additional requirements:

- **Attribution.** AI-generated content is marked as such internally until a human approves it.
- **Audit.** Every agent action is logged with its inputs, model, cost and approver (F7).
- **Reversibility.** Any `Act`-level action must be undoable.
- **Client data.** Never sent to a provider without a data-processing basis; T0 local inference is preferred for sensitive extraction. Documented per module under Compliance.
