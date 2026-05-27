---
name: Orchestrator lookup pattern
description: How to resolve orchestrator agents safely when IDs drift over time
---

# Orchestrator lookup — never trust hardcoded ID alone

When an `/api/{name}-claw/orchestrator` route hardcodes `storage.getAgent("<id>")`, it eventually breaks: agent IDs in `replit.md` drift when the DB is reseeded or rows are deleted/recreated, and the route silently returns whichever unrelated agent now occupies that ID.

**Rule:** orchestrator routes must resolve via multi-strategy fallback: **slug → ID (validated by name keyword) → name word-boundary → optional systemPrompt marker**. Use the `findOrchestratorAgent()` helper in `server/routes.ts`.

**Why:** in prod we observed routes returning wildly wrong agents (e.g. `/bg-claw` → "RG-ASESOR — Simulasi Wawancara") because ID 1033 was reassigned. Slug stays stable.

**How to apply:**
- New orchestrator route → call helper with `slug` (pattern: `{route-base}-orchestrator`) plus a **single unique** `nameKeyword` (e.g. `"BGClaw"`, not `"Bangunan Gedung"` — generic keywords falsely match unrelated agents).
- Word-boundary regex matters: `\\m{kw}\\M` is needed so `"IMClaw"` doesn't match `"BIMClaw"`. Plain `ilike '%kw%'` is unsafe for short prefixes that are substrings of other orchestrator names.
- If 404 is genuinely correct (orchestrator doesn't exist), let it 404 loudly — never fall back to "first agent that loosely matches", that's how silent bugs happen.

# Audit endpoint must mirror runtime, not lookup-by-ID

The audit endpoint at `/api/admin/audit-orchestrators` used to do `SELECT WHERE id = expected_id` and call MISMATCH if the name didn't fit. That gave false positives for ~half the MultiClaw routes because their handlers already used slug-first lookup and worked fine in prod — only the ID-position was occupied by something else.

**Rule:** audit must use the same lookup strategy the route handler uses. Differentiate `OK` (ID matches) from `DEGRADED` (resolved via fallback at a different ID — means `replit.md` is stale but page works) from `MISMATCH` / `MISSING`.

**Why:** previously the audit reported 51/66 broken; reality was ~8 truly broken. A noisy audit causes wasted reseed work and erodes trust in the dashboard.
