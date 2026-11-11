import type { Movie } from "@/lib/movies";

// Menghasilkan warna (hue) yang tetap untuk tiap film, dari id-nya.
export function posterHue(id: string) {
  return [...id].reduce((acc, ch) => (acc * 31 + ch.charCodeAt(0)) >>> 0, 7) % 360;
}

type Props = {
  movie: Pick<Movie, "id" | "title" | "posterUrl">;
  className?: string;
};

// Jika film punya posterUrl -> tampilkan gambar. Jika tidak -> poster gradasi berisi judul.
export default function Poster({ movie, className = "" }: Props) {
  const hue = posterHue(movie.id);

  return (
    <div className={`relative aspect-[2/3] overflow-hidden rounded-xl bg-plum ${className}`}>
      {movie.posterUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={movie.posterUrl}
          alt={`Poster ${movie.title}`}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      ) : (
        <div
          aria-hidden
          className="flex h-full w-full items-end p-4 transition-transform duration-300 group-hover:scale-105"
          style={{
            background: `linear-gradient(160deg, hsl(${hue} 55% 34%), hsl(${(hue + 40) % 360} 60% 14%))`,
          }}
        >
          <span className="font-display text-2xl font-bold leading-tight text-white/90">
            {movie.title}
          </span>
        </div>
      )}
    </div>
  );
}
