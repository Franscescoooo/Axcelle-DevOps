import { Suspense } from "react";
import ScheduleSearch from "@/components/ScheduleSearch";
import { getSearchOptions } from "@/lib/schedule";

// Pilihan kota/bioskop/tanggal diambil dari backend saat permintaan masuk,
// jadi harus berada di dalam <Suspense> (aturan cacheComponents).
async function HeroSearch() {
  const options = await getSearchOptions();
  return <ScheduleSearch options={options} />;
}

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
        <div className="mt-10">
          <Suspense fallback={<ScheduleSearch options={null} />}>
            <HeroSearch />
          </Suspense>
        </div>
      </div>
    </section>
  );
}
