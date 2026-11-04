import Link from "next/link";

// Warna ditulis langsung (bukan lewat kelas tema) supaya logo tetap
// terlihat di latar gelap, apa pun versi Tailwind atau isi globals.css.
const AMBER = "#f2a93b";
const WHITE = "#ffffff";

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="Eclipse, ke beranda"
      style={{ color: WHITE }}
      className={`inline-flex items-center gap-2 font-display text-2xl font-bold tracking-tight focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber ${className}`}
    >
      <svg width="28" height="28" viewBox="0 0 24 24" aria-hidden>
        {/* Bulan penuh yang tertutup bayangan (garis tipis) */}
        <circle cx="12" cy="12" r="10" fill="none" stroke={AMBER} strokeOpacity="0.35" strokeWidth="1" />
        {/* Sabit terang */}
        <path
          d="M12.581 2.017A10 10 0 1 0 20.895 16.567A8.5 8.5 0 1 1 12.581 2.017Z"
          fill={AMBER}
        />
      </svg>
      <span style={{ color: WHITE }}>Eclipse</span>
    </Link>
  );
}
