import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import MovieSection from "@/components/MovieSection";
import HowItWorks from "@/components/HowItWorks";
import Footer from "@/components/Footer";
import { getNowShowing, getComingSoon } from "@/lib/movies";

// Data film diambil saat permintaan masuk, jadi harus berada di dalam <Suspense>
// (sama seperti pola yang sudah Anda pakai di app/film/[id]/page.tsx).
async function Movies() {
  const [nowShowing, comingSoon] = await Promise.all([getNowShowing(), getComingSoon()]);
  return <MovieSection nowShowing={nowShowing} comingSoon={comingSoon} />;
}

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Suspense
          fallback={<div className="mx-auto max-w-6xl px-4 py-14 text-mist sm:px-6">Memuat film…</div>}
        >
          <Movies />
        </Suspense>
        <HowItWorks />
      </main>
      <Footer />
    </>
  );
}
