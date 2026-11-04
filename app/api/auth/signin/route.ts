import { NextResponse } from "next/server";
import {
  SESSION_COOKIE,
  SESSION_LONG,
  SESSION_SHORT,
  createSessionToken,
  findUserByEmail,
  verifyPassword,
} from "@/lib/auth";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as {
    email?: unknown;
    password?: unknown;
    remember?: unknown;
  } | null;

  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body?.password === "string" ? body.password : "";
  const remember = body?.remember === true;

  if (!email || !password) {
    return NextResponse.json(
      { error: "VALIDATION", message: "Email dan kata sandi wajib diisi." },
      { status: 400 }
    );
  }

  const user = await findUserByEmail(email);
  if (!user) {
    return NextResponse.json(
      {
        error: "USER_NOT_FOUND",
        message: "Akun dengan email ini belum terdaftar. Silakan daftar terlebih dahulu.",
      },
      { status: 404 }
    );
  }

  if (!(await verifyPassword(password, user.passwordHash))) {
    return NextResponse.json(
      { error: "WRONG_PASSWORD", message: "Kata sandi salah. Coba lagi." },
      { status: 401 }
    );
  }

  const maxAge = remember ? SESSION_LONG : SESSION_SHORT;
  const res = NextResponse.json({ ok: true, user: { name: user.name, email: user.email } });
  res.cookies.set({
    name: SESSION_COOKIE,
    value: createSessionToken(user.id, maxAge),
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    ...(remember ? { maxAge } : {}), // tanpa maxAge = hilang saat browser ditutup
  });
  return res;
}
