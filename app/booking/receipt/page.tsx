"use client";
import { Suspense, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { savePaidBooking, rupiah, useBookingDraft, useBookingHistory } from "@/lib/booking-storage";
export default function ReceiptPage() {
  return <Suspense fallback={<main className="min-h-[70vh] p-10 text-center text-mist">Memuat bukti pembayaran...</main>}><ReceiptContent /></Suspense>;
}
function ReceiptContent() {
  const query = useSearchParams();
  const id = query.get("id");
  const { ready: draftReady, draft } = useBookingDraft();
  const { ready: historyReady, history } = useBookingHistory();
  const ready = draftReady && historyReady;
  const found = (draft?.id === id ? draft : null) || history.find((item) => item.id === id) || draft;
  const booking = found ? { ...found, status: "paid" as const } : null;
  // Sudah tersimpan sebagai lunas di riwayat dan bukan draft aktif -> tidak perlu disimpan lagi
  const saved = !!found && found !== draft && found.status === "paid";
  useEffect(() => { if (found && !saved) savePaidBooking({ ...found, status: "paid" }); }, [found, saved]);
  return <><Navbar/><main className="mx-auto flex min-h-[75vh] max-w-3xl items-center px-4 py-12"><div className="w-full overflow-hidden rounded-3xl border border-white/10 bg-plum shadow-2xl"><div className="bg-gradient-to-br from-amber/20 to-velvet/20 px-6 py-10 text-center"><div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber text-3xl font-bold text-ink">✓</div><p className="mt-5 text-xs font-bold uppercase tracking-[.3em] text-amber">Eclipse cinema</p><h1 className="mt-2 font-display text-3xl font-bold">Pembayaran berhasil!</h1><p className="mt-2 text-sm text-mist">Tiket kamu sudah tersimpan di riwayat pemesanan.</p></div>{booking ? <div className="p-6 sm:p-9"><div className="flex justify-between gap-4"><div><p className="text-xs text-mist">Kode booking</p><b className="text-amber">{booking.id}</b></div><span className="h-fit rounded-full bg-green-500/15 px-3 py-1 text-xs font-semibold text-green-400">LUNAS</span></div><div className="my-6 border-t border-dashed border-white/20"/><h2 className="font-display text-2xl font-bold">{booking.movieTitle}</h2><div className="mt-5 grid grid-cols-2 gap-5 text-sm"><div><p className="text-mist">Bioskop</p><b>{booking.cinema}</b></div><div><p className="text-mist">Studio</p><b>{booking.studio}</b></div><div><p className="text-mist">Tanggal</p><b>{booking.dateLabel}</b></div><div><p className="text-mist">Jam</p><b>{booking.time}</b></div><div className="col-span-2"><p className="text-mist">Kursi</p><b>{booking.seats.join(", ")}</b></div><div><p className="text-mist">Pembayaran</p><b>{booking.paymentMethod}</b></div><div><p className="text-mist">Waktu transaksi</p><b>{new Intl.DateTimeFormat("id-ID", { dateStyle: "medium", timeStyle: "short" }).format(new Date(booking.createdAt))}</b></div></div><div className="mt-6 flex justify-between border-t border-white/10 pt-5"><b>Total dibayar</b><strong className="text-2xl text-amber">{rupiah(booking.seats.length * booking.price)}</strong></div><div className="mt-8 grid gap-3 sm:grid-cols-2"><Link href="/history" className="rounded-full bg-amber px-5 py-3 text-center font-bold text-ink hover:bg-paper">Lihat tiket saya</Link><Link href="/" className="rounded-full border border-white/20 px-5 py-3 text-center font-semibold hover:border-amber">Kembali ke beranda</Link></div></div> : <div className="p-8 text-center text-mist">{ready ? "Data transaksi tidak ditemukan. Silakan buka riwayat tiket." : "Memuat bukti pembayaran..."}</div>}</div></main><Footer/></>;
}
