"use client";

import { useState } from "react";
import type { Movie } from "@/lib/movies";
import { MovieCard, MovieCardPlaceholder } from "./MovieCard";

type Props = {
  nowShowing: Movie[];
  comingSoon: Movie[];
};

const tabs = [
  { id: "now", label: "Sedang tayang" },
  { id: "soon", label: "Segera hadir" },
] as const;

export default function MovieSection({ nowShowing, comingSoon }: Props) {
  const [tab, setTab] = useState<(typeof tabs)[number]["id"]>("now");
  const movies = tab === "now" ? nowShowing : comingSoon;

  return (
    <section id="film" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-14 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
          Film di bioskop
        </h2>

        <div role="tablist" aria-label="Kategori film" className="flex gap-1 rounded-full bg-plum p-1">
          {tabs.map((t) => (
            <button
              key={t.id}
              role="tab"
              aria-selected={tab === t.id}
              onClick={() => setTab(t.id)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-amber ${
                tab === t.id ? "bg-amber text-ink" : "text-mist hover:text-paper"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-5">
        {movies.length > 0
          ? movies.map((m) => <MovieCard key={m.id} movie={m} />)
          : Array.from({ length: 5 }).map((_, i) => <MovieCardPlaceholder key={i} />)}
      </div>

      {movies.length === 0 && (
        <p className="mt-8 text-mist">
          Belum ada film di daftar ini. Tambahkan data film di{" "}
          <code className="rounded bg-plum px-1.5 py-0.5 text-sm text-paper">lib/movies.ts</code>{" "}
          dan kartu film akan muncul di sini.
        </p>
      )}
    </section>
  );
}
