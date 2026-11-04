"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Jika pengguna sudah masuk lalu membuka /signin atau /signup,
// arahkan langsung ke beranda.
export function useRedirectIfSignedIn() {
  const router = useRouter();
  useEffect(() => {
    let cancelled = false;
    fetch("/api/auth/me", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => {
        if (!cancelled && d.user) router.replace("/");
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [router]);
}
