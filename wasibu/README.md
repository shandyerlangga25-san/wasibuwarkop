# PANDUAN LENGKAP PROYEK WEBSITE WASIBU (WARUNG SI BUNGSU)
## IMPLEMENTASI ASLI: PHP NATIVE MURNI & MYSQL (XAMPP LOCALHOST)

Aplikasi **WASIBU (Warung Si Bungsu)** ini dibuat 100% menggunakan **PHP Native murni** tanpa framework backend (tanpa Laravel/CodeIgniter), tanpa Node.js/React/TypeScript, dengan database relasional **MySQL/MariaDB**, serta frontend standar **HTML5, CSS3 murni, dan Vanilla JavaScript**.

---

## 1. STRUKTUR FOLDER PROYEK
Untuk menjalankan di XAMPP, letakkan seluruh isi folder ini di direktori web server Apache:
`C:\xampp\htdocs\wasibu\`

```
C:\xampp\htdocs\wasibu\
├── index.php                     # Gerbang utama / routing status login
├── login.php                     # Halaman autentikasi login (Slide 1, 2, 3)
├── register.php                  # Halaman pendaftaran akun baru (Slide 5)
├── logout.php                    # Script logout aman penghancur session
├── reset-password.php            # Halaman reset password baru (Slide 4)
├── config/
│   └── database.php              # Koneksi PDO MySQL aman (Prepared Statements)
├── includes/
│   ├── auth.php                  # Proteksi hak akses role (Admin vs Kasir)
│   ├── functions.php             # Format Rupiah, sanitasi input XSS, format tanggal
│   ├── header.php                # Template head HTML bersama
│   ├── sidebar.php               # Navigasi samping gelap sesuai prototype
│   ├── navbar.php                # Topbar dengan tanggal, jam & identitas pengguna
│   └── footer.php                # Penutup layout HTML & skrip JS
├── pesanan/
│   ├── index.php                 # Halaman Pesanan Aktif (Slide 6, 7, 9, 10)
│   ├── tambah.php                # Handler simpan pesanan kasir manual
│   ├── update-status.php         # Handler pembaruan status order & pembatalan
│   └── struk.php                 # Cetak struk kasir termal 58mm/80mm (Slide 8)
├── riwayat/
│   └── index.php                 # Modul Riwayat Transaksi Selesai (Slide 11 & 12)
├── produk/
│   ├── index.php                 # Modul Katalog Menu & Produk (Slide 13, 14, 15)
│   └── simpan.php                # Handler tambah, ubah, dan nonaktifkan menu
├── stok/
│   ├── index.php                 # Modul Stok Bahan Baku & Mutasi (Slide 16 & 17)
│   └── tambah.php                # Handler penambahan stok & pencatatan log
├── pelanggan/
│   └── index.php                 # Modul Daftar Pelanggan & Loyalitas (Slide 18)
├── laporan/
│   └── index.php                 # Modul Laporan Penjualan & Grafik Omset (Slide 19)
├── pengaturan/
│   └── index.php                 # Modul Pengaturan Usaha, QR Meja, Jam Operasional (Slide 20)
├── assets/
│   ├── css/
│   │   └── style.css             # Desain visual murni CSS3 sesuai prototype
│   └── js/
│       └── app.js                # Vanilla JavaScript untuk modal & cetak
├── database/
│   └── wasibu_db.sql             # Skema tabel & data seeder lengkap
└── README.md                     # Petunjuk instalasi
```

---

## 2. CARA INSTALASI DAN MENJALANKAN DI XAMPP

1. **Buka XAMPP Control Panel**:
   - Jalankan modul **Apache** (klik tombol *Start*).
   - Jalankan modul **MySQL** (klik tombol *Start*).

2. **Pindahkan Berkas Proyek**:
   - Salin seluruh folder `wasibu` ke dalam direktori:
     `C:\xampp\htdocs\wasibu\`

3. **Buat Database & Impor Data Seeder**:
   - Buka browser ke alamat: `http://localhost/phpmyadmin/`
   - Klik **New** di panel sebelah kiri.
   - Isi nama database: `wasibu_db` dengan Collation `utf8mb4_unicode_ci`, lalu klik **Create**.
   - Pilih tab **Import** pada bagian atas.
   - Klik tombol **Choose File** / **Pilih Berkas**, pilih file:
     `C:\xampp\htdocs\wasibu\database\wasibu_db.sql`
   - Klik tombol **Import** di bagian bawah. Seluruh tabel, relasi, dan data awal akan otomatis terisi.

4. **Konfigurasi Database (`config/database.php`)**:
   Konfigurasi bawaan XAMPP tanpa password root:
   ```php
   define('DB_HOST', 'localhost');
   define('DB_USER', 'root');
   define('DB_PASS', '');
   define('DB_NAME', 'wasibu_db');
   define('DB_PORT', 3306);
   ```

5. **Akses Aplikasi**:
   Buka browser dan akses URL:
   `http://localhost/wasibu/`

---

## 3. AKUN PENGUJIAN DEFAULT (HASIL SEEDER)

| Role | Username | Password | Email | Hak Akses |
|---|---|---|---|---|
| **Admin / Owner** | `admin` | `password` | `admin@wasibu.id` | Akses penuh seluruh menu: Pesanan, Menu, Stok, Pelanggan, Laporan, Pengaturan |
| **Kasir 1** | `kasir1` | `password` | `kasir1@wasibu.id` | Akses kasir: Pesanan Aktif, Riwayat, Menu, Stok |
| **Kasir 2** | `kasir2` | `password` | `kasir2@wasibu.id` | Akses kasir harian |
