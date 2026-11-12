import { Suspense } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Poster from "@/components/Poster";
import ScheduleSearch from "@/components/ScheduleSearch";
import { getSearchOptions, searchShowtimes, type SearchFilters } from "@/lib/schedule";

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

const rupiah = (n: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);

const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) || undefined;

// searchParams & data backend hanya ada saat permintaan masuk -> harus di dalam <Suspense>
export default function JadwalPage({ searchParams }: Props) {
  return (
    <>
      <Navbar />
      <main className="mx-auto min-h-[75vh] max-w-6xl px-4 py-10 sm:px-6">
        <Link href="/" className="text-sm text-mist hover:text-amber">
          ← Beranda
        </Link>
        <div className="mt-6">
          <p className="text-xs font-semibold uppercase tracking-[.25em] text-amber">Cari jadwal</p>
          <h1 className="mt-2 font-display text-3xl font-bold">Jadwal tayang</h1>
          <p className="mt-2 text-mist">Pilih jam tayang untuk langsung memilih kursi.</p>
        </div>
        <Suspense fallback={<p className="mt-8 text-mist">Mencari jadwal…</p>}>
          <Results searchParams={searchParams} />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}

async function Results({ searchParams }: Props) {
  const sp = await searchParams;
  const filters: SearchFilters = {
    kota: first(sp.kota),
    bioskop: first(sp.bioskop),
    tanggal: first(sp.tanggal),
  };
  const [options, data] = await Promise.all([getSearchOptions(), searchShowtimes(filters)]);

  // "hari" untuk halaman kursi = selisih hari dari hari ini (0 = hari ini)
  const day = options?.dates.find((d) => d.value === data?.date);
  const summary = [day?.label, filters.kota, filters.bioskop].filter(Boolean).join(" · ");

  return (
    <>
      <div className="mt-8">
        <ScheduleSearch options={options} initial={{ ...filters, tanggal: data?.date ?? filters.tanggal }} />
      </div>

      {!data ? (
        <div className="mt-8 rounded-2xl border border-white/10 bg-plum p-6 text-mist">
          Jadwal tidak bisa dimuat. Pastikan backend sudah berjalan, lalu coba lagi.
        </div>
      ) : data.results.length === 0 ? (
        <div className="mt-8 rounded-3xl border border-dashed border-white/20 bg-plum/40 px-6 py-14 text-center">
          <h2 className="font-display text-xl font-bold">Tidak ada jadwal</h2>
          <p className="mt-2 text-sm text-mist">
            Belum ada jam tayang untuk {summary || "pilihan ini"}. Coba ganti kota, bioskop, atau tanggal.
          </p>
        </div>
      ) : (
        <>
          <p className="mt-8 text-sm text-mist">
            {data.results.length} film ditemukan{summary ? ` · ${summary}` : ""}
          </p>
          <div className="mt-4 space-y-5">
            {data.results.map(({ movie, cinemas }) => (
              <article key={movie.id} className="flex flex-col gap-5 rounded-3xl border border-white/10 bg-plum p-5 sm:flex-row">
                <Link href={`/film/${movie.id}`} className="group w-24 shrink-0 sm:w-28">
                  <Poster movie={movie} />
                </Link>
                <div className="min-w-0 flex-1">
                  <Link href={`/film/${movie.id}`} className="hover:text-amber">
                    <h2 className="font-display text-xl font-bold">{movie.title}</h2>
                  </Link>
                  <p className="mt-1 text-sm text-mist">
                    {movie.genre.join(", ")} · {movie.duration} · {movie.rating}
                  </p>

                  <div className="mt-4 space-y-4">
                    {cinemas.map((c) => (
                      <div key={c.cinema}>
                        <p className="text-sm font-semibold">{c.cinema}</p>
                        <p className="text-xs text-mist">{c.city} · {c.address}</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {c.showtimes.map((s) => {
                            const qs = new URLSearchParams({
                              bioskop: c.cinema,
                              jam: s.time,
                              hari: String(day?.offset ?? 0),
                              studio: s.studio,
                              harga: String(s.price),
                            });
                            return (
                              <Link
                                key={`${s.studio}-${s.time}`}
                                href={`/film/${movie.id}/kursi?${qs}`}
                                className="rounded-xl border border-white/15 px-3 py-2 text-center transition hover:border-amber hover:text-amber"
                              >
                                <span className="block font-semibold">{s.time}</span>
                                <span className="block text-[11px] text-mist">
                                  {s.format} · {rupiah(s.price)}
                                </span>
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </>
      )}
    </>
  );
}
