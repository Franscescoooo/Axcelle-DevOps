import { NextResponse } from "next/server";
import { getMovieById } from "@/lib/movies";

// Proxy untuk komponen client (mis. halaman pilih kursi).
// Browser tidak bisa memanggil backend langsung (di Docker backend tidak
// dibuka ke luar), jadi browser memanggil Next.js dan Next.js yang memanggil backend.
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const movie = await getMovieById(id);
  if (!movie) {
    return NextResponse.json({ error: "NOT_FOUND" }, { status: 404, headers: { "Cache-Control": "no-store" } });
  }
  return NextResponse.json(movie, { headers: { "Cache-Control": "no-store" } });
}
