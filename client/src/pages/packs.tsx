import { useState } from "react";
import { useLocation } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import {
  FileText, CheckSquare, AlertTriangle, Building2, GraduationCap, ShieldCheck,
  ClipboardList, Briefcase, ArrowRight, Star, Lock, Zap, BarChart3, Users
} from "lucide-react";

interface Pack {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  badge?: string;
  status: "available" | "coming_soon";
  outputs: string[];
  useCases: string[];
  route?: string;
}

const PACKS: Pack[] = [
  {
    id: "tender_pelaksana",
    name: "Tender LPSE – Pelaksana Konstruksi",
    description: "Wizard lengkap untuk vendor/kontraktor konstruksi (gedung, jalan, jembatan). Dari data tender, sistem menghasilkan checklist kelengkapan, review risiko/kepatuhan Perpres 46/2025, dan draft dokumen penawaran siap pakai.",
    icon: <Building2 className="h-7 w-7" />,
    color: "blue",
    badge: "Tersedia",
    status: "available",
    outputs: ["Checklist LPSE + skor", "Risk & Compliance Review", "Draft surat penawaran", "Metode pelaksanaan", "Rencana SMKK"],
    useCases: ["Kontraktor pekerjaan gedung", "Kontraktor jalan & jembatan", "Vendor pengadaan konstruksi"],
    route: "/packs/tender-pelaksana",
  },
  {
    id: "tender_konsultansi",
    name: "Tender LPSE – Konsultansi MK",
    description: "Wizard khusus untuk konsultan Manajemen Konstruksi (MK). Menghasilkan proposal teknis utuh (12 blok modular), checklist kepatuhan, risk review, dan template laporan monitoring SMKK.",
    icon: <ClipboardList className="h-7 w-7" />,
    color: "purple",
    badge: "Tersedia",
    status: "available",
    outputs: ["Proposal teknis modular (M0–M12)", "Checklist + skor MK", "Risk review", "Template laporan SMKK"],
    useCases: ["Konsultan manajemen konstruksi", "Konsultan supervisi", "Konsultan DED"],
    route: "/packs/tender-konsultansi",
  },
  {
    id: "perizinan",
    name: "Perizinan & Sertifikasi",
    description: "Wizard step-by-step untuk menentukan jalur perizinan, checklist persyaratan, timeline, dan output dokumen. Mencakup SBU, NIB, BUJK, dan perizinan sektor konstruksi.",
    icon: <ShieldCheck className="h-7 w-7" />,
    color: "green",
    badge: "Segera",
    status: "coming_soon",
    outputs: ["Jalur perizinan", "Checklist persyaratan", "Timeline perizinan", "Draft dokumen"],
    useCases: ["BUJK baru", "Perpanjangan SBU", "Permohonan NIB sektor konstruksi"],
  },
  {
    id: "smap",
    name: "SMAP & Panduan Cegah Korupsi",
    description: "Self-assessment Sistem Manajemen Anti Penyuapan (SMAP) sesuai SNI ISO 37001, gap analysis, dan rencana tindakan. Termasuk Panduan Cegah Korupsi (Pancek) KPK.",
    icon: <AlertTriangle className="h-7 w-7" />,
    color: "orange",
    badge: "Segera",
    status: "coming_soon",
    outputs: ["Self-assessment SMAP", "Gap analysis", "Action plan", "Evidence checklist"],
    useCases: ["BUJK yang butuh sertifikasi", "Internal compliance review", "Persiapan audit KPK"],
  },
  {
    id: "smkk",
    name: "SMKK – Sistem Manajemen K3 Konstruksi",
    description: "Checklist penerapan SMKK, audit internal, temuan & CAPA, evidence checklist. Membantu BUJK mempersiapkan dokumentasi K3 sesuai Permen PUPR 10/2021.",
    icon: <CheckSquare className="h-7 w-7" />,
    color: "red",
    badge: "Segera",
    status: "coming_soon",
    outputs: ["Checklist SMKK", "Temuan audit", "CAPA plan", "Evidence tracker"],
    useCases: ["Kontraktor yang wajib SMKK", "Audit internal K3", "Persiapan kunjungan pengawas"],
  },
  {
    id: "bujk_report",
    name: "Laporan Kegiatan Usaha BUJK",
    description: "Pengumpulan data, validasi kelengkapan, dan generator draft narasi + tabel ringkasan untuk Laporan Kegiatan Usaha Tahunan BUJK sesuai ketentuan LSBU.",
    icon: <BarChart3 className="h-7 w-7" />,
    color: "teal",
    badge: "Segera",
    status: "coming_soon",
    outputs: ["Narasi laporan", "Tabel ringkasan kegiatan", "Validasi kelengkapan"],
    useCases: ["BUJK yang wajib laporan tahunan", "Tim legal/compliance BUJK"],
  },
];

