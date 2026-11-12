// Data untuk fitur "Cari jadwal" (form di beranda + halaman /jadwal).
// Dipakai dari Server Component saja (membaca BACKEND_URL yang bukan NEXT_PUBLIC).

import type { Movie } from "@/lib/movies";

export type CinemaOption = { name: string; address: string; city: string };
export type DateOption = { value: string; offset: number; label: string };
export type SearchOptions = {
  cities: string[];
  cinemas: CinemaOption[];
  dates: DateOption[];
};

export type SearchShowtime = { time: string; studio: string; format: string; price: number };
export type SearchResult = {
  movie: Movie;
  cinemas: { cinema: string; address: string; city: string; showtimes: SearchShowtime[] }[];
};

export type SearchFilters = { kota?: string; bioskop?: string; tanggal?: string };

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:4000";

async function api<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${BACKEND_URL}${path}`, { cache: "no-store" });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null; // backend mati -> halaman tetap tampil dengan pesan kosong
  }
}

export async function getSearchOptions(): Promise<SearchOptions | null> {
  return api<SearchOptions>("/api/cinemas");
}

export async function searchShowtimes(filters: SearchFilters) {
  const qs = new URLSearchParams();
  if (filters.kota) qs.set("kota", filters.kota);
  if (filters.bioskop) qs.set("bioskop", filters.bioskop);
  if (filters.tanggal) qs.set("tanggal", filters.tanggal);
  return api<{ date: string; results: SearchResult[] }>(`/api/showtimes?${qs}`);
}
