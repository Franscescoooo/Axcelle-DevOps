"use client";

import { useState } from "react";
import { TextField, PasswordField, GoogleButton, Divider } from "./Fields";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [errors, setErrors] = useState<{ email?: string; password?: string; form?: string }>({});
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const next: typeof errors = {};
    if (!/^\S+@\S+\.\S+$/.test(email)) next.email = "Masukkan alamat email yang valid.";
    if (!password) next.password = "Kata sandi wajib diisi.";
    setErrors(next);
    if (Object.keys(next).length) return;

    setLoading(true);
    try {
      // TODO: panggil API login kamu di sini, contoh:
      // const res = await fetch("/api/auth/login", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ email, password, remember }),
      // });
      // if (!res.ok) throw new Error();
      // router.push("/");
      await new Promise((r) => setTimeout(r, 800)); // simulasi
    } catch {
      setErrors({ form: "Email atau kata sandi salah. Coba lagi." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
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
