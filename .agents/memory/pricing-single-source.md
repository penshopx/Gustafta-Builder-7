---
name: Pricing single source of truth
description: All product/page pricing must come from client/src/data/pricing.ts — never re-hardcode price strings in pages.
---

# Pricing single source of truth

All product pricing, service tiers, hosting periods, and credit packs live in
`client/src/data/pricing.ts` (PRICING, HOSTING/HOSTING_SUMMARY/HOSTING_RANGE,
SERVICE_TIERS, CREDIT_PACKS, LICENSE_INFO, formatIDR).

**Rule:** product/marketing pages (`produk.tsx`, `packs.tsx`, `store.tsx`,
`store-featured.tsx`, etc.) must import values from this module. Never paste raw
price strings like `"Rp 299.000"` into page JSX/data arrays.

**Why:** prices were previously duplicated across pages and drifted out of sync;
a single edit point prevents inconsistent numbers between /produk, /packs, /store.

**How to apply:** when adding/changing any price, edit `pricing.ts` only. Canonical
business rules still hold (see `gustafta-pricing-model.md`): chatbot product = license
only (no mandatory setup), jasa/modul = has setup fee, no permanent free tier
(free = 7-day trial), and jasa uses the 4 canonical SERVICE_TIERS (Tier 1–4:
1.499 / 2.499 / 4.900 / 7.490 rb).
