# 👨‍💼 Manpower Monitoring System + Asset Tracking

> A comprehensive web-based dashboard to monitor workforce attendance, breaks, working hours, and employee-owned assets (e.g., mobile phones with IMEI & location tracking). Built with React 19 + Ant Design.

![GitHub repo size](https://img.shields.io/github/repo-size/username/manpower-monitoring)
![GitHub last commit](https://img.shields.io/github/last-commit/username/manpower-monitoring)
![License](https://img.shields.io/badge/license-MIT-green)

## 📋 Deskripsi

Sistem ini membantu supervisor, HR, dan manajer aset untuk memantau secara real-time:

- **Manpower**: kehadiran, shift, lokasi, alasan ketidakhadiran, jam masuk & pulang, total jam kerja.
- **Break Management**: mulai/akhiri break, riwayat break, status break (Break / After Break / Tidak Break).
- **Asset Management (Handphone)**: pendataan IMEI, merek, model; update status keberadaan di area kerja; riwayat lokasi.
- **Dashboard Statistik**: kartu ringkasan (total manpower, hadir, tidak hadir, on-site, sedang break, rata-rata jam kerja, HP di area).
- **Ekspor Data**: CSV lengkap dengan semua kolom (termasuk aset dan riwayat break).

Semua data disimpan di **localStorage** (tidak perlu backend). Cocok untuk demo, pilot project, atau penggunaan internal skala kecil.

## ✨ Fitur Lengkap

### 👥 Manajemen Manpower (CRUD)
- Tambah, edit, hapus pekerja.
- Field: Nama, Shift (Pagi/Siang/Malam), Lokasi, Status Kehadiran (Hadir/Sakit/Izin/Alpa), Alasan (khusus tidak hadir), Jam Masuk, Jam Pulang.

### ⏱️ Manajemen Break
- Tombol **Mulai Break** / **Akhiri Break** per pekerja.
- Riwayat break (daftar waktu mulai & selesai) ditampilkan dalam modal.
- Status break otomatis mengunci tombol yang tidak relevan.

### 📊 Perhitungan Jam Kerja Otomatis
- Total jam kerja = (Jam Pulang - Jam Masuk) - total durasi break (dalam menit).
- Rata-rata jam kerja harian muncul di dashboard.

### 📱 Asset Tracking (Handphone & IMEI)
- Setiap pekerja bisa memiliki 0..n handphone.
- Data handphone: merek, model, **IMEI (validasi 15 digit, unik global)**.
- Update status **di area / tidak di area** + lokasi terakhir + riwayat lokasi (timestamp).
- Filter tabel: menampilkan pekerja berdasarkan status aset di area.
- Kartu dashboard: jumlah HP yang sedang di area.

### 📈 Dashboard & Grafik
- 7 kartu statistik: total manpower, hadir, tidak hadir, on-site, sedang break, rata-rata jam kerja, HP di area.
- Grafik batang tren kehadiran (data dummy untuk MVP).

### 🗂️ Tabel Interaktif
- Kolom lengkap (termasuk alasan, jam masuk/pulang, total jam kerja, status break, daftar aset).
- Filter: Shift, Lokasi, Status Break, Status Aset di Area.
- Pencarian nama pekerja.
- Tombol aksi: Mulai Break, Akhiri Break, Edit, Hapus, Lihat Aset, Riwayat Break.

### 📎 Ekspor CSV
- Satu klik ekspor semua data manpower + aset ke file CSV.

### 💾 Persistensi Data
- Data default (5 contoh pekerja dengan berbagai skenario) disediakan.
- Setiap perubahan disimpan otomatis ke `localStorage` – data tetap ada setelah refresh.

## 🛠 Teknologi yang Digunakan

| Area | Teknologi |
|------|-----------|
| Frontend | React 19, Vite |
| UI Library | Ant Design v6 |
| Charts | Chart.js + react-chartjs-2 |
| CSV Export | react-csv |
| Time Handling | dayjs |
| State & Storage | React Hooks + localStorage |

## 📁 Struktur Folder (Usulan)
manpower-monitoring/
├── public/
├── src/
│ ├── components/
│ │ ├── DashboardCards.jsx
│ │ ├── AttendanceChart.jsx
│ │ ├── ManpowerTable.jsx
│ │ ├── ManpowerFormModal.jsx
│ │ ├── AssetModal.jsx
│ │ └── BreakHistoryModal.jsx
│ ├── data/
│ │ └── defaultManpower.js
│ ├── utils/
│ │ ├── storage.js
│ │ ├── timeHelper.js
│ │ └── imeiValidator.js
│ ├── App.jsx
│ ├── main.jsx
│ └── index.css
├── .gitignore
├── index.html
├── package.json
├── vite.config.js
└── README.md