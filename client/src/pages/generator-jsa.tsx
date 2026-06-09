import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft, Loader2, Sparkles, ShieldAlert, Copy,
  CheckCircle2, ChevronDown, AlertTriangle, Info, RotateCcw
} from "lucide-react";
import { Link } from "wouter";

const JENIS_PEKERJAAN = [
  "Penggalian & Pekerjaan Tanah", "Pekerjaan Pondasi Dalam (Tiang Pancang/Bored Pile)",
  "Pekerjaan Bekisting & Perancah", "Pengecoran Beton",
  "Pekerjaan Struktur Baja (Erection)", "Pekerjaan Atap & Waterproofing",
  "Pekerjaan Fasad & Curtain Wall", "Pekerjaan Ketinggian Umum",
  "Penggunaan Crane & Alat Angkat", "Pekerjaan Pengelasan & Pemotongan",
  "Instalasi Mekanikal-Elektrikal", "Pekerjaan Demolisi / Pembongkaran",
  "Penanganan Bahan Berbahaya (B3)", "Pekerjaan di Ruang Terbatas (Confined Space)",
  "Pekerjaan Bawah Tanah / Tunnel",
];

const LINGKUNGAN_OPTIONS = ["Normal (siang hari, outdoor)", "Malam hari / overtime", "Area sempit / terbatas", "Dekat instalasi listrik aktif", "Cuaca ekstrem / musim hujan", "Area padat pekerja (>50 orang)"];

const LEVEL_RISIKO_COLOR: Record<string, string> = {
  "Kritis": "text-red-400 border-red-400/40 bg-red-500/10",
  "Tinggi": "text-orange-400 border-orange-400/40 bg-orange-500/10",
  "Sedang": "text-amber-400 border-amber-400/40 bg-amber-500/10",
  "Rendah": "text-emerald-400 border-emerald-400/40 bg-emerald-500/10",
};

interface BahayaJSA {
  langkahPekerjaan: string;
  bahayaPotensial: string[];
  levelRisiko: "Kritis" | "Tinggi" | "Sedang" | "Rendah";
  pengendalian: { tipe: "Eliminasi" | "Substitusi" | "Engineering" | "Administratif" | "APD"; tindakan: string }[];
  apd: string[];
  penanggungJawab: string;
}

interface HasilJSA {
  judulJSA: string;
  jenisPekerjaan: string;
  tanggalDibuat: string;
  nomorJSA: string;
  deskripsiPekerjaan: string;
  bahayaList: BahayaJSA[];
  apiumum: string[];
  instruksiKhusus: string[];
  tindakanDarurat: string[];
  referensiStandar: string[];
}

