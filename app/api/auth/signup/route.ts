import { NextResponse } from "next/server";
import { createUser } from "@/lib/auth";
import { validateSignup } from "@/lib/validation";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);

  const result = validateSignup(body);
  if (!result.ok) {
    return NextResponse.json({ error: "VALIDATION", fields: result.errors }, { status: 400 });
  }

  const user = await createUser(result.data);
  if (!user) {
    return NextResponse.json(
      { error: "EMAIL_TAKEN", message: "Email ini sudah terdaftar. Silakan masuk." },
      { status: 409 }
    );
  }

  // Sengaja TIDAK membuat sesi: setelah daftar, pengguna harus masuk ulang.
  return NextResponse.json({ ok: true }, { status: 201 });
}
