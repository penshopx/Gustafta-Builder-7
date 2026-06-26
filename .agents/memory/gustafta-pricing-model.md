---
name: Gustafta pricing/product model
description: Durable product rules for the "Produk & Layanan" pages (landing.tsx, produk.tsx) — license vs setup, no permanent free tier, trial flow.
---

# Gustafta — Model Produk & Layanan (landing.tsx + produk.tsx)

Aturan produk yang harus dijaga konsisten lintas halaman pemasaran. Ini keputusan bisnis pemilik, bukan sekadar detail kode — jangan "memperbaiki" dengan menambah balik tier yang sudah dihapus.

- **Produk chatbot (langganan / Store Creator) = hanya biaya LISENSI, TANPA biaya setup.** Produk sudah jadi, tinggal pakai.
- **Layanan Jasa (modul dirakit tim Gustafta) = ada biaya SETUP (sekali bayar).** Inilah satu-satunya jalur yang punya biaya setup.
- **Tidak ada tier "Gratis" permanen.** "Gratis" HANYA berarti bonus 7 hari trial.
- **Funnel wajib:** isi Blueprint (Dialog Gustafta) → beli Starter Kit → bonus 7 hari. Tidak boleh ada tombol yang langsung mulai trial; CTA trial harus mengarah ke `/dialog-gustafta` dulu.

**Why:** pemilik ingin menghindari kebingungan harga (orang mengira chatbot jadi kena setup) dan menyaring lead lewat Blueprint sebelum memberi akses gratis.

**How to apply:** saat mengubah copy/CTA/pricing di `landing.tsx` atau `produk.tsx` (atau halaman `/pricing`, `/packs` bila relevan), pastikan tidak menambah tier gratis permanen, tidak melabeli produk chatbot dengan "setup", dan CTA trial tetap lewat Blueprint.
