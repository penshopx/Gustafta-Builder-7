/**
 * Multi-Source Tender Scraper
 * Strategi scraping untuk 5 tipe sumber:
 * 1. LPSE Pusat (LKPP/SPSE Nasional)
 * 2. LPSE Daerah Provinsi
 * 3. LPSE Daerah Kabupaten/Kota
 * 4. BUMN (procurement portal BUMN)
 * 5. Asing (SKK Migas, foreign company procurement)
 *
 * Setiap sumber mencoba strategi berikut secara berurutan:
 * A. SPSE JSON API  → /api/0/tenderStatus
 * B. DataTables API → /dt/lelang
 * C. HTML Scraping  → /lelang
 * D. Demo Data      → fallback untuk sumber yang memblokir akses
 */

import type { InsertTender, TenderSource } from "@shared/schema";

export type ScrapeStrategy = "spse_json" | "datatables" | "html" | "demo";

export interface MultiScrapeResult {
  success: boolean;
  strategy: ScrapeStrategy | null;
  tenders: InsertTender[];
  totalScraped: number;
  errors: string[];
  message: string;
}

const HEADERS = {
  "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  Accept: "application/json, text/html, */*",
  "Accept-Language": "id-ID,id;q=0.9,en;q=0.8",
  "X-Requested-With": "XMLHttpRequest",
};

// ── Strategy A: SPSE JSON API ──────────────────────────────────────────────────
async function scrapeSpseJson(baseUrl: string, source: TenderSource): Promise<InsertTender[]> {
  const url = `${baseUrl}/api/0/tenderStatus`;
  const res = await fetch(url, {
    headers: HEADERS,
    signal: AbortSignal.timeout(12000),
  });
  if (!res.ok) throw new Error(`SPSE JSON API HTTP ${res.status}`);
  const ct = res.headers.get("content-type") || "";
  if (!ct.includes("json")) throw new Error("Response not JSON");
  const data = await res.json() as any[];
  if (!Array.isArray(data)) throw new Error("Invalid SPSE JSON response");

  return data.slice(0, 50).map((item: any) => ({
    sourceId: source.id,
    tenderId: String(item.kode_tender || item.id || `spse-${Date.now()}-${Math.random().toString(36).substr(2,5)}`),
    name: item.nama_tender || item.nama || item.paket || "Paket Tidak Diketahui",
    agency: item.satuan_kerja || item.instansi || item.satker || source.name,
    budget: item.pagu || item.nilai_pagu || item.hps || "",
    type: item.jenis_pengadaan || item.metode || "",
    sector: source.sector || "konstruksi",
    sourceType: source.sourceType || "lpse_pusat",
    status: item.status_tender || item.status || "Aktif",
    stage: item.tahap || item.fase || "",
    location: item.lokasi || source.region || "",
    publishDate: item.tanggal_pengumuman || item.tgl_pengumuman || "",
    deadlineDate: item.batas_akhir || item.tgl_pemasukan || "",
    url: item.url_tender || `${baseUrl}/lelang/${item.kode_tender || ""}`,
    rawData: item,
  }));
}

// ── Strategy B: DataTables API ─────────────────────────────────────────────────
async function scrapeDataTables(baseUrl: string, source: TenderSource): Promise<InsertTender[]> {
  const params = new URLSearchParams({
    draw: "1", start: "0", length: "50",
    "order[0][column]": "0", "order[0][dir]": "desc",
  });
  const res = await fetch(`${baseUrl}/dt/lelang?${params}`, {
    headers: HEADERS,
    signal: AbortSignal.timeout(12000),
  });
  if (!res.ok) throw new Error(`DT API HTTP ${res.status}`);
  const ct = res.headers.get("content-type") || "";
  if (!ct.includes("json")) {
    const txt = await res.text();
    if (txt.includes("Just a moment") || txt.includes("cf-browser-verification")) throw new Error("Cloudflare protection");
    throw new Error("Response not JSON");
  }
  const data = await res.json() as any;
  if (!data?.data || !Array.isArray(data.data)) throw new Error("Invalid DT response");

  const { load } = await import("cheerio");
  return data.data.map((row: any) => {
    const arr = Array.isArray(row) ? row : Object.values(row);
    const $ = load(`<div>${arr.join("")}</div>`);
    return {
      sourceId: source.id,
      tenderId: String(arr[0] || `dt-${Date.now()}-${Math.random().toString(36).substr(2,5)}`),
      name: $("a").first().text().trim() || String(arr[1] || ""),
      agency: String(arr[2] || source.name),
      budget: String(arr[3] || ""),
      type: String(arr[4] || ""),
      sector: source.sector || "konstruksi",
      sourceType: source.sourceType || "lpse_pusat",
      status: String(arr[5] || "Aktif"),
      stage: String(arr[6] || ""),
      location: source.region || "",
      publishDate: String(arr[7] || ""),
      deadlineDate: "",
      url: $("a").first().attr("href") || `${baseUrl}/lelang`,
      rawData: { row: arr },
    };
  });
}

// ── Strategy C: HTML Scraping ──────────────────────────────────────────────────
async function scrapeHtml(baseUrl: string, source: TenderSource): Promise<InsertTender[]> {
  const res = await fetch(`${baseUrl}/lelang`, {
    headers: { ...HEADERS, Accept: "text/html" },
    signal: AbortSignal.timeout(12000),
  });
  if (!res.ok) throw new Error(`HTML HTTP ${res.status}`);
  const html = await res.text();
  if (html.includes("Just a moment") || html.includes("cf-browser-verification")) throw new Error("Cloudflare protection");

  const { load } = await import("cheerio");
  const $ = load(html);
  const items: InsertTender[] = [];

  $("table tbody tr").each((_, el) => {
    const tds = $(el).find("td");
    if (tds.length < 3) return;
    const linkEl = $(el).find("a").first();
    const href = linkEl.attr("href") || "";
    const idMatch = href.match(/\/(\d+)\/?$/);
    items.push({
      sourceId: source.id,
      tenderId: idMatch?.[1] || `html-${Date.now()}-${Math.random().toString(36).substr(2,5)}`,
      name: tds.eq(1).text().trim() || tds.eq(0).text().trim() || "Paket Tidak Diketahui",
      agency: tds.eq(2).text().trim() || source.name,
      budget: tds.eq(3).text().trim() || "",
      type: tds.eq(4).text().trim() || "",
      sector: source.sector || "konstruksi",
      sourceType: source.sourceType || "lpse_pusat",
      status: tds.eq(5).text().trim() || "Aktif",
      stage: "",
      location: source.region || "",
      publishDate: tds.eq(6).text().trim() || "",
      deadlineDate: "",
      url: href.startsWith("http") ? href : `${baseUrl}${href}`,
      rawData: {},
    });
  });

  if (items.length === 0) throw new Error("No tenders found in HTML (selector mismatch)");
  return items;
}

// ── Strategy D: Demo/Sample Data ──────────────────────────────────────────────
// Digunakan untuk sumber yang memblokir akses (BUMN proprietary, portal asing)
function generateDemoData(source: TenderSource): InsertTender[] {
  const sector = source.sector || "konstruksi";
  const sType = source.sourceType || "bumn";

  const templates: Record<string, string[]> = {
    konstruksi: [
      "Pengadaan Jasa Konstruksi Gedung Kantor",
      "Pekerjaan Konstruksi Jalan Akses Tambang",
      "Pekerjaan Sipil Pondasi & Struktur Baja",
      "Renovasi & Rehabilitasi Fasilitas Produksi",
      "Pembangunan Gudang Material & Workshed",
      "Pekerjaan Perkerasan Area Yard & Hardstanding",
      "Konstruksi Jetty & Fasilitas Pelabuhan",
    ],
    oil_gas: [
      "Pengadaan Jasa EPC Fasilitas Produksi Gas",
      "Pekerjaan Sipil & Mekanikal Kompresor Station",
      "Pipa Gas Trunk Line Ø24\" Offshore",
      "Pekerjaan Hookup & Commissioning Wellhead",
      "Jasa Modifikasi Separator dan Vessel Produksi",
      "Pengadaan Material Pipa API 5L Grade X65",
      "Pekerjaan Blasting & Coating Pipeline Onshore",
    ],
    pertambangan: [
      "Pengadaan Jasa Overburden Removal (OB) Mining",
      "Pekerjaan Konstruksi Settling Pond & IPAL",
      "Pengadaan Dump Truck 100 Ton & Excavator PC 800",
      "Jasa Pengangkutan Batubara Mine-Port Conveyor",
      "Konstruksi Jalan Tambang & Gorong-Gorong",
      "Pekerjaan Sipil Stockpile & Coal Handling Plant",
      "Jasa Reklamasi & Revegetasi Lahan Pascatambang",
    ],
    energi: [
      "EPC PLTU Batubara 2×50 MW",
      "Pekerjaan Sipil & Elektrikal PLTG Simple Cycle",
      "Pengadaan & Pemasangan Turbin Angin 3 MW",
      "Pekerjaan GI 150 kV & Saluran Transmisi SUTT",
      "Jasa Konstruksi Solar Farm 10 MWp",
      "Pengadaan Trafo Daya 30 MVA",
      "Pekerjaan SCADA & Control System PLTMH",
    ],
    umum: [
      "Pengadaan Barang/Jasa Umum",
      "Jasa Konsultansi Manajemen Proyek",
      "Pengadaan Alat Tulis & Perlengkapan Kantor",
      "Jasa Catering & Akomodasi Kamp Pekerja",
      "Pengadaan Seragam & APD Pekerja",
    ],
  };

  const agencies: Record<string, string[]> = {
    bumn: ["Divisi Pengadaan", "Departemen Konstruksi", "Direktorat Teknik", "Corporate Procurement", "Supply Chain Management"],
    asing: ["Drilling & Wells", "Asset Integrity", "Operations", "Projects Department", "Technical Services"],
    lpse_pusat: ["Kementerian ESDM", "SKK Migas", "BPH Migas"],
    lpse_provinsi: ["Dinas PUPR", "Dinas ESDM", "Bappeda"],
    lpse_kabkota: ["Dinas PUPR", "Dinas Perhubungan"],
  };

  const statuses = ["Pengumuman Tender", "Pendaftaran & Pengambilan Dokumen", "Pemasukan Dokumen Penawaran", "Evaluasi Penawaran", "Pengumuman Pemenang"];
  const now = new Date();
  const templates_for_sector = templates[sector] || templates.konstruksi;
  const agencies_for_type = agencies[sType] || agencies.bumn;

  return templates_for_sector.slice(0, 5).map((name, i) => {
    const pubDate = new Date(now.getTime() - (i * 7 + Math.floor(Math.random() * 5)) * 24 * 60 * 60 * 1000);
    const deadline = new Date(pubDate.getTime() + (14 + i * 7) * 24 * 60 * 60 * 1000);
    const budgetBase = sector === "oil_gas" ? 5000 : sector === "energi" ? 3000 : sector === "pertambangan" ? 2000 : 1000;
    const budget = (budgetBase + Math.floor(Math.random() * budgetBase)) * 1_000_000;

    return {
      sourceId: source.id,
      tenderId: `demo-${source.id}-${i}-${Date.now()}`,
      name: `[DEMO] ${name} — ${source.name}`,
      agency: agencies_for_type[i % agencies_for_type.length],
      budget: `Rp ${(budget / 1_000_000).toFixed(0)} juta`,
      type: sector === "konstruksi" ? "Pekerjaan Konstruksi" : sector === "oil_gas" ? "EPC/Jasa Migas" : sector === "pertambangan" ? "Jasa Pertambangan" : "Pengadaan Jasa",
      sector,
      sourceType: sType,
      status: statuses[i % statuses.length],
      stage: statuses[i % statuses.length],
      location: source.region || "Indonesia",
      publishDate: pubDate.toLocaleDateString("id-ID"),
      deadlineDate: deadline.toLocaleDateString("id-ID"),
      url: source.baseUrl,
      rawData: { demo: true, note: "Data demo — sumber portal ini memerlukan autentikasi vendor atau akses khusus" },
    };
  });
}

// ── Main scrape function ───────────────────────────────────────────────────────
export async function scrapeMultiSource(source: TenderSource): Promise<MultiScrapeResult> {
  const result: MultiScrapeResult = {
    success: false, strategy: null, tenders: [], totalScraped: 0, errors: [], message: "",
  };

  const base = source.baseUrl.replace(/\/$/, "");
  const sType = source.sourceType || "lpse_pusat";

  // BUMN & Asing → langsung demo (portal mereka tertutup)
  if (sType === "bumn" || sType === "asing") {
    result.tenders = generateDemoData(source);
    result.strategy = "demo";
    result.success = true;
    result.totalScraped = result.tenders.length;
    result.message = `[DEMO] ${result.tenders.length} contoh tender dari ${source.name} (portal ini memerlukan akses vendor terdaftar)`;
    return result;
  }

  // LPSE sites → coba strategi bertahap
  const strategies: Array<{ name: ScrapeStrategy; fn: () => Promise<InsertTender[]> }> = [
    { name: "spse_json",   fn: () => scrapeSpseJson(base, source) },
    { name: "datatables",  fn: () => scrapeDataTables(base, source) },
    { name: "html",        fn: () => scrapeHtml(base, source) },
  ];

  for (const { name, fn } of strategies) {
    try {
      const data = await fn();
      if (data.length > 0) {
        result.tenders = data;
        result.strategy = name;
        result.success = true;
        result.totalScraped = data.length;
        result.message = `Berhasil: ${data.length} tender dari ${source.name} (strategi: ${name})`;
        return result;
      }
    } catch (err: any) {
      result.errors.push(`[${name}] ${err.message}`);
    }
  }

  // Semua strategi gagal → demo
  result.tenders = generateDemoData(source);
  result.strategy = "demo";
  result.success = false;
  result.totalScraped = result.tenders.length;
  result.message = `[DEMO] Situs ${source.name} memblokir akses otomatis (Cloudflare/proteksi). Menampilkan data contoh.`;
  result.errors.push("Semua strategi scraping gagal — kemungkinan Cloudflare atau IP block");
  return result;
}
