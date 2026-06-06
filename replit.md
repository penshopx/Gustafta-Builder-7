# Gustafta
Gustafta is an AI chatbot builder platform that enables users to create, configure, and deploy intelligent conversational assistants, including the integrated LexCom Legal AI system.

## Run & Operate
- **Run Development Server**: `npm run dev`
- **Build**: `npm run build`
- **Typecheck**: `npm run typecheck`
- **Codegen (Drizzle)**: `npx drizzle-kit generate`
- **DB Push (Drizzle)**: `npx drizzle-kit push`
- **Environment Variables**: `MIDTRANS_SERVER_KEY`, `MIDTRANS_CLIENT_KEY` (for Midtrans payment integration)

## Stack
- **Frontend**: React 18 + TypeScript, Tailwind CSS, shadcn/ui, TanStack React Query, Vite
- **Backend**: Express 5 + TypeScript, Node.js (`tsx`), Drizzle ORM + Zod, PostgreSQL
- **Payment**: Scalev.id (menggantikan Midtrans)
- **AI Models**: OpenAI (gpt-4o-mini/gpt-4o/gpt-4-turbo/gpt-3.5-turbo), DeepSeek (deepseek-chat/deepseek-reasoner), Qwen (qwen-turbo/qwen-plus/qwen-max), Google Gemini (gemini-1.5-flash/gemini-1.5-pro/gemini-2.0-flash), Anthropic via proxy (claude-3-haiku/claude-3-sonnet/claude-3-5-sonnet), Custom

## Where things live
- **Database Schema**: `shared/schema.ts` (source of truth; `db/schema.ts` is symlinked)
- **API Routes**: `server/routes.ts`
- **Inter-Agent API v2**: `server/routes.ts` ~line 2806 (orchestration block), ~line 3926 (`callAgentInternal` v2)
- **Legal AI Configuration**: `server/lib/legal-agents.ts`
- **Legal Landing/Chat**: `client/src/pages/legal-landing.tsx` (route `/legal`), `client/src/pages/legal-chat.tsx` (route `/legal/chat`)
- **Chaesa Lexbot Widget**: `client/src/components/chaesa-widget.tsx`
- **MultiClaw Orchestration Planner**: `client/src/components/agentic-ai-panel.tsx`
- **Rakit Tim Agen (Trilogi)**: `client/src/pages/tutor-builder.tsx` (route `/tutor-builder`)
- **Trilogi OpenClaw Chat**: `client/src/pages/trilogi-chat.tsx` (route `/trilogi-chat/:orchestratorId`)
- **Test Tracker**: `client/src/pages/test-tracker.tsx` (route `/test-tracker`) — 6 tab: Tender + Federation + Pilot + KONSTRA + AI Tutor + SBUClaw
- **RAB Kalkulator Otomatis**: `client/src/pages/rab-kalkulator.tsx` (route `/rab-kalkulator`) — GPT-4o JSON → tabel terstruktur + CSV export. Backend: `POST /api/tools/rab-kalkulator`.
- **AI Vision K3 Inspector**: `client/src/pages/k3-vision.tsx` (route `/k3-vision`) — upload foto → GPT-4o Vision → laporan temuan K3 + skor kepatuhan. Backend: `POST /api/tools/k3-vision`.

## Architecture decisions
- **5-Level Modular Hierarchy**: Agents organized Master → Series HUB → Sub-HUB → Specialist → Deep Specialist.
- **Two-Panel Dashboard Layout**: Separates global navigation from selected content.
- **Multi-Provider LLM Fallback**: Chain: OpenAI → DeepSeek → Qwen → Gemini.
- **Inter-Agent API v2 (L2.5)**: Orchestrator agents call sub-agents in parallel via `callAgentInternal()` (25s AbortController timeout, min 1500 maxTokens, conversation history passed). Results injected as `LAPORAN SUB-AGEN` block before orchestrator synthesizes. SSE events: `orchestrating_start`, `sub_agent_start`, `sub_agent_done`, `aggregating`. Config via `agenticSubAgents` jsonb on agents table.
- **FEDERATION_MODE v2 Guard**: Seed checks for `FEDERATION_MODE v2` marker in prompts to avoid overwriting upgraded orchestrator prompts.

