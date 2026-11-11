"use client";

import { useState } from "react";
import Link from "next/link";
import type { CinemaSchedule } from "@/lib/movies";

const days = ["Hari ini", "Besok", "Lusa"];

const rupiah = (n: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);

type Selection = { cinema: string; time: string; studio: string; price: number };

export default function ShowtimePicker({
  movieId,
  schedule,
}: {
  movieId: string;
  schedule: CinemaSchedule[];
}) {
  const [day, setDay] = useState(0);
  const [selected, setSelected] = useState<Selection | null>(null);

  function changeDay(i: number) {
    setDay(i);
    setSelected(null);
  }

  return (
    <div>
      {/* Pilihan hari */}
      <div role="tablist" aria-label="Pilih hari" className="inline-flex gap-1 rounded-full bg-ink p-1">
        {days.map((d, i) => (
          <button
            key={d}
            role="tab"
            aria-selected={day === i}
            onClick={() => changeDay(i)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-amber ${
              day === i ? "bg-amber text-ink" : "text-mist hover:text-paper"
            }`}
          >
            {d}
          </button>
        ))}
      </div>

      {/* Daftar bioskop dan jam tayang */}
      <div className="mt-6 space-y-4">
        {schedule.map((c) => (
          <div key={c.cinema} className="rounded-2xl border border-white/10 bg-ink/50 p-5">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <h3 className="font-display text-lg font-semibold">{c.cinema}</h3>
                <p className="text-sm text-mist">{c.address}</p>
              </div>
              <span className="rounded-full border border-amber/50 px-3 py-0.5 text-xs text-amber">
                {c.format}
              </span>
            </div>

            <div className="mt-4 flex flex-wrap gap-3">
              {c.showtimes.map((s) => {
                const isSelected = selected?.cinema === c.cinema && selected.time === s.time;
                return (
                  <button
                    key={s.time}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() =>
                      setSelected({ cinema: c.cinema, time: s.time, studio: s.studio, price: s.price })
                    }
                    className={`rounded-lg border px-4 py-2 text-left transition-colors focus-visible:outline-2 focus-visible:outline-amber ${
                      isSelected
                        ? "border-amber bg-amber text-ink"
                        : "border-white/20 hover:border-amber"
                    }`}
                  >
                    <span className="block font-semibold">{s.time}</span>
                    <span className={`block text-xs ${isSelected ? "text-ink/80" : "text-mist"}`}>
                      {rupiah(s.price)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Ringkasan pilihan */}
      {selected && (
        <div
          role="status"
          className="sticky bottom-4 mt-6 flex flex-col gap-3 rounded-2xl border border-amber/60 bg-plum p-4 shadow-2xl sm:flex-row sm:items-center sm:justify-between"
        >
          <p className="text-sm">
            <span className="font-semibold">{selected.cinema}</span> · {selected.studio} ·{" "}
            {days[day]}, {selected.time} · {rupiah(selected.price)}
          </p>
          <Link
            href={`/film/${movieId}/kursi?bioskop=${encodeURIComponent(selected.cinema)}&jam=${selected.time}&hari=${day}`}
            className="rounded-full bg-amber px-6 py-2.5 text-center text-sm font-semibold text-ink transition-colors hover:bg-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-paper"
          >
            Pilih kursi
          </Link>
        </div>
      )}
    </div>
  );
}
