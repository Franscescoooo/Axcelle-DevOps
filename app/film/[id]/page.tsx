import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Halaman detail film — MOCKUP UI/UX (belum pakai data).
// Semua isi di bawah adalah placeholder statis. Nanti tinggal diganti
// dengan data film berdasarkan `params.id` (mis. dari database / API).

const genres = ["Aksi", "Petualangan", "Sci-Fi"];

const detail = [
  { label: "Sutradara", value: "Nama Sutradara" },
  { label: "Pemeran", value: "Aktor A, Aktor B, Aktor C" },
  { label: "Bahasa", value: "Inggris" },
  { label: "Subtitle", value: "Indonesia" },
  { label: "Format", value: "2D · 3D · IMAX" },
  { label: "Tanggal rilis", value: "1 Januari 2026" },
];

// Jadwal contoh (statis, hanya untuk tampilan)
const dates = [
  { day: "Sen", date: "5" },
  { day: "Sel", date: "6" },
  { day: "Rab", date: "7" },
  { day: "Kam", date: "8" },
  { day: "Jum", date: "9" },
  { day: "Sab", date: "10" },
  { day: "Min", date: "11" },
];

const cinemas = [
  { name: "Eclipse Sun Plaza", area: "Medan Kota", times: ["12:30", "15:10", "18:00", "20:45"] },
  { name: "Eclipse Centre Point", area: "Medan Timur", times: ["13:00", "16:20", "19:30"] },
  { name: "Eclipse Plaza Medan Fair", area: "Medan Petisah", times: ["11:45", "14:30", "17:15", "21:00"] },
];

export default async function MovieDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // id tersedia untuk pengambilan data nanti; belum dipakai di mockup.
  await params;

  return (
    <>
      <Navbar />

      <main>
        {/* ---------- Backdrop + info utama ---------- */}
        <section className="relative">
          {/* Area backdrop (placeholder) */}
          <div
            aria-hidden
            className="absolute inset-0 h-104 overflow-hidden sm:h-120"
          >
            <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-plum via-ink to-ink text-sm text-mist/40">
              Gambar backdrop
            </div>
            {/* Gradien agar menyatu ke latar */}
            <div className="absolute inset-0 bg-linear-to-t from-ink via-ink/70 to-transparent" />
          </div>

          <div className="relative mx-auto max-w-6xl px-4 pb-14 pt-40 sm:px-6 sm:pt-56">
            <div className="flex flex-col gap-8 sm:flex-row sm:items-end">
              {/* Poster (placeholder) */}
              <div className="w-40 shrink-0 sm:w-56">
                <div className="flex aspect-2/3 items-center justify-center rounded-xl border-2 border-dashed border-white/15 bg-plum/70 text-sm text-mist/60 shadow-2xl">
                  Poster film
                </div>
              </div>

              {/* Judul & meta */}
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded bg-ink/80 px-2 py-0.5 text-xs font-semibold ring-1 ring-white/15">
                    13+
                  </span>
                  <span className="flex items-center gap-1 rounded bg-amber/15 px-2 py-0.5 text-xs font-semibold text-amber">
                    ★ 8.4
                  </span>
                  <span className="text-xs text-mist">2026</span>
                  <span className="text-xs text-mist">·</span>
                  <span className="text-xs text-mist">2j 15m</span>
                </div>

                <h1 className="mt-3 font-display text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
                  Judul Film
                </h1>

                <div className="mt-4 flex flex-wrap gap-2">
                  {genres.map((g) => (
                    <span
                      key={g}
                      className="rounded-full border border-white/15 px-3 py-1 text-xs text-mist"
                    >
                      {g}
                    </span>
                  ))}
                </div>

                <p className="mt-5 max-w-2xl text-sm leading-relaxed text-mist">
                  Sinopsis singkat film akan tampil di sini. Teks ini hanya
                  contoh untuk mengisi tata letak sampai data asli tersedia —
                  menjelaskan premis cerita, tokoh utama, dan konflik yang
                  mereka hadapi dalam beberapa kalimat yang menggugah.
                </p>

                <div className="mt-7 flex flex-wrap items-center gap-3">
                  <a
                    href="#jadwal"
                    className="rounded-full bg-amber px-7 py-3 text-sm font-semibold text-ink transition-colors hover:bg-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-paper"
                  >
                    Pesan tiket
                  </a>
                  <button
                    type="button"
                    className="flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm font-medium text-paper transition-colors hover:border-white/40 focus-visible:outline-2 focus-visible:outline-amber"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                      <path d="M8 5v14l11-7z" />
                    </svg>
                    Tonton trailer
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ---------- Detail film ---------- */}
        <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <h2 className="font-display text-2xl font-bold tracking-tight">
            Tentang film
          </h2>
          <dl className="mt-6 grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
            {detail.map((d) => (
              <div key={d.label} className="border-b border-white/10 pb-4">
                <dt className="text-xs uppercase tracking-wide text-mist/70">
                  {d.label}
                </dt>
                <dd className="mt-1 text-sm text-paper">{d.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* ---------- Jadwal / pilih waktu ---------- */}
        <section
          id="jadwal"
          className="mx-auto max-w-6xl scroll-mt-20 px-4 pb-20 sm:px-6"
        >
          <h2 className="font-display text-2xl font-bold tracking-tight">
            Jadwal tayang
          </h2>

          {/* Pilih tanggal */}
          <div className="mt-6 flex gap-2 overflow-x-auto pb-2">
            {dates.map((d, i) => (
              <button
                key={d.date}
                type="button"
                aria-pressed={i === 0}
                className={`flex shrink-0 flex-col items-center rounded-xl px-4 py-2.5 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-amber ${
                  i === 0
                    ? "bg-amber text-ink"
                    : "bg-plum text-mist hover:text-paper"
                }`}
              >
                <span className="text-xs">{d.day}</span>
                <span className="font-display text-lg font-semibold">
                  {d.date}
                </span>
              </button>
            ))}
          </div>

          {/* Daftar bioskop + jam */}
          <div className="mt-6 space-y-4">
            {cinemas.map((c) => (
              <div
                key={c.name}
                className="rounded-2xl border border-white/10 bg-plum/50 p-5 sm:p-6"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="font-display text-lg font-semibold">
                    {c.name}
                  </h3>
                  <span className="text-xs text-mist">{c.area}</span>
                </div>
                <div className="mt-4 flex flex-wrap gap-2.5">
                  {c.times.map((t) => (
                    <button
                      key={t}
                      type="button"
                      className="rounded-lg border border-white/15 bg-ink/40 px-4 py-2 text-sm font-medium tabular-nums text-paper transition-colors hover:border-amber hover:text-amber focus-visible:outline-2 focus-visible:outline-amber"
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <p className="mt-6 text-xs text-mist/60">
            * Tampilan jadwal ini masih contoh statis (mockup). Nanti diisi dari
            data bioskop &amp; jam tayang sebenarnya.
          </p>
        </section>
      </main>

      <Footer />
    </>
  );
}