## Product
- **AI Chatbot Builder**: Create, configure, and deploy intelligent conversational agents.
- **LexCom Legal AI**: Integrated system with 12 specialized legal agents and a floating "Chaesa Lexbot" widget.
- **Federation Layer (131 hubs — COMPLETE)**: 131 hub orchestrators with `agenticSubAgents` configured, SYNTHESIS ORCHESTRATOR marker, SCORECARD/WIN PROBABILITY 4-dimension table, T5-HANDOVER, F3-FALLBACK MODE, MASTER STANDAR v2.0 — semua 129/129 complete.
- **ABD v1.1 Upgrade (934/944 agents — COMPLETE)**: SBU (339) + SKK (53) + ASKOM/LSP (52) + Universal (609). Marker per kategori: `SBU_ABD_v1.1_UPGRADED`, `SKK_ABD_v1.1_UPGRADED`, `ASKOM_ABD_v1.1_UPGRADED`, `ABD_v1.1_UPGRADED`. 10 agen sisa seeded ABD-compliant by design.
- **Mini Apps (45 types — COMPLETE)**: Registered in schema.ts, mini-apps-panel.tsx, server/routes.ts. Hub cards: violet Kreator, emerald Bekerja, orange Berusaha.
- **Dynamic Knowledge Base**: Hierarchical classification, versioning, source attribution, multiple upload types.
- **Chatbot Templates & Gustafta Store**: Public marketplace with payment integration.
- **Gustafta Apps Feature Access System**: Plan-gated. Tiers: `free`(0) `starter`(1) `profesional`(2) `bisnis`(3) `enterprise`(4). Source: `shared/feature-plans.ts`. Hook: `use-feature-access.ts`. Gate: `feature-gate.tsx`. Admin activates via `POST /api/subscriptions/activate/:id`.

## MultiClaw Suite (45 halaman)
Semua pakai `PremiumPageGuard` feature="advanced_ai_tools" requiredPlan="profesional". SSE streaming, sub-agent panel dots, legend strip, 6 sample prompts.

