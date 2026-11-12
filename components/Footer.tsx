const YEAR = 2026;

export default function Footer() {
  return (
    <footer className="border-t border-white/10">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 text-sm text-mist sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>© {YEAR} Eclipse. Semua hak dilindungi.</p>
        <p>Update by Franscesco</p>
        <nav aria-label="Footer" className="flex gap-6">
          <a href="/bantuan" className="hover:text-paper">Bantuan</a>
          <a href="/syarat" className="hover:text-paper">Syarat &amp; ketentuan</a>
          <a href="/privasi" className="hover:text-paper">Privasi</a>
        </nav>
      </div>
    </footer>
  );
}
