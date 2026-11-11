import { useMemo, useSyncExternalStore } from "react";

export type BookingDraft = {
  id: string;
  movieId: string;
  movieTitle: string;
  posterUrl?: string;
  cinema: string;
  studio: string;
  dateLabel: string;
  showDate: string;
  time: string;
  seats: string[];
  price: number;
  paymentMethod: string;
  status: "pending" | "paid";
  createdAt: string;
};

const DRAFT_KEY = "eclipse_booking_draft";
const HISTORY_KEY = "eclipse_booking_history";
// Event "storage" bawaan browser hanya terpicu dari tab lain, jadi tab yang
// sama memakai event sendiri supaya hook di bawah ikut ter-update.
const CHANGE_EVENT = "eclipse-booking-change";

function parse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try { return JSON.parse(raw) as T; }
  catch { return fallback; }
}
function notify() {
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function readDraft(): BookingDraft | null {
  if (typeof window === "undefined") return null;
  return parse<BookingDraft | null>(localStorage.getItem(DRAFT_KEY), null);
}
export function saveDraft(draft: BookingDraft) {
  localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  notify();
}
export function readHistory(): BookingDraft[] {
  if (typeof window === "undefined") return [];
  return parse<BookingDraft[]>(localStorage.getItem(HISTORY_KEY), []);
}
export function savePaidBooking(booking: BookingDraft) {
  const history = readHistory();
  const next = [booking, ...history.filter((item) => item.id !== booking.id)];
  localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
  localStorage.removeItem(DRAFT_KEY);
  notify();
}

/* ---------- Hook untuk komponen client ---------- */

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(CHANGE_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(CHANGE_EVENT, callback);
  };
}

// Mengembalikan isi mentah localStorage. `undefined` = masih di server /
// belum hydrate (localStorage belum bisa dibaca).
function useStoredRaw(key: string): string | null | undefined {
  return useSyncExternalStore(
    subscribe,
    () => localStorage.getItem(key),
    () => undefined
  );
}

export function useBookingDraft() {
  const raw = useStoredRaw(DRAFT_KEY);
  const draft = useMemo(() => parse<BookingDraft | null>(raw ?? null, null), [raw]);
  return { ready: raw !== undefined, draft };
}

export function useBookingHistory() {
  const raw = useStoredRaw(HISTORY_KEY);
  const history = useMemo(() => parse<BookingDraft[]>(raw ?? null, []), [raw]);
  return { ready: raw !== undefined, history };
}

export const rupiah = (value: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value);
