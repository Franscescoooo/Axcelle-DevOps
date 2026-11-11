// Sumber data film. Semua film di bawah ini adalah CONTOH FIKTIF untuk uji tampilan.
// Ganti isinya dengan data asli (atau ambil dari database/API) nanti.
// Kosongkan array `movies` (= []) untuk kembali ke tampilan kerangka poster.

export type Showtime = {
  time: string; // contoh: "19:30"
  studio: string; // contoh: "Studio 2"
  price: number; // dalam rupiah
};

export type CinemaSchedule = {
  cinema: string;
  address: string;
  format: string; // contoh: "Reguler 2D", "Premiere"
  showtimes: Showtime[];
};

export type Movie = {
  id: string; // dipakai di alamat: /film/{id}
  title: string;
  tagline?: string;
  genre: string[];
  duration: string; // contoh: "1j 52m"
  rating: string; // contoh: "13+"
  score?: number; // 0 - 10
  synopsis: string;
  director: string;
  cast: string[];
  language: string;
  releaseDate: string; // teks tampilan, contoh: "6 November 2026"
  status: "now" | "soon";
  posterUrl?: string; // contoh: "/posters/senja.jpg" (taruh file di public/posters)
  trailerUrl?: string;
  schedule?: CinemaSchedule[];
};

const sampleSchedule: CinemaSchedule[] = [
  {
    cinema: "Eclipse Plaza Utara",
    address: "Lantai 3, Jl. Contoh No. 1",
    format: "Reguler 2D",
    showtimes: [
      { time: "12:15", studio: "Studio 1", price: 40000 },
      { time: "14:45", studio: "Studio 1", price: 40000 },
      { time: "17:20", studio: "Studio 2", price: 50000 },
      { time: "19:50", studio: "Studio 2", price: 50000 },
    ],
  },
  {
    cinema: "Eclipse Central",
    address: "Lantai 5, Jl. Contoh No. 2",
    format: "Premiere",
    showtimes: [
      { time: "13:00", studio: "Premiere 1", price: 85000 },
      { time: "16:10", studio: "Premiere 1", price: 95000 },
      { time: "20:30", studio: "Premiere 1", price: 95000 },
    ],
  },
  {
    cinema: "Eclipse Riverside",
    address: "Lantai 2, Jl. Contoh No. 3",
    format: "Reguler 2D",
    showtimes: [
      { time: "11:30", studio: "Studio 3", price: 35000 },
      { time: "15:00", studio: "Studio 3", price: 40000 },
      { time: "18:40", studio: "Studio 4", price: 50000 },
    ],
  },
];

