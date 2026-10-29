# Game Pengurangan — Petualangan Memancing Ikan

Game edukasi pengurangan untuk anak SD, dibuat dengan React, TypeScript, dan Vite.

## Fitur
- 5 level dengan tingkat kesulitan bertahap.
- 10 soal per level dan batas waktu 30 detik per soal.
- Pilihan jawaban berupa ikan yang dapat diklik.
- Efek suara yang dapat dimatikan.
- Bintang dan progres disimpan di browser menggunakan `localStorage`.
- Dibundel menjadi halaman statis saat build.

## Menjalankan di komputer
Gunakan Node.js 20.19+ atau 22.12+.

```bash
npm ci
npm run dev
```

## Build dan uji hasil build

```bash
npm ci
npm run build
npm run preview
```

Hasil produksi ada di folder `dist/`. Jangan mengunggah folder `node_modules/`.

## Hosting di GitHub Pages
1. Buat repository GitHub baru.
2. Unggah isi folder proyek ini ke repository, termasuk `.github/workflows/deploy.yml`.
3. Pastikan branch utama bernama `main` atau `master`.
4. Buka **Settings → Pages** di repository.
5. Pilih **GitHub Actions** pada bagian **Build and deployment**.
6. Push perubahan ke branch utama atau jalankan workflow dari tab **Actions**.
7. Setelah workflow berhasil, buka URL Pages yang ditampilkan GitHub.

Path relatif pada konfigurasi Vite mendukung URL proyek seperti `https://username.github.io/nama-repository/`.

## Catatan
- Progres tersimpan di browser/perangkat yang digunakan dan tidak tersinkron otomatis.
- Suara dapat memerlukan interaksi pertama pengguna karena kebijakan autoplay browser.
- Font Google memerlukan koneksi internet; browser akan menggunakan font pengganti jika tidak tersedia.
