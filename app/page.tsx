import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import MovieSection from "@/components/MovieSection";
import HowItWorks from "@/components/HowItWorks";
import Footer from "@/components/Footer";
import { nowShowing, comingSoon } from "@/lib/movies";

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