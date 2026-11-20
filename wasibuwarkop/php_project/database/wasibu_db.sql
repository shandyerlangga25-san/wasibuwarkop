-- ============================================================
-- SKEMA DATABASE: wasibu_db
-- Aplikasi: WASIBU (Warung Si Bungsu) Merchant POS & Management
-- Engine: MySQL 8.0 / MariaDB 10.4+ (XAMPP Default)
-- ============================================================

CREATE DATABASE IF NOT EXISTS `wasibu_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `wasibu_db`;

-- 1. Tabel Users
DROP TABLE IF EXISTS `users`;
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

-- 2. Tabel Categories
DROP TABLE IF EXISTS `categories`;
CREATE TABLE `categories` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(50) NOT NULL UNIQUE,
  `slug` VARCHAR(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Tabel Products
DROP TABLE IF EXISTS `products`;
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

-- 4. Tabel Dining Tables
DROP TABLE IF EXISTS `dining_tables`;
CREATE TABLE `dining_tables` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `table_number` VARCHAR(20) NOT NULL UNIQUE,
  `qr_code_token` VARCHAR(100) NOT NULL,
  `status` ENUM('Kosong', 'Terisi', 'Reservasi') DEFAULT 'Kosong'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. Tabel Customers
DROP TABLE IF EXISTS `customers`;
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

-- 6. Tabel Orders
DROP TABLE IF EXISTS `orders`;
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

-- 7. Tabel Order Items
DROP TABLE IF EXISTS `order_items`;
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

-- 8. Tabel Stock Items
DROP TABLE IF EXISTS `stock_items`;
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

-- 9. Tabel Stock Movements
DROP TABLE IF EXISTS `stock_movements`;
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

-- 10. Tabel Settings
DROP TABLE IF EXISTS `settings`;
CREATE TABLE `settings` (
  `key_name` VARCHAR(50) PRIMARY KEY,
  `key_value` TEXT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- DATA SEEDER AWAL
INSERT INTO `users` (`name`, `username`, `email`, `password`, `role`) VALUES
('Admin Utama', 'admin', 'admin@wasibu.id', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin'),
('Kasir 1', 'kasir1', 'kasir1@wasibu.id', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Kasir'),
('Kasir 2', 'kasir2', 'kasir2@wasibu.id', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Kasir');

INSERT INTO `categories` (`name`, `slug`) VALUES
('Makanan', 'makanan'),
('Minuman', 'minuman'),
('Cemilan', 'cemilan'),
('Paket Hemat', 'paket-hemat');

INSERT INTO `products` (`code`, `category_id`, `name`, `price`, `status`, `prep_time`, `ingredients`, `description`) VALUES
('MN001', 1, 'Ayam Geprek', 20000.00, 'Tersedia', '10-15 menit', 'Nasi, ayam goreng crispy, sambal, lalapan (timun, selada)', 'Ayam goreng crispy dengan sambal pedas khas Warung Si Bungsu, disajikan dengan nasi dan lalapan segar.'),
('MN002', 1, 'Chicken Steak Ayam Crispy Lada Hitam', 17000.00, 'Tersedia', '12-18 menit', 'Daging ayam fillet crispy, saus lada hitam khas, kentang', 'Fillet ayam krispi renyah dengan siraman saus lada hitam pedas gurih.'),
('MN003', 1, 'Oseng Taichan', 15000.00, 'Tersedia', '10-12 menit', 'Daging ayam cincang dadu, cabai rawit pedas, jeruk nipis', 'Potongan ayam empuk dioseng dengan bumbu taichan pedas segar.'),
('MN004', 1, 'Nasi Ayam Crispy Asam Manis', 15000.00, 'Tersedia', '10-15 menit', 'Nasi, ayam fillet krispi, saus asam manis nanas', 'Ayam renyah berpadu saus asam manis nan segar.'),
('MN005', 1, 'Nasi Goreng Spesial', 25000.00, 'Tersedia', '10-12 menit', 'Nasi gurih, telur ceplok, suwir ayam, sosis, kerupuk', 'Nasi goreng harum khas bumbu warung dengan topping komplit.'),
('MN012', 2, 'Es Teh Manis', 5000.00, 'Tersedia', '2-3 menit', 'Teh melati seduh segar, gula asli, es batu kristal', 'Teh melati wangi dingin menyegarkan.');

INSERT INTO `dining_tables` (`table_number`, `qr_code_token`) VALUES
('Meja 01', 'TOKEN_01'), ('Meja 02', 'TOKEN_02'), ('Meja 03', 'TOKEN_03'), ('Meja 04', 'TOKEN_04'), ('Meja 05', 'TOKEN_05'),
('Meja 06', 'TOKEN_06'), ('Meja 07', 'TOKEN_07'), ('Meja 08', 'TOKEN_08'), ('Meja 09', 'TOKEN_09'), ('Meja 10', 'TOKEN_10');

INSERT INTO `stock_items` (`name`, `category`, `unit`, `current_stock`, `min_stock`, `status`, `location`, `notes`) VALUES
('Beras', 'Bahan Pokok', 'kg', 25.00, 10.00, 'Aman', 'Rak Dapur', 'Stok rutin untuk kebutuhan dapur harian.'),
('Ayam Potong', 'Protein', 'kg', 8.00, 5.00, 'Aman', 'Freezer 1', 'Ayam segar potong 8 bagian.'),
('Ayam Fillet', 'Protein', 'kg', 6.00, 10.00, 'Menipis', 'Freezer 1', 'Fillet dada ayam tanpa tulang.'),
('Telur', 'Protein', 'kg', 12.00, 10.00, 'Aman', 'Rak Telur Belakang', 'Telur ayam negeri fresh.'),
('Minyak Goreng', 'Bahan Pokok', 'liter', 5.00, 5.00, 'Menipis', 'Gudang Belakang', 'Minyak sawit jerigen.'),
('Bawang Merah', 'Bumbu & Sayur', 'kg', 0.00, 5.00, 'Habis', 'Rak Bumbu Kering', 'Perlu restock segera.'),
('Es Batu', 'Minuman', 'kg', 0.00, 5.00, 'Habis', 'Chest Freezer', 'Menunggu kiriman es kristal.');

INSERT INTO `settings` (`key_name`, `key_value`) VALUES
('store_name', 'Warung Si Bungsu'),
('store_address', 'Gg. Remaja 2 Blok Remaja 2 No.16, RT.6/RW.3, Gedong, Kec. Ps. Rebo, Jakarta Timur 13760'),
('store_phone', '+62 852-1189-4007'),
('store_instagram', '@wrg_sibungsu'),
('open_time', '09:00'),
('close_time', '22:00'),
('total_tables', '10');
