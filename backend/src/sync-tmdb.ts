// TMDB -> Database. Jalankan: npm run sync
// Aman dijalankan berulang kali (UPSERT berdasarkan tmdb_id).

import { pool } from "./db";

const API = "https://api.themoviedb.org/3";
const KEY = process.env.TMDB_API_KEY;
const LIMIT = Number(process.env.SYNC_LIMIT ?? 10); // jumlah film per kategori

type TmdbDetail = {
  id: number;
  title: string;
  original_title?: string;
  tagline?: string;
  overview?: string;
  genres?: { name: string }[];
  runtime?: number | null;
  vote_average?: number;
  original_language?: string;
  poster_path?: string | null;
  backdrop_path?: string | null;
  release_date?: string;
  credits?: { cast?: { name: string }[]; crew?: { job: string; name: string }[] };
  videos?: { results?: { key: string; site: string; type: string; official?: boolean }[] };
  release_dates?: {
    results?: { iso_3166_1: string; release_dates: { certification: string }[] }[];
  };
};

async function tmdb<T>(path: string, params: Record<string, string> = {}): Promise<T> {
  const url = new URL(API + path);
  url.searchParams.set("api_key", KEY as string);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`TMDB ${path} gagal: HTTP ${res.status}`);
  return (await res.json()) as T;
}

async function listIds(kind: "now_playing" | "upcoming"): Promise<number[]> {
  const data = await tmdb<{ results: { id: number }[] }>(`/movie/${kind}`, {
    region: "ID",
    language: "id-ID",
  });
  return data.results.slice(0, LIMIT).map((m) => m.id);
}

async function getDetail(id: number): Promise<TmdbDetail> {
  const d = await tmdb<TmdbDetail>(`/movie/${id}`, {
    language: "id-ID",
    append_to_response: "credits,videos,release_dates",
    include_video_language: "id,en,null",
  });
  // Cadangan bahasa Inggris jika: (1) belum ada sinopsis bahasa Indonesia, atau
  // (2) judul belum diterjemahkan dan masih memakai aksara asli (Jepang, Hindi, Korea, dll).
  const untranslatedTitle =
    d.title === d.original_title && !["id", "en"].includes(d.original_language ?? "");
  if (!d.overview || untranslatedTitle) {
    const en = await tmdb<TmdbDetail>(`/movie/${id}`, { language: "en-US" });
    d.overview = d.overview || en.overview;
    d.tagline = d.tagline || en.tagline;
    if (untranslatedTitle) d.title = en.title;
  }
  return d;
}

async function upsertMovie(d: TmdbDetail, status: "now" | "soon"): Promise<number> {
  const director = d.credits?.crew?.find((c) => c.job === "Director")?.name ?? null;
  const cast = (d.credits?.cast ?? []).slice(0, 5).map((c) => c.name);

  const cert =
    d.release_dates?.results
      ?.find((r) => r.iso_3166_1 === "ID")
      ?.release_dates.map((x) => x.certification)
      .find(Boolean) ?? null;

  const yt = (d.videos?.results ?? []).filter((v) => v.site === "YouTube");
  const trailer =
    yt.find((v) => v.type === "Trailer" && v.official) ??
    yt.find((v) => v.type === "Trailer") ??
    yt[0];

  const { rows } = await pool.query<{ id: number }>(
    `INSERT INTO movies
       (tmdb_id, title, tagline, overview, genres, runtime, certification, vote_average,
        original_language, poster_path, backdrop_path, trailer_key, release_date,
        status, director, cast_members, synced_at)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16::jsonb, now())
     ON CONFLICT (tmdb_id) DO UPDATE SET
       title = EXCLUDED.title, tagline = EXCLUDED.tagline, overview = EXCLUDED.overview,
       genres = EXCLUDED.genres, runtime = EXCLUDED.runtime,
       certification = EXCLUDED.certification, vote_average = EXCLUDED.vote_average,
       original_language = EXCLUDED.original_language, poster_path = EXCLUDED.poster_path,
       backdrop_path = EXCLUDED.backdrop_path, trailer_key = EXCLUDED.trailer_key,
       release_date = EXCLUDED.release_date, status = EXCLUDED.status,
       director = EXCLUDED.director, cast_members = EXCLUDED.cast_members, synced_at = now()
     RETURNING id`,
    [
      d.id,
      d.title,
      d.tagline || null,
      d.overview || null,
      (d.genres ?? []).map((g) => g.name),
      d.runtime || null,
      cert,
      d.vote_average ?? null,
      d.original_language ?? null,
      d.poster_path ?? null,
      d.backdrop_path ?? null,
      trailer?.key ?? null,
      d.release_date || null,
      status,
      director,
      JSON.stringify(cast),
    ]
  );
  return rows[0].id;
}

/* ---------- Jadwal tayang (dibuat sendiri, TMDB tidak punya data ini) ---------- */

const SLOTS = ["12:15", "14:45", "17:20", "19:50"];
const DAYS = 3; // hari ini, besok, lusa

const jakartaDate = (offset: number) =>
  new Date(Date.now() + offset * 86_400_000).toLocaleDateString("en-CA", {
    timeZone: "Asia/Jakarta",
  }); // format YYYY-MM-DD

// Setiap (studio, jam, hari) diisi satu film secara bergilir, jadi tidak ada jadwal bentrok.
async function seedShowtimes(movieIds: number[]) {
  if (movieIds.length === 0) return;
  const { rows: studios } = await pool.query<{ id: number; base_price: number }>(
    "SELECT id, base_price FROM studios ORDER BY id"
  );

  let created = 0;
  for (let day = 0; day < DAYS; day++) {
    const date = jakartaDate(day);
    for (let si = 0; si < studios.length; si++) {
      for (let ti = 0; ti < SLOTS.length; ti++) {
        const movieId = movieIds[(si * SLOTS.length + ti + day) % movieIds.length];
        const start = new Date(`${date}T${SLOTS[ti]}:00+07:00`);
        const price = studios[si].base_price + (ti >= 2 ? 10000 : 0);
        const r = await pool.query(
          `INSERT INTO showtimes (movie_id, studio_id, start_time, price)
           VALUES ($1,$2,$3,$4) ON CONFLICT (studio_id, start_time) DO NOTHING`,
          [movieId, studios[si].id, start, price]
        );
        created += r.rowCount ?? 0;
      }
    }
  }
  console.log(`Jadwal baru dibuat: ${created}`);
}

async function main() {
  if (!KEY) throw new Error("TMDB_API_KEY belum diisi di .env");

  const nowIds = await listIds("now_playing");
  const soonIds = (await listIds("upcoming")).filter((id) => !nowIds.includes(id));

  const nowDbIds: number[] = [];
  for (const id of nowIds) {
    const d = await getDetail(id);
    nowDbIds.push(await upsertMovie(d, "now"));
    console.log(`[now]  ${d.title}`);
  }
  for (const id of soonIds) {
    const d = await getDetail(id);
    await upsertMovie(d, "soon");
    console.log(`[soon] ${d.title}`);
  }

  await seedShowtimes(nowDbIds);
  await pool.end();
  console.log("Sinkronisasi selesai.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
