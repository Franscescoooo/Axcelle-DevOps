"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import type { Movie } from "@/lib/movies";
import { rupiah } from "@/lib/booking-storage";

type SelectedShow = { cinema: string; time: string; studio: string; price: number };
const rows = ["A", "B", "C", "D", "E", "F"];
const taken = ["A4", "A5", "B3", "C7", "D2", "D3", "E6", "F5"];

export default function BookingSeatPage() {
  return (
    <Suspense fallback={<main className="mx-auto min-h-[75vh] max-w-6xl px-4 py-10 text-mist">Memuat halaman pemilihan kursi...</main>}>
      <BookingSeatContent />
    </Suspense>
  );
}

function BookingSeatContent() {
  const params = useParams<{ id: string }>();
  const query = useSearchParams();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [seats, setSeats] = useState<string[]>([]);
  const cinema = query.get("bioskop") || "Eclipse Plaza Utara";
  const time = query.get("jam") || "19:30";
  const day = Number(query.get("hari") || 0);
  // Dari halaman /jadwal studio & harga ikut dikirim (jadwal besok/lusa bisa beda studio dengan hari ini)
  const studioParam = query.get("studio");
  const priceParam = Number(query.get("harga")) || 0;
  const show = useMemo<SelectedShow>(() => {
    const matching = movie?.schedule?.find((s) => s.cinema === cinema)?.showtimes.find((s) => s.time === time);
    return { cinema, time, studio: studioParam || matching?.studio || "Studio 1", price: priceParam || matching?.price || 50000 };
  }, [movie, cinema, time, studioParam, priceParam]);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/movies/${encodeURIComponent(params.id)}`, { cache: "no-store" })
      .then((r) => (r.ok ? (r.json() as Promise<Movie>) : null))
      .then((m) => { if (!cancelled) setMovie(m); })
      .catch(() => { if (!cancelled) setMovie(null); });
    return () => { cancelled = true; };
  }, [params.id]);
  const date = new Date(); date.setDate(date.getDate() + day);
  const dateLabel = new Intl.DateTimeFormat("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(date);
  const total = seats.length * show.price;

  function toggleSeat(seat: string) {
    if (taken.includes(seat)) return;
    setSeats((current) => current.includes(seat) ? current.filter((s) => s !== seat) : current.length < 6 ? [...current, seat] : current);
  }

  function continueBooking() {
    if (!movie || seats.length === 0) return;
    const draft = { id: `ECL-${Date.now()}`, movieId: movie.id, movieTitle: movie.title, posterUrl: movie.posterUrl, cinema: show.cinema, studio: show.studio, dateLabel, showDate: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`, time: show.time, seats, price: show.price, paymentMethod: "QRIS", status: "pending" as const, createdAt: new Date().toISOString() };
    localStorage.setItem("eclipse_booking_draft", JSON.stringify(draft));
    window.location.href = "/booking/konfirmasi";
  }

  return <><Navbar /><main className="mx-auto min-h-[75vh] w-full max-w-6xl px-4 py-10 sm:px-6">
    <Link href={`/film/${params.id}`} className="text-sm text-mist hover:text-amber">← Kembali ke detail film</Link>
    <div className="mt-5 flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-[.25em] text-amber">Tahap 2 dari 4</p><h1 className="mt-2 font-display text-3xl font-bold">Pilih kursi</h1><p className="mt-2 text-mist">{movie?.title || "Memuat film..."} · {show.cinema} · {show.studio} · {dateLabel}, {show.time}</p></div><span className="rounded-full border border-white/15 px-4 py-2 text-sm text-mist">Maks. 6 kursi</span></div>
    <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]"><section className="rounded-3xl border border-white/10 bg-plum/60 p-5 sm:p-8"><div className="mx-auto mb-12 max-w-xl"><div className="h-2 rounded-full bg-gradient-to-r from-transparent via-amber to-transparent shadow-[0_8px_28px_#f2a93b55]"/><p className="mt-3 text-center text-xs tracking-[.35em] text-mist">LAYAR BIOSKOP</p></div><div className="mx-auto max-w-md space-y-3">{rows.map((row) => <div key={row} className="grid grid-cols-8 gap-2 sm:gap-3">{Array.from({ length: 8 }, (_, i) => { const seat = `${row}${i + 1}`; const isTaken = taken.includes(seat); const active = seats.includes(seat); return <button key={seat} disabled={isTaken} onClick={() => toggleSeat(seat)} aria-label={`Kursi ${seat}${isTaken ? " sudah terisi" : ""}`} className={`aspect-square rounded-t-lg rounded-b-md border text-xs font-semibold transition ${isTaken ? "cursor-not-allowed border-white/5 bg-white/10 text-white/20" : active ? "border-amber bg-amber text-ink shadow-lg shadow-amber/20" : "border-white/20 bg-ink text-mist hover:border-amber hover:text-amber"}`}>{seat}</button>; })}</div>)}</div><div className="mt-8 flex flex-wrap justify-center gap-5 text-xs text-mist"><span className="flex items-center gap-2"><i className="h-3 w-3 rounded border border-white/20 bg-ink"/> Tersedia</span><span className="flex items-center gap-2"><i className="h-3 w-3 rounded bg-amber"/> Dipilih</span><span className="flex items-center gap-2"><i className="h-3 w-3 rounded bg-white/10"/> Terisi</span></div></section>
    <aside className="h-fit rounded-3xl border border-white/10 bg-plum p-6"><p className="text-xs font-semibold uppercase tracking-[.2em] text-amber">Ringkasan kursi</p><h2 className="mt-3 font-display text-xl font-bold">{movie?.title || "Film"}</h2><p className="mt-2 text-sm text-mist">{show.cinema}<br/>{show.studio} · {dateLabel}<br/>Pukul {show.time}</p><div className="my-5 border-t border-white/10"/><div className="flex justify-between text-sm"><span className="text-mist">Kursi dipilih</span><b>{seats.length ? seats.join(", ") : "-"}</b></div><div className="mt-3 flex justify-between text-sm"><span className="text-mist">Harga / kursi</span><b>{rupiah(show.price)}</b></div><div className="mt-5 flex justify-between border-t border-white/10 pt-4"><span className="font-semibold">Total</span><strong className="text-xl text-amber">{rupiah(total)}</strong></div><button onClick={continueBooking} disabled={!seats.length || !movie} className="mt-6 w-full rounded-full bg-amber px-5 py-3 font-bold text-ink transition hover:bg-paper disabled:cursor-not-allowed disabled:opacity-40">Lanjut konfirmasi</button></aside></div>
  </main><Footer /></>;
}
