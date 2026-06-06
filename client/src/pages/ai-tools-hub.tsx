import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft, Calculator, ShieldAlert, Sparkles, ChevronRight,
  Zap, Brain, Eye, FileText, Wrench, FileSignature, Shield, Target
} from "lucide-react";

interface Tool {
  href: string;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  badgeColor: string;
  label: string;
  desc: string;
  tag: string;
  model: string;
}

const TOOLS: Tool[] = [
  {
    href: "/rab-kalkulator",
    icon: <Calculator className="h-6 w-6" />,
    iconBg: "bg-amber-500/10",
    iconColor: "text-amber-400",
    badgeColor: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    label: "Kalkulator RAB Otomatis",
    desc: "Tempel catatan lapangan yang berantakan — AI langsung mengubahnya menjadi tabel RAB terstruktur lengkap dengan volume, harga satuan, PPN, dan grand total.",
    tag: "Estimasi Biaya",
    model: "GPT-4o",
  },
  {
    href: "/k3-vision",
    icon: <ShieldAlert className="h-6 w-6" />,
    iconBg: "bg-red-500/10",
    iconColor: "text-red-400",
    badgeColor: "bg-red-500/15 text-red-400 border-red-500/30",
    label: "AI Vision K3 Inspector",
    desc: "Upload foto lapangan konstruksi — GPT-4o Vision menganalisis potensi pelanggaran K3, memberikan skor kepatuhan, dan rekomendasi tindakan segera.",
    tag: "Inspeksi K3",
    model: "GPT-4o Vision",
  },
  {
    href: "/docu-gen",
    icon: <FileSignature className="h-6 w-6" />,
    iconBg: "bg-blue-500/10",
    iconColor: "text-blue-400",
    badgeColor: "bg-blue-500/15 text-blue-400 border-blue-500/30",
    label: "DocuGen — AI Document Generator",
    desc: "Pilih klien dan jenis dokumen — AI menghasilkan Surat Kuasa, Permohonan SBU, Pakta Integritas, Perjanjian Layanan, dan 5 jenis surat lain dalam bahasa Indonesia formal.",
    tag: "Biro Jasa",
    model: "GPT-4o",
  },
  {
    href: "/cert-tracker",
    icon: <Shield className="h-6 w-6" />,
    iconBg: "bg-emerald-500/10",
    iconColor: "text-emerald-400",
    badgeColor: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    label: "CertTracker — Monitor Sertifikat BUJK",
    desc: "Kelola sertifikat SBU, SKK, ISO, CSMS, dan dokumen perizinan klien biro jasa. Alert otomatis H-90/H-30 sebelum expired.",
    tag: "Biro Jasa",
    model: "PostgreSQL",
  },
  {
    href: "/tender-mate",
    icon: <Target className="h-6 w-6" />,
    iconBg: "bg-indigo-500/10",
    iconColor: "text-indigo-400",
    badgeColor: "bg-indigo-500/15 text-indigo-400 border-indigo-500/30",
    label: "TenderMate — Pipeline Tender",
    desc: "Track dan kelola pipeline tender klien biro jasa dari teridentifikasi → penawaran → menang. Hitung win rate dan total nilai kontrak.",
    tag: "Biro Jasa",
    model: "PostgreSQL",
  },
];

const MODEL_ROUTER = [
  {
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    icon: <Brain className="h-4 w-4" />,
    label: "GPT-4o",
    role: "Orchestrator & Vision",
    desc: "Logika kompleks, analisis gambar, koordinasi agen",
  },
  {
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    icon: <Zap className="h-4 w-4" />,
    label: "DeepSeek",
    role: "Kalkulasi & RAB",
    desc: "Chain-of-thought matematis, hemat biaya",
  },
  {
    color: "text-violet-400",
    bg: "bg-violet-500/10",
    border: "border-violet-500/20",
    icon: <Eye className="h-4 w-4" />,
    label: "Gemini",
    role: "Dokumen Besar",
    desc: "Context window raksasa, analisis PDF tebal",
  },
  {
    color: "text-orange-400",
    bg: "bg-orange-500/10",
    border: "border-orange-500/20",
    icon: <FileText className="h-4 w-4" />,
    label: "Qwen",
    role: "Ekstraksi Data",
    desc: "Structured JSON output, data berantakan → rapi",
  },
];

export default function AiToolsHub() {
  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <div className="border-b border-white/8 px-4 py-3 flex items-center gap-3">
        <Link href="/">
          <Button variant="ghost" size="sm" className="text-white/60 hover:text-white gap-1.5 -ml-2">
            <ArrowLeft className="h-4 w-4" />
            Kembali
          </Button>
        </Link>
        <div className="flex-1" />
        <Badge className="bg-violet-500/15 text-violet-400 border-violet-500/30 gap-1.5">
          <Wrench className="h-3.5 w-3.5" />
          AI Tools Hub
        </Badge>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-violet-500/10 border border-violet-500/20 mb-4">
            <Sparkles className="h-8 w-8 text-violet-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">AI Tools Hub</h1>
          <p className="text-white/50 text-sm max-w-md mx-auto">
            Kumpulan alat AI mandiri untuk pekerjaan konstruksi, K3, dan estimasi biaya — tidak perlu login, langsung pakai.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
          {TOOLS.map((tool) => (
            <Link key={tool.href} href={tool.href}>
              <div className="group cursor-pointer border border-white/8 hover:border-white/20 rounded-2xl p-5 bg-white/2 hover:bg-white/4 transition-all">
                <div className="flex items-start gap-4">
                  <div className={`flex-shrink-0 w-12 h-12 rounded-xl ${tool.iconBg} border border-white/8 flex items-center justify-center ${tool.iconColor}`}>
                    {tool.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-semibold text-white group-hover:text-white/90">{tool.label}</h3>
                    </div>
                    <p className="text-xs text-white/45 leading-relaxed mb-3">{tool.desc}</p>
                    <div className="flex items-center gap-2">
                      <Badge className={`text-[10px] px-2 py-0.5 border ${tool.badgeColor}`}>{tool.tag}</Badge>
                      <span className="text-[10px] text-white/30">via {tool.model}</span>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-white/25 group-hover:text-white/50 shrink-0 mt-1 transition-colors" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="border border-white/8 rounded-2xl p-5 bg-white/2">
          <div className="flex items-center gap-2 mb-1">
            <Brain className="h-4 w-4 text-violet-400" />
            <h2 className="text-sm font-semibold text-white">Model Router — Routing AI Otomatis</h2>
          </div>
          <p className="text-xs text-white/40 mb-4">
            Setiap tool secara otomatis memilih model AI terbaik berdasarkan jenis tugas. Tidak ada biaya pemborosan — model mahal hanya dipakai untuk tugas yang membutuhkannya.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {MODEL_ROUTER.map((m) => (
              <div key={m.label} className={`border ${m.border} rounded-xl p-3 ${m.bg}`}>
                <div className={`flex items-center gap-1.5 mb-1 ${m.color}`}>
                  {m.icon}
                  <span className="text-xs font-semibold">{m.label}</span>
                </div>
                <p className="text-[10px] text-white/60 font-medium mb-0.5">{m.role}</p>
                <p className="text-[10px] text-white/35 leading-snug">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
