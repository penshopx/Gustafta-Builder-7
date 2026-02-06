import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SharedHeader } from "@/components/shared-header";
import { useGustaftaAssistant } from "@/hooks/use-agents";
import { ChatPopup } from "@/components/chat-popup";
import { 
  Bot, Lightbulb, Wrench, MessageSquare, BookOpen, 
  Sparkles, Globe, Settings, Shield, BarChart3, Zap, Code, 
  FileText, Users, Play, Puzzle, Layers, Brain, Key, Webhook
} from "lucide-react";

interface DocCard {
  icon: typeof Bot;
  title: string;
  description: string;
  tags: string[];
  href: string;
}

const mainDocs: DocCard[] = [
  {
    icon: Lightbulb,
    title: "Big Idea Framework",
    description: "Mulai dari masalah, ide, inspirasi, atau mentoring untuk membangun chatbot yang tepat sasaran.",
    tags: ["hierarki", "strategi", "planning"],
    href: "#big-idea",
  },
  {
    icon: Wrench,
    title: "Toolbox System",
    description: "Kumpulkan kemampuan dan fitur yang dibutuhkan untuk mencapai Big Idea Anda.",
    tags: ["capabilities", "features", "tools"],
    href: "#toolbox",
  },
  {
    icon: Bot,
    title: "Persona Configuration",
    description: "Konfigurasi nama, tagline, filosofi, system prompt, dan kepribadian chatbot Anda.",
    tags: ["persona", "branding", "identity"],
    href: "#persona",
  },
  {
    icon: BookOpen,
    title: "Knowledge Base",
    description: "Upload PDF, PPT, Excel, Word atau tambahkan teks dan URL untuk melatih chatbot.",
    tags: ["RAG", "dokumen", "training"],
    href: "#knowledge-base",
  },
  {
    icon: Sparkles,
    title: "Attentive Agentic AI",
    description: "Aktifkan kemampuan AI yang lebih cerdas dengan listening, context retention, dan emotional intelligence.",
    tags: ["AI", "agentic", "advanced"],
    href: "#agentic-ai",
  },
  {
    icon: Globe,
    title: "Multi-Channel Integration",
    description: "Hubungkan chatbot ke WhatsApp, Telegram, Discord, Slack, Web Widget, dan API.",
    tags: ["integrasi", "channels", "deployment"],
    href: "#integrations",
  },
];

const gettingStarted: DocCard[] = [
  {
    icon: Play,
    title: "Quick Start",
    description: "Mulai membangun chatbot pertama Anda dalam hitungan menit.",
    tags: ["setup", "first-run"],
    href: "#quick-start",
  },
  {
    icon: Layers,
    title: "Hierarki Chatbot",
    description: "Pahami alur Big Idea → Toolbox → Chatbot Orchestrator → Specialist.",
    tags: ["arsitektur", "struktur"],
    href: "#hierarchy",
  },
  {
    icon: Puzzle,
    title: "Web Widget Embed",
    description: "Embed chatbot ke website Anda dengan mudah menggunakan widget.",
    tags: ["embed", "widget", "website"],
    href: "#embed",
  },
  {
    icon: Code,
    title: "API Integration",
    description: "Integrasikan chatbot ke aplikasi Anda menggunakan REST API.",
    tags: ["API", "developer", "REST"],
    href: "#api",
  },
];

const apiReference: DocCard[] = [
  {
    icon: FileText,
    title: "Message Structure",
    description: "Struktur pesan, roles, dan metadata yang digunakan dalam chat.",
    tags: ["schema", "roles", "metadata"],
    href: "#message-structure",
  },
  {
    icon: Webhook,
    title: "REST API Endpoints",
    description: "HTTP endpoints untuk integrasi server-to-server.",
    tags: ["http", "endpoints", "auth"],
    href: "#rest-api",
  },
  {
    icon: Key,
    title: "Access Control",
    description: "Token akses, mode publik/privat, dan kontrol domain untuk monetisasi.",
    tags: ["security", "token", "auth"],
    href: "#access-control",
  },
];

