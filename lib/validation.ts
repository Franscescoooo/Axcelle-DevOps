// Dipakai di browser (form) dan di server (API) supaya aturannya selalu sama.

export const EMAIL_RE = /^\S+@\S+\.\S+$/;
export const PHONE_RE = /^(\+62|62|0)8\d{8,11}$/;

export const normalizePhone = (v: string) => v.replace(/[\s-]/g, "");

export type SignupErrors = Partial<Record<"name" | "email" | "phone" | "password", string>>;

export type SignupData = {
  name: string;
  email: string;
  phone: string;
  password: string;
};

export function validateSignup(
  input: unknown
): { ok: true; data: SignupData } | { ok: false; errors: SignupErrors } {
  const d = (input ?? {}) as Record<string, unknown>;
  const str = (v: unknown) => (typeof v === "string" ? v : "");

  const name = str(d.name).trim();
  const email = str(d.email).trim().toLowerCase();
  const phone = normalizePhone(str(d.phone));
  const password = str(d.password);

  const errors: SignupErrors = {};
  if (name.length < 2) errors.name = "Nama lengkap wajib diisi.";
  if (!EMAIL_RE.test(email)) errors.email = "Masukkan alamat email yang valid.";
  if (!PHONE_RE.test(phone)) errors.phone = "Masukkan nomor HP Indonesia yang valid, contoh 081234567890.";
  if (password.length < 8) errors.password = "Kata sandi minimal 8 karakter.";

  if (Object.keys(errors).length) return { ok: false, errors };
  return { ok: true, data: { name, email, phone, password } };
}
