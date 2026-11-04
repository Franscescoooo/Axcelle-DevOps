import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { SESSION_COOKIE, findUserById, verifySessionToken } from "@/lib/auth";

export async function GET() {
  // cookies() dipanggil lebih dulu supaya route ini dianggap dinamis
  // (penting untuk Next.js 16 dengan Cache Components).
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  const userId = token ? verifySessionToken(token) : null;
  const user = userId ? await findUserById(userId) : null;

  return NextResponse.json(
    { user: user ? { name: user.name, email: user.email } : null },
    { headers: { "Cache-Control": "no-store" } }
  );
}