const managementSystems: DocCard[] = [
  {
    icon: Shield,
    title: "ISO 37001:2016",
    description: "Sistem Manajemen Anti Penyuapan - Membangun chatbot untuk compliance dan pelatihan anti-korupsi.",
    tags: ["anti-bribery", "compliance", "ISO"],
    href: "#iso-37001",
  },
  {
    icon: Shield,
    title: "SMK3",
    description: "Sistem Manajemen Keselamatan dan Kesehatan Kerja - Chatbot untuk K3 dan safety training.",
    tags: ["K3", "safety", "OHS"],
    href: "#smk3",
  },
  {
    icon: Shield,
    title: "ISO 9001:2015",
    description: "Sistem Manajemen Mutu - Chatbot untuk quality management dan customer satisfaction.",
    tags: ["quality", "QMS", "ISO"],
    href: "#iso-9001",
  },
];

function DocCardComponent({ doc }: { doc: DocCard }) {
  return (
    <a href={doc.href}>
      <Card className="h-full hover-elevate cursor-pointer transition-all">
        <CardHeader className="pb-3">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <doc.icon className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-base">{doc.title}</CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-sm text-muted-foreground mb-3">{doc.description}</p>
          <div className="flex flex-wrap gap-1">
            {doc.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </a>
  );
}

function DocSection({ title, description, docs }: { title: string; description?: string; docs: DocCard[] }) {
  return (
    <section className="mb-12">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">{title}</h2>
        {description && <p className="text-muted-foreground">{description}</p>}
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {docs.map((doc) => (
          <DocCardComponent key={doc.title} doc={doc} />
        ))}
      </div>
    </section>
  );
}

export default function Documentation() {
  const { data: gustaftaAssistant } = useGustaftaAssistant();

  return (
    <div className="min-h-screen bg-background">
      <SharedHeader />

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Dokumentasi Gustafta</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Pelajari cara membangun dengan Gustafta — tambahkan pengetahuan, gunakan Agentic AI, 
              buat chatbot khusus, dan hubungkan ke berbagai channel.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
            {mainDocs.map((doc) => (
              <DocCardComponent key={doc.title} doc={doc} />
            ))}
          </div>

          <DocSection 
            title="Mulai" 
            description="Baru mengenal Gustafta? Mulai dari sini untuk menyiapkan chatbot pertama Anda."
            docs={gettingStarted}
          />

          <DocSection 
            title="Sistem Manajemen"
            description="Panduan khusus untuk implementasi chatbot di bidang compliance dan manajemen."
            docs={managementSystems}
          />

          <DocSection 
            title="Referensi API" 
            description="Dokumentasi referensi untuk integrasi dan pengembangan lanjutan."
            docs={apiReference}
          />

          <section id="big-idea" className="mb-12 scroll-mt-20">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Lightbulb className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">Big Idea Framework</CardTitle>
                    <p className="text-muted-foreground">Fondasi strategi chatbot Anda</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="prose prose-sm dark:prose-invert max-w-none">
                <p>
                  Big Idea adalah titik awal dalam hierarki Gustafta. Ini adalah visi besar atau masalah 
                  yang ingin Anda selesaikan dengan chatbot AI.
                </p>
                
                <h3>Tipe Big Idea</h3>
                <ul>
                  <li><strong>Problem</strong> - Masalah bisnis yang akan diatasi oleh chatbot</li>
                  <li><strong>Idea</strong> - Ide inovatif untuk mencapai tujuan tertentu</li>
                  <li><strong>Inspiration</strong> - Inspirasi untuk inovasi dan transformasi</li>
                  <li><strong>Mentoring</strong> - Program edukasi dan pendampingan</li>
                </ul>

                <h3>Contoh Big Idea</h3>
                <div className="bg-muted p-4 rounded-lg not-prose">
                  <p className="font-medium mb-2">Problem: Otomasi Customer Service</p>
                  <p className="text-sm text-muted-foreground">
                    "Tim customer service kami kewalahan dengan pertanyaan berulang. 
                    Kami ingin chatbot yang bisa menjawab FAQ, membantu tracking order, 
                    dan mengalihkan ke manusia hanya untuk kasus kompleks."
                  </p>
                </div>
              </CardContent>
            </Card>
          </section>

          <section id="toolbox" className="mb-12 scroll-mt-20">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Wrench className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">Toolbox System</CardTitle>
                    <p className="text-muted-foreground">Kumpulan kemampuan untuk chatbot</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="prose prose-sm dark:prose-invert max-w-none">
                <p>
                  Toolbox adalah kumpulan kemampuan (capabilities) yang dibutuhkan untuk mencapai 
                  Big Idea. Setiap Toolbox terhubung ke satu Big Idea dan bisa memiliki 
                  beberapa chatbot.
                </p>
                
                <h3>Komponen Toolbox</h3>
                <ul>
                  <li><strong>Nama & Deskripsi</strong> - Identitas toolbox</li>
                  <li><strong>Purpose</strong> - Tujuan spesifik toolbox</li>
                  <li><strong>Capabilities</strong> - Daftar kemampuan yang tersedia</li>
                  <li><strong>Limitations</strong> - Batasan yang perlu diketahui</li>
                </ul>
              </CardContent>
            </Card>
          </section>

          <section id="agentic-ai" className="mb-12 scroll-mt-20">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Brain className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">Attentive Agentic AI</CardTitle>
                    <p className="text-muted-foreground">Kemampuan AI tingkat lanjut</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="prose prose-sm dark:prose-invert max-w-none">
                <p>
                  Gustafta menggunakan teknologi Agentic AI yang memiliki kemampuan untuk memahami 
                  konteks, belajar dari percakapan, dan memberikan respons yang lebih manusiawi.
                </p>
                
                <h3>Fitur Agentic AI</h3>
                <div className="grid md:grid-cols-2 gap-4 not-prose">
                  {[
                    { title: "Attentive Listening", desc: "Memahami maksud pengguna dengan baik" },
                    { title: "Context Retention", desc: "Mengingat konteks percakapan sebelumnya" },
                    { title: "Emotional Intelligence", desc: "Merespons dengan empati dan pemahaman" },
                    { title: "Multi-step Reasoning", desc: "Menyelesaikan masalah kompleks bertahap" },
                    { title: "Proactive Assistance", desc: "Memberikan saran tanpa diminta" },
                    { title: "Self-Correction", desc: "Memperbaiki kesalahan sendiri" },
                    { title: "Learning Enabled", desc: "Belajar dari interaksi untuk perbaikan" },
                    { title: "Agentic Mode", desc: "Mode otonom untuk tugas kompleks" },
                  ].map((item) => (
                    <div key={item.title} className="bg-muted p-3 rounded-lg">
                      <p className="font-medium text-sm">{item.title}</p>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>

          <section id="iso-37001" className="mb-12 scroll-mt-20">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">ISO 37001:2016 - Sistem Manajemen Anti Penyuapan</CardTitle>
                    <p className="text-muted-foreground">Anti-Bribery Management System (ABMS)</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="prose prose-sm dark:prose-invert max-w-none">
                <p>
                  ISO 37001:2016 adalah standar internasional untuk sistem manajemen anti penyuapan. 
                  Gustafta dapat membantu organisasi Anda dalam implementasi dan pelatihan ABMS.
                </p>
                
                <h3>Penggunaan Chatbot untuk ISO 37001</h3>
                <ul>
                  <li><strong>Pelatihan Karyawan</strong> - Edukasi interaktif tentang kebijakan anti penyuapan</li>
                  <li><strong>FAQ Compliance</strong> - Menjawab pertanyaan seputar prosedur dan kebijakan</li>
                  <li><strong>Pelaporan Insiden</strong> - Memandu proses whistleblowing</li>
                  <li><strong>Due Diligence</strong> - Membantu proses evaluasi mitra bisnis</li>
                  <li><strong>Audit Internal</strong> - Menyediakan informasi untuk audit ABMS</li>
                </ul>

                <h3>Knowledge Base yang Direkomendasikan</h3>
                <ul>
                  <li>Dokumen kebijakan anti penyuapan perusahaan</li>
                  <li>Prosedur pelaporan dan investigasi</li>
                  <li>Standar ISO 37001:2016</li>
                  <li>Regulasi anti korupsi yang berlaku</li>
                  <li>Studi kasus dan contoh situasi</li>
                </ul>
              </CardContent>
            </Card>
          </section>

          <section id="smk3" className="mb-12 scroll-mt-20">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">SMK3 - Sistem Manajemen K3</CardTitle>
                    <p className="text-muted-foreground">Keselamatan dan Kesehatan Kerja</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="prose prose-sm dark:prose-invert max-w-none">
                <p>
                  SMK3 (Sistem Manajemen Keselamatan dan Kesehatan Kerja) adalah sistem yang wajib 
                  diterapkan oleh perusahaan di Indonesia sesuai PP No. 50 Tahun 2012.
                </p>
                
                <h3>Penggunaan Chatbot untuk SMK3</h3>
                <ul>
                  <li><strong>Induksi K3</strong> - Orientasi keselamatan untuk karyawan baru</li>
                  <li><strong>Pelaporan Insiden</strong> - Memandu pelaporan kecelakaan dan near-miss</li>
                  <li><strong>SOP & Prosedur</strong> - Akses cepat ke prosedur keselamatan</li>
                  <li><strong>HIRADC</strong> - Informasi hazard identification dan risk assessment</li>
                  <li><strong>APD</strong> - Panduan penggunaan alat pelindung diri</li>
                  <li><strong>Tanggap Darurat</strong> - Prosedur emergency response</li>
                </ul>

                <h3>Kategori Knowledge Base</h3>
                <div className="grid md:grid-cols-2 gap-4 not-prose">
                  {[
                    "Kebijakan K3 Perusahaan",
                    "Prosedur Kerja Aman",
                    "HIRADC Register",
                    "Panduan APD",
                    "Prosedur Tanggap Darurat",
                    "Permit to Work System",
                    "JSA (Job Safety Analysis)",
                    "Regulasi K3 (PP 50/2012)",
                  ].map((item) => (
                    <div key={item} className="bg-muted p-3 rounded-lg text-sm">
                      {item}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>

          <section id="quick-start" className="mb-12 scroll-mt-20">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Play className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">Quick Start</CardTitle>
                    <p className="text-muted-foreground">Mulai dalam 5 menit</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="prose prose-sm dark:prose-invert max-w-none">
                <h3>Langkah 1: Buat Big Idea</h3>
                <p>Tentukan masalah atau tujuan yang ingin dicapai oleh chatbot Anda.</p>

                <h3>Langkah 2: Buat Toolbox</h3>
                <p>Definisikan kemampuan yang dibutuhkan untuk mencapai Big Idea.</p>

                <h3>Langkah 3: Buat Chatbot</h3>
                <p>Konfigurasi persona, system prompt, dan greeting message.</p>

                <h3>Langkah 4: Tambah Knowledge Base</h3>
                <p>Upload dokumen atau tambahkan teks untuk melatih chatbot.</p>

                <h3>Langkah 5: Test & Deploy</h3>
                <p>Uji chatbot melalui Chat Console, lalu deploy ke channel pilihan Anda.</p>

                <div className="not-prose mt-6">
                  <Link href="/dashboard">
                    <Button className="gap-2" data-testid="button-start-building">
                      Mulai Membangun
                      <Zap className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </section>

          <div className="bg-muted/50 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold mb-2">Butuh Bantuan?</h2>
            <p className="text-muted-foreground mb-4">
              Hubungi tim dukungan kami untuk pertanyaan lebih lanjut.
            </p>
            <Button variant="outline" data-testid="button-contact-support">
              Hubungi Dukungan
            </Button>
          </div>
        </div>
      </main>

      <footer className="py-12 border-t mt-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Bot className="h-6 w-6 text-primary" />
              <span className="font-bold">Gustafta</span>
            </div>
            <p className="text-sm text-muted-foreground">
              2024 Gustafta. AI Chatbot Builder Platform.
            </p>
          </div>
        </div>
      </footer>

      {gustaftaAssistant && (
        <ChatPopup agent={gustaftaAssistant} />
      )}
    </div>
  );
}
