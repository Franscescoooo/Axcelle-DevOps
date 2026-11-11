import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function MovieNotFound() {
  return (
    <>
      <Navbar />
      <main className="mx-auto flex max-w-xl flex-col items-center px-4 py-28 text-center">
        <p className="font-display text-6xl font-bold text-amber">404</p>
        <h1 className="mt-4 font-display text-3xl font-bold">Film tidak ditemukan</h1>
        <p className="mt-3 text-mist">
          Film yang kamu cari tidak ada atau sudah tidak tayang.
        </p>
        <Link
          href="/#film"
          className="mt-8 rounded-full bg-amber px-6 py-3 font-semibold text-ink transition-colors hover:bg-paper"
        >
          Lihat semua film
        </Link>
      </main>
      <Footer />
    </>
  );
}
