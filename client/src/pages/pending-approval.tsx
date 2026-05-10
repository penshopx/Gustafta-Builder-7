import { useEffect } from "react";
import { Bot, Clock, Mail, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PendingApproval() {
  useEffect(() => {
    document.title = "Menunggu Persetujuan — Gustafta";
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-950 dark:to-indigo-950 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
            <Bot className="h-6 w-6 text-white" />
          </div>
          <span className="font-bold text-xl text-foreground">Gustafta</span>
        </div>

        {/* Status card */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-border shadow-sm p-8">
          <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-950/50 flex items-center justify-center mx-auto mb-5">
            <Clock className="h-8 w-8 text-amber-600 dark:text-amber-400" />
          </div>

          <h1 className="text-2xl font-bold text-foreground mb-2">
            Akun Sedang Diverifikasi
          </h1>
          <p className="text-muted-foreground text-sm leading-relaxed mb-6">
            Pendaftaran Anda sudah diterima. Tim kami akan memverifikasi akun dan
            menghubungi Anda secepatnya melalui WhatsApp atau email.
          </p>

          <div className="bg-muted/50 rounded-xl p-4 text-left space-y-3 mb-6">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Proses selanjutnya
            </p>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-violet-100 dark:bg-violet-950 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-violet-600 dark:text-violet-400">1</span>
              </div>
              <p className="text-sm text-foreground">Tim Gustafta memverifikasi data Anda</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-violet-100 dark:bg-violet-950 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-violet-600 dark:text-violet-400">2</span>
              </div>
              <p className="text-sm text-foreground">Anda dihubungi untuk konfirmasi kebutuhan & produk</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-violet-100 dark:bg-violet-950 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-violet-600 dark:text-violet-400">3</span>
              </div>
              <p className="text-sm text-foreground">Akun diaktifkan & platform siap digunakan</p>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <a
              href="https://wa.me/6282299417818?text=Halo%20Gustafta%2C%20saya%20baru%20mendaftar%20dan%20ingin%20konfirmasi%20akun%20saya."
              target="_blank"
              rel="noopener noreferrer"
              data-testid="button-wa-pending"
            >
              <Button className="w-full gap-2 bg-green-600 hover:bg-green-700 text-white">
                <MessageSquare className="h-4 w-4" />
                Hubungi via WhatsApp
              </Button>
            </a>
            <a href="mailto:admin@gustafta.my.id?subject=Konfirmasi%20Akun%20Gustafta" data-testid="link-email-pending">
              <Button variant="outline" className="w-full gap-2">
                <Mail className="h-4 w-4" />
                Kirim Email Konfirmasi
              </Button>
            </a>
          </div>
        </div>

        <p className="mt-6 text-xs text-muted-foreground">
          Sudah diverifikasi?{" "}
          <a href="/api/login" className="text-primary hover:underline">
            Coba login ulang
          </a>{" "}
          atau{" "}
          <a href="/api/logout" className="text-muted-foreground hover:text-foreground hover:underline">
            keluar
          </a>
        </p>
      </div>
    </div>
  );
}
