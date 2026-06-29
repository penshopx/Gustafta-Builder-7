---
name: Struktur landing page persuasif Gustafta
description: Kerangka PAS→AIDA yang dipakai untuk merombak landing produk dari "katalog" jadi halaman jualan. Pakai sebagai standar saat menyempurnakan landing lain.
---

## Konteks
Gustafta punya ~40 landing page produk (core: /trilogi /mitra /legacy /blueprint;
per-industri; konsultan; LSP/KAN; /multiclaw-suite; dll). Keluhan berulang user:
landing "terlalu singkat & terkesan katalog". Solusi yang disepakati = kerangka
PAS yang mengalir ke AIDA.

## Urutan section standar (PAS → AIDA)
1. Hero (Attention) — headline berorientasi outcome + 1 baris trust + 2 CTA (beli + WA).
2. Problem (PAS) — 3–4 pain point yang relatable.
3. Agitate (PAS) — konsekuensi status quo (band gelap, satu kalimat menohok).
4. Solution (PAS / Interest) — cara kerja produk sebagai jawaban pain.
5. Desire — komparasi "Tanpa vs Dengan" + daftar outcome.
6. Bukti/Use case — skenario nyata per persona (bukan testimoni palsu).
7. Pricing (Action) — paket + risk reversal (demo gratis / bonus).
8. FAQ — tangani keberatan (perlu teknis? akurat? bisa coba dulu?).
9. Final CTA — penutup + WA.

## Aturan wajib (jangan dilanggar)
- **Why:** kredibilitas brand & kepatuhan harga.
- JANGAN buat testimoni/angka pelanggan fiktif. Pakai bukti jujur: cakupan, dasar regulasi, dikurasi tim.
- Harga: pakai sumber resmi (link checkout Scalev / `@/data/pricing`). Tidak ada free permanen; "gratis" = bonus berdurasi (mis. "1 bulan Builder gratis" di bundle).
- FAQ akurasi AI wajib sertakan disclaimer verifikasi ke pihak berwenang (selaras etos FALLBACK).
- Pertahankan: logika filter paket, dark-mode (`dark:*`), dan `data-testid` pada elemen interaktif/dinamis.

## Band Riset "Menurut Data" (pengganti testimoni)
Karena testimoni dilarang, tiap landing pakai band riset domain-spesifik sebagai bukti.
- Posisi: setelah Agitate/Problem, sebelum Solusi (alur PAS tetap terjaga).
- Isi: Badge "Menurut Data" → grid 3 kartu stat (nilai besar + label + "Sumber: …") → 1 baris disclaimer **"Angka di atas adalah konteks industri dari lembaga riset, bukan klaim hasil spesifik dari produk ini."**
- Tiap angka WAJIB diverifikasi via webSearch dulu; sumber sespesifik mungkin (lembaga + tahun/laporan), bukan "Gartner" saja.
- Pola const: `const STATS_{PAGE} = [{icon, value, label, source}]`; render `const SIcon = s.icon` lalu `<SIcon/>`; `data-testid={`stat-{page}-${i}`}`; warna ikuti tema halaman.
- **Why:** kredibilitas tanpa testimoni palsu; angka tervalidasi mencegah klaim fiktif yang melanggar aturan brand.
