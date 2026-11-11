-- Skema awal: film (dari TMDB) + bioskop/studio/jadwal (data milik sendiri)

CREATE TABLE IF NOT EXISTS movies (
  id                SERIAL PRIMARY KEY,
  tmdb_id           INTEGER UNIQUE NOT NULL,      -- kunci untuk UPSERT dari TMDB
  title             TEXT NOT NULL,
  tagline           TEXT,
  overview          TEXT,
  genres            TEXT[] NOT NULL DEFAULT '{}',
  runtime           INTEGER,                      -- menit
  certification     TEXT,                         -- rating usia (sering kosong untuk ID)
  vote_average      NUMERIC(3,1),
  original_language TEXT,
  poster_path       TEXT,                         -- hanya path, gambar diambil dari CDN TMDB
  backdrop_path     TEXT,
  trailer_key       TEXT,                         -- key video YouTube
  release_date      DATE,
  status            TEXT NOT NULL CHECK (status IN ('now', 'soon')),
  director          TEXT,
  cast_members      JSONB NOT NULL DEFAULT '[]',
  synced_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS cinemas (
  id      SERIAL PRIMARY KEY,
  name    TEXT UNIQUE NOT NULL,
  address TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS studios (
  id         SERIAL PRIMARY KEY,
  cinema_id  INTEGER NOT NULL REFERENCES cinemas(id),
  name       TEXT NOT NULL,
  format     TEXT NOT NULL,                       -- Reguler 2D, Premiere, dst.
  base_price INTEGER NOT NULL,
  UNIQUE (cinema_id, name)
);

CREATE TABLE IF NOT EXISTS showtimes (
  id         SERIAL PRIMARY KEY,
  movie_id   INTEGER NOT NULL REFERENCES movies(id) ON DELETE CASCADE,
  studio_id  INTEGER NOT NULL REFERENCES studios(id),
  start_time TIMESTAMPTZ NOT NULL,
  price      INTEGER NOT NULL,
  UNIQUE (studio_id, start_time)                  -- satu studio tidak bisa dobel jadwal
);

-- Data bioskop contoh (sama dengan data dummy di lib/movies.ts)
INSERT INTO cinemas (name, address) VALUES
  ('Eclipse Plaza Utara', 'Lantai 3, Jl. Contoh No. 1'),
  ('Eclipse Central',     'Lantai 5, Jl. Contoh No. 2'),
  ('Eclipse Riverside',   'Lantai 2, Jl. Contoh No. 3')
ON CONFLICT (name) DO NOTHING;

INSERT INTO studios (cinema_id, name, format, base_price)
SELECT c.id, v.name, v.format, v.price
FROM (VALUES
  ('Eclipse Plaza Utara', 'Studio 1',   'Reguler 2D', 40000),
  ('Eclipse Plaza Utara', 'Studio 2',   'Reguler 2D', 50000),
  ('Eclipse Central',     'Premiere 1', 'Premiere',   90000),
  ('Eclipse Riverside',   'Studio 3',   'Reguler 2D', 40000)
) AS v(cinema, name, format, price)
JOIN cinemas c ON c.name = v.cinema
ON CONFLICT (cinema_id, name) DO NOTHING;
