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
- **RAB Kalkulator Otomatis**: `client/src/pages/rab-kalkulator.tsx` (route `/rab-kalkulator`) — GPT-4o JSON → tabel terstruktur + CSV export + PDF export (jsPDF). Backend: `POST /api/tools/rab-kalkulator`.
- **AI Vision K3 Inspector**: `client/src/pages/k3-vision.tsx` (route `/k3-vision`) — upload foto → GPT-4o Vision → laporan temuan K3 + skor kepatuhan. Backend: `POST /api/tools/k3-vision`.
- **AI Tools Hub**: `client/src/pages/ai-tools-hub.tsx` (route `/ai-tools`) — directory semua AI tools standalone + penjelasan Model Router.
- **Model Router**: `server/lib/model-router.ts` — utility `chooseModel(task)` + `callWithRouter()` untuk intelligent LLM routing: GPT-4o (orchestration/vision), DeepSeek (math/RAB), Gemini (large docs), Qwen (data extraction).

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

## MultiClaw Suite (80 halaman)
Semua pakai `PremiumPageGuard` feature="advanced_ai_tools" requiredPlan="profesional". SSE streaming, sub-agent panel dots, legend strip, 6 sample prompts.

Endpoint: `GET /api/{nama}-claw/orchestrator` → `{ id, name, tagline, avatar }`. Semua route pakai `getAgentBySlug` sebagai primary lookup — JANGAN ganti ke hardcoded ID.

