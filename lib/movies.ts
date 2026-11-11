// Sumber data film: sekarang diambil dari Backend (yang membaca database).
// Tipe di bawah sama dengan sebelumnya, jadi komponen lain tidak perlu diubah.
// Dipakai dari Server Component saja (membaca BACKEND_URL yang bukan NEXT_PUBLIC).

export type Showtime = {
  time: string; // contoh: "19:30"
  studio: string; // contoh: "Studio 2"
  price: number; // dalam rupiah
};

export type CinemaSchedule = {
  cinema: string;
  address: string;
  format: string; // contoh: "Reguler 2D", "Premiere"
  showtimes: Showtime[];
};

export type Movie = {
  id: string; // dipakai di alamat: /film/{id}
  title: string;
  tagline?: string;
  genre: string[];
  duration: string; // contoh: "1j 52m"
  rating: string; // contoh: "13+"
  score?: number; // 0 - 10
  synopsis: string;
  director: string;
  cast: string[];
  language: string;
  releaseDate: string; // teks tampilan, contoh: "6 November 2026"
  status: "now" | "soon";
  posterUrl?: string;
  trailerUrl?: string;
  schedule?: CinemaSchedule[];
};

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:4000";

async function api<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${BACKEND_URL}${path}`, { cache: "no-store" });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null; // backend mati -> halaman tetap tampil (tanpa film)
  }
}

export async function getNowShowing(): Promise<Movie[]> {
  return (await api<Movie[]>("/api/movies?status=now")) ?? [];
}

export async function getComingSoon(): Promise<Movie[]> {
  return (await api<Movie[]>("/api/movies?status=soon")) ?? [];
}

export async function getMovieById(id: string): Promise<Movie | null> {
  return api<Movie>(`/api/movies/${encodeURIComponent(id)}`);
}