const COLOR_MAP: Record<string, { bg: string; border: string; icon: string; badge: string }> = {
  blue:   { bg: "bg-blue-50 dark:bg-blue-950/30",   border: "border-blue-200 dark:border-blue-800",   icon: "text-blue-600",   badge: "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300" },
  purple: { bg: "bg-purple-50 dark:bg-purple-950/30", border: "border-purple-200 dark:border-purple-800", icon: "text-purple-600", badge: "bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300" },
  green:  { bg: "bg-green-50 dark:bg-green-950/30",  border: "border-green-200 dark:border-green-800",  icon: "text-green-600",  badge: "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300" },
  orange: { bg: "bg-orange-50 dark:bg-orange-950/30", border: "border-orange-200 dark:border-orange-800", icon: "text-orange-600", badge: "bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300" },
  red:    { bg: "bg-red-50 dark:bg-red-950/30",      border: "border-red-200 dark:border-red-800",      icon: "text-red-600",    badge: "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300" },
  teal:   { bg: "bg-teal-50 dark:bg-teal-950/30",    border: "border-teal-200 dark:border-teal-800",    icon: "text-teal-600",   badge: "bg-teal-100 text-teal-700 dark:bg-teal-900/50 dark:text-teal-300" },
};

export default function PacksPage() {
  const [, navigate] = useLocation();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")} className="gap-2">
                ← Dashboard
              </Button>
            </div>
            {!user && (
              <Button onClick={() => navigate("/dashboard")} className="gap-2">
                Mulai Gratis <ArrowRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Hero */}
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4 px-3 py-1 text-xs gap-1.5">
            <Zap className="h-3 w-3" /> Domain Solution Packs
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Paket Chatbot Siap Pakai
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Engine Gustafta + konten domain spesifik. Pilih paket, isi wizard, dapatkan output kerja yang nyata — tanpa coding.
          </p>
        </div>

        {/* Highlight stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {[
            { icon: <FileText className="h-5 w-5 text-blue-500" />, value: "2", label: "Pack Tersedia" },
            { icon: <CheckSquare className="h-5 w-5 text-green-500" />, value: "4", label: "Pack Segera Hadir" },
            { icon: <ShieldCheck className="h-5 w-5 text-orange-500" />, value: "Perpres 46/2025", label: "Regulasi Acuan" },
            { icon: <Users className="h-5 w-5 text-purple-500" />, value: "No-Code", label: "Wizard Based" },
          ].map(({ icon, value, label }) => (
            <Card key={label} className="text-center p-4">
              <div className="flex justify-center mb-2">{icon}</div>
              <div className="font-bold text-lg">{value}</div>
              <div className="text-xs text-muted-foreground">{label}</div>
            </Card>
          ))}
        </div>

        {/* Pack Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {PACKS.map((pack) => {
            const colors = COLOR_MAP[pack.color] || COLOR_MAP.blue;
            const isAvailable = pack.status === "available";
            return (
              <Card
                key={pack.id}
                className={`relative overflow-hidden border-2 transition-all duration-200 ${isAvailable ? "hover:shadow-lg hover:-translate-y-0.5 cursor-pointer" : "opacity-75"} ${colors.border}`}
                onClick={() => isAvailable && pack.route && navigate(pack.route)}
                data-testid={`card-pack-${pack.id}`}
              >
                {!isAvailable && (
                  <div className="absolute top-3 right-3">
                    <Lock className="h-4 w-4 text-muted-foreground" />
                  </div>
                )}
                <CardHeader className={`pb-3 ${colors.bg}`}>
                  <div className="flex items-start gap-3">
                    <div className={`mt-0.5 ${colors.icon}`}>{pack.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <CardTitle className="text-base leading-tight">{pack.name}</CardTitle>
                        {pack.badge && (
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${colors.badge}`}>
                            {pack.badge}
                          </span>
                        )}
                      </div>
                      <CardDescription className="text-xs leading-relaxed">{pack.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-4 space-y-4">
                  <div>
                    <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-2">Output yang Dihasilkan</p>
                    <div className="flex flex-wrap gap-1.5">
                      {pack.outputs.map((o) => (
                        <Badge key={o} variant="secondary" className="text-xs font-normal py-0">{o}</Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-2">Cocok Untuk</p>
                    <div className="space-y-1">
                      {pack.useCases.map((u) => (
                        <div key={u} className="flex items-center gap-2 text-xs text-muted-foreground">
                          <div className={`w-1.5 h-1.5 rounded-full ${colors.icon.replace("text-", "bg-")}`} />
                          {u}
                        </div>
                      ))}
                    </div>
                  </div>
                  {isAvailable ? (
                    <Button className="w-full gap-2" size="sm" data-testid={`btn-launch-pack-${pack.id}`}>
                      Mulai Wizard <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  ) : (
                    <Button variant="outline" className="w-full" size="sm" disabled>
                      Segera Hadir
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center border rounded-2xl p-10 bg-card">
          <div className="flex justify-center mb-4">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Star className="h-7 w-7 text-primary" />
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-3">Butuh Pack Khusus?</h2>
          <p className="text-muted-foreground max-w-lg mx-auto mb-6">
            Kami menerima pengembangan paket khusus sesuai domain dan kebutuhan perusahaan Anda. Hubungi tim kami untuk diskusi lebih lanjut.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Button variant="outline" className="gap-2" onClick={() => navigate("/")}>
              <Briefcase className="h-4 w-4" /> Pelajari Engine
            </Button>
            <Button className="gap-2" onClick={() => navigate("/pricing")}>
              <GraduationCap className="h-4 w-4" /> Lihat Harga
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
