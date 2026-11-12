"use client";

import { useState } from "react";
import type { SearchFilters, SearchOptions } from "@/lib/schedule";

const fieldClass =
  "mt-1 w-full rounded-lg border border-ink/20 bg-[#252240] px-3 py-2.5 text-white outline-none focus:border-amber focus:ring-2 focus:ring-amber/30 disabled:opacity-60";

// Form "Cari jadwal". Dipakai di beranda (Hero) dan di atas hasil pencarian (/jadwal).
// options = null -> data dari backend belum/tidak tersedia, form ditampilkan nonaktif.
export default function ScheduleSearch({
  options,
  initial = {},
}: {
  options: SearchOptions | null;
  initial?: SearchFilters;
}) {
  const [kota, setKota] = useState(initial.kota ?? "");
  const [bioskop, setBioskop] = useState(initial.bioskop ?? "");
  const disabled = !options;

  const cinemas = (options?.cinemas ?? []).filter((c) => !kota || c.city === kota);
  const dates = options?.dates ?? [];
  const defaultDate = dates.some((d) => d.value === initial.tanggal) ? initial.tanggal : dates[0]?.value;

  function changeKota(next: string) {
    setKota(next);
    // Bioskop yang dipilih bukan di kota ini -> kembali ke "Semua bioskop"
    const stillValid = options?.cinemas.some((c) => c.name === bioskop && (!next || c.city === next));
    if (!stillValid) setBioskop("");
  }

  return (
    <form
      action="/jadwal"
      className="relative rounded-2xl bg-plum/60 p-6 text-white shadow-2xl sm:p-8"
    >
      {/* Lekukan tiket kiri-kanan */}
      <span aria-hidden className="absolute -left-3 top-1/2 hidden h-6 w-6 -translate-y-1/2 rounded-full bg-ink md:block" />
      <span aria-hidden className="absolute -right-3 top-1/2 hidden h-6 w-6 -translate-y-1/2 rounded-full bg-ink md:block" />

      <div className="grid gap-5 md:grid-cols-[1fr_1fr_1fr_auto] md:items-end">
        <label className="block text-sm font-medium">
          Kota
          <select
            name="kota"
            value={kota}
            onChange={(e) => changeKota(e.target.value)}
            disabled={disabled}
            className={fieldClass}
          >
            <option value="">Semua kota</option>
            {options?.cities.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </label>

        <label className="block text-sm font-medium">
          Bioskop
          <select
            name="bioskop"
            value={bioskop}
            onChange={(e) => setBioskop(e.target.value)}
            disabled={disabled}
            className={fieldClass}
          >
            <option value="">Semua bioskop</option>
            {cinemas.map((c) => (
              <option key={c.name} value={c.name}>{c.name}</option>
            ))}
          </select>
        </label>

        <label className="block text-sm font-medium">
          Tanggal
          <select
            // key: pilihan tanggal baru tiba dari server -> pakai default yang baru
            key={defaultDate ?? "none"}
            name="tanggal"
            defaultValue={defaultDate}
            disabled={disabled}
            className={fieldClass}
          >
            {dates.length === 0 && <option value="">Memuat tanggal…</option>}
            {dates.map((d) => (
              <option key={d.value} value={d.value}>{d.label}</option>
            ))}
          </select>
        </label>

        <button
          type="submit"
          disabled={disabled}
          className="rounded-lg bg-amber px-6 py-3 font-semibold text-black transition-colors hover:bg-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-velvet disabled:cursor-not-allowed disabled:opacity-60"
        >
          Cari jadwal
        </button>
      </div>
    </form>
  );
}