| Rute | Nama | Agen | Hub ID | Theme | Sub-agent IDs |
|------|------|------|--------|-------|----------------|
| `/sbu-claw` | SBUClaw — SBU Konstruksi | 10 | 1404 | amber | 1394–1403 |
| `/smap-claw` | SMAPClaw — ISO 37001 Anti-Penyuapan | 8 | 272 | teal | — |
| `/pancek-claw` | PanCEKClaw — KPK | 5 | 281 | red | — |
| `/iso-claw-9001` | ISOClaw 9001 SMM | 6 | 140 | blue | — |
| `/iso-claw-14001` | ISOClaw 14001 SML | 6 | 131 | green | — |
| `/smk3-claw` | SMK3Claw — IMS & SMK3 | 7 | 307 | orange | — |
| `/lkut-claw` | LKUTClaw — LKUT BUJK | 4 | 302 | cyan | — |
| `/pjbu-claw` | PJBUClaw — Personel Manajerial | 5 | 1008 | indigo | — |
| `/keuangan-claw` | KeuanganClaw — Keuangan BUJK | 4 | 298 | emerald | — |
| `/csms-claw` | CSMSClaw — Contractor Safety | 12 | 69 | amber | — |
| `/safira-claw` | SafiraClaw — SKK K3 Konstruksi | 5 | 501 | red | — |
| `/tendera-claw` | TenderaClaw — AI Tender BUJK | 10 | 663 | indigo | 1022–1031 |
| `/konstra-tender-claw` | KonstraTenderClaw — Monitor Tender SIRUP | 4 | 652 | emerald | 1018–1021 |
| `/bg-claw` | BGClaw — Ruang Lingkup Bangunan Gedung | 9 | 1033 | stone | 1034–1042 |
| `/bs-claw` | BSClaw — Ruang Lingkup Bangunan Sipil | 11 | 1043 | sky | 1044–1053 |
| `/im-claw` | IMClaw — Instalasi Mekanikal-Elektrikal | 10 | 1054 | emerald | 1055–1063 |
| `/ko-claw` | KOClaw — Konstruksi Spesialis | 9 | 1064 | violet | 1065–1072 |
| `/kk-claw` | KKClaw — Jasa Konsultansi Konstruksi | 8 | 1073 | rose | 1074–1080 |
| `/migas-claw` | MigasClaw — Kompetensi & Perizinan Energi | 9 | 564 | orange | 565–573 |
| `/dev-properti-claw` | DevPropertiClaw — Developer Real Estate | 10 | 575 | violet | 576–585 |
| `/estate-care-claw` | EstateCareClaw — Konsultan Properti Konsumen | 10 | 586 | emerald | 587–596 |
| `/skema-claw` | SkemaClaw — Konsultan Cerdas Sertifikasi BUJK Permen PU 6/2025 | 9 | 1448 | blue/indigo | 1449–1457 |
| `/panduan-sbu` | PanduanSBU — Tanya Jawab SBU untuk Masyarakat Umum (answer machine) | 1 | 1458 | emerald | — |
| `/abu-claw` | ABUClaw — Konsultan ABU & LSBU Asesmen Badan Usaha | 8 | 1459 | slate | 214·228·393·107·110·111·112·555 |
| `/panduan-askom` | PanduanASKOM — Tanya Jawab Uji Kompetensi SKK (answer machine) | 1 | 1460 | teal | — |
| `/manprojak-claw` | ManprojakClaw — Jabatan Kerja SKK Manajemen Pelaksanaan | 7 | 1383 | indigo | 1376–1382 |
| `/arsitektur-claw` | ArsitekturClaw — Jabatan Kerja SKK Klasifikasi Arsitektur | 7 | 1391 | rose | 1384–1390 |
| `/surveipemetaan-claw` | SurveiPemetaanClaw — Jabatan Kerja SKK Survei & Pemetaan | 7 | 1399 | teal | 1392–1398 |
| `/geoteknik-claw` | GeoteknikClaw — Jabatan Kerja SKK Klasifikasi Sipil (Geoteknik) | 7 | 1879 | amber | 1872–1878 |
| `/jalanjembatan-claw` | JalanJembatanClaw — Jabatan Kerja SKK Klasifikasi Sipil (Jalan & Jembatan) | 7 | 1887 | yellow | 1880–1886 |
| `/tatalingkungan-claw` | TataLingkunganClaw — Jabatan Kerja SKK Klasifikasi Tata Lingkungan | 7 | 1895 | green | 1888–1894 |
| `/elektrikal-claw` | ElektrikalClaw — Jabatan Kerja SKK Klasifikasi Elektrikal | 7 | 1903 | blue | 1896–1902 |
| `/mep-claw` | MEPClaw — AI Konsultan MEP (Mekanikal-Elektrikal-Plumbing) | 7 | 1831 | emerald | 1824–1830 |
| `/sipil-claw` | SipilClaw — AI Konsultan Teknik Sipil | 7 | 1823 | sky | 1816–1822 |
| `/lingkungan-claw` | LingkunganClaw — AI Konsultan Lingkungan Hidup | 7 | 1847 | teal | 1840–1846 |
| `/qs-claw` | QSClaw — Quantity Surveying & Estimasi Biaya Konstruksi | 7 | 1911 | amber | 1904–1910 |
| `/pengawas-claw` | PengawasClaw — Pengawas Konstruksi & Jabatan Kerja SKK | 7 | 1919 | orange | 1912–1918 |
| `/kontrak-claw` | KontrakClaw — Manajemen Kontrak & Klaim Konstruksi | 7 | 1927 | red | 1920–1926 |
| `/k3man-claw` | K3ManClaw — Manajemen K3 Konstruksi & Jabatan Kerja SKK | 7 | 1935 | orange/red | 1928–1934 |
| `/konstra-claw` | KonstraClaw — Manajemen Proyek Konstruksi | 9 | 1281 | slate | 1272–1280 |
| `/brain-claw` | BrainClaw — Project Intelligence AI | 6 | 806 | cyan | 664–669 |
| `/educounsel-claw` | EducounselClaw — Konseling Akademik | 11 | 899 | teal | 888–898 |
| `/ibtu-claw` | IBTUClaw — IB Testing Unit AI | 7 | 1953 | indigo | 1946–1952 |
| `/etlo-academy-claw` | ETLOAcademyClaw — Program ETLO: Kurikulum, Audit Energi & Sertifikasi EBT | 10 | 964 | emerald | 954–963 |
| `/etlo-bizdev-claw` | ETLOBizDevClaw — Strategi Bisnis & Pengembangan Program ETLO | 10 | 975 | teal | 965–974 |
| `/bim-claw` | BIMClaw — AI Konsultan BIM & Konstruksi Digital Indonesia | 8 | 1031 | blue | 1023–1030 |
| `/desain-claw` | DesainClaw — AI Konsultan Desain Arsitektur & Rekayasa Indonesia | 8 | 1040 | rose | 1032–1039 |
| `/siteops-claw` | SiteOpsClaw — AI Konsultan Operasional Lapangan Konstruksi | 8 | 1049 | orange | 1041–1048 |
| `/ketenagalistrikan-claw` | KetenagalistrikanClaw — Konsultan Sistem Ketenagalistrikan Indonesia | 8 | 994 | yellow | 986–993 |
| `/energi-claw` | EnergiClaw — Konsultan Energi & EBT Indonesia | 8 | 1003 | orange | 995–1002 |
| `/pertambangan-claw` | PertambanganClaw — Konsultan Pertambangan Indonesia | 8 | 1012 | stone | 1004–1011 |
| `/digital-marketing-claw` | DigitalMarketingClaw — AI Konsultan Digital Marketing Indonesia | 8 | 1159 | violet | 1151–1158 |
| `/crm-sales-claw` | CrmSalesClaw — AI Konsultan CRM & Sales Excellence Indonesia | 8 | 1168 | blue | 1160–1167 |
| `/brand-content-claw` | BrandContentClaw — AI Konsultan Brand & Content Marketing Indonesia | 8 | 1177 | rose | 1169–1176 |
| `/ecommerce-claw` | EcommerceClaw — AI Konsultan E-Commerce & Perdagangan Digital Indonesia | 8 | 1186 | orange | 1178–1185 |
| `/rekrutmen-claw` | RekrutmenClaw — AI Konsultan Rekrutmen & Talent Acquisition Indonesia | 8 | 1195 | teal | 1187–1194 |
| `/ld-kompetensi-claw` | LdKompetensiClaw — AI Konsultan Learning & Development Indonesia | 8 | 1204 | emerald | 1196–1203 |
| `/penilaian-kinerja-claw` | PenilaianKinerjaClaw — AI Konsultan Penilaian Kinerja & Manajemen SDM Indonesia | 8 | 1213 | indigo | 1205–1212 |
| `/pajak-claw` | PajakClaw — AI Advisor Pajak Indonesia | 8 | 1183 | amber | 1175–1182 |
| `/hubungan-industrial-claw` | HubunganIndustrialClaw — HR & Industrial Relations Indonesia | 8 | 1192 | orange | 1184–1191 |
| `/esg-claw` | ESGClaw — ESG & Keberlanjutan Indonesia | 8 | 1201 | emerald | 1193–1200 |
| `/lean-opex-claw` | LeanOpExClaw — Lean Manufacturing & Operational Excellence | 8 | 1210 | blue | 1202–1209 |
| `/supply-chain-claw` | SupplyChainClaw — Supply Chain & Logistics Indonesia | 8 | 1219 | indigo | 1211–1218 |
| `/industri40-claw` | Industri40Claw — Industri 4.0 & Digital Manufacturing Indonesia | 8 | 1228 | violet | 1220–1227 |
| `/transmisi-claw` | TransmisiClaw — Transmisi & Gardu Induk PLN | 7 | 1236 | red | 1229–1235 |
| `/cybersecurity-claw` | CybersecurityClaw — Cybersecurity & PDP Indonesia | 8 | 1245 | slate | 1237–1244 |
| `/haccp-claw` | HACCPClaw — HACCP, BPOM & Sertifikasi Halal Indonesia | 8 | 1254 | green | 1246–1253 |
| `/lkpm-claw` | LKPMClaw — LKPM & Penanaman Modal BKPM Indonesia | 7 | 1262 | teal | 1255–1261 |
| `/pub-lkut-claw` | PUB-LKUTClaw — Pengembangan Usaha Berkelanjutan & LKUT BUJK (Permen PUPR 7/2024) | 8 | 1281 | sky | 1273–1280 |
| `/esimpan-claw` | ESIMPANClaw — Input Pengalaman BUJK & Tenaga Kerja Konstruksi di E-SIMPAN | 9 | 1458 | blue | 1450–1457·1475 |
| `/oss-claw` | OSSClaw — AI Konsultan OSS-RBA, NIB & Perizinan Berusaha Indonesia | 8 | 1514 | emerald | 1506–1513 |
| `/teras-lpjk-1` | TerasLPJK#1 — Sharing Knowledge Tata Kelola Sertifikasi Kompetensi Kerja Konstruksi | 5 | 1520 | indigo | 1515–1519 |

