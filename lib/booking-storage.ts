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

export function readDraft(): BookingDraft | null {
  if (typeof window === "undefined") return null;
  try { return JSON.parse(localStorage.getItem(DRAFT_KEY) || "null") as BookingDraft | null; }
  catch { return null; }
}
export function saveDraft(draft: BookingDraft) {
  localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
}
export function readHistory(): BookingDraft[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]") as BookingDraft[]; }
  catch { return []; }
}
export function savePaidBooking(booking: BookingDraft) {
  const history = readHistory();
  const next = [booking, ...history.filter((item) => item.id !== booking.id)];
  localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
  localStorage.removeItem(DRAFT_KEY);
}
export const rupiah = (value: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value);
