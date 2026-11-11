import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getMovieById } from "@/lib/movies";
import ShowtimePicker from "@/components/ShowtimePicker";

type Props = { params: Promise<{ id: string }> };

// Dengan cacheComponents, params & fetch data harus berada di dalam <Suspense>,
// kalau tidak `next build` gagal ("Uncached data was accessed outside of <Suspense>").
export default function BookingTimePage({ params }: Props) {
  return (
    <>
      <Navbar />
      <main className="mx-auto min-h-[75vh] max-w-6xl px-4 py-10 sm:px-6">
        <Suspense fallback={<p className="text-mist">Memuat jadwal…</p>}>
          <BookingTime params={params} />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}

async function BookingTime({ params }: Props) {
  const { id } = await params;
  const movie = await getMovieById(id);
  if (!movie) notFound();

  return (
    <>
      <Link href={`/film/${id}`} className="text-sm text-mist hover:text-amber">
        ← Kembali ke detail film
      </Link>
      <div className="mt-6">
        <p className="text-xs font-semibold uppercase tracking-[.25em] text-amber">Tahap 1 dari 4</p>
        <h1 className="mt-2 font-display text-3xl font-bold">Pilih jadwal tayang</h1>
        <p className="mt-2 text-mist">
          {movie.title} · {movie.duration} · {movie.rating}
        </p>
      </div>
      {movie.schedule?.length ? (
        <div className="mt-8">
          <ShowtimePicker movieId={movie.id} schedule={movie.schedule} />
        </div>
      ) : (
        <div className="mt-8 rounded-2xl border border-white/10 bg-plum p-6 text-mist">
          Jadwal belum tersedia untuk film ini.
        </div>
      )}
    </>
  );
}
