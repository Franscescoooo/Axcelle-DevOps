# Axcelle (Eclipse Cinema)

Next.js (frontend) + Express (backend) + PostgreSQL, dijalankan lewat Docker Compose.

## Menjalankan (localhost)

1. Pastikan Docker Desktop sudah menyala.
2. Pastikan file `.env` ada (salin dari `.env.example`) dan `TMDB_API_KEY` + `AUTH_SECRET` terisi.
3. Jalankan:

   ```bash
   docker compose up --build
   ```

4. Di terminal lain, isi database dengan film dari TMDB (cukup sekali):

   ```bash
   docker compose run --rm sync
   ```

5. Buka http://localhost:3000

Reset total (hapus database & akun): `docker compose down -v`

Project ini menggunakan GitHub Actions
untuk menjalankan proses CI/CD secara otomatis
ketika terdapat push ke repository.

Pipeline menjalankan tahapan sesuai konfigurasi
workflow yang tersedia di folder .github/workflows.