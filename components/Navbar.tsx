"use client";

import { useState } from "react";
import Link from "next/link";
import Logo from "./Logo";

const links = [
  { href: "#film", label: "Film" },
  { href: "#bioskop", label: "Bioskop" },
  { href: "#promo", label: "Promo" },
  { href: "#cara-pesan", label: "Cara pesan" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-ink/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Logo />

        <nav aria-label="Menu utama" className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm text-mist transition-colors hover:text-paper focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/signup"
            className="hidden px-3 py-2 text-sm text-mist hover:text-paper sm:inline-block"
          >
            Sign Up
          </Link>
          <Link
            href="/signin"
            className="hidden rounded-full bg-amber px-5 py-2 text-sm font-semibold text-ink transition-colors hover:bg-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-paper sm:inline-block"
          >
            Sign In
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="menu-mobile"
            aria-label="Buka menu"
            className="rounded-md p-2 text-paper md:hidden focus-visible:outline-2 focus-visible:outline-amber"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {open ? (
                <path d="M6 6l12 12M18 6L6 18" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <nav
          id="menu-mobile"
          aria-label="Menu mobile"
          className="border-t border-white/10 bg-ink px-4 pb-4 md:hidden"
        >
          <ul className="flex flex-col">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block py-3 text-mist hover:text-paper"
                >
                  {l.label}
                </a>
              </li>
            ))}
            <li className="pt-2">
              <Link
                href="/signin"
                className="block rounded-full bg-amber py-2.5 text-center font-semibold text-ink"
              >
                Sign In
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