| Rute | Nama | Agen | Hub Slug (DB) | Theme |
|------|------|------|---------------|-------|
| `/sbu-claw` | SBUClaw — SBU Konstruksi | 10 | sbuclaw-orchestrator | amber |
| `/smap-claw` | SMAPClaw — ISO 37001 Anti-Penyuapan | 8 | smap-orchestrator-hub-multi-agent-anti-penyuapan | teal |
| `/pancek-claw` | PanCEKClaw — KPK | 5 | pancek-orchestrator-hub-multi-agent-smap-nasional-pancek | red |
| `/iso-claw-9001` | ISOClaw 9001 SMM | 6 | hub-iso-9001-jasa-konstruksi | blue |
| `/iso-claw-14001` | ISOClaw 14001 SML | 6 | hub-iso-14001-jasa-konstruksi | green |
| `/smk3-claw` | SMK3Claw — IMS & SMK3 | 7 | hub-ims-smk3-terintegrasi | orange |
| `/lkut-claw` | LKUTClaw — LKUT BUJK | 4 | lkut-hub | cyan |
| `/pjbu-claw` | PJBUClaw — Personel Manajerial | 5 | pjbu-claw-orchestrator | indigo |
| `/keuangan-claw` | KeuanganClaw — Keuangan BUJK | 4 | keuangan-claw-orchestrator | emerald |
| `/csms-claw` | CSMSClaw — Contractor Safety | 12 | (ID 69) | amber |
| `/safira-claw` | SafiraClaw — SKK K3 Konstruksi | 5 | safira-claw-orchestrator | red |
| `/tendera-claw` | TenderaClaw — AI Tender BUJK | 10 | tendera-orchestrator | indigo |
| `/konstra-tender-claw` | KonstraTenderClaw — Monitor Tender SIRUP | 4 | konstra-tender-orchestrator | emerald |
| `/bg-claw` | BGClaw — Ruang Lingkup Bangunan Gedung | 9 | bg-claw-orchestrator | stone |
| `/bs-claw` | BSClaw — Ruang Lingkup Bangunan Sipil | 11 | bs-claw-orchestrator | sky |
| `/im-claw` | IMClaw — Instalasi Mekanikal-Elektrikal | 10 | im-claw-orchestrator | emerald |
| `/ko-claw` | KOClaw — Konstruksi Spesialis | 9 | ko-claw-orchestrator | violet |
| `/kk-claw` | KKClaw — Jasa Konsultansi Konstruksi | 8 | kk-claw-orchestrator | rose |
| `/migas-claw` | MigasClaw — Kompetensi & Perizinan Energi | 9 | (prompt: MIGAS_ORCHESTRATOR_v1.0) | orange |
| `/dev-properti-claw` | DevPropertiClaw — Developer Real Estate | 10 | hub-devproperti-pro-v1 | violet |
| `/estate-care-claw` | EstateCareClaw — Konsultan Properti Konsumen | 10 | hub-estatecare-pro-v1 | emerald |
| `/skema-claw` | SkemaClaw — Sertifikasi BUJK Permen PU 6/2025 | 9 | skema-claw-orchestrator | blue/indigo |
| `/panduan-sbu` | PanduanSBU — Tanya Jawab SBU (answer machine) | 1 | panduan-sbu | emerald |
| `/abu-claw` | ABUClaw — Konsultan ABU & LSBU | 8 | (prompt: ABU_LSBU_ORCHESTRATOR_v1.0) | slate |
| `/panduan-askom` | PanduanASKOM — Tanya Jawab SKK (answer machine) | 1 | (ID 1460) | teal |
| `/manprojak-claw` | ManprojakClaw — SKK Manajemen Pelaksanaan | 7 | manprojakclaw-orchestrator | indigo |
| `/arsitektur-claw` | ArsitekturClaw — SKK Klasifikasi Arsitektur | 7 | arsitekturclaw-orchestrator | rose |
| `/surveipemetaan-claw` | SurveiPemetaanClaw — SKK Survei & Pemetaan | 7 | surveipemetaanclaw-orchestrator | teal |
| `/geoteknik-claw` | GeoteknikClaw — SKK Sipil (Geoteknik) | 7 | geoteknikklaw-orchestrator | amber |
| `/jalanjembatan-claw` | JalanJembatanClaw — SKK Sipil (Jalan & Jembatan) | 7 | jalanjembatanklaw-orchestrator | yellow |
| `/tatalingkungan-claw` | TataLingkunganClaw — SKK Tata Lingkungan | 7 | tatalingkunganklaw-orchestrator | green |
| `/elektrikal-claw` | ElektrikalClaw — SKK Klasifikasi Elektrikal | 7 | elektrikalclaw-orchestrator | blue |
| `/mep-claw` | MEPClaw — AI Konsultan MEP | 7 | mepclaw-orchestrator | emerald |
| `/sipil-claw` | SipilClaw — AI Konsultan Teknik Sipil | 7 | sipilclaw-orchestrator | sky |
| `/lingkungan-claw` | LingkunganClaw — AI Konsultan Lingkungan Hidup | 7 | lingkunganclaw-orchestrator | teal |
| `/qs-claw` | QSClaw — Quantity Surveying & Estimasi Biaya | 7 | qsclaw-orchestrator | amber |
| `/pengawas-claw` | PengawasClaw — Pengawas Konstruksi & SKK | 7 | pengawasclaw-orchestrator | orange |
| `/kontrak-claw` | KontrakClaw — Manajemen Kontrak & Klaim | 7 | kontrakclaw-orchestrator | red |
| `/k3man-claw` | K3ManClaw — Manajemen K3 Konstruksi & SKK | 7 | k3manclaw-orchestrator | orange/red |
| `/konstra-claw` | KonstraClaw — Manajemen Proyek Konstruksi | 9 | konstra-claw-orchestrator | slate |
| `/brain-claw` | BrainClaw — Project Intelligence AI | 6 | brain-project-orchestrator | cyan |
| `/educounsel-claw` | EducounselClaw — Konseling Akademik | 11 | educounsel-orchestrator | teal |
| `/ibtu-claw` | IBTUClaw — IB Testing Unit AI | 7 | ibtuclaw-orchestrator | indigo |
| `/etlo-academy-claw` | ETLOAcademyClaw — Program ETLO Energi & Sertifikasi EBT | 10 | etloacademyclaw-orchestrator | emerald |
| `/etlo-bizdev-claw` | ETLOBizDevClaw — Strategi Bisnis & Pengembangan ETLO | 10 | etlobizdevclaw-orchestrator | teal |
| `/bim-claw` | BIMClaw — AI Konsultan BIM & Konstruksi Digital | 8 | bim-claw-orchestrator | blue |
| `/desain-claw` | DesainClaw — AI Konsultan Desain Arsitektur | 8 | desain-claw-orchestrator | rose |
| `/siteops-claw` | SiteOpsClaw — AI Konsultan Operasional Lapangan | 8 | siteops-claw-orchestrator | orange |
| `/ketenagalistrikan-claw` | KetenagalistrikanClaw — Konsultan Ketenagalistrikan | 8 | ketenagalistrikan-claw-orchestrator | yellow |
| `/energi-claw` | EnergiClaw — Konsultan Energi & EBT | 8 | energi-claw-orchestrator | orange |
| `/pertambangan-claw` | PertambanganClaw — Konsultan Pertambangan | 8 | pertambangan-claw-orchestrator | stone |
| `/digital-marketing-claw` | DigitalMarketingClaw — AI Konsultan Digital Marketing | 8 | digital-marketing-claw-orchestrator | violet |
| `/crm-sales-claw` | CrmSalesClaw — AI Konsultan CRM & Sales | 8 | crm-sales-claw-orchestrator | blue |
| `/brand-content-claw` | BrandContentClaw — AI Konsultan Brand & Content | 8 | brand-content-claw-orchestrator | rose |
| `/ecommerce-claw` | EcommerceClaw — AI Konsultan E-Commerce | 8 | ecommerce-claw-orchestrator | orange |
| `/rekrutmen-claw` | RekrutmenClaw — AI Konsultan Rekrutmen | 8 | rekrutmen-claw-orchestrator | teal |
| `/ld-kompetensi-claw` | LdKompetensiClaw — AI Konsultan Learning & Development | 8 | ld-kompetensi-claw-orchestrator | emerald |
| `/penilaian-kinerja-claw` | PenilaianKinerjaClaw — AI Konsultan Manajemen Kinerja | 8 | penilaian-kinerja-claw-orchestrator | indigo |
| `/pajak-claw` | PajakClaw — AI Advisor Pajak Indonesia | 8 | (slug: pajak-claw-orchestrator) | amber |
| `/hubungan-industrial-claw` | HubunganIndustrialClaw — HR & Industrial Relations | 8 | (slug: hubungan-industrial-claw-orchestrator) | orange |
| `/esg-claw` | ESGClaw — ESG & Keberlanjutan Indonesia | 8 | (slug: esg-claw-orchestrator) | emerald |
| `/lean-opex-claw` | LeanOpExClaw — Lean Manufacturing & OpEx | 8 | (slug: lean-opex-claw-orchestrator) | blue |
| `/supply-chain-claw` | SupplyChainClaw — Supply Chain & Logistics | 8 | (slug: supply-chain-claw-orchestrator) | indigo |
| `/industri40-claw` | Industri40Claw — Industri 4.0 & Digital Manufacturing | 8 | (slug: industri40-claw-orchestrator) | violet |
| `/transmisi-claw` | TransmisiClaw — Transmisi & Gardu Induk PLN | 7 | (slug: transmisi-claw-orchestrator) | red |
| `/cybersecurity-claw` | CybersecurityClaw — Cybersecurity & PDP Indonesia | 8 | (slug: cybersecurity-claw-orchestrator) | slate |
| `/haccp-claw` | HACCPClaw — HACCP, BPOM & Sertifikasi Halal | 8 | (slug: haccp-claw-orchestrator) | green |
| `/lkpm-claw` | LKPMClaw — LKPM & Penanaman Modal BKPM | 7 | (slug: lkpm-claw-orchestrator) | teal |
| `/pub-lkut-claw` | PUB-LKUTClaw — Pengembangan Usaha Berkelanjutan & LKUT | 8 | (slug: pub-lkut-claw-orchestrator) | sky |
| `/esimpan-claw` | ESIMPANClaw — Input Pengalaman BUJK & TKK di E-SIMPAN | 9 | (prompt: ESIMPAN_CLAW_ORCHESTRATOR_v1) | blue |
| `/oss-claw` | OSSClaw — AI Konsultan OSS-RBA, NIB & Perizinan | 8 | (prompt: OSS_CLAW_ORCHESTRATOR_v1) | emerald |
| `/teras-lpjk-1` | TerasLPJK#1 — Sharing Knowledge Sertifikasi SKK | 5 | (prompt: TERAS_LPJK1_ORCHESTRATOR_v1) | indigo |
| `/ebt-solar-claw` | EBTSolarClaw — AI Konsultan PLTS & Energi Surya | 8 | ebt-solar-claw-orchestrator | yellow |
| `/geologi-claw` | GeologiClaw — AI Konsultan Geologi & Eksplorasi | 8 | geologi-claw-orchestrator | brown |
| `/offshore-safety-claw` | OffshoreSafetyClaw — AI Konsultan K3 & Operasi Migas Offshore | 8 | offshore-safety-claw-orchestrator | slate |
| `/transisi-energi-claw` | TransisiEnergiClaw — AI Konsultan Transisi Energi | 8 | transisi-energi-claw-orchestrator | green |
| `/tutor-teknik-claw` | TutorTeknikClaw — AI Tutor Teknik untuk Mahasiswa | 8 | tutor-teknik-claw-orchestrator | indigo |
| `/riset-skripsi-claw` | RisetSkripsiClaw — AI Konsultan Riset & Skripsi | 8 | riset-skripsi-claw-orchestrator | violet |
| `/nspk-navigator-claw` | NSPKNavigatorClaw — AI Panduan NSPK & Standar Teknis | 8 | nspk-navigator-claw-orchestrator | blue |
| `/korporasi-claw` | KorporasiClaw — AI Konsultan Korporasi & Bisnis | 8 | korporasi-claw-orchestrator | gray |

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
- **Orchestrator routes**: SELALU gunakan `getAgentBySlug(slug)` sebagai primary lookup. JANGAN `getAgent("hardcoded-id")` — ID drift setelah re-seed menyebabkan route mengembalikan agen yang salah tanpa error.

## Pointers
- **Inter-Agent API**: `server/routes.ts` orchestration block ~line 2806
- **Test Tracker Storage** (localStorage): `gustafta_test_tracker_v1` (Tender) · `gustafta_fed_tracker_v1` (Federation) · `gustafta_pilot_tracker_v1` (Pilot) · `gustafta_konstra_tracker_v1` (KONSTRA) · `gustafta_konstra_signoff_v1` (Sprint 4 Sign-Off)
