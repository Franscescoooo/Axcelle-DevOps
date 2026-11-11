import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Poster, { posterHue } from "@/components/Poster";
import ShowtimePicker from "@/components/ShowtimePicker";
import { getMovieById } from "@/lib/movies";

type Props = { params: Promise<{ id: string }> };

export default function MovieDetailPage({ params }: Props) {
  return (
    <>
      <Navbar />
      <main>
        {/* Suspense dibutuhkan karena `params` baru diketahui saat permintaan masuk */}
        <Suspense fallback={<DetailSkeleton />}>
          <MovieDetail params={params} />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}

async function MovieDetail({ params }: Props) {
  const { id } = await params;
  const movie = await getMovieById(id);
  if (!movie) notFound();

  const hue = posterHue(movie.id);

  return (
    <>
      <title>{`${movie.title} – Eclipse`}</title>

      {/* ===== Bagian atas: poster + informasi ===== */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse at 20% 0%, hsl(${hue} 60% 32% / 0.55), transparent 60%)`,
          }}
        />

        <div className="relative mx-auto max-w-6xl px-4 pb-14 pt-8 sm:px-6">
          <Link
            href="/#film"
            className="inline-flex items-center gap-1 text-sm text-mist hover:text-paper focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber"
          >
            <span aria-hidden>←</span> Semua film
          </Link>

          <div className="mt-8 grid gap-8 md:grid-cols-[18rem_1fr] md:gap-12">
            <div className="mx-auto w-56 md:mx-0 md:w-full">
              <Poster movie={movie} className="shadow-2xl" />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <span className="rounded bg-paper px-2 py-0.5 font-semibold text-ink">
                  {movie.rating}
                </span>
                <span className="text-mist">{movie.duration}</span>
                <span aria-hidden className="text-mist/50">•</span>
                <span className="text-mist">{movie.genre.join(", ")}</span>
              </div>

              <h1 className="mt-4 font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl">
                {movie.title}
              </h1>
              {movie.tagline && <p className="mt-3 text-lg text-mist">{movie.tagline}</p>}

              {movie.score !== undefined && (
                <p className="mt-4 flex items-center gap-2 text-sm">
                  <span aria-hidden className="text-amber">★</span>
                  <span className="font-semibold">{movie.score.toFixed(1)}</span>
                  <span className="text-mist">/ 10</span>
                </p>
              )}

              <p className="mt-6 max-w-2xl leading-relaxed text-paper/90">{movie.synopsis}</p>

              <dl className="mt-8 grid max-w-2xl grid-cols-[auto_1fr] gap-x-8 gap-y-3 text-sm">
                <dt className="text-mist">Sutradara</dt>
                <dd>{movie.director}</dd>
                <dt className="text-mist">Pemeran</dt>
                <dd>{movie.cast.join(", ")}</dd>
                <dt className="text-mist">Bahasa</dt>
                <dd>{movie.language}</dd>
                <dt className="text-mist">Rilis</dt>
                <dd>{movie.releaseDate}</dd>
              </dl>

              <div className="mt-8 flex flex-wrap gap-3">
                {movie.status === "now" && (
                  <a
                    href="#jadwal"
                    className="rounded-full bg-amber px-6 py-3 font-semibold text-ink transition-colors hover:bg-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-paper"
                  >
                    Lihat jadwal tayang
                  </a>
                )}
                {movie.trailerUrl && (
                  <a
                    href={movie.trailerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full border border-white/25 px-6 py-3 font-medium transition-colors hover:border-amber hover:text-amber focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber"
                  >
                    Tonton trailer
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Jadwal tayang ===== */}
      <section id="jadwal" className="scroll-mt-20 border-t border-white/10 bg-plum/40">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <h2 className="font-display text-3xl font-bold tracking-tight">Jadwal tayang</h2>

          {movie.status === "now" && movie.schedule && movie.schedule.length > 0 ? (
            <div className="mt-6">
              <ShowtimePicker movieId={movie.id} schedule={movie.schedule} />
            </div>
          ) : (
            <p className="mt-4 max-w-xl text-mist">
              {movie.status === "soon"
                ? `Film ini belum tayang. Jadwal akan dibuka mendekati tanggal rilis, ${movie.releaseDate}.`
                : "Jadwal untuk film ini belum tersedia."}
            </p>
          )}
        </div>
      </section>
    </>
  );
}

function DetailSkeleton() {
  return (
    <div aria-hidden className="mx-auto max-w-6xl animate-pulse px-4 py-14 sm:px-6">
      <div className="grid gap-8 md:grid-cols-[18rem_1fr] md:gap-12">
        <div className="mx-auto aspect-[2/3] w-56 rounded-xl bg-plum md:mx-0 md:w-full" />
        <div className="space-y-4">
          <div className="h-5 w-48 rounded bg-white/10" />
          <div className="h-12 w-3/4 rounded bg-white/10" />
          <div className="h-5 w-1/2 rounded bg-white/5" />
          <div className="mt-6 h-24 max-w-2xl rounded bg-white/5" />
        </div>
      </div>
    </div>
  );
}
