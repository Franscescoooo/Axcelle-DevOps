"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { TextField, PasswordField, GoogleButton, Divider } from "./Fields";
import Toast, { type ToastData } from "@/components/Toast";
import { EMAIL_RE } from "@/lib/validation";
import { useRedirectIfSignedIn } from "./useRedirectIfSignedIn";

type Errors = { email?: string; password?: string; form?: string };

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  useRedirectIfSignedIn();

  const justRegistered = searchParams.get("registered") === "1";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<ToastData | null>(
    justRegistered
      ? { type: "success", message: "Akun berhasil dibuat. Silakan masuk dengan akun barumu." }
      : null
  );
  const closeToast = useCallback(() => setToast(null), []);

  // Bersihkan ?registered=1 dari alamat supaya notifikasi tidak muncul lagi saat refresh
  useEffect(() => {
    if (justRegistered) router.replace("/signin", { scroll: false });
  }, [justRegistered, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const next: Errors = {};
    if (!EMAIL_RE.test(email.trim())) next.email = "Masukkan alamat email yang valid.";
    if (!password) next.password = "Kata sandi wajib diisi.";
    setErrors(next);
    if (Object.keys(next).length) return;

    setLoading(true);
    try {
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password, remember }),
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        router.push("/");
        router.refresh();
        return;
      }

      if (data.error === "USER_NOT_FOUND") {
        setErrors({ email: "Email ini belum terdaftar." });
        setToast({
          type: "error",
          message: data.message,
          action: { label: "Daftar sekarang", href: "/signup" },
        });
      } else if (data.error === "WRONG_PASSWORD") {
        setErrors({ password: data.message });
      } else {
        setErrors({ form: data.message ?? "Terjadi kesalahan. Coba lagi." });
      }
    } catch {
      setErrors({ form: "Tidak dapat terhubung ke server. Coba lagi." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Toast toast={toast} onClose={closeToast} />

      <GoogleButton label="Masuk dengan Google" />
      <Divider text="atau dengan email" />

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        {errors.form && (
          <p role="alert" className="rounded-lg border border-red-400/40 bg-red-400/10 px-3.5 py-3 text-sm text-red-200">
            {errors.form}
          </p>
        )}

        <TextField
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="nama@email.com"
          value={email}
          onChange={setEmail}
          error={errors.email}
        />

        <PasswordField
          label="Kata sandi"
          name="password"
          autoComplete="current-password"
          value={password}
          onChange={setPassword}
          error={errors.password}
        />

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="h-4 w-4 accent-amber"
            />
            Ingat saya
          </label>
          <a href="/lupa-sandi" className="text-amber hover:underline">Lupa kata sandi?</a>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-amber py-3 font-semibold text-ink transition-colors hover:bg-paper disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-paper"
        >
          {loading ? "Memproses…" : "Masuk"}
        </button>
      </form>
    </>
  );
}