export default function GeneratorJSA() {
  const [jenisPekerjaan, setJenisPekerjaan] = useState("");
  const [lingkungan, setLingkungan] = useState<string[]>([]);
  const [namaProyek, setNamaProyek] = useState("");
  const [result, setResult] = useState<HasilJSA | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [openBahaya, setOpenBahaya] = useState<Set<number>>(new Set([0]));
  const [copied, setCopied] = useState(false);

  function toggleLingkungan(l: string) { setLingkungan(prev => prev.includes(l) ? prev.filter(x => x !== l) : [...prev, l]); }
  function toggleBahaya(i: number) { setOpenBahaya(prev => { const n = new Set(prev); n.has(i) ? n.delete(i) : n.add(i); return n; }); }

  async function generate() {
    if (!jenisPekerjaan) return;
    setLoading(true); setError(""); setResult(null);
    try {
      const res = await fetch("/api/tools/generator-jsa", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jenisPekerjaan, lingkungan, namaProyek }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data); setOpenBahaya(new Set([0]));
    } catch (e: any) { setError(e.message || "Gagal generate JSA."); }
    finally { setLoading(false); }
  }

  function copyAll() {
    if (!result) return;
    const text = `${result.judulJSA}\nNo. JSA: ${result.nomorJSA}\nTanggal: ${result.tanggalDibuat}\n\n${result.deskripsiPekerjaan}\n\n${result.bahayaList.map((b, i) => `LANGKAH ${i+1}: ${b.langkahPekerjaan}\nBahaya: ${b.bahayaPotensial.join(", ")}\nRisiko: ${b.levelRisiko}\nPengendalian: ${b.pengendalian.map(p => `[${p.tipe}] ${p.tindakan}`).join("; ")}\nAPD: ${b.apd.join(", ")}`).join("\n\n")}`;
    navigator.clipboard.writeText(text);
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  }

  const kritis = result?.bahayaList.filter(b => b.levelRisiko === "Kritis" || b.levelRisiko === "Tinggi").length ?? 0;

  return (
    <div className="min-h-screen bg-slate-950 py-6 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/kompetensi-hub" className="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-lg font-bold text-white flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-amber-400" /> Generator JSA — Job Safety Analysis
            </h1>
            <p className="text-xs text-slate-400">Pilih jenis pekerjaan → AI generate draft JSA: identifikasi bahaya, penilaian risiko, pengendalian hierarki, APD</p>
          </div>
        </div>

        {!result && (
          <div className="space-y-4">
            <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-3 flex items-start gap-2">
              <ShieldAlert className="h-3.5 w-3.5 text-amber-400 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-300">JSA yang dihasilkan adalah draft referensi. Harus ditinjau dan divalidasi oleh HSE Officer atau Ahli K3 bersertifikat sebelum digunakan di lapangan.</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/3 p-5 space-y-4">
              <div>
                <label className="text-xs text-slate-400 block mb-1.5">Jenis Pekerjaan *</label>
                <select value={jenisPekerjaan} onChange={e => setJenisPekerjaan(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400/50">
                  <option value="">Pilih jenis pekerjaan...</option>
                  {JENIS_PEKERJAAN.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1.5">Nama Proyek <span className="text-slate-600">(opsional)</span></label>
                <input value={namaProyek} onChange={e => setNamaProyek(e.target.value)}
                  placeholder="cth: Proyek Gedung X Jakarta"
                  className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none" />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1.5">Kondisi Lingkungan Kerja <span className="text-slate-600">(pilih yang relevan)</span></label>
                <div className="grid grid-cols-2 gap-1.5">
                  {LINGKUNGAN_OPTIONS.map(l => (
                    <button key={l} onClick={() => toggleLingkungan(l)}
                      className={`rounded-lg border py-2 px-2.5 text-xs text-left transition-all ${lingkungan.includes(l) ? "bg-amber-500/10 border-amber-400/30 text-amber-200" : "border-white/8 text-slate-400 hover:text-white"}`}>{l}</button>
                  ))}
                </div>
              </div>
            </div>
            {error && <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-red-400 text-sm">{error}</div>}
            <Button onClick={generate} disabled={!jenisPekerjaan || loading} className="w-full bg-amber-600 hover:bg-amber-700">
              {loading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Generating JSA...</> : <><Sparkles className="h-4 w-4 mr-2" />Generate Job Safety Analysis</>}
            </Button>
          </div>
        )}

        {loading && <div className="space-y-3 mt-2">{[1,2,3].map(i => <div key={i} className="rounded-xl border border-white/8 bg-white/3 p-4 animate-pulse"><div className="h-3 bg-white/8 rounded w-1/2 mb-2" /><div className="h-3 bg-white/8 rounded w-full mb-2" /><div className="h-3 bg-white/8 rounded w-3/4" /></div>)}</div>}

        {result && !loading && (
          <>
            <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4 mb-4">
              <div className="flex items-center justify-between mb-1">
                <div>
                  <p className="text-sm text-white font-semibold">{result.judulJSA}</p>
                  <p className="text-[10px] text-slate-500">No: {result.nomorJSA} · {result.tanggalDibuat}</p>
                </div>
                <Button onClick={copyAll} variant="outline" className="h-7 text-xs gap-1.5 shrink-0">
                  {copied ? <><CheckCircle2 className="h-3 w-3 text-emerald-400" />Disalin</> : <><Copy className="h-3 w-3" />Salin</>}
                </Button>
              </div>
              <p className="text-xs text-slate-400">{result.deskripsiPekerjaan}</p>
              {kritis > 0 && <div className="mt-2 rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-2 flex items-center gap-2">
                <AlertTriangle className="h-3.5 w-3.5 text-red-400 shrink-0" />
                <p className="text-xs text-red-300">{kritis} langkah dengan risiko Kritis/Tinggi — perlu perhatian khusus HSE Officer</p>
              </div>}
            </div>

            <div className="space-y-2 mb-4">
              {result.bahayaList?.map((b, i) => (
                <div key={i} className="rounded-xl border border-white/8 bg-white/2">
                  <button onClick={() => toggleBahaya(i)} className="w-full text-left p-3.5 flex items-center gap-3">
                    <div className="rounded-full bg-amber-500/20 w-6 h-6 flex items-center justify-center shrink-0 text-xs font-bold text-amber-400">{i+1}</div>
                    <p className="text-sm text-white font-medium flex-1">{b.langkahPekerjaan}</p>
                    <Badge variant="outline" className={`text-[9px] border shrink-0 ${LEVEL_RISIKO_COLOR[b.levelRisiko] ?? "text-slate-400 border-slate-600"}`}>{b.levelRisiko}</Badge>
                    <ChevronDown className={`h-4 w-4 text-slate-500 shrink-0 transition-transform ${openBahaya.has(i) ? "rotate-180" : ""}`} />
                  </button>
                  {openBahaya.has(i) && (
                    <div className="px-4 pb-4 border-t border-white/8 pt-3 space-y-3">
                      <div>
                        <p className="text-[10px] text-red-400 font-semibold mb-1">Bahaya Potensial</p>
                        <div className="flex flex-wrap gap-1">{b.bahayaPotensial.map((bp, bpi) => <Badge key={bpi} variant="outline" className="text-[9px] text-red-300 border-red-400/30">{bp}</Badge>)}</div>
                      </div>
                      <div>
                        <p className="text-[10px] text-amber-400 font-semibold mb-1">Pengendalian (Hirarki)</p>
                        <div className="space-y-1">
                          {b.pengendalian.map((p, pi) => (
                            <div key={pi} className="flex items-start gap-2">
                              <Badge variant="outline" className={`text-[8px] border shrink-0 ${p.tipe === "Eliminasi" ? "text-red-400 border-red-400/30" : p.tipe === "Engineering" ? "text-blue-400 border-blue-400/30" : p.tipe === "APD" ? "text-emerald-400 border-emerald-400/30" : "text-amber-400 border-amber-400/30"}`}>{p.tipe}</Badge>
                              <p className="text-[11px] text-slate-300">{p.tindakan}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-[10px] text-emerald-400 font-semibold mb-1">APD yang Wajib Digunakan</p>
                        <div className="flex flex-wrap gap-1">{b.apd.map((a, ai) => <Badge key={ai} variant="outline" className="text-[9px] text-emerald-300 border-emerald-400/30">{a}</Badge>)}</div>
                      </div>
                      <p className="text-[10px] text-slate-500">Penanggung Jawab: <span className="text-slate-300">{b.penanggungJawab}</span></p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {result.tindakanDarurat?.length > 0 && (
              <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4 mb-4">
                <p className="text-red-400 text-xs font-semibold mb-2 flex items-center gap-1.5"><AlertTriangle className="h-3.5 w-3.5" /> Prosedur Darurat</p>
                <ul className="space-y-1">{result.tindakanDarurat.map((t, i) => <li key={i} className="text-xs text-slate-300 flex items-start gap-2"><span className="text-[9px] font-bold text-red-400 shrink-0 mt-0.5">{i+1}.</span>{t}</li>)}</ul>
              </div>
            )}

            <div className="flex gap-3">
              <Button onClick={() => setResult(null)} variant="outline" className="flex-1 text-xs"><RotateCcw className="h-3 w-3 mr-1" />Pekerjaan Lain</Button>
              <Button asChild className="flex-1 bg-amber-600 hover:bg-amber-700 text-xs">
                <Link href="/generator-sop-k3-proyek">Generator SOP K3 →</Link>
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