### Endpoint pattern
`GET /api/{nama}-claw/orchestrator` → `{ id, name, tagline, avatar }`

### Key MultiClaw agents
- **SBUClaw (1404)**: AGENT-MAPPER·QUALIFY·DOCS·SKKMATCH·LETTERGEN·COST·ASSESS·OSS·COMPLY·INTEGRITY. Regulasi: Permen PU 6/2025. SK Dirjen 37/2025 JANGAN jadi acuan teknis.
- **KonstraClaw (1281)**: PM·TEK·KON·K3·QC·ENV·EQP·LOG·FIN. FIDIC/ISO 9001/ISO 14001/SMK3/PSAK 34.
- **EducounselClaw (899)**: Safety Gate wajib first. Mode: Siswa/Konselor/OrangTua/Admin. Marker: `EDUC_ORCHESTRATOR_v1.0`.
- **MigasClaw (564)**: BUJKM·KTEK·PLTS·EBT·IUP·K3TBG·GAPA·KASUS·LSP. UU Minerba 3/2020 · Kepmen ESDM 1827/2018 · SKKNI EBT · IWCF/IADC.
- **BGClaw (1033)**: BUKAN tentang SBU — tentang RUANG LINGKUP PEKERJAAN per subklasifikasi (Permen PU 6/2025).
- **GeoteknikClaw**: GEO-SONDIR·FONDASI·LERENG·SETTLEMENT·GEMPA·TEROWONGAN·TURAP. SNI 8460:2017·SNI 1726:2019·SNI 4153:2008 (SPT)·SNI 2827:2008 (CPT)·ASTM D1586·Eurocode 7.
- **JalanJembatanClaw**: JJ-PERKERASAN·GEOMETRIK·DRAINASE·JEMBATAN·LAIK·MATERIAL·PEMELIHARAAN. MDP Bina Marga 2021·SNI 1725:2016·RSNI T-14-2004·PKJI 2023·Permen PU 19/2011.
- **TataLingkunganClaw**: TL-SANITASI·AIRBERSIH·LIMBAHPADAT·IPAL·KEBISINGAN·REMEDIASI·INFRASTRUKTUR. SNI 03-2398-2017·PP 22/2021·Kepmen LH 48/1996·Metcalf & Eddy·EPA ESA.
- **ElektrikalClaw**: EL-DISTRIBUSI·INSTALASI·PROTEKSI·OTOMASI·PLTS·GARDU·ESTIMASI. PUIL 2011·IEC 60364·IEC 62305·IEEE 80·IEEE 1584·SPLN·Permen ESDM 26/2021·SNI 8172:2017.
- **ManprojakClaw (1383)**: MP-MANPRO·LAPANGAN·MUTU·ESTIMASI·KONTRAK·KEUANGAN·LOGISTIK. FIDIC/EVM/PSAK 34/AHSP PermenPUPR 1/2022.
- **ArsitekturClaw (1391)**: ARS-DESAIN·STRUKTUR·INTERIOR·LANSEKAP·REGULASI·TEKNIS·URBAN. UU BG 28/2002·PP 16/2021·PermenPUPR 22/2018·Neufert·Greenship·ISO 19650 BIM.
- **SurveiPemetaanClaw (1399)**: SP-GEODESI·TOPOGRAFI·KADASTER·GIS·HIDROGRAFI·KONSTRUKSI·DRONE. SRGI2013·BPN/PTSL·IHO S-44·ASPRS LAS·HEC-RAS·Permenhub UAV PM 37/2020.
- **MEPClaw (1831)**: MEP-HVAC·PLUMB·LISTRIK·FIRE·LIFT·ELV·ESTIMASI. ASHRAE·SNI 03-6572·SNI 03-7065·PUIL 2011·NFPA·SNI 03-6573·PermenPUPR 26/2008.
- **SipilClaw (1823)**: SC-STRUCT·GEOTEK·JALAN·JEMBATAN·SDA·MATERIAL·METODE. SNI 2847:2019·SNI 8460·SNI 1725:2016·KP-01·Bina Marga·AASHTO LRFD.
- **LingkunganClaw (1847)**: LH-AMDAL·B3·AIR·UDARA·TANAH·KARBON·GREENSHIP. PP 22/2021·UU 32/2009·PermenLHK P.68/2016·PermenLHK P.14/2020·AERMOD.
- **QSClaw (1911)**: QS-TAKEOFF·HARGA·RAB·COSTCONTROL·VE·TENDER·BIM5D. AHSP PermenPUPR 01/2022·Perpres 16/2018·PSAK 34·PMI EVM·SAVE International·ISO 19650.
- **PengawasClaw (1919)**: PW-LAPANGAN·STRUKTUR·FINISHING·MEP·K3·MUTU·ADMIN. SNI 2847:2019·PUIL 2011·PP 50/2012·ISO 9001·FIDIC·PermenPUPR 10/2021.
- **KontrakClaw (1927)**: KT-FIDIC·PEMERINTAH·KLAIM·DISPUTE·SUBKON·ASURANSI·KOMERSIAL. FIDIC 1999/2017·Perpres 16/2018·UU Arbitrase 30/1999·BANI·SCL Protocol 2017.
- **K3ManClaw (1935)**: K3M-SMKK·HAZID·PTW·CSMS·INSIDEN·KEBAKARAN·AUDIT. PP 50/2012·PermenPUPR 10/2021·ISO 45001:2018·NFPA 10/13/72·OSHA 1926.
- **IBTUClaw (1953)**: TU-REGISTRAR·SENTINEL·IAA·PG·EXAM·COMMS·AUDIT. IBO DP/MYP/PYP/CP·IBIS·DAP·Academic Integrity Policy 2023·IBO Standards & Practices 2020.
- **ESIMPANClaw (1458)**: AKUN·BUJK·TKK·IMPORT·DOKUMEN·DATA·SUBMIT·PANDUAN·EVALUASI. v1.1 — simpan.pu.go.id · PP 5/2021 · SE PUPR 21/2021 · Permen 8/2022 · Nota Dinas PA0106/B/Dk/2026/48. Sub-agents: 1450–1457·1475.
- **EBTSolarClaw (1068)**: SOL-SIZING·PPA·PERIZINAN·EPC·GRID·OM·BESS·AGRIVOLT. Permen ESDM 2/2023·Permen ESDM 26/2021·Perpres 112/2022·SNI 8172:2017·IEC 61215/61730·IEEE 1547·IEC 62116·NFPA 855·PLN Grid Code. Route: `/ebt-solar-claw`.
- **GeologiClaw (1077)**: GEO-REGIONAL·EKSPLORASI·GEOFISIKA·PEMBORAN·SUMBERDAYA·ALTERASI·GEOTEKNIK·HIDRO. JORC 2012·KCMI 2017·PERHAPI·AusIMM·UU 3/2020·PP 96/2021·Hoek-Brown·RMR Bieniawski·Q-system Barton·PP 22/2021. Route: `/geologi-claw`.
- **OffshoreSafetyClaw (1086)**: OFF-SMK3·OPERASI·DRILLING·MARINE·PROSAFETY·LINGKUNGAN·INTEGRITY·REGULASI. UU 22/2001·SKK Migas PTK 006/036·Permen ESDM 18/2018·MARPOL 73/78·SOLAS·API RP 2A/2SIM·IEC 61511·IWCF/IADC·ISM Code·OSHA PSM·IMCA. Route: `/offshore-safety-claw`.
- **TransisiEnergiClaw (1105)**: TRE-KEBIJAKAN·HIDROGEN·GEOTHERMAL·ANGIN·STORAGE·KARBON·RETIRE·GRID. JETP CIPP·NZE 2060·Paris Agreement NDC·Perpres 98/2021 (NEK)·Perpres 112/2022·IDXCarbon POJK 14/2023·UU 21/2014 (Panas Bumi)·IEC 61400·ETM ADB·RUEN·RUPTL PLN 2021–2030. Route: `/transisi-energi-claw`.
- **TutorTeknikClaw (1114)**: TUT-SIPIL·MESIN·ELEKTRO·KIMIA·INFORMATIKA·MATEMATIKA·FISIKA·PRAKTIKUM. Tutor D3/S1/S2 semua jurusan teknik. SNI 2847:2019·SNI 1726·PUIL 2011·Kreyszig·Felder·Fogler·CLRS·Serway. Route: `/tutor-teknik-claw`.
- **RisetSkripsiClaw (1122)**: SKR-TOPIK·LITREV·METODE·DATA·TULISAN·SIDANG·PUBLIKASI. PRISMA·APA 7th·IEEE·SmartPLS/SEM·SPSS·Scopus/SINTA·PKM·Hibah Dikti. Route: `/riset-skripsi-claw`.
- **NSPKNavigatorClaw (1131)**: NSP-KONSTRUKSI·ENERGI·LINGKUNGAN·K3·TATARUANG·DIGITAL·TAMBANG·INDUSTRI. SNI·PUIL 2011·PP 22/2021·PP 50/2012 (SMK3)·UU 26/2007·PP 5/2021 (OSS-RBA)·UU 3/2020 (Minerba)·ISO 9001/22000/45001·BPOM·BPJPH. Route: `/nspk-navigator-claw`.
- **KorporasiClaw (1140)**: KOR-PENDIRIAN·PERIZINAN·PAJAK·SAHAM·KONTRAK·HR·KEUANGAN·MA. UU 40/2007·PP 5/2021·UU 13/2003·PP 35/2021·UU PPh/PPN·PSAK·POJK·KPPU UU 5/1999·KUH Perdata·BANI. Route: `/korporasi-claw`.
- **DigitalMarketingClaw (1159)**: DM-SEO·SEM·SOSMED·CONTENT·EMAIL·ANALITIK·INFLUENCER·GROWTH. Google Ads·Meta Ads·GA4·SEMrush·Moz·Mailchimp·HubSpot·Tokopedia/Shopee Ads. Route: `/digital-marketing-claw`.
- **CrmSalesClaw (1168)**: CRM-PIPELINE·PROSPEK·CLOSING·RETENSI·TOOLS·REPORTING·OMNICHANNEL·STRATEGI. Salesforce·HubSpot·Zoho·SPIN Selling·Challenger Sale·NPS·CLV. Route: `/crm-sales-claw`.
- **BrandContentClaw (1177)**: BC-BRAND·COPY·VISUAL·STORY·VIDEO·PR·UGC·AUDIT. Brand strategy·Positioning·Copywriting·Storytelling·PR & Media·Reputation management. Route: `/brand-content-claw`.
- **EcommerceClaw (1186)**: EC-MARKETPLACE·PRODUK·IKLAN·OPERASI·LOGISTIK·KEUANGAN·CUSTOMER·EKSPANSI. Tokopedia/Shopee/TikTok Shop·Shopify/WooCommerce·3PL·CRO·Growth hacking. Route: `/ecommerce-claw`.
- **RekrutmenClaw (1195)**: REK-STRATEGI·SOURCING·SELEKSI·INTERVIEW·ONBOARDING·EVP·KONTRAK·ATS. LinkedIn Recruiter·Boolean search·Psychometric·Assessment center·Employer branding·D&I. Route: `/rekrutmen-claw`.
- **LdKompetensiClaw (1204)**: LD-TNA·KURIKULUM·FASILITASI·ELEARNING·EVALUASI·KOMPETENSI·COACHING·SERTIFIKASI. ADDIE/SAM·LMS·Microlearning·Kirkpatrick 4 levels·360 feedback·Competency framework. Route: `/ld-kompetensi-claw`.
- **PenilaianKinerjaClaw (1213)**: PK-OKR·KPI·REVIEW·PIP·KOMPENSASI·TALENT·ENGAGEMENT·HRIS. OKR/SMART framework·Pay-for-performance·Calibration·Forced ranking·People analytics·Attrition prediction. Route: `/penilaian-kinerja-claw`.

