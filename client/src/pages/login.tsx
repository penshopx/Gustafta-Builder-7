import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft, Sparkles, CheckCircle2, LogOut } from "lucide-react";
import { trackCompleteRegistration, trackLead } from "@/lib/meta-pixel";

type Mode = "choose" | "login" | "register" | "verify";

export default function LoginPage() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [mode, setMode] = useState<Mode>("login");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  // Fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [otp, setOtp] = useState("");
  const [pendingEmail, setPendingEmail] = useState("");
  const [otpFallback, setOtpFallback] = useState<string | undefined>(undefined);

  // Detect existing session so user can switch accounts
  const { data: currentUser } = useQuery<any>({
    queryKey: ["/api/auth/user"],
    retry: false,
    staleTime: 0,
  });

  const handleSwitchAccount = () => {
    window.location.href = "/api/logout";
  };

  const handleReplitLogin = () => {
    window.location.href = "/api/login";
  };

  const handleLogin = async () => {
    if (!email || !password) {
      toast({ title: "Isi email dan password", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      await apiRequest("POST", "/api/auth/login-email", { email, password });
      await queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      trackLead({ content_name: "Email Login" });
      navigate("/dashboard");
    } catch (err: any) {
      const msg = err?.message || "";
      if (msg.includes("needsVerification") || msg.includes("belum diverifikasi")) {
        setPendingEmail(email);
        setMode("verify");
        toast({ title: "Email belum diverifikasi", description: "Masukkan kode OTP yang dikirim ke email Anda." });
      } else {
        toast({ title: "Login gagal", description: msg.replace(/^\d+: /, ""), variant: "destructive" });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!firstName || !email || !password) {
      toast({ title: "Nama, email, dan password wajib diisi", variant: "destructive" });
      return;
    }
    if (password.length < 8) {
      toast({ title: "Password minimal 8 karakter", variant: "destructive" });
      return;
    }
    if (password !== confirmPassword) {
      toast({ title: "Password tidak cocok", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const res = await apiRequest("POST", "/api/auth/register", { email, password, firstName, lastName });
      setPendingEmail(email);
      setOtpFallback(res?.otpFallback);
      setMode("verify");
      if (res?.otpFallback) {
        toast({ title: "OTP dibuat", description: "Lihat kode OTP yang tampil di layar (email belum dikonfigurasi)." });
      } else {
        toast({ title: "Kode OTP dikirim!", description: `Cek email ${email} untuk kode verifikasi.` });
      }
    } catch (err: any) {
      toast({ title: "Registrasi gagal", description: (err?.message || "").replace(/^\d+: /, ""), variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!otp || otp.length !== 6) {
      toast({ title: "Kode OTP harus 6 digit", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      await apiRequest("POST", "/api/auth/verify-email", { email: pendingEmail, code: otp });
      await queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      trackCompleteRegistration({ content_name: "Email Registration" });
      toast({ title: "Email terverifikasi!", description: "Selamat datang di Gustafta." });
      navigate("/dashboard");
    } catch (err: any) {
      toast({ title: "Verifikasi gagal", description: (err?.message || "").replace(/^\d+: /, ""), variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setLoading(true);
    try {
      const res = await apiRequest("POST", "/api/auth/resend-otp", { email: pendingEmail });
      setOtpFallback(res?.otpFallback);
      if (res?.otpFallback) {
        toast({ title: "OTP baru dibuat", description: "Lihat kode OTP yang tampil di layar." });
      } else {
        toast({ title: "Kode OTP baru dikirim", description: `Cek email ${pendingEmail}.` });
      }
    } catch (err: any) {
      toast({ title: "Gagal kirim ulang", description: (err?.message || "").replace(/^\d+: /, ""), variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      {/* Logo */}
      <a href="/" className="flex items-center gap-2 mb-8">
        <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center">
          <Sparkles className="h-5 w-5 text-white" />
        </div>
        <span className="text-xl font-bold">Gustafta</span>
      </a>

      <div className="w-full max-w-sm">
        {/* Switch account banner — shown only if a session already exists */}
        {currentUser?.email && (
          <div className="mb-3 rounded-xl border border-amber-300 bg-amber-50 dark:bg-amber-950/30 p-3 text-sm flex items-start gap-3" data-testid="banner-switch-account">
            <div className="flex-1 min-w-0">
              <p className="text-amber-900 dark:text-amber-200 font-medium">Sudah masuk sebagai</p>
              <p className="text-amber-700 dark:text-amber-300 truncate">{currentUser.email}</p>
            </div>
            <div className="flex flex-col gap-1 shrink-0">
              <Button size="sm" variant="outline" className="h-7 text-xs gap-1" onClick={() => navigate("/dashboard")} data-testid="button-continue-session">
                Lanjutkan
              </Button>
              <Button size="sm" variant="ghost" className="h-7 text-xs gap-1 text-amber-700 dark:text-amber-300" onClick={handleSwitchAccount} data-testid="button-switch-account">
                <LogOut className="h-3 w-3" /> Ganti akun
              </Button>
            </div>
          </div>
        )}

        <div className="bg-card border rounded-2xl shadow-sm p-6 space-y-5">

          {/* ── CHOOSE MODE ── */}
          {mode === "choose" && (
            <>
              <div className="text-center space-y-1">
                <h1 className="text-xl font-bold">Masuk ke Gustafta</h1>
                <p className="text-sm text-muted-foreground">Gunakan email & password Anda</p>
              </div>

              <div className="space-y-3">
                <Button
                  className="w-full h-11 gap-3 font-medium"
                  onClick={() => setMode("login")}
                  data-testid="button-login-email"
                >
                  <Mail className="h-4 w-4" />
                  Masuk dengan Email
                </Button>
              </div>

              <p className="text-center text-sm text-muted-foreground">
                Belum punya akun?{" "}
                <button
                  className="text-primary font-medium hover:underline"
                  onClick={() => setMode("register")}
                  data-testid="button-go-register"
                >
                  Daftar sekarang
                </button>
              </p>
            </>
          )}

          {/* ── LOGIN ── */}
          {mode === "login" && (
            <>
              <div className="flex items-center gap-3">
                <button onClick={() => setMode("choose")} className="text-muted-foreground hover:text-foreground">
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <div>
                  <h1 className="text-lg font-bold">Masuk</h1>
                  <p className="text-xs text-muted-foreground">Gunakan email & password Anda</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label htmlFor="login-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="nama@email.com"
                      className="pl-9"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                      data-testid="input-login-email"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="login-password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="login-password"
                      type={showPass ? "text" : "password"}
                      placeholder="Password Anda"
                      className="pl-9 pr-10"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                      data-testid="input-login-password"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      onClick={() => setShowPass(!showPass)}
                    >
                      {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <Button className="w-full" onClick={handleLogin} disabled={loading} data-testid="button-submit-login">
                  {loading ? "Memproses..." : "Masuk"}
                </Button>
              </div>

              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <button className="text-primary font-medium hover:underline" onClick={() => setMode("register")}>
                  Belum punya akun? Daftar
                </button>
                <a
                  href="https://wa.me/6282299417818?text=Halo%2C+saya+lupa+password+akun+Gustafta+saya.+Email%3A+"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground hover:underline"
                  data-testid="link-forgot-password"
                >
                  Lupa password?
                </a>
              </div>
            </>
          )}

          {/* ── REGISTER ── */}
          {mode === "register" && (
            <>
              <div className="flex items-center gap-3">
                <button onClick={() => setMode("choose")} className="text-muted-foreground hover:text-foreground">
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <div>
                  <h1 className="text-lg font-bold">Buat Akun</h1>
                  <p className="text-xs text-muted-foreground">Daftar dengan email & password</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="reg-firstname">Nama Depan *</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="reg-firstname"
                        placeholder="Budi"
                        className="pl-9"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        data-testid="input-reg-firstname"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="reg-lastname">Nama Belakang</Label>
                    <Input
                      id="reg-lastname"
                      placeholder="Santoso"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      data-testid="input-reg-lastname"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="reg-email">Email *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="reg-email"
                      type="email"
                      placeholder="nama@email.com"
                      className="pl-9"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      data-testid="input-reg-email"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="reg-password">Password * <span className="text-muted-foreground font-normal">(min. 8 karakter)</span></Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="reg-password"
                      type={showPass ? "text" : "password"}
                      placeholder="Minimal 8 karakter"
                      className="pl-9 pr-10"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      data-testid="input-reg-password"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      onClick={() => setShowPass(!showPass)}
                    >
                      {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="reg-confirm">Konfirmasi Password *</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="reg-confirm"
                      type={showConfirmPass ? "text" : "password"}
                      placeholder="Ulangi password"
                      className="pl-9 pr-10"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      data-testid="input-reg-confirm"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      onClick={() => setShowConfirmPass(!showConfirmPass)}
                    >
                      {showConfirmPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <Button className="w-full" onClick={handleRegister} disabled={loading} data-testid="button-submit-register">
                  {loading ? "Memproses..." : "Daftar & Kirim OTP"}
                </Button>
              </div>

              <p className="text-center text-sm text-muted-foreground">
                Sudah punya akun?{" "}
                <button className="text-primary font-medium hover:underline" onClick={() => setMode("login")}>
                  Masuk
                </button>
              </p>
            </>
          )}

          {/* ── VERIFY OTP ── */}
          {mode === "verify" && (
            <>
              <div className="text-center space-y-2">
                <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <CheckCircle2 className="h-6 w-6 text-primary" />
                </div>
                <h1 className="text-lg font-bold">Verifikasi Email</h1>
                <p className="text-sm text-muted-foreground">
                  {otpFallback ? (
                    <>Email server belum dikonfigurasi.</>
                  ) : (
                    <>Kode OTP dikirim ke<br />
                    <span className="font-medium text-foreground">{pendingEmail}</span></>
                  )}
                </p>
              </div>

              {/* OTP Fallback Display — shown when SMTP not configured */}
              {otpFallback && (
                <div className="rounded-xl border-2 border-dashed border-amber-400 bg-amber-50 dark:bg-amber-950/30 p-4 text-center space-y-1">
                  <p className="text-xs font-medium text-amber-700 dark:text-amber-400 uppercase tracking-wide">Kode OTP Anda</p>
                  <p className="text-3xl font-bold tracking-[0.3em] text-amber-900 dark:text-amber-200 select-all">{otpFallback}</p>
                  <p className="text-xs text-amber-600 dark:text-amber-500">Salin kode ini dan masukkan di bawah</p>
                </div>
              )}

              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label htmlFor="otp-code">Kode OTP (6 digit)</Label>
                  <Input
                    id="otp-code"
                    placeholder="123456"
                    maxLength={6}
                    className="text-center text-2xl font-bold tracking-widest h-12"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    onKeyDown={(e) => e.key === "Enter" && handleVerify()}
                    autoFocus
                    data-testid="input-otp"
                  />
                </div>
                <Button className="w-full" onClick={handleVerify} disabled={loading || otp.length !== 6} data-testid="button-verify-otp">
                  {loading ? "Memverifikasi..." : "Verifikasi"}
                </Button>
                <Button variant="ghost" className="w-full text-sm" onClick={handleResendOTP} disabled={loading} data-testid="button-resend-otp">
                  Kirim ulang kode OTP
                </Button>
              </div>

              <button
                className="w-full text-center text-sm text-muted-foreground hover:text-foreground"
                onClick={() => { setMode("choose"); setOtp(""); setOtpFallback(undefined); }}
              >
                ← Kembali ke halaman login
              </button>
            </>
          )}
        </div>

        {/* Admin / Replit OIDC fallback — small discreet link */}
        {mode !== "verify" && (
          <p className="text-center text-xs text-muted-foreground mt-3">
            <button
              type="button"
              onClick={handleReplitLogin}
              className="underline hover:text-foreground"
              data-testid="link-admin-replit-login"
            >
              Masuk sebagai admin (Replit)
            </button>
          </p>
        )}

        <p className="text-center text-xs text-muted-foreground mt-4">
          Dengan masuk, Anda menyetujui{" "}
          <a href="#" className="underline hover:text-foreground">Syarat & Ketentuan</a>{" "}
          Gustafta.
        </p>
      </div>
    </div>
  );
}
