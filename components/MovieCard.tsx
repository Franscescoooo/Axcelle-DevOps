import Link from "next/link";

export type Movie = {
  id: string;
  title: string;
  genre: string;
  duration: string; // contoh: "2j 15m"
  rating: string; // contoh: "13+"
  posterUrl?: string;
};

export function MovieCard({ movie }: { movie: Movie }) {
  return (
    <Link
      href={`/film/${movie.id}`}
      className="group block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber"
    >
      <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-plum">
        {movie.posterUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={movie.posterUrl}
            alt={`Poster ${movie.title}`}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        )}
        <span className="absolute left-2 top-2 rounded bg-ink/80 px-2 py-0.5 text-xs font-semibold">
          {movie.rating}
        </span>
      </div>
      <h3 className="mt-3 font-display text-lg font-semibold leading-tight">
        {movie.title}
      </h3>
      <p className="text-sm text-mist">
        {movie.genre} · {movie.duration}
      </p>
    </Link>
  );
}

// Kerangka kosong saat belum ada data film
export function MovieCardPlaceholder() {
  return (
    <div aria-hidden>
      <div className="flex aspect-[2/3] items-center justify-center rounded-xl border-2 border-dashed border-white/15 bg-plum/50 text-sm text-mist/60">
        Poster film
      </div>
      <div className="mt-3 h-5 w-3/4 rounded bg-white/10" />
      <div className="mt-2 h-4 w-1/2 rounded bg-white/5" />
    </div>
  );
}
