import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { FileEdit, ChevronLeft, Copy, CheckCircle, RotateCcw } from "lucide-react";
import { Link } from "wouter";

type BeritaAcara = { judul: string; nomorBA: string; isiBA: string; pihakYangMenandatangani: string[]; lampiran: string[]; catatan: string };

const JENIS_BA = [
  "BA Prestasi Pekerjaan / MC (Monthly Certificate)","BA Serah Terima Lapangan","BA Pemeriksaan Pekerjaan","BA Pengujian & Tes Material","BA Pekerjaan Tambah/Kurang","BA Adendum Kontrak","BA Perpanjangan Waktu / CCO","BA Pembahasan Keterlambatan","BA Kerusakan / Force Majeure","BA Perhitungan Akhir (Final Account)","BA Rapat Koordinasi Proyek","BA Penghentian Pekerjaan","BA Konsiliasi / Penyelesaian Sengketa",
];

export default function GeneratorBeritaAcara() {
  const [jenisBA, setJenisBA] = useState("");
  const [namaProyek, setNamaProyek] = useState("");
  const [pihakPertama, setPihakPertama] = useState("");
  const [pihakKedua, setPihakKedua] = useState("");
  const [tanggal, setTanggal] = useState("");
  const [lokasi, setLokasi] = useState("");
  const [nomorKontrak, setNomorKontrak] = useState("");
  const [nilaiProgress, setNilaiProgress] = useState("");
  const [konteksKhusus, setKonteksKhusus] = useState("");
  const [hasil, setHasil] = useState<BeritaAcara | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  async function generate() {
    if (!jenisBA || !namaProyek) return;
    setLoading(true);
    try {
      const r = await fetch("/api/tools/generator-berita-acara", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jenisBA, namaProyek, pihakPertama, pihakKedua, tanggal, lokasi, nomorKontrak, nilaiProgress, konteksKhusus }),
      });
      setHasil(await r.json());
    } catch { }
    setLoading(false);
  }

  function copyText() {
    if (!hasil) return;
    const lines = [hasil.judul, hasil.nomorBA, "", hasil.isiBA];
    if (hasil.lampiran.length > 0) { lines.push("", "LAMPIRAN:"); hasil.lampiran.forEach((l, i) => lines.push(`${i + 1}. ${l}`)); }
    if (hasil.catatan) lines.push("", hasil.catatan);
    navigator.clipboard.writeText(lines.join("\n"));
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="min-h-screen bg-[#0a0f1e] text-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link href="/kompetensi-hub"><button className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 text-sm transition-colors"><ChevronLeft className="h-4 w-4" />Kembali ke Hub</button></Link>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-emerald-500/10"><FileEdit className="h-6 w-6 text-emerald-400" /></div>
          <div><h1 className="text-2xl font-bold">Generator Berita Acara Proyek Konstruksi</h1><p className="text-slate-400 text-sm">MC, serah terima, adendum, CCO, force majeure, sengketa — siap tanda tangan</p></div>
        </div>
        <div className="flex gap-2 mb-8"><Badge variant="outline" className="text-emerald-400 border-emerald-400/30">Gelombang 18</Badge><Badge variant="outline" className="text-slate-400 border-slate-600">GPT-4o-mini</Badge></div>

        {!hasil ? (
          <Card className="bg-slate-900 border-slate-700 p-6 space-y-5">
            <div className="space-y-2"><Label className="text-slate-300">Jenis Berita Acara</Label>
              <Select value={jenisBA} onValueChange={setJenisBA}><SelectTrigger className="bg-slate-800 border-slate-600"><SelectValue placeholder="Pilih jenis BA..." /></SelectTrigger>
                <SelectContent>{JENIS_BA.map(j => <SelectItem key={j} value={j}>{j}</SelectItem>)}</SelectContent></Select></div>
            <div className="space-y-2"><Label className="text-slate-300">Nama Proyek</Label>
              <Input placeholder="cth: Pembangunan RSUD Tipe B Kabupaten Bogor" value={namaProyek} onChange={e => setNamaProyek(e.target.value)} className="bg-slate-800 border-slate-600 text-white" /></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2"><Label className="text-slate-300">Pihak Pertama (Pemberi Kerja)</Label>
                <Input placeholder="cth: Dinas PUPR Kab. Bogor / PT XYZ Tbk." value={pihakPertama} onChange={e => setPihakPertama(e.target.value)} className="bg-slate-800 border-slate-600 text-white" /></div>
              <div className="space-y-2"><Label className="text-slate-300">Pihak Kedua (Kontraktor)</Label>
                <Input placeholder="cth: PT Maju Konstruksi Nusantara" value={pihakKedua} onChange={e => setPihakKedua(e.target.value)} className="bg-slate-800 border-slate-600 text-white" /></div>
              <div className="space-y-2"><Label className="text-slate-300">Nomor Kontrak</Label>
                <Input placeholder="cth: 123/SPK-PUPR/2026" value={nomorKontrak} onChange={e => setNomorKontrak(e.target.value)} className="bg-slate-800 border-slate-600 text-white" /></div>
              <div className="space-y-2"><Label className="text-slate-300">Tanggal & Lokasi</Label>
                <Input placeholder="cth: Bogor, 9 Juni 2026" value={tanggal} onChange={e => setTanggal(e.target.value)} className="bg-slate-800 border-slate-600 text-white" /></div>
              <div className="space-y-2 md:col-span-2"><Label className="text-slate-300">Nilai / Progres / Persentase (opsional)</Label>
                <Input placeholder="cth: Progres 67,5%, nilai tagihan Rp 12.500.000.000" value={nilaiProgress} onChange={e => setNilaiProgress(e.target.value)} className="bg-slate-800 border-slate-600 text-white" /></div>
            </div>
            <div className="space-y-2"><Label className="text-slate-300">Konteks / Detail Khusus (opsional)</Label>
              <Textarea placeholder="cth: Keterlambatan 14 hari akibat hujan ekstrem selama 10 hari dan banjir lokal yang mengakibatkan area kerja tidak dapat diakses. Didukung data BMKG dan laporan site." value={konteksKhusus} onChange={e => setKonteksKhusus(e.target.value)} className="bg-slate-800 border-slate-600 text-white" rows={3} /></div>
            <Button onClick={generate} disabled={loading || !jenisBA || !namaProyek} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
              {loading ? "Generating berita acara..." : "Generate Berita Acara →"}
            </Button>
          </Card>
        ) : (
          <div className="space-y-4">
            <div className="flex gap-3">
              <Button size="sm" variant="outline" onClick={() => setHasil(null)} className="border-slate-600 text-slate-300"><RotateCcw className="h-3 w-3 mr-1" />Ubah</Button>
              <Button size="sm" onClick={copyText} className={`${copied ? "bg-emerald-700" : "bg-emerald-600 hover:bg-emerald-700"} text-white`}>
                {copied ? <><CheckCircle className="h-3 w-3 mr-1" />Tersalin!</> : <><Copy className="h-3 w-3 mr-1" />Salin BA</>}
              </Button>
            </div>
            <Card className="bg-slate-900 border-slate-700 p-8">
              <div className="text-center mb-6">
                <h2 className="text-lg font-bold text-white uppercase tracking-wider">{hasil.judul}</h2>
                {hasil.nomorBA && <p className="text-sm text-slate-400 mt-1">{hasil.nomorBA}</p>}
              </div>
              <div className="whitespace-pre-line text-slate-200 text-sm leading-relaxed">{hasil.isiBA}</div>
              {hasil.pihakYangMenandatangani.length > 0 && (
                <div className="mt-8 pt-4 border-t border-slate-700">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">{hasil.pihakYangMenandatangani.map((p, i) => (
                    <div key={i} className="text-center">
                      <div className="h-16 border-b border-dashed border-slate-600 mb-2" />
                      <p className="text-xs text-slate-400">{p}</p>
                    </div>
                  ))}</div>
                </div>
              )}
              {hasil.lampiran.length > 0 && (
                <div className="mt-4 pt-4 border-t border-slate-700">
                  <p className="text-xs font-bold text-slate-400 mb-2">LAMPIRAN:</p>
                  <ol className="space-y-1">{hasil.lampiran.map((l, i) => <li key={i} className="text-xs text-slate-400">{i + 1}. {l}</li>)}</ol>
                </div>
              )}
              {hasil.catatan && <p className="mt-4 text-xs text-slate-500 italic border-t border-slate-700 pt-3">{hasil.catatan}</p>}
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
