-- ============================================================
-- WASIBU (Warung Si Bungsu) - Database Schema & Data Seeder
-- DBMS: MySQL 8.0 / MariaDB 10.4+ (XAMPP Default)
-- Database Name: wasibu_db
-- ============================================================

CREATE DATABASE IF NOT EXISTS `wasibu_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `wasibu_db`;

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS `order_items`;
DROP TABLE IF EXISTS `orders`;
DROP TABLE IF EXISTS `products`;
DROP TABLE IF EXISTS `categories`;
DROP TABLE IF EXISTS `dining_tables`;
DROP TABLE IF EXISTS `stock_movements`;
DROP TABLE IF EXISTS `stock_items`;
DROP TABLE IF EXISTS `customers`;
DROP TABLE IF EXISTS `users`;
DROP TABLE IF EXISTS `settings`;
SET FOREIGN_KEY_CHECKS = 1;

-- 1. TABEL PENGGUNA (USERS)
CREATE TABLE `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `username` VARCHAR(50) NOT NULL UNIQUE,
  `email` VARCHAR(100) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `role` ENUM('Admin', 'Owner', 'Kasir') NOT NULL DEFAULT 'Kasir',
  `status` ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. TABEL KATEGORI (CATEGORIES)
CREATE TABLE `categories` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(50) NOT NULL UNIQUE,
  `slug` VARCHAR(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. TABEL MENU & PRODUK (PRODUCTS)
CREATE TABLE `products` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `code` VARCHAR(20) NOT NULL UNIQUE,
  `category_id` INT NOT NULL,
  `name` VARCHAR(150) NOT NULL,
  `price` DECIMAL(12, 2) NOT NULL,
  `status` ENUM('Tersedia', 'Habis') NOT NULL DEFAULT 'Tersedia',
  `image` VARCHAR(255) NULL,
  `prep_time` VARCHAR(50) DEFAULT '10-15 menit',
  `ingredients` TEXT NULL,
  `description` TEXT NULL,
  `is_active` TINYINT(1) DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. TABEL MEJA MAKAN (DINING_TABLES)
CREATE TABLE `dining_tables` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `table_number` VARCHAR(20) NOT NULL UNIQUE,
  `qr_code_token` VARCHAR(100) NOT NULL,
  `status` ENUM('Kosong', 'Terisi') DEFAULT 'Kosong'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. TABEL PELANGGAN (CUSTOMERS)
CREATE TABLE `customers` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `phone` VARCHAR(30) NULL,
  `total_orders` INT DEFAULT 0,
  `total_spent` DECIMAL(14, 2) DEFAULT 0.00,
  `last_order_date` VARCHAR(50) NULL,
  `favorite_menu` VARCHAR(100) NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. TABEL PESANAN (ORDERS)
CREATE TABLE `orders` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `order_number` VARCHAR(50) NOT NULL UNIQUE,
  `table_number` VARCHAR(20) NOT NULL,
  `customer_name` VARCHAR(100) DEFAULT 'Pelanggan Meja',
  `customer_id` INT NULL,
  `user_id` INT NULL,
  `source` ENUM('QR', 'Kasir') NOT NULL DEFAULT 'Kasir',
  `status` ENUM('Baru', 'Diproses', 'Siap Disajikan', 'Selesai', 'Dibatalkan') NOT NULL DEFAULT 'Baru',
  `payment_status` ENUM('Belum Bayar', 'Lunas') NOT NULL DEFAULT 'Belum Bayar',
  `payment_method` ENUM('Tunai', 'QRIS', 'Debit/Kartu', 'E-Wallet') NOT NULL DEFAULT 'Tunai',
  `reference_no` VARCHAR(100) NULL,
  `notes` TEXT NULL,
  `subtotal` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  `discount` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  `tax` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  `total` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  `cash_received` DECIMAL(12, 2) NULL,
  `cash_change` DECIMAL(12, 2) NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 7. TABEL ITEM PESANAN (ORDER_ITEMS)
CREATE TABLE `order_items` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `order_id` INT NOT NULL,
  `product_id` INT NOT NULL,
  `product_name` VARCHAR(150) NOT NULL,
  `price` DECIMAL(12, 2) NOT NULL,
  `qty` INT NOT NULL DEFAULT 1,
  `subtotal` DECIMAL(12, 2) NOT NULL,
  FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 8. TABEL STOK BARANG & BAHAN BAKU (STOCK_ITEMS)
CREATE TABLE `stock_items` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `category` ENUM('Bahan Pokok', 'Protein', 'Bumbu & Sayur', 'Minuman', 'Kemasan') NOT NULL,
  `unit` VARCHAR(20) NOT NULL,
  `current_stock` DECIMAL(10, 2) NOT NULL DEFAULT 0,
  `min_stock` DECIMAL(10, 2) NOT NULL DEFAULT 5,
  `status` ENUM('Aman', 'Menipis', 'Habis') NOT NULL DEFAULT 'Aman',
  `location` VARCHAR(100) DEFAULT 'Rak Dapur',
  `notes` TEXT NULL,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 9. TABEL MUTASI STOK (STOCK_MOVEMENTS)
CREATE TABLE `stock_movements` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `stock_item_id` INT NOT NULL,
  `type` ENUM('Barang Masuk', 'Dipakai Dapur', 'Penyesuaian') NOT NULL,
  `amount` DECIMAL(10, 2) NOT NULL,
  `unit` VARCHAR(20) NOT NULL,
  `note` VARCHAR(255) NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`stock_item_id`) REFERENCES `stock_items`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 10. TABEL PENGATURAN USAHA (SETTINGS)
