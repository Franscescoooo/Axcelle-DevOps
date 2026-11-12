// Database -> API untuk website. Bentuk JSON sengaja disamakan dengan tipe `Movie`
// di frontend (lib/movies.ts) supaya komponen yang sudah ada tidak perlu diubah.

import express from "express";
import { pool } from "./db";

const app = express();
const IMG = "https://image.tmdb.org/t/p";

type MovieRow = {
  id: number;
  title: string;
  tagline: string | null;
  overview: string | null;
  genres: string[];
  runtime: number | null;
  certification: string | null;
  vote_average: string | null; // NUMERIC dikirim pg sebagai string
  original_language: string | null;
  poster_path: string | null;
  trailer_key: string | null;
  release_date: string | null;
  status: "now" | "soon";
  director: string | null;
  cast_members: string[];
};

const COLS = `id, title, tagline, overview, genres, runtime, certification, vote_average,
  original_language, poster_path, trailer_key, release_date::text AS release_date,
  status, director, cast_members`;

const dateFmt = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

function formatRuntime(m: number | null) {
  if (!m) return "-";
  const h = Math.floor(m / 60);
  const mm = m % 60;
  return h ? `${h}j ${String(mm).padStart(2, "0")}m` : `${mm}m`;
}

function langName(code: string | null) {
  if (!code) return "-";
  try {
    return new Intl.DisplayNames(["id"], { type: "language" }).of(code) ?? code;
  } catch {
    return code;
  }
}

function toMovie(r: MovieRow) {
  const score = Number(r.vote_average);
  return {
    id: String(r.id),
    title: r.title,
    tagline: r.tagline || undefined,
    genre: r.genres,
    duration: formatRuntime(r.runtime),
    rating: r.certification || "NR", // NR = belum ada rating usia dari TMDB
    score: score > 0 ? score : undefined,
    synopsis: r.overview || "Sinopsis belum tersedia.",
    director: r.director || "-",
    cast: r.cast_members,
    language: langName(r.original_language),
    releaseDate: r.release_date
      ? dateFmt.format(new Date(`${r.release_date}T00:00:00Z`))
      : "-",
    status: r.status,
    posterUrl: r.poster_path ? `${IMG}/w500${r.poster_path}` : undefined,
    trailerUrl: r.trailer_key ? `https://www.youtube.com/watch?v=${r.trailer_key}` : undefined,
  };
}

// Dipakai juga sebagai health check container / CD
app.get("/health", async (_req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ status: "ok" });
  } catch {
    res.status(503).json({ status: "db_down" });
  }
});

// GET /api/movies?status=now|soon
app.get("/api/movies", async (req, res) => {
  const status = req.query.status === "now" || req.query.status === "soon" ? req.query.status : null;
  const { rows } = await pool.query<MovieRow>(
    `SELECT ${COLS} FROM movies
     WHERE ($1::text IS NULL OR status = $1)
     ORDER BY release_date DESC NULLS LAST`,
    [status]
  );
  res.json(rows.map(toMovie));
});

// GET /api/movies/:id?date=YYYY-MM-DD  (default: hari ini, zona Asia/Jakarta)
app.get("/api/movies/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    res.status(404).json({ error: "NOT_FOUND" });
    return;
  }

  const { rows } = await pool.query<MovieRow>(`SELECT ${COLS} FROM movies WHERE id = $1`, [id]);
  if (rows.length === 0) {
    res.status(404).json({ error: "NOT_FOUND" });
    return;
  }

  const date =
    typeof req.query.date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(req.query.date)
      ? req.query.date
      : new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Jakarta" });

  const { rows: st } = await pool.query<{
    cinema: string;
    address: string;
    format: string;
    studio: string;
    time: string;
    price: number;
  }>(
    `SELECT c.name AS cinema, c.address, s.format, s.name AS studio,
            to_char(st.start_time AT TIME ZONE 'Asia/Jakarta', 'HH24:MI') AS time,
            st.price
     FROM showtimes st
     JOIN studios s ON s.id = st.studio_id
     JOIN cinemas c ON c.id = s.cinema_id
     WHERE st.movie_id = $1
       AND (st.start_time AT TIME ZONE 'Asia/Jakarta')::date = $2::date
     ORDER BY c.name, st.start_time`,
    [id, date]
  );

  // Kelompokkan per bioskop -> bentuk CinemaSchedule[] di frontend
  const grouped = new Map<
    string,
    { cinema: string; address: string; format: string; showtimes: { time: string; studio: string; price: number }[] }
  >();
  for (const r of st) {
    const key = `${r.cinema}|${r.format}`;
    if (!grouped.has(key)) {
      grouped.set(key, { cinema: r.cinema, address: r.address, format: r.format, showtimes: [] });
    }
    grouped.get(key)!.showtimes.push({ time: r.time, studio: r.studio, price: r.price });
  }

  res.json({ ...toMovie(rows[0]), schedule: [...grouped.values()] });
});

/* ---------- Cari jadwal (form di beranda) ---------- */

