---
name: Reposisi Gustafta → AI Organization Builder
description: Arah strategis besar — Gustafta naik kelas dari "AI Chatbot Builder" menjadi "AI Organization Builder". Baca sebelum kerja narasi/positioning/landing utama.
---

## Visi (dinyatakan owner, Juni 2026)
Gustafta = **AI Organization Builder**: platform yang mengubah **pengetahuan manusia → organisasi AI** yang mampu **berpikir, berkolaborasi, menghasilkan karya, dan membangun bisnis berkelanjutan**.

**Why:** naik dari positioning "alat bikin chatbot" (komoditas, mudah ditiru) ke kategori sendiri (organisasi AI) — diferensiasi & nilai jangka panjang.

## Prinsip eksekusi
- **Bertahap, pelan-pelan** (permintaan eksplisit owner). Jangan rombak besar sekaligus. Kunci konsep/narasi dulu sebelum sentuh kode/UI.
- Fondasi teknis SUDAH ADA — ini reframing + pendalaman, bukan bangun dari nol.

## Pemetaan visi → aset existing
| Pilar visi | Aset hari ini |
|---|---|
| Berpikir | 900+ agen, Model Router (`server/lib/model-router.ts`) |
| Berkolaborasi | Inter-Agent API v2, 131 Federation hub, MultiClaw orkestrasi sub-agen paralel |
| Menghasilkan karya | Mini Apps (45 jenis), AI Tools (RAB, K3 Vision), generator dokumen |
| Membangun bisnis | Store, template, sistem paket berlangganan |

## Yang masih kurang (kandidat pekerjaan)
- Narasi/manifesto "AI Organization Builder" yang tajam & konsisten.
- Builder journey (pengalaman pengguna membangun "organisasi AI"-nya).
- Bahasa produk konsisten lintas landing/UI (istilah "organisasi AI", bukan "chatbot").

## Roadmap eksekusi (Blueprint Engine) — dokumen kanonik
Roadmap teknis bertahap hidup di **`docs/blueprint-engine/`** (BUKAN di memory):
- `00-roadmap.md` — 9 tahap (Audit→Blueprint Schema→Mapping→Config→Dialogue V2→Inference→Confidence→Gap→Critic/Sim/Evolution).
- `01-builder-audit.md` — katalog Builder (tabel `agents` + panel + entitas anak).
- `02-blueprint-schema.md` + `shared/blueprint/blueprint-schema.ts` — Blueprint JSON "DNA".

**Keputusan desain Blueprint (durable):**
- Field Blueprint memakai **nama kolom `agents` apa adanya** → Mapping Engine bisa 1:1. Jangan rename.
- **Confidence, bukan Completion**: tiap field punya `FieldMeta{confidence,source,evidence,needsConfirmation}`; dialog hanya tanya yang confidence rendah.
- **Scope contract**: Blueprint = DNA desain, BUKAN gudang data. Kecualikan field system-managed (id/userId/accessToken/createdAt) & tabel runtime (analytics/messages/leads/scoring_results). Yang masuk hanya konfigurasinya.

**Prinsip mati-matian (ditegaskan owner berulang):** JANGAN rombak app, JANGAN ubah UI/Builder. Engine baru = ADITIF, tersembunyi dulu, disambung pelan-pelan. Engine direncanakan di `server/services/blueprint-engine/` agar Builder existing tak tersentuh sampai Tahap 4.
**Pergeseran inti:** Builder bukan titik awal tapi tujuan — alurnya `Dialog→Blueprint(JSON "DNA")→Config→Builder auto-fill→Ekosistem`. Pakai **Confidence**, bukan Completion %.

## Catatan selaras strategi lain
- Tetap hormati Framework Visibility Strategy (Framework login-gated) & aturan anti-testimoni/anti-stat-fiktif di landing-page-persuasion.md.