CREATE TABLE `settings` (
  `key_name` VARCHAR(50) PRIMARY KEY,
  `key_value` TEXT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- SEEDER DATA SESUAI PROTOTYPE RESMI (SLIDE 1 - 21)
-- ============================================================

-- Akun Pengujian: password di-hash dengan password_hash('password', PASSWORD_BCRYPT)
INSERT INTO `users` (`name`, `username`, `email`, `password`, `role`) VALUES
('Admin Utama', 'admin', 'admin@wasibu.id', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin'),
('Kasir 1', 'kasir1', 'kasir1@wasibu.id', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Kasir'),
('Kasir 2', 'kasir2', 'kasir2@wasibu.id', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Kasir');

-- Kategori
INSERT INTO `categories` (`name`, `slug`) VALUES
('Makanan', 'makanan'),
('Minuman', 'minuman'),
('Cemilan', 'cemilan'),
('Paket Hemat', 'paket-hemat');

-- Menu Produk Sesuai Slide 13
INSERT INTO `products` (`code`, `category_id`, `name`, `price`, `status`, `prep_time`, `ingredients`, `description`) VALUES
('MN001', 1, 'Ayam Geprek', 20000.00, 'Tersedia', '10-15 menit', 'Nasi, ayam goreng crispy, sambal, lalapan (timun, selada)', 'Ayam goreng crispy dengan sambal pedas khas Warung Si Bungsu, disajikan dengan nasi dan lalapan segar.'),
('MN002', 1, 'Chicken Steak Ayam Crispy Lada Hitam', 17000.00, 'Tersedia', '12-18 menit', 'Daging ayam fillet crispy, saus lada hitam khas, mix veggies, kentang goreng', 'Fillet ayam krispi renyah dengan siraman saus lada hitam pedas manis gurih.'),
('MN003', 1, 'Oseng Taichan', 15000.00, 'Tersedia', '10-12 menit', 'Daging ayam cincang dadu, cabai rawit pedas, bawang putih, jeruk nipis', 'Potongan ayam empuk dioseng dengan bumbu taichan pedas asam segar beraroma khas.'),
('MN004', 1, 'Nasi Ayam Crispy Asam Manis', 15000.00, 'Tersedia', '10-15 menit', 'Nasi putih, ayam fillet krispi, saus asam manis nanas, wijen sangrai', 'Ayam renyah berpadu saus asam manis segar dengan taburan wijen.'),
('MN005', 1, 'Nasi Goreng Spesial', 25000.00, 'Tersedia', '10-12 menit', 'Nasi gurih, ayam suwir, telur mata sapi, sosis, bakso, kerupuk, acar', 'Nasi goreng harum khas bumbu warung dengan topping lengkap dan telur ceplok.'),
('MN006', 1, 'Nasi Goreng', 12000.00, 'Tersedia', '8-10 menit', 'Nasi, telur orak-arik, bumbu racik istimewa, kerupuk bawang', 'Nasi goreng klasik gurih lezat porsi mengenyangkan.'),
('MN007', 1, 'Nasi Ikan Goreng', 15000.00, 'Tersedia', '12-15 menit', 'Nasi, ikan nila goreng renyah, sambal terasi, lalap segar', 'Ikan segar berbumbu gurih digoreng kering renyah dengan sambal pedas.'),
('MN008', 1, 'Nasi Udang Tempura', 18000.00, 'Tersedia', '10-15 menit', 'Nasi pulen, udang balut tepung tempura renyah, saus celup spesial', 'Udang berbalut tepung keemasan yang garing di luar dan lembut di dalam.'),
('MN009', 1, 'Nasi Eggroll', 18000.00, 'Habis', '10-12 menit', 'Nasi, olahan telur rol isi daging ayam gurih, saus tomat manis', 'Eggroll daging ayam gurih lembut berselimut dadar telur renyah.'),
('MN010', 1, 'Nasi Telur', 8000.00, 'Tersedia', '5-8 menit', 'Nasi putih hangat, telur dadar krispi kecap, sambal bawang', 'Menu hemat favorit mahasiswa dan pekerja, simpel dan gurih nikmat.'),
('MN011', 1, 'Indomie', 7000.00, 'Tersedia', '5-7 menit', 'Indomie goreng/kuah, sayur sawi hijau, cabai rawit iris', 'Mie instan legendaris dimasak pas dengan sayuran segar dan rawit.'),
('MN012', 2, 'Es Teh Manis', 5000.00, 'Tersedia', '2-3 menit', 'Teh melati seduh segar, gula tebu asli, es batu kristal higienis', 'Teh melati wangi dingin menyegarkan pelepas dahaga.'),
('MN013', 2, 'Es Jeruk Peras', 7000.00, 'Tersedia', '3-5 menit', 'Jeruk peras murni, air gula, es batu kristal', 'Jeruk segar peras asli kaya vitamin C dan menyegarkan.'),
('MN014', 2, 'Kopi Tubruk Si Bungsu', 6000.00, 'Tersedia', '3-5 menit', 'Bubuk kopi robusta pilihan, gula pasir', 'Kopi hitam seduh tradisional mantap dengan aroma pekat.'),
('MN015', 3, 'Lumpia Goreng Spesial (3 pcs)', 12000.00, 'Tersedia', '7-10 menit', 'Kulit lumpia renyah, isian ayam, rebung, sayur, sambal kecap rawit', 'Lumpia goreng emas krispi dengan cocolan sambal kecap pedas gurih khas Warung Si Bungsu.'),
('MN016', 3, 'Kentang Goreng Krispi', 10000.00, 'Tersedia', '7-10 menit', 'Kentang potong crinkle, bumbu tabur gurih, saus cabai & mayonaise', 'Kentang goreng renyah garing di luar, empuk di dalam.'),
('MN017', 4, 'Paket Hemat Pelajar (Nasi Ayam + Es Teh)', 22000.00, 'Tersedia', '10-15 menit', 'Nasi putih pulen, ayam goreng krispi, sambal bawang, es teh manis jumbo', 'Kombinasi komplit hemat mengenyangkan untuk makan siang aktif.');

-- Meja Makan
INSERT INTO `dining_tables` (`table_number`, `qr_code_token`, `status`) VALUES
('Meja 01', 'TOKEN_TABLE_01', 'Kosong'),
('Meja 02', 'TOKEN_TABLE_02', 'Terisi'),
('Meja 03', 'TOKEN_TABLE_03', 'Terisi'),
('Meja 04', 'TOKEN_TABLE_04', 'Kosong'),
('Meja 05', 'TOKEN_TABLE_05', 'Terisi'),
('Meja 06', 'TOKEN_TABLE_06', 'Terisi'),
('Meja 07', 'TOKEN_TABLE_07', 'Terisi'),
('Meja 08', 'TOKEN_TABLE_08', 'Terisi'),
('Meja 09', 'TOKEN_TABLE_09', 'Terisi'),
('Meja 10', 'TOKEN_TABLE_10', 'Terisi');

-- Stok Bahan Baku Sesuai Slide 16
INSERT INTO `stock_items` (`name`, `category`, `unit`, `current_stock`, `min_stock`, `status`, `location`, `notes`) VALUES
('Beras', 'Bahan Pokok', 'kg', 25.00, 10.00, 'Aman', 'Rak Dapur', 'Stok rutin untuk kebutuhan dapur harian.'),
('Ayam Potong', 'Protein', 'kg', 8.00, 5.00, 'Aman', 'Freezer 1', 'Ayam segar potong 8 bagian.'),
('Ayam Fillet', 'Protein', 'kg', 6.00, 10.00, 'Menipis', 'Freezer 1', 'Fillet dada ayam tanpa tulang untuk steak & crispy.'),
('Telur', 'Protein', 'kg', 12.00, 10.00, 'Aman', 'Rak Telur Belakang', 'Telur ayam negeri fresh.'),
('Minyak Goreng', 'Bahan Pokok', 'liter', 5.00, 5.00, 'Menipis', 'Gudang Belakang', 'Minyak kelapa sawit premium jerigen.'),
('Cabai Merah', 'Bumbu & Sayur', 'kg', 2.00, 5.00, 'Menipis', 'Chiller Bumbu', 'Cabai merah keriting untuk racikan sambal geprek.'),
('Bawang Merah', 'Bumbu & Sayur', 'kg', 0.00, 5.00, 'Habis', 'Rak Bumbu Kering', 'Harus segera dipesan ke pasar induk.'),
('Bawang Putih', 'Bumbu & Sayur', 'kg', 3.00, 5.00, 'Menipis', 'Rak Bumbu Kering', 'Bawang kating kupas.'),
('Timun', 'Bumbu & Sayur', 'kg', 8.00, 5.00, 'Aman', 'Chiller Sayur', 'Timun lalap segar hijau.'),
('Kol', 'Bumbu & Sayur', 'kg', 4.00, 5.00, 'Menipis', 'Chiller Sayur', 'Kol bulat segar.'),
('Teh Celup', 'Minuman', 'pack', 20.00, 10.00, 'Aman', 'Lemari Minuman', 'Teh melati celup isi 25 sachet.'),
('Kopi Sachet', 'Minuman', 'pack', 18.00, 10.00, 'Aman', 'Lemari Minuman', 'Kopi hitam bubuk sachet renteng.'),
('Gula Pasir', 'Bahan Pokok', 'kg', 3.00, 5.00, 'Menipis', 'Rak Gula', 'Gula pasir kristal putih.'),
('Es Batu', 'Minuman', 'kg', 0.00, 5.00, 'Habis', 'Chest Freezer Es', 'Menunggu kiriman es kristal higienis.'),
('Air Galon', 'Minuman', 'galon', 4.00, 3.00, 'Aman', 'Dispenser & Gudang', 'Galon air mineral higienis.'),
('Cup Plastik', 'Kemasan', 'pcs', 150.00, 100.00, 'Aman', 'Rak Kemasan Takeaway', 'Cup 16oz dengan tutup sealer.'),
('Tisu', 'Kemasan', 'pack', 2.00, 5.00, 'Menipis', 'Meja Kasir', 'Tisu makan dispenser meja.');

-- Mutasi Stok Beras (Slide 16)
INSERT INTO `stock_movements` (`stock_item_id`, `type`, `amount`, `unit`, `note`) VALUES
(1, 'Barang Masuk', 5.00, 'kg', 'Stok rutin bulanan'),
(1, 'Dipakai Dapur', -2.00, 'kg', 'Untuk masak nasi'),
(1, 'Penyesuaian', -1.00, 'kg', 'Selisih stok fisik');

-- Pelanggan (Slide 18)
INSERT INTO `customers` (`name`, `total_orders`, `total_spent`, `last_order_date`, `favorite_menu`) VALUES
('Andi Pratama', 8, 420000.00, '21 Okt 2026', 'Ayam Geprek'),
('Siti Rahma', 12, 650000.00, '21 Okt 2026', 'Nasi Goreng Spesial'),
('Budi Santoso', 5, 230000.00, '20 Okt 2026', 'Oseng Taichan'),
('Dewi Lestari', 9, 480000.00, '20 Okt 2026', 'Chicken Steak Lada Hitam'),
('Maya Sari', 4, 180000.00, '20 Okt 2026', 'Nasi Goreng Spesial'),
('Fajar Hidayat', 7, 310000.00, '19 Okt 2026', 'Nasi Ikan Goreng'),
('Nina Anggraini', 3, 120000.00, '18 Okt 2026', 'Nasi Udang Tempura'),
('Rizky Maulana', 6, 270000.00, '20 Okt 2026', 'Chicken Steak Lada Hitam'),
('Agus Setiawan', 4, 195000.00, '19 Okt 2026', 'Indomie Goreng Dobel'),
('Putri Ananda', 5, 250000.00, '21 Okt 2026', 'Paket Hemat Pelajar');

-- Pesanan Aktif Sesuai Slide 6
INSERT INTO `orders` (`id`, `order_number`, `table_number`, `customer_name`, `customer_id`, `user_id`, `source`, `status`, `payment_status`, `payment_method`, `reference_no`, `notes`, `subtotal`, `discount`, `tax`, `total`, `created_at`) VALUES
(1, '#SB-20261021-001', 'Meja 05', 'Andi Pratama', 1, 1, 'QR', 'Baru', 'Lunas', 'QRIS', 'QRIS-20261021-001', 'Nasi goreng sedang aja', 55000.00, 0.00, 0.00, 55000.00, '2026-10-21 10:20:00'),
(2, '#SB-20261021-002', 'Meja 02', 'Siti Rahma', 2, 2, 'Kasir', 'Diproses', 'Lunas', 'Tunai', 'CASH-20261021-002', 'Pedas level 3', 42000.00, 0.00, 0.00, 42000.00, '2026-10-21 10:15:00'),
(3, '#SB-20261021-003', 'Meja 08', 'Budi Santoso', 3, 1, 'QR', 'Baru', 'Lunas', 'QRIS', 'QRIS-20261021-003', 'Kuah banyakin', 28000.00, 0.00, 0.00, 28000.00, '2026-10-21 10:10:00'),
(4, '#SB-20261021-004', 'Meja 01', 'Dewi Lestari', 4, 1, 'QR', 'Siap Disajikan', 'Lunas', 'QRIS', 'QRIS-20261021-004', 'Saus dipisah', 35000.00, 0.00, 0.00, 35000.00, '2026-10-21 10:05:00'),
(5, '#SB-20261021-005', 'Meja 10', 'Maya Sari', 5, 3, 'Kasir', 'Diproses', 'Lunas', 'E-Wallet', 'OVO-20261021-005', 'Telur setengah matang', 68000.00, 0.00, 0.00, 68000.00, '2026-10-21 09:55:00'),
(6, '#SB-20261021-006', 'Meja 07', 'Fajar Hidayat', 6, 2, 'Kasir', 'Diproses', 'Lunas', 'Tunai', 'CASH-20261021-006', 'Sambal ekstra', 24000.00, 0.00, 0.00, 24000.00, '2026-10-21 09:50:00'),
(7, '#SB-20261021-007', 'Meja 03', 'Nina Anggraini', 7, 1, 'QR', 'Siap Disajikan', 'Lunas', 'QRIS', 'QRIS-20261021-007', 'Kopi sedang', 46000.00, 0.00, 0.00, 46000.00, '2026-10-21 09:45:00'),
(8, '#SB-20261021-008', 'Meja 06', 'Rizky Maulana', 8, 3, 'Kasir', 'Diproses', 'Lunas', 'Debit/Kartu', 'BCA-20261021-008', 'Saos dipisah', 31000.00, 0.00, 0.00, 31000.00, '2026-10-21 09:40:00'),
(9, '#SB-20261021-009', 'Meja 04', 'Agus Setiawan', 9, 1, 'QR', 'Siap Disajikan', 'Lunas', 'QRIS', 'QRIS-20261021-009', 'Sawi banyakin', 27000.00, 0.00, 0.00, 27000.00, '2026-10-21 09:35:00'),
(10, '#SB-20261021-010', 'Meja 09', 'Putri Ananda', 10, 2, 'Kasir', 'Diproses', 'Lunas', 'E-Wallet', 'GOPAY-20261021-010', 'Tanpa es', 52000.00, 0.00, 0.00, 52000.00, '2026-10-21 09:30:00');

-- Order Items untuk Pesanan #SB-20261021-001 (Slide 6 & 8)
INSERT INTO `order_items` (`order_id`, `product_id`, `product_name`, `price`, `qty`, `subtotal`) VALUES
(1, 5, 'Nasi Goreng Spesial', 25000.00, 1, 25000.00),
(1, 1, 'Nasi Ayam Geprek', 20000.00, 1, 20000.00),
(1, 12, 'Es Teh Manis', 5000.00, 2, 10000.00),
(2, 1, 'Ayam Geprek', 20000.00, 2, 40000.00),
(2, 12, 'Es Teh Manis', 5000.00, 1, 5000.00);

-- Pengaturan Usaha (Slide 20)
INSERT INTO `settings` (`key_name`, `key_value`) VALUES
('store_name', 'Warung Si Bungsu'),
('store_address', 'Gg. Remaja 2 Blok Remaja 2 No.16, RT.6/RW.3, Gedong, Kec. Ps. Rebo, Jakarta Timur 13760'),
('store_phone', '+62 852-1189-4007'),
('store_instagram', '@wrg_sibungsu'),
('open_time', '09:00'),
('close_time', '22:00'),
('total_tables', '10'),
('active_qrs', '10'),
('payment_tunai', '1'),
('payment_qris', '1'),
('payment_debit', '1'),
('payment_ewallet', '1'),
('printer_status', 'Terhubung');
