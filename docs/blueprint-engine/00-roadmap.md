# GUSTAFTA → AI Organization Builder — Master Roadmap

> **Visi:** Gustafta adalah **AI Organization Builder** — platform yang mengubah
> pengetahuan manusia menjadi organisasi AI yang mampu berpikir, berkolaborasi,
> menghasilkan karya, dan membangun bisnis secara berkelanjutan.

## Prinsip kerja (WAJIB)
1. **Tidak merombak aplikasi.** UI & Builder yang sudah ada TIDAK diubah. Aplikasi lama tetap hidup di setiap tahap.
2. **Aditif & bertahap.** Setiap tahap menambah "engine" baru di belakang layar — awalnya tersembunyi/belum terhubung — lalu disambungkan pelan-pelan.
3. **Builder = tujuan akhir, bukan awal.** Cara mengisi Builder yang berubah (dari Blueprint), bukan Builder-nya.
4. **Per tahap, berhenti & review.** Tidak loncat. Selesaikan satu tahap, tunjukkan hasil, baru lanjut.

## Pergeseran paradigma
**Lama:** `User → isi Form Builder → Chatbot`
**Baru:** `Dialog (Socratic) → AI Blueprint → Konfigurasi → Builder terisi otomatis → Ekosistem (chatbot, landing, mini apps, marketing, dst.)`

Trilogi Gustafta = framework berpikir di baliknya: **Dialog → Kolaborasi → Kreasi** (Insight → Blueprint → Value).

## Tahapan (urutan eksekusi)
| Tahap | Engine / Deliverable | Sentuh kode app? | Status |
|------|----------------------|------------------|--------|
| **1** | **AUDIT Builder** — katalog semua field konfigurasi (dokumen Markdown) | Tidak (read-only) | ✅ SELESAI — lihat `01-builder-audit.md` |
| **2** | **Blueprint Schema** — model data JSON yang mewakili seluruh konfigurasi Builder | Tidak (tipe/skema baru, belum disambung) | ✅ SELESAI — `shared/blueprint/blueprint-schema.ts` + `02-blueprint-schema.md` |
| **3** | **Mapping Engine** — peta setiap field Blueprint → field Builder | Tidak (fungsi murni, belum disambung) | ✅ SELESAI — `server/services/blueprint-engine/mapping-engine.ts` + `03-mapping-engine.md` |
| **4** | **Configuration Engine** — baca Blueprint, isi otomatis Builder (user tetap bisa edit) | Ya (engine baru, UI tak diubah, belum disambung) | ✅ SELESAI — `server/services/blueprint-engine/configuration-engine.ts` + `04-configuration-engine.md` |
| 5 | **Dialogue Engine V2** — wawancara Socratic adaptif, pertanyaan sesedikit mungkin | Ya (engine baru, pure, belum disambung) | ✅ SELESAI — `server/services/blueprint-engine/dialogue-engine.ts` + `05-dialogue-engine.md` |
| 6 | **Inference Engine** — simpulkan field dari sedikit input, beri alasan | Ya (engine baru, pure, belum disambung) | ✅ SELESAI — `server/services/blueprint-engine/inference-engine.ts` + `06-inference-engine.md` |
| 7 | **Confidence Engine** — skor keyakinan per field (bukan sekadar "completion %") | Ya (engine baru, pure, belum disambung) | ✅ SELESAI — `server/services/blueprint-engine/confidence-engine.ts` + `07-confidence-engine.md` |
| 8 | **Gap Analysis Engine** — cari field kosong/inkonsisten + rekomendasi | Ya (engine baru, pure, belum disambung) | ✅ SELESAI — `server/services/blueprint-engine/gap-analysis-engine.ts` + `08-gap-analysis-engine.md` |
| 9 | **Critic / Simulation / Evolution Engine** — kritik mutu, simulasi customer, belajar dari history | Ya (3 engine baru, pure, belum disambung) | ✅ SELESAI — `critic-engine.ts` + `simulation-engine.ts` + `evolution-engine.ts` + `09-critic-simulation-evolution.md` |

## Tempat kerja engine (rencana, belum dibuat)
Direktori service baru terpisah dari Builder, mis. `server/services/blueprint-engine/` —
sehingga Builder existing tidak tersentuh sampai Tahap 4 menyambungkannya.

## Konsep penting yang diadopsi
- **AI Blueprint™** = "DNA" organisasi AI (bukan sekadar file): Identity, Persona, Policy, Knowledge, Agent, Mini Apps, Deliverables, Conversion, Marketing, Revenue, dst.
- **Confidence, bukan Completion** — setiap field punya skor keyakinan; yang ditanya hanya yang confidence-nya rendah.
- **Living Blueprint** — Blueprint terus berkembang makin kaya seiring dialog & pemakaian.
- **AI Organization** — output akhir bukan 1 chatbot, tapi organisasi agen (OpenClaw/MultiClaw) berstruktur, ber-workflow, dengan hak akses antar-agen.
