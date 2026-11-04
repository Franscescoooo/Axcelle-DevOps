"use client";

import { useState } from "react";
import { TextField, PasswordField, GoogleButton, Divider } from "./Fields";

type Errors = Partial<Record<"name" | "email" | "phone" | "password" | "confirm" | "terms" | "form", string>>;

export default function SignupForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [terms, setTerms] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const next: Errors = {};
    if (name.trim().length < 2) next.name = "Nama lengkap wajib diisi.";
    if (!/^\S+@\S+\.\S+$/.test(email)) next.email = "Masukkan alamat email yang valid.";
    if (!/^(\+62|62|0)8\d{8,11}$/.test(phone.replace(/[\s-]/g, "")))
      next.phone = "Masukkan nomor HP Indonesia yang valid, contoh 081234567890.";
    if (password.length < 8) next.password = "Kata sandi minimal 8 karakter.";
    if (confirm !== password) next.confirm = "Konfirmasi kata sandi tidak sama.";
    if (!terms) next.terms = "Kamu perlu menyetujui syarat dan ketentuan.";
    setErrors(next);
    if (Object.keys(next).length) return;

    setLoading(true);
    try {
      // TODO: panggil API pendaftaran kamu di sini, contoh:
      // const res = await fetch("/api/auth/signup", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ name, email, phone, password }),
      // });
      // if (!res.ok) throw new Error();
      // router.push("/masuk");
      await new Promise((r) => setTimeout(r, 800)); // simulasi
    } catch {
      setErrors({ form: "Pendaftaran gagal. Periksa data kamu lalu coba lagi." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <GoogleButton label="Daftar dengan Google" />
      <Divider text="atau dengan email" />

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        {errors.form && (
          <p role="alert" className="rounded-lg border border-red-400/40 bg-red-400/10 px-3.5 py-3 text-sm text-red-200">
            {errors.form}
          </p>
        )}

        <TextField label="Nama lengkap" name="name" autoComplete="name" value={name} onChange={setName} error={errors.name} />
        <TextField label="Email" name="email" type="email" autoComplete="email" placeholder="nama@email.com" value={email} onChange={setEmail} error={errors.email} />
        <TextField
          label="Nomor HP"
          name="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="081234567890"
          hint="E-tiket dan kode pesanan akan dikirim ke nomor ini."
          value={phone}
          onChange={setPhone}
          error={errors.phone}
        />
        <PasswordField label="Kata sandi" name="password" autoComplete="new-password" hint="Minimal 8 karakter." value={password} onChange={setPassword} error={errors.password} />
        <PasswordField label="Ulangi kata sandi" name="confirm" autoComplete="new-password" value={confirm} onChange={setConfirm} error={errors.confirm} />

        <div>
          <label className="flex items-start gap-2.5 text-sm">
            <input
              type="checkbox"
              checked={terms}
              onChange={(e) => setTerms(e.target.checked)}
              aria-invalid={!!errors.terms}
              className="mt-0.5 h-4 w-4 accent-amber"
            />
            <span>
              Saya setuju dengan{" "}
              <a href="/syarat" className="text-amber hover:underline">syarat dan ketentuan</a> serta{" "}
              <a href="/privasi" className="text-amber hover:underline">kebijakan privasi</a>.
            </span>
          </label>
          {errors.terms && <p className="mt-1.5 text-sm text-red-300">{errors.terms}</p>}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-amber py-3 font-semibold text-ink transition-colors hover:bg-paper disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-paper"
        >
          {loading ? "Memproses…" : "Buat akun"}
        </button>
      </form>
    </>
  );
}