## User preferences
Preferred communication style: Simple, everyday language.

## Gotchas
- **FEDERATION_MODE v2 marker**: Embedded in DB prompts for upgraded orchestrators. Seed checks this. NEVER remove.
- **Agent Cache 5 min TTL**: Restart server after bulk SQL prompt/agenticSubAgents updates.
- **LexCom Admin Key**: Admin KB uploads require `x-legal-admin-key` header.
- **Disabled Agents**: `/api/chat/config/:agentId` and `/api/widget/config/:agentId` return 503 if disabled.
- **callAgentInternal signature**: `(agentId, userMessage, conversationHistory?, timeoutMs=25000)` — v2.
- **Sub-agent maxTokens**: `Math.max(1500, Math.min(3000, subAgent.maxTokens ?? 1500))` — min guaranteed 1500.
- **FALLBACK template**: `[ASUMSI: {nilai} | basis: {regulasi/heuristik} | verifikasi-ke: {pihak}]`
- **agenticSubAgents JSON format**: `[{"role": "KODE", "agentId": 123, "description": "..."}]`

## Pointers
- **Inter-Agent API**: `server/routes.ts` orchestration block ~line 2806
- **Test Tracker Storage** (localStorage): `gustafta_test_tracker_v1` (Tender) · `gustafta_fed_tracker_v1` (Federation) · `gustafta_pilot_tracker_v1` (Pilot) · `gustafta_konstra_tracker_v1` (KONSTRA) · `gustafta_konstra_signoff_v1` (Sprint 4 Sign-Off)