export const movies: Movie[] = [
  {
    id: "senja-di-kota-hujan",
    title: "Senja di Kota Hujan",
    tagline: "Ada cinta yang hanya datang saat langit mendung.",
    genre: ["Drama", "Romansa"],
    duration: "1j 52m",
    rating: "13+",
    score: 8.1,
    synopsis:
      "Seorang fotografer yang kehilangan arah kembali ke kota kecil tempat ia dibesarkan. Di sana ia bertemu teman lama yang menyimpan rahasia, dan keduanya harus memutuskan apakah masa lalu layak diperjuangkan lagi.",
    director: "Maya Wiraguna",
    cast: ["Kirana Aldebaran", "Bima Satrio", "Tasya Mahendrati"],
    language: "Indonesia",
    releaseDate: "30 Oktober 2026",
    status: "now",
    schedule: sampleSchedule,
  },
  {
    id: "malam-terakhir-di-stasiun",
    title: "Malam Terakhir di Stasiun",
    tagline: "Satu malam, satu kereta, satu kebenaran.",
    genre: ["Thriller", "Misteri"],
    duration: "2j 05m",
    rating: "17+",
    score: 7.6,
    synopsis:
      "Seorang petugas stasiun menemukan koper tanpa pemilik saat kereta terakhir hendak berangkat. Dalam waktu kurang dari satu jam, ia harus menebak siapa pemiliknya sebelum semuanya terlambat.",
    director: "Rendra Haryosaputro",
    cast: ["Arga Mahendra", "Laras Wulandari", "Joko Prasetyo"],
    language: "Indonesia",
    releaseDate: "23 Oktober 2026",
    status: "now",
    schedule: sampleSchedule,
  },
  {
    id: "kapten-awan",
    title: "Kapten Awan",
    tagline: "Petualangan terbesar dimulai dari mimpi paling kecil.",
    genre: ["Animasi", "Keluarga", "Petualangan"],
    duration: "1j 38m",
    rating: "SU",
    score: 8.4,
    synopsis:
      "Awan kecil bernama Kapten Awan bermimpi menjadi hujan pertama di musim kemarau. Bersama burung camar dan seekor ikan terbang, ia menempuh perjalanan melintasi langit untuk menyelamatkan sebuah desa nelayan.",
    director: "Sari Kusumawardhani",
    cast: ["Suara: Dimas Anggara", "Suara: Putri Kencana"],
    language: "Indonesia",
    releaseDate: "6 November 2026",
    status: "now",
    schedule: sampleSchedule,
  },
  {
    id: "gema-dari-bukit-sunyi",
    title: "Gema dari Bukit Sunyi",
    tagline: "Jangan jawab suara yang memanggil namamu.",
    genre: ["Horor"],
    duration: "1j 44m",
    rating: "17+",
    score: 7.2,
    synopsis:
      "Sekelompok pendaki terjebak kabut di sebuah bukit yang konon tak pernah memantulkan gema. Satu per satu, mereka mulai mendengar suara yang tak seharusnya ada.",
    director: "Bagas Triatmaja",
    cast: ["Nadia Prabandari", "Rio Santika", "Fajar Wicaksono"],
    language: "Indonesia",
    releaseDate: "30 Oktober 2026",
    status: "now",
    schedule: sampleSchedule,
  },
  {
    id: "rimba-tujuh-samudra",
    title: "Rimba Tujuh Samudra",
    tagline: "Peta lama, tujuh pulau, satu harta yang tak boleh ditemukan.",
    genre: ["Petualangan", "Aksi"],
    duration: "2j 18m",
    rating: "13+",
    score: 7.9,
    synopsis:
      "Seorang arkeolog muda mewarisi peta kuno milik kakeknya. Ia menyusuri tujuh pulau bersama kapten kapal yang keras kepala, sambil dikejar kelompok yang menginginkan peta itu lebih dari apa pun.",
    director: "Hendra Pramudita",
    cast: ["Alya Ramadhani", "Teuku Zulkarnain", "Gita Maheswari"],
    language: "Indonesia",
    releaseDate: "16 Oktober 2026",
    status: "now",
    schedule: sampleSchedule,
  },
  {
    id: "lentera-kota-tua",
    title: "Lentera Kota Tua",
    tagline: "Setiap lampu menyimpan satu cerita.",
    genre: ["Drama", "Fantasi"],
    duration: "1j 58m",
    rating: "13+",
    synopsis:
      "Seorang penjaga lampu jalan di kota tua menyadari bahwa setiap lentera yang ia nyalakan memperlihatkan kenangan orang yang pernah lewat di bawahnya.",
    director: "Maya Wiraguna",
    cast: ["Bima Satrio", "Dewi Kartikasari"],
    language: "Indonesia",
    releaseDate: "2 Desember 2026",
    status: "soon",
  },
  {
    id: "cahaya-di-ujung-pelabuhan",
    title: "Cahaya di Ujung Pelabuhan",
    tagline: "Pulang bukan soal tempat, tapi siapa yang menunggu.",
    genre: ["Drama", "Keluarga"],
    duration: "2j 01m",
    rating: "SU",
    synopsis:
      "Setelah bertahun-tahun merantau, seorang pelaut kembali ke pelabuhan kecil dan mendapati keluarganya telah berubah. Ia belajar bahwa kembali pulang kadang lebih sulit daripada pergi.",
    director: "Sari Kusumawardhani",
    cast: ["Arga Mahendra", "Kirana Aldebaran"],
    language: "Indonesia",
    releaseDate: "18 Desember 2026",
    status: "soon",
  },
];

export const nowShowing = movies.filter((m) => m.status === "now");
export const comingSoon = movies.filter((m) => m.status === "soon");

export function getMovieById(id: string): Movie | null {
  return movies.find((m) => m.id === id) ?? null;
}
