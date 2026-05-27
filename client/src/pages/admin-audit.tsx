import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, AlertTriangle, XCircle, Loader2, RefreshCw, ExternalLink } from "lucide-react";
import { Link } from "wouter";

interface AuditRow {
  route: string;
  expectedId: number;
  status: "OK" | "MISMATCH" | "MISSING";
  issue?: string;
  matchedKeyword?: string;
  expectedKeywords?: string[];
  actual: {
    id: string;
    name: string;
    slug: string;
    tagline: string | null;
    avatar: string | null;
    isActive: boolean;
  } | null;
}

interface AuditResponse {
  summary: { total: number; ok: number; mismatch: number; missing: number };
  results: AuditRow[];
}

export default function AdminAudit() {
  const { data, isLoading, error, refetch, isFetching } = useQuery<AuditResponse>({
    queryKey: ["/api/admin/audit-orchestrators"],
    staleTime: 30 * 1000,
  });

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold">Audit Orchestrator Agents</h1>
            <p className="text-muted-foreground mt-1">
              Cek apakah setiap MultiClaw route punya agent yang benar di database.
            </p>
          </div>
          <Button onClick={() => refetch()} disabled={isFetching} data-testid="button-refresh">
            <RefreshCw className={`h-4 w-4 mr-2 ${isFetching ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        )}

        {error && (
          <Card className="border-destructive">
            <CardContent className="pt-6">
              <p className="text-destructive">Error: {(error as Error).message}</p>
              <p className="text-sm text-muted-foreground mt-2">
                Pastikan Anda login sebagai superadmin.
              </p>
            </CardContent>
          </Card>
        )}

        {data && (
          <>
            <div className="grid grid-cols-4 gap-4">
              <SummaryCard label="Total" value={data.summary.total} color="default" />
              <SummaryCard label="Benar (OK)" value={data.summary.ok} color="emerald" icon={<CheckCircle2 className="h-5 w-5" />} />
              <SummaryCard label="Salah Nama" value={data.summary.mismatch} color="amber" icon={<AlertTriangle className="h-5 w-5" />} />
              <SummaryCard label="Hilang" value={data.summary.missing} color="red" icon={<XCircle className="h-5 w-5" />} />
            </div>

            {(data.summary.mismatch > 0 || data.summary.missing > 0) && (
              <Card className="border-amber-500/40 bg-amber-50/50 dark:bg-amber-950/20">
                <CardContent className="pt-6">
                  <p className="text-sm">
                    <strong>{data.summary.mismatch + data.summary.missing}</strong> orchestrator bermasalah perlu diperbaiki.
                    Ini biasanya karena ID agent ketimpa saat seeding agent lain.
                    Setelah audit selesai, kabari agent (saya) — saya akan buat seed patch untuk perbaiki nama/data yang salah.
                  </p>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Detail per Route</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {data.results.map((row) => (
                    <AuditRowItem key={row.route} row={row} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        )}

        <div className="text-center">
          <Link href="/admin">
            <Button variant="outline">← Kembali ke Admin Panel</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

function SummaryCard({ label, value, color, icon }: { label: string; value: number; color: string; icon?: React.ReactNode }) {
  const colorClasses: Record<string, string> = {
    default: "bg-muted",
    emerald: "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-500/30 text-emerald-700 dark:text-emerald-400",
    amber: "bg-amber-50 dark:bg-amber-950/30 border-amber-500/30 text-amber-700 dark:text-amber-400",
    red: "bg-red-50 dark:bg-red-950/30 border-red-500/30 text-red-700 dark:text-red-400",
  };
  return (
    <Card className={colorClasses[color]}>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">{label}</p>
          {icon}
        </div>
        <p className="text-3xl font-bold mt-2" data-testid={`stat-${label.toLowerCase().replace(/[^a-z]/g, "")}`}>{value}</p>
      </CardContent>
    </Card>
  );
}

function AuditRowItem({ row }: { row: AuditRow }) {
  const statusConfig = {
    OK: { icon: <CheckCircle2 className="h-4 w-4 text-emerald-600" />, color: "border-emerald-500/30 bg-emerald-50/30 dark:bg-emerald-950/10" },
    MISMATCH: { icon: <AlertTriangle className="h-4 w-4 text-amber-600" />, color: "border-amber-500/40 bg-amber-50/40 dark:bg-amber-950/20" },
    MISSING: { icon: <XCircle className="h-4 w-4 text-red-600" />, color: "border-red-500/40 bg-red-50/40 dark:bg-red-950/20" },
  };
  const cfg = statusConfig[row.status];

  return (
    <div className={`border rounded-lg p-3 ${cfg.color}`} data-testid={`row-${row.route.replace(/\//g, "")}`}>
      <div className="flex items-start gap-3">
        <div className="mt-1">{cfg.icon}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <code className="font-mono text-sm font-semibold">{row.route}</code>
            <Badge variant="outline" className="text-xs">ID {row.expectedId}</Badge>
            <Badge
              variant={row.status === "OK" ? "default" : "destructive"}
              className={row.status === "OK" ? "bg-emerald-600" : row.status === "MISMATCH" ? "bg-amber-600" : "bg-red-600"}
            >
              {row.status}
            </Badge>
            <a href={row.route} target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
              <ExternalLink className="h-3 w-3" /> buka
            </a>
          </div>
          {row.actual ? (
            <p className="text-sm mt-1">
              <span className="text-muted-foreground">Nama di DB:</span>{" "}
              <span className={row.status === "OK" ? "" : "font-semibold text-amber-700 dark:text-amber-400"}>
                {row.actual.name}
              </span>
              {row.actual.tagline && <span className="text-xs text-muted-foreground ml-2">({row.actual.tagline})</span>}
            </p>
          ) : (
            <p className="text-sm mt-1 text-red-600">Agent tidak ada di database</p>
          )}
          {row.issue && (
            <p className="text-xs text-amber-700 dark:text-amber-400 mt-1">⚠️ {row.issue}</p>
          )}
          {row.expectedKeywords && row.status !== "OK" && (
            <p className="text-xs text-muted-foreground mt-1">
              Keyword diharapkan: <code>{row.expectedKeywords.join(" / ")}</code>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
