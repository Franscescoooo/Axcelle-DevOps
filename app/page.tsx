import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import MovieSection from "@/components/MovieSection";
import HowItWorks from "@/components/HowItWorks";
import Footer from "@/components/Footer";
import type { Movie } from "@/components/MovieCard";

// Isi array ini nanti dari database / API.
// Selama kosong, halaman menampilkan kerangka (placeholder) poster.
const nowShowing: Movie[] = [];
const comingSoon: Movie[] = [];

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <MovieSection nowShowing={nowShowing} comingSoon={comingSoon} />
        <HowItWorks />
      </main>
      <Footer />
    </>
  );
}
