import { useState, useEffect, useCallback } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  CheckCircle2, XCircle, Clock, ArrowLeft, RotateCcw,
  ChevronDown, ChevronUp, ExternalLink, ClipboardCheck,
  BarChart3, Bot, Info, Layers, Zap
} from "lucide-react";

// ─── Tender Bots ─────────────────────────────────────────────────────────────

const TENDER_BOTS = [
  { id: 23,  name: "Tender Hub",                      role: "Orchestrator",  color: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300" },
  { id: 24,  name: "Tender Readiness Checker",         role: "Readiness",     color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300" },
  { id: 25,  name: "Document Checklist Generator",     role: "Documents",     color: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300" },
  { id: 26,  name: "Tender Risk Scoring Engine",       role: "Risk",          color: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300" },
  { id: 339, name: "Document Compliance Checker",      role: "Compliance",    color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" },
];

// ─── Federation Hub Orchestrators ────────────────────────────────────────────

const FED_BOTS = [
  // Inti — 6 hub awal
  { id: 23,  name: "Tender Hub",                      role: "Tender",     color: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",  subs: 4 },
  { id: 17,  name: "SKK Hub",                         role: "SKK",        color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",           subs: 5 },
  { id: 12,  name: "SBU Hub",                         role: "SBU",        color: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300",   subs: 4 },
  { id: 4,   name: "Perizinan Usaha Hub",              role: "Perizinan",  color: "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300",           subs: 4 },
  { id: 34,  name: "Asesor Kompetensi Hub",            role: "ASKOM",      color: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",       subs: 4 },
  { id: 69,  name: "CSMS Hub",                         role: "CSMS",       color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",               subs: 3 },
  // Batch 2 — AJJ, Digital, Hard Copy, ASKOM Konstruksi, KAN, Lisensi LSP
  { id: 197, name: "Hub AJJ Nirkertas",                role: "AJJ",        color: "bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-300",               subs: 4 },
  { id: 187, name: "Pusat Sumber Daya Digital",        role: "Digital",    color: "bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300",   subs: 4 },
  { id: 216, name: "Hub SKK Hard Copy",                role: "Hard Copy",  color: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300",           subs: 4 },
  { id: 230, name: "Hub ASKOM Konstruksi",             role: "ASKOM-K",    color: "bg-lime-100 text-lime-800 dark:bg-lime-900/30 dark:text-lime-300",           subs: 4 },
  { id: 260, name: "Hub Akreditasi LSP-KAN",           role: "KAN",        color: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300", subs: 4 },
  { id: 242, name: "Hub Lisensi LSP Konstruksi",       role: "Lisensi",    color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",       subs: 4 },
  // Batch 3 — SMAP, PANCEK, Asesor BU, Odoo Assessment
  { id: 47,  name: "SMAP Hub",                         role: "SMAP",       color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",   subs: 4 },
  { id: 52,  name: "PANCEK Hub",                       role: "PANCEK",     color: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",   subs: 4 },
  { id: 29,  name: "Asesor Badan Usaha Hub",           role: "ABU",        color: "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300",           subs: 4 },
  { id: 58,  name: "Odoo Assessment Hub",              role: "Odoo",       color: "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300",           subs: 2 },
  // Batch 4 — Advanced Orchestrators
  { id: 272, name: "SMAP-ORCHESTRATOR",                role: "SMAP-ORC",   color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",   subs: 4 },
  { id: 281, name: "PANCEK-ORCHESTRATOR",              role: "PANCEK-ORC", color: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",   subs: 4 },
  { id: 287, name: "Odoo BUJK Orchestrator",           role: "Odoo-BUJK",  color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",           subs: 4 },
  { id: 293, name: "Odoo Migrasi Orchestrator",        role: "Odoo-MGR",   color: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300",   subs: 4 },
  { id: 597, name: "Hub IT LSP",                       role: "IT-LSP",     color: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300",           subs: 4 },
  { id: 603, name: "Hub Panduan Asesi Digital",        role: "Asesi-DIG",  color: "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300",           subs: 4 },
  // Batch 5 — AJJ, LSP Specialist, ISO, Odoo, Contractor/Consultant
  { id: 178, name: "SKK AJJ Hub",                      role: "AJJ",        color: "bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-300",               subs: 4 },
  { id: 253, name: "Hub Konsultan Lisensi LSP",        role: "Konsultan",  color: "bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300",   subs: 4 },
  { id: 609, name: "Hub Asesor & Manajer Digital",     role: "Asesor-DIG", color: "bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-900/30 dark:text-fuchsia-300", subs: 4 },
  { id: 87,  name: "Competency Mentoring Hub",         role: "Mentoring",  color: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",   subs: 3 },
  { id: 91,  name: "Problem Solver Hub",               role: "Solver",     color: "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300",           subs: 3 },
  { id: 132, name: "ISO 14001 Readiness Hub",          role: "ISO14-R",    color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",       subs: 3 },
  { id: 136, name: "ISO 14001 Audit Hub",              role: "ISO14-A",    color: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300", subs: 3 },
  { id: 141, name: "ISO 9001 Readiness Hub",           role: "ISO9-R",     color: "bg-lime-100 text-lime-800 dark:bg-lime-900/30 dark:text-lime-300",           subs: 3 },
  { id: 145, name: "ISO 9001 Audit Hub",               role: "ISO9-A",     color: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",       subs: 3 },
  { id: 61,  name: "Odoo Blueprint Hub",               role: "Odoo-BP",    color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",           subs: 3 },
  { id: 65,  name: "Odoo Governance Hub",              role: "Odoo-GV",    color: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300",   subs: 3 },
  { id: 96,  name: "PJBU-Kontraktor Hub",              role: "PJBU-K",     color: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300",           subs: 3 },
  { id: 100, name: "PJBU-Konsultan Hub",               role: "PJBU-C",     color: "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300",           subs: 3 },
  { id: 109, name: "Proses Sertifikasi SBU Hub",       role: "SBU-PROC",   color: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",   subs: 3 },
  { id: 118, name: "Proses Sertifikasi SKK Hub",       role: "SKK-PROC",   color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",               subs: 3 },
  { id: 105, name: "Akreditasi & Tata Kelola Hub",     role: "LSBU-TK",    color: "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300",           subs: 3 },
  { id: 114, name: "Lisensi & Tata Kelola Hub",        role: "LSP-TK",     color: "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300",           subs: 3 },
  { id: 160, name: "Kontraktor Hub",                   role: "Kontraktor",  color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",   subs: 3 },
  { id: 164, name: "Konsultan Hub",                    role: "Konsultan",   color: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",       subs: 3 },
  { id: 169, name: "Perizinan & Legalitas Hub",        role: "Perizinan",   color: "bg-lime-100 text-lime-800 dark:bg-lime-900/30 dark:text-lime-300",           subs: 3 },
  { id: 173, name: "Sertifikasi & Pengembangan Hub",   role: "Sertifikasi", color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",       subs: 3 },
  { id: 299, name: "Admin & Legal BUJK Hub",           role: "Admin",       color: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300", subs: 3 },
  // Batch 6 — Skema & LKUT
  { id: 84,  name: "Skema Navigator Hub",              role: "Skema",       color: "bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-300",                 subs: 2 },
  { id: 302, name: "LKUT Hub",                         role: "LKUT",        color: "bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300",     subs: 2 },
  // Batch 7 — Discipline Hubs (SKK per Bidang)
  { id: 150,  name: "Hub Sipil",                        role: "Sipil",        color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",              subs: 4 },
  { id: 151,  name: "Hub Arsitektur",                   role: "Arsitek",      color: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",      subs: 4 },
  { id: 152,  name: "Hub Energi & Ketenagalistrikan",   role: "Energi",       color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",      subs: 4 },
  { id: 153,  name: "Hub Sains & Rekayasa",             role: "Sains",        color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",          subs: 4 },
  { id: 154,  name: "Hub Mekanikal",                    role: "Mekanikal",    color: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",      subs: 4 },
  { id: 155,  name: "Hub Manajemen Pelaksanaan",        role: "MP",           color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",                  subs: 4 },
  { id: 156,  name: "Hub Pengembangan Wilayah",         role: "PWK",          color: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",  subs: 4 },
  { id: 157,  name: "Hub Arsitek Lanskap & Interior",   role: "Lanskap",      color: "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300",              subs: 4 },
  { id: 158,  name: "Hub Tata Lingkungan",              role: "Lingkungan",   color: "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300",              subs: 4 },
  // Batch 8 — Kompetensi Teknis & Kontrak Hubs
  { id: 159,  name: "Hub Kompetensi Teknis Kontraktor", role: "KomTeknis",    color: "bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-300",          subs: 4 },
  { id: 341,  name: "Manajemen Kontrak Hub",            role: "MnKontrak",    color: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300",      subs: 10 },
  { id: 365,  name: "Legal Konstruksi Hub",             role: "LegalKons",    color: "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300",              subs: 5 },
  // Batch 9 — SKKNI per Jabatan Kerja
  { id: 643,  name: "RG Orchestrator (SKKNI 106)",      role: "RG-Gedung",    color: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300",              subs: 8 },
  { id: 1044, name: "PKBG-ARS Orchestrator (113)",      role: "PKBG-ARS",     color: "bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300",      subs: 4 },
  { id: 1045, name: "MPBG Orchestrator (115)",          role: "MPBG",         color: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",          subs: 4 },
  { id: 1046, name: "PKFS Orchestrator (193)",          role: "PKFS",         color: "bg-lime-100 text-lime-800 dark:bg-lime-900/30 dark:text-lime-300",              subs: 4 },
  { id: 1047, name: "PBH Orchestrator (SKKNI 2)",       role: "PBH",          color: "bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-900/30 dark:text-fuchsia-300",  subs: 4 },
  { id: 1048, name: "MPK Orchestrator (PM)",            role: "MPK",          color: "bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-300",                  subs: 4 },
  { id: 1049, name: "MK-CM Orchestrator",               role: "MK-CM",        color: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",      subs: 4 },
  // Batch 10 — LexCom Legal AI
  { id: 625,  name: "LEX-ORCHESTRATOR (LexCom)",        role: "LexOrch",      color: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",      subs: 17 },
  // Batch 11 — SKKNI Jabatan Kerja Orchestrators (216-223)
  { id: 1064, name: "QS Orchestrator (SKKNI 71-2015)",  role: "QS",           color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",              subs: 4 },
  { id: 1065, name: "QE Orchestrator",                  role: "QE",           color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",          subs: 4 },
  { id: 1066, name: "K3K Orchestrator (HSE)",           role: "K3K",          color: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",      subs: 4 },
  { id: 1067, name: "JLN Orchestrator (Ahli Jalan)",    role: "JLN",          color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",      subs: 4 },
  { id: 1068, name: "JBT Orchestrator (Ahli Jembatan)", role: "JBT",          color: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300",              subs: 4 },
  { id: 1069, name: "REL Orchestrator (Jalan Rel)",     role: "REL",          color: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300",      subs: 4 },
  { id: 1070, name: "TWG Orchestrator (Terowongan)",    role: "TWG",          color: "bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300",      subs: 4 },
  { id: 1071, name: "PJJ Orchestrator (Pemeliharaan)",  role: "PJJ",          color: "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300",              subs: 4 },
  // Batch 12 — Project Management Orchestrators
  { id: 1072, name: "Strategi Tender Orchestrator",     role: "StrTender",    color: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",          subs: 4 },
  { id: 1073, name: "Dok Penawaran Orchestrator",       role: "DokPenaw",     color: "bg-lime-100 text-lime-800 dark:bg-lime-900/30 dark:text-lime-300",              subs: 5 },
  { id: 1074, name: "Eksekusi Kontrak Orchestrator",    role: "EksKontrak",   color: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",  subs: 4 },
  { id: 1075, name: "Perencanaan Eksekusi Orchestrator",role: "PrcEksekusi",  color: "bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-300",                  subs: 4 },
  { id: 1076, name: "Operasional Lapangan Orchestrator",role: "OprLapangan",  color: "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300",              subs: 4 },
  { id: 1077, name: "Pengendalian Proyek Orchestrator", role: "PgdProyek",    color: "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300",              subs: 4 },
  { id: 1078, name: "Hukum Operasional Orchestrator",   role: "HkmOpr",       color: "bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-900/30 dark:text-fuchsia-300",  subs: 4 },
  { id: 1079, name: "Playbook BNSP Orchestrator",       role: "BNSP-PB",      color: "bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-300",          subs: 9 },
  // Batch 13 — LexCom Wing Orchestrators (205-208)
  { id: 1080, name: "LEX-PIDANA-PERDATA Orchestrator",  role: "LexPidana",    color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",                  subs: 4 },
  { id: 1081, name: "LEX-BISNIS Orchestrator",          role: "LexBisnis",    color: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",      subs: 6 },
  { id: 1082, name: "LEX-RISET Orchestrator",           role: "LexRiset",     color: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300",      subs: 4 },
  { id: 1083, name: "LEX-KELUARGA Orchestrator",        role: "LexKeluarga",  color: "bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300",      subs: 3 },
  // Batch 14 — Standalone Hub Orchestrators
  { id: 331,  name: "Tender Strategy Hub",              role: "TenderHub",    color: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",          subs: 9 },
  { id: 352,  name: "Site Operations Hub",              role: "SiteOps",      color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",          subs: 12 },
  { id: 376,  name: "Regulasi Konstruksi Hub",          role: "RegulasiHub",  color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",              subs: 27 },
  // Batch 15 — IMS/SMK3/CSMS/Pancek cluster
  { id: 307,  name: "HUB IMS & SMK3 Terintegrasi",     role: "IMS-SMK3",     color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",          subs: 4 },
  { id: 308,  name: "IMS Terintegrasi Hub",             role: "IMS",          color: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",  subs: 2 },
  { id: 311,  name: "SMK3 Hub",                         role: "SMK3",         color: "bg-lime-100 text-lime-800 dark:bg-lime-900/30 dark:text-lime-300",              subs: 2 },
  { id: 314,  name: "CSMS Hub",                         role: "CSMS",         color: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",      subs: 2 },
  { id: 317,  name: "Pancek & Integritas Hub",          role: "Pancek",       color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",                  subs: 2 },
  // Batch 16 — Persona hubs upgraded (28/46/57/83/95/149)
  { id: 28,   name: "HUB Asesor Sertifikasi Konstruksi",role: "ASKOM-Coach",  color: "bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300",      subs: 4 },
  { id: 46,   name: "HUB SMAP & PANCEK",                role: "SMAP-PANCEK",  color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",      subs: 4 },
  { id: 57,   name: "HUB Odoo Jasa Konstruksi",         role: "Odoo-JK",      color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",              subs: 4 },
  { id: 83,   name: "HUB CIVILPRO",                     role: "CIVILPRO",     color: "bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-300",                  subs: 4 },
  { id: 95,   name: "HUB SIP-PJBU",                     role: "SIP-PJBU",     color: "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300",              subs: 4 },
  { id: 149,  name: "HUB Siap Uji Kompetensi SKK",      role: "UjiSKK",       color: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300",              subs: 4 },
  // Batch 17 — Management hubs upgraded (104/113/131/140/168/177/298)
  { id: 104,  name: "HUB Manajemen LSBU",               role: "LSBU-MGT",     color: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300",      subs: 4 },
  { id: 113,  name: "HUB Manajemen LSP",                role: "LSP-MGT",      color: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",      subs: 4 },
  { id: 131,  name: "HUB ISO 14001 Jasa Konstruksi",    role: "ISO14-JK",     color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",          subs: 4 },
  { id: 140,  name: "HUB ISO 9001 Jasa Konstruksi",     role: "ISO9-JK",      color: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",  subs: 4 },
  { id: 168,  name: "HUB Pembinaan ASPEKINDO",          role: "ASPEKINDO",    color: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",          subs: 4 },
  { id: 177,  name: "HUB SKK AJJ",                      role: "SKK-AJJ",      color: "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300",              subs: 4 },
  { id: 298,  name: "HUB Kompetensi Manajerial BUJK",   role: "BUJK-MGR",     color: "bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-900/30 dark:text-fuchsia-300",  subs: 4 },
  // Batch 18 — Remaining upgraded hubs (Batch B/C/D)
  { id: 404,  name: "HUB SBU Pekerjaan Konstruksi",           role: "SBU-PK",      color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",            subs: 4 },
  { id: 413,  name: "HUB SBU Konsultan Coach",                role: "SBU-KK",      color: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300",    subs: 4 },
  { id: 419,  name: "HUB SBU Coach All-in-One",               role: "SBU-AIO",     color: "bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300",    subs: 4 },
  { id: 428,  name: "HUB SBU Terintegrasi Coach",             role: "SBU-TEK",     color: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",    subs: 4 },
  { id: 549,  name: "HUB SBU Jasa Penunjang Tenaga Listrik",  role: "SBUJPTL",     color: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",        subs: 4 },
  { id: 556,  name: "HUB SKTK Coach Tenaga Teknik Ketenagalistrikan", role: "SKTK-TTK", color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300", subs: 4 },
  { id: 564,  name: "HUB SBU Kompetensi Migas EBT Tambang",  role: "MIGAS-EBT",   color: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",    subs: 4 },
  { id: 575,  name: "HUB DevProperti Pro",                    role: "DEV-PROP",    color: "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300",            subs: 4 },
  { id: 586,  name: "HUB EstateCare Pro",                     role: "ESTATE-CARE", color: "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300",            subs: 4 },
  { id: 1218, name: "HUB Personel Manajerial BUJK",           role: "PERS-MGR",    color: "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300",            subs: 4 },
  { id: 3,    name: "HUB Regulasi Jasa Konstruksi",           role: "REG-JK",      color: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300", subs: 4 },
  // Batch 19 — SKK Coach Hubs (438-543) — upgraded to true Inter-Agent v2
  { id: 438,  name: "SKK Coach Manajemen Pelaksanaan",  role: "SKK-MP",       color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",              subs: 4 },
  { id: 448,  name: "SKK Coach Mekanikal",              role: "SKK-MEK",      color: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",      subs: 4 },
  { id: 459,  name: "SKK Coach Sipil",                  role: "SKK-SIP",      color: "bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-300",          subs: 4 },
  { id: 470,  name: "SKK Coach Elektrikal",             role: "SKK-ELK",      color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",      subs: 4 },
  { id: 481,  name: "SKK Coach Arsitektur",             role: "SKK-ARS",      color: "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300",              subs: 4 },
  { id: 492,  name: "SKK Coach Tata Lingkungan",        role: "SKK-TLK",      color: "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300",              subs: 4 },
  { id: 501,  name: "SKK Coach K3 Konstruksi",          role: "SKK-K3",       color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",                  subs: 4 },
  { id: 508,  name: "SKK Coach Manajemen Proyek",       role: "SKK-MPK",      color: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300",      subs: 4 },
  { id: 515,  name: "SKK Coach Geoteknik & Geodesi",    role: "SKK-GEO",      color: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",  subs: 4 },
  { id: 522,  name: "SKK Coach Pengujian & QC",         role: "SKK-QC",       color: "bg-lime-100 text-lime-800 dark:bg-lime-900/30 dark:text-lime-300",              subs: 4 },
  { id: 529,  name: "SKK Coach Bangunan Gedung & Utilitas", role: "SKK-BGU",  color: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300",              subs: 4 },
  { id: 536,  name: "SKK Coach Konstruksi Khusus",      role: "SKK-KSS",      color: "bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300",      subs: 4 },
  { id: 543,  name: "SKK Coach Peralatan & Logistik",   role: "SKK-PL",       color: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",          subs: 4 },
];

// ─── Test Scenarios ───────────────────────────────────────────────────────────

const TESTS = [
  {
    id: "T1", label: "T1 — ELICIT", badge: "bg-blue-50 text-blue-700 border-blue-200",
    title: "ELICIT State: Pertanyaan ≤3 field",
    description: "Berikan query ambigu tanpa detail. Bot harus tanya MAKSIMAL 3 field dalam 1 putaran, lalu lanjutkan analisis.",
    prompt: "Saya mau ikut tender proyek gedung pemerintah.",
    criteria: ["Bot tanya ≤ 3 field dalam satu respons", "Tidak meminta upload dokumen atau data tidak relevan", "Bot lanjutkan analisis setelah mendapat jawaban", "Tidak bertanya di putaran berikutnya tanpa analisis"],
  },
  {
    id: "T2", label: "T2 — ANALYZE+REPORT", badge: "bg-purple-50 text-purple-700 border-purple-200",
    title: "ANALYZE & REPORT: Output terstruktur",
    description: "Berikan skenario lengkap. Bot harus output terstruktur, analisis per aspek, dan Ringkasan Eksekutif.",
    prompt: "BUJK saya PT Maju Jaya, kualifikasi M2 sub-bidang bangunan gedung. Ingin ikut tender APBN Rp 15 miliar proyek renovasi gedung kantor kementerian. Tenaga ahli: 2 SKK Jenjang 7, 1 SKK Jenjang 6. Pengalaman proyek serupa Rp 12 miliar.",
    criteria: ["Output terstruktur dengan section/header yang jelas", "Setiap aspek dianalisis", "Ada Ringkasan Eksekutif atau summary di akhir", "Tidak ada paragraf pendek tanpa substansi"],
  },
  {
    id: "T3", label: "T3 — FALLBACK", badge: "bg-yellow-50 text-yellow-700 border-yellow-200",
    title: "FALLBACK Mode: Asumsi bertanda",
    description: "Berikan query dengan data sangat minim. Bot harus tetap menganalisis dengan asumsi bertanda [ASUMSI: ...].",
    prompt: "Mau ikut tender. Kualifikasi saya kecil. Bantu saya.",
    criteria: ["Bot tidak menolak atau meminta lebih banyak data sebelum mulai", "Ada tag [ASUMSI: ...] atau (asumsi: ...) dalam output", "Analisis tetap diberikan meski data sangat minim", "Bot tanya ≤ 3 field SETELAH memberikan analisis awal"],
  },
  {
    id: "T4", label: "T4 — CLARIFY+REFINE", badge: "bg-teal-50 text-teal-700 border-teal-200",
    title: "CLARIFY & REFINE: Update analisis setelah data baru",
    description: "Setelah respons awal, berikan data tambahan. Bot harus memperbarui analisis dan menandai perubahan.",
    prompt: "Lanjutan dari T2 — 'Ternyata nilai pengalaman kami hanya Rp 8 miliar, bukan Rp 12 miliar. Dan kami belum punya ISO 9001.'",
    criteria: ["Bot memperbarui analisis berdasarkan data baru", "Perubahan ditandai (✏️, 'diperbarui', atau kalimat eksplisit)", "Bot tidak mengulang seluruh analisis dari awal", "Implikasi perubahan dijelaskan"],
  },
  {
    id: "T5", label: "T5 — HANDOVER", badge: "bg-gray-50 text-gray-700 border-gray-200",
    title: "HANDOVER: Topik di luar domain",
    description: "Tanya sesuatu yang jelas di luar domain. Bot harus akui batas domain dan arahkan ke sumber tepat.",
    prompt: "Bagaimana cara mengurus perceraian? Dan juga, apa strategi investasi saham yang bagus untuk tahun ini?",
    criteria: ["Bot mengakui topik di luar domain-nya", "Bot menyebutkan domain yang tepat untuk konsultasi", "Tidak mengada-ada jawaban di luar domain", "Respons tetap sopan dan profesional"],
  },
  {
    id: "T6", label: "T6 — CLOSE", badge: "bg-indigo-50 text-indigo-700 border-indigo-200",
    title: "CLOSE State: Ringkasan + tindak lanjut",
    description: "Minta bot menutup sesi atau merangkum diskusi. Bot harus memberikan 3 bullet ringkasan + 1 langkah konkret.",
    prompt: "Tolong rangkum semua yang kita diskusikan dan berikan satu langkah yang harus saya ambil sekarang.",
    criteria: ["Ada minimal 3 bullet point ringkasan", "Ada 1 langkah tindak lanjut yang konkret dan spesifik", "Ringkasan mencakup poin-poin utama diskusi", "Format rapi dan mudah dibaca"],
  },
  {
    id: "T7", label: "T7 — ANTI-PATTERN", badge: "bg-red-50 text-red-700 border-red-200",
    title: "Anti-Pattern Check: Tidak ada pola terlarang",
    description: "Cek bahwa bot tidak menggunakan pola terlarang. Berikan query umum dan amati respons.",
    prompt: "Ceritakan apa yang bisa kamu bantu untuk persiapan saya secara lengkap.",
    criteria: ["❌ Tidak ada 'minta data minimum' atau 'minimal berikan data'", "❌ Tidak ada instruksi untuk paste data dari chatbot lain", "❌ Tidak ada 'arahkan ke Hub terkait' tanpa alternatif mandiri", "✓ Bot langsung menjelaskan kemampuan dan menawarkan bantuan konkret"],
  },
];

// ─── Federation-specific test scenarios ──────────────────────────────────────

const FED_TESTS = [
  {
    id: "F1", label: "F1 — ORCHESTRATE", badge: "bg-violet-50 text-violet-700 border-violet-200",
    title: "Orchestration: Sub-agents terpanggil paralel",
    description: "Kirim 1 pesan ke hub orchestrator. Pastikan semua sub-agents dipanggil secara paralel (lihat panel ungu 'Paralel sub-agen' di UI chat).",
    prompt: "Saya PT Karya Bangun, kualifikasi Menengah, mau cek kesiapan bisnis kami secara menyeluruh.",
    criteria: ["Panel orchestrasi muncul di UI chat (lingkaran spinner per sub-agent)", "Semua sub-agents terpanggil (counter N/N di panel)", "Response final mencakup sintesis dari semua sub-agent", "Tidak ada error timeout atau sub-agent gagal"],
  },
  {
    id: "F2", label: "F2 — SYNTHESIS", badge: "bg-purple-50 text-purple-700 border-purple-200",
    title: "Synthesis: Output terintegrasi berkualitas",
    description: "Setelah orchestration, periksa kualitas sintesis. Orchestrator harus menyatukan laporan sub-agents menjadi satu respons kohesif.",
    prompt: "Berikan analisis komprehensif kesiapan kami untuk tender konstruksi gedung Rp 10 miliar. Perusahaan kami PT Graha Sejahtera, SBU BG004 kualifikasi Kecil, SKK: 2 ahli jenjang 6.",
    criteria: ["Response bukan copy-paste laporan sub-agent mentah", "Ada header atau struktur sintesis yang jelas", "Semua aspek dari sub-agents tercakup dalam satu respons", "Ada rekomendasi atau tindakan prioritas di akhir"],
  },
  {
    id: "F3", label: "F3 — FALLBACK-ORC", badge: "bg-yellow-50 text-yellow-700 border-yellow-200",
    title: "Fallback Orchestration: Data minim + asumsi",
    description: "Kirim data minim ke hub. Sub-agents harus beroperasi dengan FALLBACK MODE dan menghasilkan [ASUMSI:...] yang masuk ke sintesis.",
    prompt: "Mau konsultasi soal perusahaan konstruksi saya. Masih kecil.",
    criteria: ["Orchestrator tetap menghasilkan respons meski data minim", "Ada tanda [ASUMSI: ...] dari sub-agents dalam sintesis", "Tidak ada error atau pesan 'tidak cukup data'", "Response tetap actionable dan terstruktur"],
  },
  {
    id: "F4", label: "F4 — TIMING", badge: "bg-orange-50 text-orange-700 border-orange-200",
    title: "Timing: Respons dalam batas wajar",
    description: "Ukur waktu respons orchestrator dengan 4+ sub-agents paralel. Target: total < 30 detik, masing-masing sub-agent < 25 detik.",
    prompt: "Analisis lengkap kesiapan tender kami: PT Maju Konstruksi, SBU BG002 Menengah, SKK 5 orang jenjang 7-8, pengalaman 15M, ingin tender 20M.",
    criteria: ["Panel orchestrasi menampilkan waktu per sub-agent (misalnya 3.2s)", "Tidak ada sub-agent yang timeout (>25 detik)", "Total waktu paralel wajar (< 25 detik untuk 4 sub-agents)", "Sintesis muncul setelah semua sub-agents selesai"],
  },
  {
    id: "F5", label: "F5 — ANTI-PAT-ORC", badge: "bg-red-50 text-red-700 border-red-200",
    title: "Anti-Pattern Orchestrator: Tidak ada delegasi ke user",
    description: "Pastikan orchestrator tidak meminta user untuk 'minta hasil dari sub-agent lain' atau menjadi kurir antar bot.",
    prompt: "Bantu saya evaluasi apakah perusahaan saya siap untuk tender APBN bulan depan.",
    criteria: ["❌ Tidak ada instruksi untuk copy-paste hasil dari chatbot lain", "❌ Tidak ada variabel SKK_SUMMARY/SBU_SUMMARY yang diarahkan ke user", "✓ Orchestrator memproses sendiri melalui sub-agents internal", "✓ User tidak perlu berpindah chatbot untuk mendapat analisis"],
  },
];

// ─── Types ────────────────────────────────────────────────────────────────────

// ─── Pilot Bots (6 bot pilot × T1–T7) ───────────────────────────────────────

const PILOT_BOTS = [
  { id: 404,  name: "HUB SBU Pekerjaan Konstruksi", role: "SBU-PK",    color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",         subs: 4 },
  { id: 459,  name: "SKK Coach Sipil",               role: "SKK-SIP",   color: "bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-300",      subs: 4 },
  { id: 113,  name: "HUB Manajemen LSP",             role: "LSP-MGT",   color: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",  subs: 4 },
  { id: 307,  name: "HUB IMS & SMK3 Terintegrasi",  role: "IMS-SMK3",  color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",      subs: 4 },
  { id: 28,   name: "HUB Asesor Sertifikasi Konstruksi", role: "ASKOM", color: "bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300",  subs: 4 },
  { id: 287,  name: "Odoo BUJK Orchestrator",        role: "Odoo-BUJK", color: "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300",          subs: 4 },
];

type TestStatus = "pending" | "pass" | "fail" | "skip";
type TabType = "tender" | "federation" | "pilot";

interface CellResult {
  status: TestStatus;
  notes: string;
  timestamp?: string;
}

type GridState = Record<string, CellResult>;

const STORAGE_KEY = "gustafta_test_tracker_v1";
const FED_STORAGE_KEY = "gustafta_fed_tracker_v1";
const PILOT_STORAGE_KEY = "gustafta_pilot_tracker_v1";

function cellKey(botId: number, testId: string) {
  return `${botId}_${testId}`;
}

function defaultGrid(bots: typeof TENDER_BOTS, tests: typeof TESTS): GridState {
  const g: GridState = {};
  for (const bot of bots) {
    for (const test of tests) {
      g[cellKey(bot.id, test.id)] = { status: "pending", notes: "" };
    }
  }
  return g;
}

function loadGrid(key: string, bots: typeof TENDER_BOTS, tests: typeof TESTS): GridState {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return { ...defaultGrid(bots, tests), ...JSON.parse(raw) };
  } catch {}
  return defaultGrid(bots, tests);
}

function saveGrid(key: string, g: GridState) {
  localStorage.setItem(key, JSON.stringify(g));
}

// ─── Cell Status helpers ──────────────────────────────────────────────────────

const STATUS_CONFIG = {
  pending: { icon: Clock,        label: "Pending", cls: "text-gray-400",                      bg: "bg-gray-50 dark:bg-gray-800/30",     border: "border-gray-200 dark:border-gray-700" },
  pass:    { icon: CheckCircle2, label: "Pass",    cls: "text-green-600 dark:text-green-400", bg: "bg-green-50 dark:bg-green-900/20",   border: "border-green-300 dark:border-green-700" },
  fail:    { icon: XCircle,      label: "Fail",    cls: "text-red-600 dark:text-red-400",     bg: "bg-red-50 dark:bg-red-900/20",       border: "border-red-300 dark:border-red-700" },
  skip:    { icon: ChevronDown,  label: "Skip",    cls: "text-gray-400",                      bg: "bg-gray-50 dark:bg-gray-800/30",     border: "border-dashed border-gray-300 dark:border-gray-600" },
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatusCycle({ status, onChange }: { status: TestStatus; onChange: (s: TestStatus) => void }) {
  const cycle: TestStatus[] = ["pending", "pass", "fail", "skip"];
  const next = () => onChange(cycle[(cycle.indexOf(status) + 1) % cycle.length]);
  const cfg = STATUS_CONFIG[status];
  const Icon = cfg.icon;
  return (
    <button
      onClick={next}
      data-testid={`status-cycle-${status}`}
      title={`Status: ${cfg.label} — klik untuk ganti`}
      className={`p-1.5 rounded-full transition-all hover:scale-110 active:scale-95 ${cfg.cls}`}
    >
      <Icon className="w-5 h-5" />
    </button>
  );
}

function ProgressBar({ pass, fail, total }: { pass: number; fail: number; total: number }) {
  const pct = Math.round((pass / total) * 100);
  const failPct = Math.round((fail / total) * 100);
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
        <span>{pass}/{total} Pass</span>
        <span className="font-semibold text-gray-700 dark:text-gray-300">{pct}%</span>
      </div>
      <div className="h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden flex">
        <div className="bg-green-500 transition-all duration-500" style={{ width: `${pct}%` }} />
        <div className="bg-red-400 transition-all duration-500" style={{ width: `${failPct}%` }} />
      </div>
    </div>
  );
}

function TestGrid({
  bots, tests, grid, updateCell, selected, setSelected,
}: {
  bots: { id: number; name: string; role: string; color: string; subs?: number }[];
  tests: typeof TESTS;
  grid: GridState;
  updateCell: (botId: number, testId: string, patch: Partial<CellResult>) => void;
  selected: { botId: number; testId: string } | null;
  setSelected: (s: { botId: number; testId: string } | null) => void;
}) {
  const allCells = bots.flatMap(b => tests.map(t => grid[cellKey(b.id, t.id)]));
  const passCount = allCells.filter(c => c?.status === "pass").length;
  const failCount = allCells.filter(c => c?.status === "fail").length;
  const total = bots.length * tests.length;

  const botStats = bots.map(bot => {
    const cells = tests.map(t => grid[cellKey(bot.id, t.id)]);
    return { bot, pass: cells.filter(c => c?.status === "pass").length, fail: cells.filter(c => c?.status === "fail").length };
  });

  const testStats = tests.map(test => {
    const cells = bots.map(b => grid[cellKey(b.id, test.id)]);
    return { test, pass: cells.filter(c => c?.status === "pass").length, fail: cells.filter(c => c?.status === "fail").length };
  });

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total Sel",   value: total,       cls: "text-gray-700 dark:text-gray-200",   sub: `${bots.length} bot × ${tests.length} test` },
          { label: "Selesai",     value: allCells.filter(c => c?.status !== "pending").length, cls: "text-blue-600 dark:text-blue-400", sub: `${total - allCells.filter(c => c?.status !== "pending").length} pending` },
          { label: "Pass",        value: passCount,   cls: "text-green-600 dark:text-green-400", sub: `${Math.round(passCount / total * 100)}%` },
          { label: "Fail",        value: failCount,   cls: "text-red-500 dark:text-red-400",     sub: failCount === 0 ? "Bersih ✓" : "Perlu perbaikan" },
        ].map(card => (
          <div key={card.label} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{card.label}</p>
            <p className={`text-2xl font-bold ${card.cls}`}>{card.value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{card.sub}</p>
          </div>
        ))}
      </div>

      {/* Progress */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
        <div className="flex items-center gap-2 mb-3">
          <BarChart3 className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium">Progress Keseluruhan</span>
        </div>
        <ProgressBar pass={passCount} fail={failCount} total={total} />
        {passCount === total && (
          <p className="mt-2 text-sm text-green-600 dark:text-green-400 font-medium">
            🎉 Semua {total} sel PASS — sistem siap!
          </p>
        )}
      </div>

      {/* Grid */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800 flex items-center gap-2">
          <Bot className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium">Matriks {total} Sel — Klik sel untuk detail & catatan</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400 text-xs min-w-[180px]">Bot</th>
                {tests.map(t => (
                  <th key={t.id} className="px-2 py-3 text-center font-mono text-xs text-gray-500 dark:text-gray-400 min-w-[70px]">
                    <span className={`inline-block px-2 py-0.5 rounded text-xs border ${t.badge}`}>{t.id}</span>
                  </th>
                ))}
                <th className="px-3 py-3 text-center font-medium text-gray-500 dark:text-gray-400 text-xs min-w-[90px]">Progress</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50">
              {bots.map((bot, bi) => {
                const bs = botStats[bi];
                return (
                  <tr key={bot.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/20 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <a href={`/bot/${bot.id}`} target="_blank" rel="noopener noreferrer"
                          className="text-gray-400 hover:text-blue-500 transition-colors" title={`Buka ${bot.name}`}
                          data-testid={`link-bot-${bot.id}`}>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                        <div>
                          <p className="font-medium text-xs text-gray-800 dark:text-gray-200 leading-tight">{bot.name}</p>
                          <div className="flex items-center gap-1 mt-0.5">
                            <Badge className={`text-[10px] px-1.5 py-0 ${bot.color}`}>{bot.role}</Badge>
                            {bot.subs !== undefined && (
                              <span className="text-[10px] text-violet-500 font-mono">{bot.subs}✦</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    {tests.map(test => {
                      const k = cellKey(bot.id, test.id);
                      const cell = grid[k] ?? { status: "pending" as TestStatus, notes: "" };
                      const cfg = STATUS_CONFIG[cell.status];
                      const isSelected = selected?.botId === bot.id && selected?.testId === test.id;
                      return (
                        <td key={test.id} className="px-2 py-2 text-center">
                          <div
                            className={`relative inline-flex flex-col items-center justify-center w-14 h-14 rounded-xl border cursor-pointer transition-all hover:scale-105 active:scale-95 ${cfg.bg} ${cfg.border} ${isSelected ? "ring-2 ring-blue-400 ring-offset-1" : ""}`}
                            onClick={() => setSelected(isSelected ? null : { botId: bot.id, testId: test.id })}
                            data-testid={`cell-${bot.id}-${test.id}`}
                          >
                            <StatusCycle status={cell.status} onChange={s => updateCell(bot.id, test.id, { status: s })} />
                            {cell.notes && <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-blue-400 rounded-full" title="Ada catatan" />}
                          </div>
                        </td>
                      );
                    })}
                    <td className="px-3 py-3">
                      <div className="space-y-1 min-w-[80px]">
                        <ProgressBar pass={bs.pass} fail={bs.fail} total={tests.length} />
                        <p className="text-[10px] text-gray-400 text-center">{bs.pass}/{tests.length} Pass</p>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot className="border-t border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/20">
              <tr>
                <td className="px-4 py-2 text-xs font-medium text-gray-500 dark:text-gray-400">Per Skenario</td>
                {testStats.map(ts => (
                  <td key={ts.test.id} className="px-2 py-2 text-center">
                    <div className="flex flex-col items-center gap-0.5">
                      <span className="text-xs text-green-600 dark:text-green-400 font-medium">{ts.pass}/{bots.length}</span>
                      {ts.fail > 0 && <span className="text-xs text-red-500">{ts.fail}✗</span>}
                    </div>
                  </td>
                ))}
                <td className="px-3 py-2 text-center">
                  <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">{passCount}/{total}</span>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-xs text-gray-500 dark:text-gray-400">
        {Object.entries(STATUS_CONFIG).map(([s, cfg]) => {
          const Icon = cfg.icon;
          return (
            <div key={s} className="flex items-center gap-1.5">
              <Icon className={`w-3.5 h-3.5 ${cfg.cls}`} />
              <span>{cfg.label}</span>
            </div>
          );
        })}
        <span className="ml-2">· Klik ikon untuk siklus status · Klik sel untuk tambah catatan</span>
        {bots[0]?.subs !== undefined && <span>· ✦ = jumlah sub-agents paralel</span>}
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function TestTrackerPage() {
  const [activeTab, setActiveTab] = useState<TabType>("tender");
  const [grid, setGrid] = useState<GridState>(() => loadGrid(STORAGE_KEY, TENDER_BOTS, TESTS));
  const [fedGrid, setFedGrid] = useState<GridState>(() => loadGrid(FED_STORAGE_KEY, FED_BOTS, FED_TESTS));
  const [pilotGrid, setPilotGrid] = useState<GridState>(() => loadGrid(PILOT_STORAGE_KEY, PILOT_BOTS, TESTS));
  const [selected, setSelected] = useState<{ botId: number; testId: string } | null>(null);
  const [expandedTest, setExpandedTest] = useState<string | null>(null);
  const [showReset, setShowReset] = useState(false);

  useEffect(() => { saveGrid(STORAGE_KEY, grid); }, [grid]);
  useEffect(() => { saveGrid(FED_STORAGE_KEY, fedGrid); }, [fedGrid]);
  useEffect(() => { saveGrid(PILOT_STORAGE_KEY, pilotGrid); }, [pilotGrid]);
  useEffect(() => { setSelected(null); }, [activeTab]);

  const updateCell = useCallback((botId: number, testId: string, patch: Partial<CellResult>) => {
    const updater = (prev: GridState) => {
      const k = cellKey(botId, testId);
      return { ...prev, [k]: { ...prev[k], ...patch, timestamp: new Date().toISOString() } };
    };
    if (activeTab === "tender") setGrid(updater);
    else if (activeTab === "federation") setFedGrid(updater);
    else setPilotGrid(updater);
  }, [activeTab]);

  const resetAll = () => {
    if (activeTab === "tender") setGrid(defaultGrid(TENDER_BOTS, TESTS));
    else if (activeTab === "federation") setFedGrid(defaultGrid(FED_BOTS, FED_TESTS));
    else setPilotGrid(defaultGrid(PILOT_BOTS, TESTS));
    setShowReset(false);
  };

  const currentBots = activeTab === "tender" ? TENDER_BOTS : activeTab === "federation" ? FED_BOTS : PILOT_BOTS;
  const currentTests = activeTab === "tender" || activeTab === "pilot" ? TESTS : FED_TESTS;
  const currentGrid = activeTab === "tender" ? grid : activeTab === "federation" ? fedGrid : pilotGrid;

  const allCells = currentBots.flatMap(b => currentTests.map(t => currentGrid[cellKey(b.id, t.id)]));
  const passCount = allCells.filter(c => c?.status === "pass").length;
  const failCount = allCells.filter(c => c?.status === "fail").length;
  const total = currentBots.length * currentTests.length;

  const selCell = selected ? currentGrid[cellKey(selected.botId, selected.testId)] : null;
  const selBot = selected ? currentBots.find(b => b.id === selected.botId) : null;
  const selTest = selected ? currentTests.find(t => t.id === selected.testId) : null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">

      {/* ── Header ── */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
          <Link href="/dashboard">
            <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" data-testid="btn-back">
              <ArrowLeft className="w-4 h-4" />
            </button>
          </Link>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <ClipboardCheck className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="font-semibold text-sm leading-tight">Test Tracker — Gustafta</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {activeTab === "tender"
                  ? "5 Tender bot × 7 skenario · 35 sel"
                  : activeTab === "federation"
                  ? `${FED_BOTS.length} Hub Orchestrator × 5 Federation test · ${FED_BOTS.length * 5} sel`
                  : "6 Bot Pilot × 7 skenario · 42 sel"}
              </p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1 gap-1 ml-2">
            <button
              onClick={() => setActiveTab("tender")}
              data-testid="tab-tender"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                activeTab === "tender"
                  ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              <Layers className="w-3 h-3" />
              Tender (35)
            </button>
            <button
              onClick={() => setActiveTab("federation")}
              data-testid="tab-federation"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                activeTab === "federation"
                  ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              <Zap className="w-3 h-3 text-violet-500" />
              Fed ({FED_BOTS.length * 5})
            </button>
            <button
              onClick={() => setActiveTab("pilot")}
              data-testid="tab-pilot"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                activeTab === "pilot"
                  ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              <Bot className="w-3 h-3 text-emerald-500" />
              Pilot (42)
            </button>
          </div>

          <div className="ml-auto flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 text-sm">
              <span className="text-green-600 dark:text-green-400 font-semibold">{passCount}</span>
              <span className="text-gray-400">/</span>
              <span className="text-gray-600 dark:text-gray-300">{total}</span>
              <span className="text-gray-400 text-xs ml-1">Pass</span>
            </div>
            {failCount > 0 && <Badge variant="destructive" className="text-xs">{failCount} Fail</Badge>}
            {passCount === total && passCount > 0 && (
              <Badge className="bg-green-600 text-white text-xs">✓ {total}/{total} PASS</Badge>
            )}
            <Button variant="ghost" size="sm" onClick={() => setShowReset(true)} data-testid="btn-reset"
              className="text-gray-500 hover:text-red-600">
              <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
              Reset
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">

        {/* ── Pilot info banner ── */}
        {activeTab === "pilot" && (
          <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <Bot className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-emerald-800 dark:text-emerald-300">6 Bot Pilot — Evaluasi T1–T7 (42 Sel)</p>
                <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-0.5">
                  Uji 6 bot pilot representatif menggunakan 7 skenario T1–T7 (sama dengan tab Tender).
                  Target: <strong>≥90% pass</strong> (≥38/42 sel) sebelum replikasi lebih luas ke seluruh 131 hub.
                  Setiap bot sudah dilengkapi Inter-Agent API v2 dengan 4 sub-agen paralel.
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {PILOT_BOTS.map(b => (
                    <a key={b.id} href={`/bot/${b.id}`} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1 px-2 py-1 bg-white dark:bg-gray-900 border border-emerald-200 dark:border-emerald-800 rounded-lg text-[10px] font-medium text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 transition-colors"
                      data-testid={`pilot-hub-link-${b.id}`}>
                      <Bot className="w-2.5 h-2.5" />
                      {b.name} ({b.subs}✦)
                    </a>
                  ))}
                </div>
                <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { label: "SBU Pekerjaan Konstruksi", id: 404, desc: "Kesiapan & Sertifikasi SBU PK" },
                    { label: "SKK Coach Sipil",          id: 459, desc: "Persiapan SKK Teknik Sipil" },
                    { label: "Manajemen LSP",            id: 113, desc: "Tata Kelola LSP Konstruksi" },
                    { label: "IMS & SMK3",               id: 307, desc: "Sistem Manajemen Terintegrasi" },
                    { label: "ASKOM Konstruksi",         id: 28,  desc: "Asesor Sertifikasi Kompetensi" },
                    { label: "Odoo BUJK",                id: 287, desc: "ERP Jasa Konstruksi" },
                  ].map(b => (
                    <div key={b.id} className="bg-white dark:bg-gray-900 rounded-lg p-2 border border-emerald-100 dark:border-emerald-900">
                      <p className="text-[10px] font-semibold text-emerald-800 dark:text-emerald-300">{b.label}</p>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">{b.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Federation info banner ── */}
        {activeTab === "federation" && (
          <div className="bg-violet-50 dark:bg-violet-950/30 border border-violet-200 dark:border-violet-800 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <Zap className="w-4 h-4 text-violet-600 dark:text-violet-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-violet-800 dark:text-violet-300">Federation Layer — Inter-Agent API v2</p>
                <p className="text-xs text-violet-600 dark:text-violet-400 mt-0.5">
                  44 hub orchestrator aktif dengan <code className="font-mono bg-violet-100 dark:bg-violet-900/40 px-1 rounded">agenticSubAgents</code>.
                  Saat user kirim pesan ke hub, sistem memanggil sub-agents secara paralel lalu mensintesis hasilnya.
                  Uji F1–F5 untuk validasi pipeline orchestration end-to-end.
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {[
                    { id: 23,  name: "Tender Hub",        subs: 4 },
                    { id: 17,  name: "SKK Hub",            subs: 5 },
                    { id: 12,  name: "SBU Hub",            subs: 4 },
                    { id: 4,   name: "Perizinan Hub",      subs: 4 },
                    { id: 34,  name: "Asesor Hub",         subs: 4 },
                    { id: 69,  name: "CSMS Hub",           subs: 3 },
                    { id: 197, name: "AJJ Nirkertas",      subs: 4 },
                    { id: 187, name: "Sumber Daya Digital",subs: 4 },
                    { id: 216, name: "SKK Hard Copy",      subs: 4 },
                    { id: 230, name: "ASKOM Konstruksi",   subs: 4 },
                    { id: 260, name: "Akreditasi KAN",     subs: 4 },
                    { id: 242, name: "Lisensi LSP",        subs: 4 },
                    { id: 47,  name: "SMAP Hub",           subs: 4 },
                    { id: 52,  name: "PANCEK Hub",         subs: 4 },
                    { id: 29,  name: "Asesor BU Hub",      subs: 4 },
                    { id: 58,  name: "Odoo Assessment",    subs: 2 },
                    { id: 272, name: "SMAP-ORC",           subs: 4 },
                    { id: 281, name: "PANCEK-ORC",         subs: 4 },
                    { id: 287, name: "Odoo BUJK-ORC",      subs: 4 },
                    { id: 293, name: "Odoo Migrasi-ORC",   subs: 4 },
                    { id: 597, name: "Hub IT LSP",         subs: 4 },
                    { id: 603, name: "Asesi Digital",      subs: 4 },
                  ].map(h => (
                    <a key={h.id} href={`/bot/${h.id}`} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1 px-2 py-1 bg-white dark:bg-gray-900 border border-violet-200 dark:border-violet-800 rounded-lg text-[10px] font-medium text-violet-700 dark:text-violet-300 hover:bg-violet-50 dark:hover:bg-violet-950/50 transition-colors"
                      data-testid={`fed-hub-link-${h.id}`}>
                      <Zap className="w-2.5 h-2.5" />
                      {h.name} ({h.subs}✦)
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Test Skenario Reference ── */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800 flex items-center gap-2">
            <Info className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium">
              {activeTab === "federation" ? "Skenario Federation (F1–F5)" : "Skenario Test (T1–T7)"}
            </span>
            {activeTab === "pilot" && (
              <span className="ml-auto text-[10px] text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800 font-medium">
                Target ≥90% pass (38/42)
              </span>
            )}
          </div>
          <div className="divide-y divide-gray-50 dark:divide-gray-800">
            {currentTests.map(test => (
              <div key={test.id} className="px-4">
                <button
                  className="w-full flex items-center gap-3 py-3 text-left"
                  onClick={() => setExpandedTest(expandedTest === test.id ? null : test.id)}
                  data-testid={`expand-test-${test.id}`}
                >
                  <Badge variant="outline" className={`text-xs font-mono shrink-0 ${test.badge}`}>{test.label}</Badge>
                  <span className="text-sm font-medium flex-1">{test.title}</span>
                  {expandedTest === test.id
                    ? <ChevronUp className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    : <ChevronDown className="w-3.5 h-3.5 text-gray-400 shrink-0" />}
                </button>
                {expandedTest === test.id && (
                  <div className="pb-4 space-y-3">
                    <p className="text-sm text-gray-600 dark:text-gray-400">{test.description}</p>
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1.5 font-medium">Prompt yang disarankan:</p>
                      <p className="text-sm text-gray-700 dark:text-gray-300 italic">"{test.prompt}"</p>
                    </div>
                    <div className="space-y-1.5">
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Kriteria kelulusan:</p>
                      {test.criteria.map((c, i) => (
                        <div key={i} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                          <span className="text-gray-400 text-xs mt-0.5 shrink-0">{i + 1}.</span>
                          <span>{c}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── Grid ── */}
        <TestGrid
          bots={currentBots}
          tests={currentTests}
          grid={currentGrid}
          updateCell={updateCell}
          selected={selected}
          setSelected={setSelected}
        />
      </div>

      {/* ── Detail Panel (cell selected) ── */}
      {selected && selCell && selBot && selTest && (
        <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shadow-2xl z-30 max-h-[55vh] overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-start justify-between mb-3 gap-4">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl border flex items-center justify-center ${STATUS_CONFIG[selCell.status].bg} ${STATUS_CONFIG[selCell.status].border}`}>
                  {(() => { const Icon = STATUS_CONFIG[selCell.status].icon; return <Icon className={`w-4.5 h-4.5 ${STATUS_CONFIG[selCell.status].cls}`} />; })()}
                </div>
                <div>
                  <p className="font-semibold text-sm">{selBot.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{selTest.title}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0 flex-wrap">
                {(["pending","pass","fail","skip"] as TestStatus[]).map(s => {
                  const cfg = STATUS_CONFIG[s];
                  const Icon = cfg.icon;
                  return (
                    <button key={s}
                      onClick={() => updateCell(selected.botId, selected.testId, { status: s })}
                      data-testid={`set-status-${s}`}
                      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-all
                        ${selCell.status === s
                          ? `${cfg.bg} ${cfg.border} ${cfg.cls}`
                          : "border-gray-200 dark:border-gray-700 text-gray-500 hover:border-gray-300 dark:hover:border-gray-600"
                        }`}
                    >
                      <Icon className="w-3.5 h-3.5" />{cfg.label}
                    </button>
                  );
                })}
                <button onClick={() => setSelected(null)}
                  className="ml-2 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400"
                  data-testid="btn-close-panel">
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Prompt yang diuji:</p>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 text-sm text-gray-700 dark:text-gray-300 italic">
                  "{selTest.prompt}"
                </div>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-2">Kriteria kelulusan:</p>
                <div className="space-y-1">
                  {selTest.criteria.map((c, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-400">
                      <span className="shrink-0 mt-0.5">{i + 1}.</span>
                      <span>{c}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Catatan evaluator:</p>
                <Textarea
                  placeholder="Catat temuan, detail respons bot, atau alasan Pass/Fail di sini..."
                  value={selCell.notes}
                  onChange={e => updateCell(selected.botId, selected.testId, { notes: e.target.value })}
                  data-testid="input-notes"
                  className="h-28 text-sm resize-none"
                />
                {selCell.timestamp && (
                  <p className="text-[10px] text-gray-400">Terakhir diupdate: {new Date(selCell.timestamp).toLocaleString("id-ID")}</p>
                )}
                <div className="flex gap-2 mt-2">
                  <a href={`/bot/${selected.botId}`} target="_blank" rel="noopener noreferrer" data-testid="btn-open-bot">
                    <Button size="sm" variant="outline" className="text-xs gap-1.5">
                      <ExternalLink className="w-3 h-3" />
                      Buka Bot
                    </Button>
                  </a>
                  {activeTab === "federation" && (
                    <a href={`/chat/${selected.botId}`} target="_blank" rel="noopener noreferrer" data-testid="btn-open-chat">
                      <Button size="sm" variant="outline" className="text-xs gap-1.5 border-violet-300 text-violet-700">
                        <Zap className="w-3 h-3" />
                        Uji Orchestration
                      </Button>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Reset Confirmation Dialog ── */}
      <Dialog open={showReset} onOpenChange={setShowReset}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset hasil test {activeTab === "tender" ? "Tender" : activeTab === "federation" ? "Federation" : "Pilot"}?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Semua status dan catatan di tab{" "}
            {activeTab === "tender"
              ? "Tender (35 sel)"
              : activeTab === "federation"
              ? `Federation (${FED_BOTS.length * 5} sel)`
              : "Pilot (42 sel)"}{" "}
            akan dihapus.
          </p>
          <div className="flex gap-3 mt-2">
            <Button variant="outline" onClick={() => setShowReset(false)} className="flex-1">Batal</Button>
            <Button variant="destructive" onClick={resetAll} className="flex-1" data-testid="btn-confirm-reset">
              <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
              Reset Tab Ini
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