const DAYS_AHEAD = 3; // sama dengan jumlah hari jadwal yang dibuat sync-tmdb.ts
const dayLabel = new Intl.DateTimeFormat("id-ID", {
  weekday: "long",
  day: "numeric",
  month: "long",
  timeZone: "Asia/Jakarta",
});

// Tanggal YYYY-MM-DD di zona Asia/Jakarta, `offset` hari dari sekarang
function jakartaDate(offset: number) {
  return new Date(Date.now() + offset * 86_400_000).toLocaleDateString("en-CA", {
    timeZone: "Asia/Jakarta",
  });
}

function queryText(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

// Database lama (dibuat sebelum ada kolom kota) ikut diperbarui otomatis,
// jadi anggota tim tidak perlu `docker compose down -v`.
async function ensureSchema() {
  await pool.query(`ALTER TABLE cinemas ADD COLUMN IF NOT EXISTS city TEXT`);
  await pool.query(
    `UPDATE cinemas SET city = v.city
     FROM (VALUES ('Eclipse Plaza Utara', 'Medan'),
                  ('Eclipse Central', 'Jakarta'),
                  ('Eclipse Riverside', 'Bandung')) AS v(name, city)
     WHERE cinemas.name = v.name AND cinemas.city IS NULL`
  );
}

// GET /api/cinemas -> pilihan untuk form: kota, bioskop, dan tanggal yang punya jadwal
app.get("/api/cinemas", async (_req, res) => {
  const { rows } = await pool.query<{ name: string; address: string; city: string | null }>(
    `SELECT name, address, city FROM cinemas ORDER BY city NULLS LAST, name`
  );
  const cinemas = rows.map((r) => ({ name: r.name, address: r.address, city: r.city ?? "Lainnya" }));
  const cities = [...new Set(cinemas.map((c) => c.city))];
  const dates = Array.from({ length: DAYS_AHEAD }, (_, offset) => {
    const value = jakartaDate(offset);
    const label = dayLabel.format(new Date(`${value}T12:00:00+07:00`));
    return { value, offset, label: offset === 0 ? `Hari ini, ${label}` : label };
  });
  res.json({ cities, cinemas, dates });
});

// GET /api/showtimes?kota=&bioskop=&tanggal=YYYY-MM-DD
// Semua filter opsional. Jadwal yang jamnya sudah lewat tidak ditampilkan.
app.get("/api/showtimes", async (req, res) => {
  const city = queryText(req.query.kota);
  const cinema = queryText(req.query.bioskop);
  const tanggal = queryText(req.query.tanggal);
  const date = tanggal && /^\d{4}-\d{2}-\d{2}$/.test(tanggal) ? tanggal : jakartaDate(0);

  const { rows: st } = await pool.query<{
    movie_id: number;
    cinema: string;
    address: string;
    city: string | null;
    studio: string;
    format: string;
    time: string;
    price: number;
  }>(
    `SELECT st.movie_id, c.name AS cinema, c.address, c.city, s.name AS studio, s.format,
            to_char(st.start_time AT TIME ZONE 'Asia/Jakarta', 'HH24:MI') AS time,
            st.price
     FROM showtimes st
     JOIN studios s ON s.id = st.studio_id
     JOIN cinemas c ON c.id = s.cinema_id
     WHERE (st.start_time AT TIME ZONE 'Asia/Jakarta')::date = $1::date
       AND st.start_time > now()
       AND ($2::text IS NULL OR c.city = $2)
       AND ($3::text IS NULL OR c.name = $3)
     ORDER BY c.name, st.start_time`,
    [date, city, cinema]
  );

  const movieIds = [...new Set(st.map((r) => r.movie_id))];
  const { rows: movies } = movieIds.length
    ? await pool.query<MovieRow>(`SELECT ${COLS} FROM movies WHERE id = ANY($1::int[]) ORDER BY title`, [movieIds])
    : { rows: [] as MovieRow[] };

  // Kelompokkan: film -> bioskop -> jam tayang
  const results = movies.map((m) => {
    const byCinema = new Map<
      string,
      { cinema: string; address: string; city: string; showtimes: { time: string; studio: string; format: string; price: number }[] }
    >();
    for (const r of st) {
      if (r.movie_id !== m.id) continue;
      if (!byCinema.has(r.cinema)) {
        byCinema.set(r.cinema, { cinema: r.cinema, address: r.address, city: r.city ?? "Lainnya", showtimes: [] });
      }
      byCinema.get(r.cinema)!.showtimes.push({ time: r.time, studio: r.studio, format: r.format, price: r.price });
    }
    return { movie: toMovie(m), cinemas: [...byCinema.values()] };
  });

  res.json({ date, results });
});

const port = Number(process.env.PORT ?? 4000);
ensureSchema()
  .catch((err) => console.error("Gagal memperbarui skema database:", err))
  .finally(() => {
    app.listen(port, () => console.log(`Backend berjalan di http://localhost:${port}`));
  });
