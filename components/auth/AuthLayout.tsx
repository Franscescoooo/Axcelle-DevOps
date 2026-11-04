import Logo from "@/components/Logo";

type Props = {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer: React.ReactNode;
};

export default function AuthLayout({ title, subtitle, children, footer }: Props) {
  return (
    <div className="grid min-h-screen lg:grid-cols-[1fr_1.1fr]">
      {/* Panel kiri: hanya tampil di layar besar */}
      <aside className="relative hidden overflow-hidden bg-plum lg:flex lg:flex-col">
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(242,169,59,0.18),transparent_60%)]"
        />

        {/* Logo di kiri atas */}
        <div className="relative p-12">
          <Logo />
        </div>

        {/* Gerhana + tagline: satu kelompok, rata tengah */}
        <div className="relative flex flex-1 flex-col items-center justify-center px-12 pb-28 text-center">
          <div aria-hidden className="relative h-64 w-64">
            {/* Korona */}
            <div className="absolute -inset-12 rounded-full bg-[radial-gradient(circle,rgba(242,169,59,0.40),transparent_65%)]" />
            {/* Cakram gelap */}
            <div className="absolute inset-0 rounded-full bg-ink ring-1 ring-amber/80 shadow-[0_0_60px_8px_rgba(242,169,59,0.30)]" />
          </div>

          <p className="mt-14 max-w-sm text-balance font-display text-3xl font-bold leading-snug">
            The lights dim, the screen lights up.
            <span className="mt-1 block text-mist">Your ticket is ready.</span>
          </p>
        </div>
      </aside>

      {/* Panel kanan: form */}
      <main className="flex flex-col px-4 py-8 sm:px-10">
        <div className="lg:hidden"><Logo /></div>

        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-10">
          <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
          <p className="mt-2 text-mist">{subtitle}</p>
          <div className="mt-8">{children}</div>
          <p className="mt-8 text-center text-sm text-mist">{footer}</p>
        </div>
      </main>
    </div>
  );
}
