"use client";

import { useEffect } from "react";
import Link from "next/link";

export type ToastData = {
  type: "success" | "error";
  message: string;
  action?: { label: string; href: string };
};

export default function Toast({
  toast,
  onClose,
}: {
  toast: ToastData | null;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(onClose, 7000);
    return () => clearTimeout(t);
  }, [toast, onClose]);

  if (!toast) return null;
  const isError = toast.type === "error";

  return (
    <div
      role={isError ? "alert" : "status"}
      className={`fixed left-4 right-4 top-4 z-50 flex items-start gap-3 rounded-xl border bg-plum p-4 shadow-2xl sm:left-auto sm:w-96 ${
        isError ? "border-red-400/60" : "border-amber/60"
      }`}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
        className={`mt-0.5 shrink-0 ${isError ? "text-red-300" : "text-amber"}`}
      >
        {isError ? (
          <>
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v5M12 16.5v.01" />
          </>
        ) : (
          <>
            <circle cx="12" cy="12" r="10" />
            <path d="M8 12.5l2.7 2.7L16 9.5" />
          </>
        )}
      </svg>

      <div className="flex-1 text-sm">
        <p>{toast.message}</p>
        {toast.action && (
          <Link
            href={toast.action.href}
            className="mt-2 inline-block font-semibold text-amber hover:underline"
          >
            {toast.action.label}
          </Link>
        )}
      </div>

      <button
        type="button"
        onClick={onClose}
        aria-label="Tutup notifikasi"
        className="rounded p-1 text-mist hover:text-paper focus-visible:outline-2 focus-visible:outline-amber"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      </button>
    </div>
  );
}
