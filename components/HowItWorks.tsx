const steps = [
  { title: "Pilih film dan jadwal", text: "Cari film, bioskop, dan jam tayang yang cocok." },
  { title: "Pilih kursi", text: "Lihat denah studio dan tentukan kursi favoritmu." },
  { title: "Bayar dan tunjukkan e-tiket", text: "Scan kode QR di pintu masuk studio." },
];

export default function HowItWorks() {
  return (
    <section id="cara-pesan" className="scroll-mt-20 border-t border-white/10 bg-plum/40">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <h2 className="font-display text-3xl font-bold tracking-tight">
          Pesan tiket dalam tiga langkah
        </h2>

        <ol className="mt-8 grid gap-6 md:grid-cols-3">
          {steps.map((s, i) => (
            <li key={s.title} className="flex gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber font-display text-lg font-bold text-ink">
                {i + 1}
              </span>
              <div>
                <h3 className="font-display text-lg font-semibold">{s.title}</h3>
                <p className="mt-1 text-mist">{s.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
