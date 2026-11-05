const fieldClass =
  "mt-1 w-full rounded-lg border border-ink/20 bg-[#252240] px-3 py-2.5 text-white outline-none focus:border-amber focus:ring-2 focus:ring-amber/30";

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Cahaya proyektor */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 left-1/2 h-[28rem] w-[60rem] -translate-x-1/2 bg-[radial-gradient(ellipse_at_top,rgba(242,169,59,0.22),transparent_65%)]"
      />

      <div className="relative mx-auto max-w-6xl px-4 pb-16 pt-14 sm:px-6 sm:pt-20">
        <h1 className="max-w-3xl font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl">
          Pilih film, pilih kursi, langsung masuk.
        </h1>
        <p className="mt-5 max-w-xl text-lg text-mist">
          Cek jadwal di bioskop terdekat dan pesan tiket tanpa antre.
        </p>

        {/* Form pencarian berbentuk tiket */}
        <form
          action="/jadwal"
          className="relative mt-10 rounded-2xl bg-plum/60 p-6 text-white shadow-2xl sm:p-8"
        >
          {/* Lekukan tiket kiri-kanan */}
          <span aria-hidden className="absolute -left-3 top-1/2 hidden h-6 w-6 -translate-y-1/2 rounded-full bg-ink md:block" />
          <span aria-hidden className="absolute -right-3 top-1/2 hidden h-6 w-6 -translate-y-1/2 rounded-full bg-ink md:block" />

          <div className="grid gap-5 md:grid-cols-[1fr_1fr_1fr_auto] md:items-end">
            <label className="block text-sm font-medium">
              Kota
              <select name="kota" defaultValue="" className={fieldClass}>
                <option value="" disabled>Pilih kota</option>
                <option>Medan</option>
                <option>Jakarta</option>
                <option>Bandung</option>
              </select>
            </label>

            <label className="block text-sm font-medium">
              Bioskop
              <select name="bioskop" defaultValue="" className={fieldClass}>
                <option value="" disabled>Pilih bioskop</option>
                <option>Semua bioskop</option>
              </select>
            </label>

            <label className="block text-sm font-medium">
              Tanggal
              <input type="date" name="tanggal" className={fieldClass} />
            </label>

            <button
              type="submit"
              className="rounded-lg bg-amber px-6 py-3 font-semibold text-black transition-colors hover:bg-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-velvet"
            >
              Cari jadwal
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
