# Panduan Instalasi & Menjalankan WASIBU (Warung Si Bungsu) di XAMPP

Aplikasi Sistem Manajemen & Kasir Warung Si Bungsu (WASIBU) dibangun dengan **PHP Native** dan **MySQL/MariaDB**, dirancang khusus untuk operasional warung kuliner modern, mencakup modul pesanan aktif, riwayat transaksi, katalog menu, manajemen stok bahan baku, pelanggan, laporan laba rugi omset, cetak struk kasir termal 58mm/80mm, serta konfigurasi operasional meja & QR Code.

---

## 1. Persyaratan Sistem
- Web Server: **Apache** (XAMPP 7.4 / 8.0 / 8.1 / 8.2+)
- Database: **MySQL 8.0** / **MariaDB 10.4+**
- PHP: Versi **7.4 ke atas** dengan ekstensi `pdo_mysql` aktif.
- Web Browser: Google Chrome, Microsoft Edge, Mozilla Firefox, atau Safari.

---

## 2. Langkah-Langkah Pemasangan di XAMPP

### Langkah 1: Pindahkan Berkas Proyek
1. Buka folder instalasi XAMPP di komputer Anda, biasanya berada di `C:\xampp\htdocs\` (atau `/Applications/XAMPP/htdocs/` di macOS).
2. Buat folder baru bernama `wasibu` di dalam `htdocs/`.
3. Salin seluruh isi folder `php_project/` ke dalam `C:\xampp\htdocs\wasibu\`.

### Langkah 2: Buat Database dan Impor SQL
1. Buka aplikasi **XAMPP Control Panel**.
2. Klik tombol **Start** pada modul **Apache** dan **MySQL** hingga indikator berwarna hijau.
3. Buka browser dan kunjungi: `http://localhost/phpmyadmin`
4. Di panel sebelah kiri phpMyAdmin, klik **New** (Baru).
5. Masukkan nama basis data: `wasibu_db` dengan collation `utf8mb4_unicode_ci`, lalu klik **Create**.
6. Klik tab **Import** (Impor) di bagian atas.
7. Klik **Choose File** (Pilih Berkas) dan arahkan ke file `C:\xampp\htdocs\wasibu\database\wasibu_db.sql`.
8. Klik tombol **Import** di bagian bawah halaman. Tunggu hingga muncul notifikasi sukses bahwa semua tabel dan data awal berhasil dibuat.

### Langkah 3: Konfigurasi Koneksi Database
Jika Anda menggunakan setelan bawaan XAMPP tanpa kata sandi root, berkas `config/database.php` sudah langsung siap digunakan:
```php
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'wasibu_db');
define('DB_PORT', 3306);
```
*(Ubah `DB_PASS` jika MySQL XAMPP Anda memiliki password custom).*

### Langkah 4: Akses Aplikasi di Browser
Buka browser dan ketik alamat:
```
http://localhost/wasibu/
```
Aplikasi akan otomatis mengarahkan ke halaman **Login Admin & Kasir**.

---

## 3. Akun Pengujian Bawaan (Default Credentials)

| Role | Username | Password | Email | Keterangan |
|------|----------|----------|-------|------------|
| **Admin / Owner** | `admin` | `password` | `admin@wasibu.id` | Akses seluruh modul termasuk Laporan & Pengaturan |
| **Kasir 1** | `kasir1` | `password` | `kasir1@wasibu.id` | Akses kasir & pesanan harian |
| **Kasir 2** | `kasir2` | `password` | `kasir2@wasibu.id` | Akses kasir & pesanan harian |

---

## 4. Struktur Berkas Proyek

```
wasibu/
├── index.php                     # Router / Halaman Utama
├── login.php                     # Halaman Login Admin & Kasir (Slide 1)
├── register.php                  # Halaman Registrasi Merchant (Slide 5)
├── logout.php                    # Skrip Pengakhiran Sesi (Slide 21)
├── forgot-password.php           # Permintaan Reset Password (Slide 3)
├── reset-password.php            # Formulir Reset Password (Slide 4)
├── bantuan.php                   # Pusat Bantuan & FAQ (Slide 2)
├── config/
│   └── database.php              # Koneksi PDO MySQL
├── includes/
│   ├── auth.php                  # Proteksi Sesi & Hak Akses Role
│   ├── functions.php             # Format Rupiah, Tanggal, Sanitasi XSS
│   ├── header.php                # Head & Metadata CSS
│   ├── sidebar.php               # Navigasi Samping Konsisten
│   ├── navbar.php                # Bar Atas (Jam, Pencarian, Profil)
│   └── footer.php                # Penutup HTML & Skrip JS
├── pesanan/
│   ├── index.php                 # Modul Pesanan Aktif (Slide 6)
│   ├── tambah.php                # Modal / Form Pesanan Kasir (Slide 7)
│   ├── update-status.php         # Handler Pembaruan Status (Slide 9 & 10)
│   └── struk.php                 # Format Cetak Struk Kasir Termal (Slide 8)
├── riwayat/
│   ├── index.php                 # Modul Riwayat Transaksi (Slide 11)
│   └── detail.php                # Detail Riwayat Pesanan (Slide 12)
├── produk/
│   ├── index.php                 # Modul Katalog Menu & Produk (Slide 13)
│   ├── tambah.php                # Form Tambah Menu Baru (Slide 14)
│   └── edit.php                  # Form Edit Menu (Slide 15)
├── stok/
│   ├── index.php                 # Modul Stok Barang & Mutasi (Slide 16)
│   └── tambah.php                # Form Tambah & Penyesuaian Stok (Slide 17)
├── pelanggan/
│   └── index.php                 # Modul Pelanggan & Loyalitas (Slide 18)
├── laporan/
│   └── index.php                 # Modul Analitik Omset & Grafik (Slide 19)
├── pengaturan/
│   └── index.php                 # Modul Pengaturan Usaha, QR & Printer (Slide 20)
├── database/
│   └── wasibu_db.sql             # Skema & Data Awal MySQL
└── README.md                     # Panduan Lengkap
```
