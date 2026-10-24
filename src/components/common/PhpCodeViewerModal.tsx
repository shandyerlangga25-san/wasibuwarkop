import React, { useState } from 'react';
import { X, Copy, Check, Download, FileCode, Database, Terminal, Server } from 'lucide-react';
import { useWasibu } from '../../context/WasibuContext';

interface CodeFile {
  name: string;
  path: string;
  language: string;
  description: string;
  content: string;
}

export const PhpCodeViewerModal: React.FC = () => {
  const { isSourceCodeModalOpen, closeSourceCodeModal } = useWasibu();
  const [activeFileIndex, setActiveFileIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  const files: CodeFile[] = [
    {
      name: 'wasibu_db.sql',
      path: 'database/wasibu_db.sql',
      language: 'sql',
      description: 'Skema Database MySQL lengkap (Tabel users, products, orders, items, stock, settings)',
      content: `-- ============================================================
-- DATABASE SKEMA: wasibu_db (Warung Si Bungsu)
-- Sistem Manajemen & Kasir Warung Si Bungsu
-- Target DBMS: MySQL 8.0 / MariaDB 10.4+ (XAMPP Default)
-- ============================================================

CREATE DATABASE IF NOT EXISTS \`wasibu_db\` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE \`wasibu_db\`;

-- 1. TABEL PENGGUNA (USERS)
DROP TABLE IF EXISTS \`users\`;
CREATE TABLE \`users\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`name\` VARCHAR(100) NOT NULL,
  \`username\` VARCHAR(50) NOT NULL UNIQUE,
  \`email\` VARCHAR(100) NOT NULL UNIQUE,
  \`password\` VARCHAR(255) NOT NULL,
  \`role\` ENUM('Admin', 'Owner', 'Kasir') NOT NULL DEFAULT 'Kasir',
  \`status\` ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. TABEL KATEGORI (CATEGORIES)
DROP TABLE IF EXISTS \`categories\`;
CREATE TABLE \`categories\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`name\` VARCHAR(50) NOT NULL UNIQUE,
  \`slug\` VARCHAR(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. TABEL PRODUK / MENU (PRODUCTS)
DROP TABLE IF EXISTS \`products\`;
CREATE TABLE \`products\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`code\` VARCHAR(20) NOT NULL UNIQUE,
  \`category_id\` INT NOT NULL,
  \`name\` VARCHAR(150) NOT NULL,
  \`price\` DECIMAL(12, 2) NOT NULL,
  \`status\` ENUM('Tersedia', 'Habis') NOT NULL DEFAULT 'Tersedia',
  \`image\` VARCHAR(255) NULL,
  \`prep_time\` VARCHAR(50) DEFAULT '10-15 menit',
  \`ingredients\` TEXT NULL,
  \`description\` TEXT NULL,
  \`is_active\` TINYINT(1) DEFAULT 1,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (\`category_id\`) REFERENCES \`categories\`(\`id\`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. TABEL MEJA (DINING_TABLES)
DROP TABLE IF EXISTS \`dining_tables\`;
CREATE TABLE \`dining_tables\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`table_number\` VARCHAR(20) NOT NULL UNIQUE,
  \`qr_code_token\` VARCHAR(100) NOT NULL,
  \`status\` ENUM('Kosong', 'Terisi', 'Reservasi') DEFAULT 'Kosong'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. TABEL PELANGGAN (CUSTOMERS)
DROP TABLE IF EXISTS \`customers\`;
CREATE TABLE \`customers\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`name\` VARCHAR(100) NOT NULL,
  \`phone\` VARCHAR(30) NULL,
  \`total_orders\` INT DEFAULT 0,
  \`total_spent\` DECIMAL(14, 2) DEFAULT 0.00,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. TABEL PESANAN (ORDERS)
DROP TABLE IF EXISTS \`orders\`;
CREATE TABLE \`orders\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`order_number\` VARCHAR(50) NOT NULL UNIQUE,
  \`table_number\` VARCHAR(20) NOT NULL,
  \`customer_name\` VARCHAR(100) DEFAULT 'Pelanggan Meja',
  \`customer_id\` INT NULL,
  \`user_id\` INT NULL, -- Kasir yang menangani
  \`source\` ENUM('QR', 'Kasir') NOT NULL DEFAULT 'Kasir',
  \`status\` ENUM('Baru', 'Diproses', 'Siap Disajikan', 'Selesai', 'Dibatalkan') NOT NULL DEFAULT 'Baru',
  \`payment_status\` ENUM('Belum Bayar', 'Lunas') NOT NULL DEFAULT 'Belum Bayar',
  \`payment_method\` ENUM('Tunai', 'QRIS', 'Debit/Kartu', 'E-Wallet') NOT NULL DEFAULT 'Tunai',
  \`reference_no\` VARCHAR(100) NULL,
  \`notes\` TEXT NULL,
  \`subtotal\` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  \`discount\` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  \`tax\` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  \`total\` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  \`cash_received\` DECIMAL(12, 2) NULL,
  \`cash_change\` DECIMAL(12, 2) NULL,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE SET NULL,
  FOREIGN KEY (\`customer_id\`) REFERENCES \`customers\`(\`id\`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 7. TABEL ITEM PESANAN (ORDER_ITEMS)
DROP TABLE IF EXISTS \`order_items\`;
CREATE TABLE \`order_items\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`order_id\` INT NOT NULL,
  \`product_id\` INT NOT NULL,
  \`product_name\` VARCHAR(150) NOT NULL, -- snapshot nama menu
  \`price\` DECIMAL(12, 2) NOT NULL, -- snapshot harga menu
  \`qty\` INT NOT NULL DEFAULT 1,
  \`subtotal\` DECIMAL(12, 2) NOT NULL,
  FOREIGN KEY (\`order_id\`) REFERENCES \`orders\`(\`id\`) ON DELETE CASCADE,
  FOREIGN KEY (\`product_id\`) REFERENCES \`products\`(\`id\`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 8. TABEL STOK BARANG & BAHAN BAKU (INGREDIENTS / STOCK)
DROP TABLE IF EXISTS \`stock_items\`;
CREATE TABLE \`stock_items\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`name\` VARCHAR(100) NOT NULL,
  \`category\` ENUM('Bahan Pokok', 'Protein', 'Bumbu & Sayur', 'Minuman', 'Kemasan') NOT NULL,
  \`unit\` VARCHAR(20) NOT NULL, -- kg, liter, pack, pcs, galon
  \`current_stock\` DECIMAL(10, 2) NOT NULL DEFAULT 0,
  \`min_stock\` DECIMAL(10, 2) NOT NULL DEFAULT 5,
  \`status\` ENUM('Aman', 'Menipis', 'Habis') NOT NULL DEFAULT 'Aman',
  \`location\` VARCHAR(100) DEFAULT 'Rak Dapur',
  \`notes\` TEXT NULL,
  \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 9. TABEL RIWAYAT PERUBAHAN STOK (STOCK_MOVEMENTS)
DROP TABLE IF EXISTS \`stock_movements\`;
CREATE TABLE \`stock_movements\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`stock_item_id\` INT NOT NULL,
  \`type\` ENUM('Barang Masuk', 'Dipakai Dapur', 'Penyesuaian') NOT NULL,
  \`amount\` DECIMAL(10, 2) NOT NULL,
  \`unit\` VARCHAR(20) NOT NULL,
  \`note\` VARCHAR(255) NULL,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (\`stock_item_id\`) REFERENCES \`stock_items\`(\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 10. TABEL PENGATURAN USAHA (SETTINGS)
DROP TABLE IF EXISTS \`settings\`;
CREATE TABLE \`settings\` (
  \`key_name\` VARCHAR(50) PRIMARY KEY,
  \`key_value\` TEXT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- DATA AWAL (SEEDER)
INSERT INTO \`users\` (\`name\`, \`username\`, \`email\`, \`password\`, \`role\`) VALUES
('Admin Utama', 'admin', 'admin@wasibu.id', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin'), -- pass: password
('Kasir 1', 'kasir1', 'kasir1@wasibu.id', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Kasir'),
('Kasir 2', 'kasir2', 'kasir2@wasibu.id', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Kasir');

INSERT INTO \`categories\` (\`name\`, \`slug\`) VALUES
('Makanan', 'makanan'),
('Minuman', 'minuman'),
('Cemilan', 'cemilan'),
('Paket Hemat', 'paket-hemat');

INSERT INTO \`products\` (\`code\`, \`category_id\`, \`name\`, \`price\`, \`status\`, \`prep_time\`, \`ingredients\`, \`description\`) VALUES
('MN001', 1, 'Ayam Geprek', 20000.00, 'Tersedia', '10-15 menit', 'Nasi, ayam goreng crispy, sambal, lalapan (timun, selada)', 'Ayam goreng crispy dengan sambal pedas khas Warung Si Bungsu, disajikan dengan nasi dan lalapan segar.'),
('MN002', 1, 'Chicken Steak Ayam Crispy Lada Hitam', 17000.00, 'Tersedia', '12-18 menit', 'Daging ayam fillet crispy, saus lada hitam khas, kentang', 'Fillet ayam krispi renyah dengan siraman saus lada hitam pedas gurih.'),
('MN003', 1, 'Oseng Taichan', 15000.00, 'Tersedia', '10-12 menit', 'Daging ayam cincang dadu, cabai rawit pedas, jeruk nipis', 'Potongan ayam empuk dioseng dengan bumbu taichan pedas segar.'),
('MN004', 1, 'Nasi Ayam Crispy Asam Manis', 15000.00, 'Tersedia', '10-15 menit', 'Nasi, ayam fillet krispi, saus asam manis nanas', 'Ayam renyah berpadu saus asam manis nan segar.'),
('MN005', 1, 'Nasi Goreng Spesial', 25000.00, 'Tersedia', '10-12 menit', 'Nasi gurih, telur ceplok, suwir ayam, sosis, kerupuk', 'Nasi goreng harum khas bumbu warung dengan topping komplit.'),
('MN012', 2, 'Es Teh Manis', 5000.00, 'Tersedia', '2-3 menit', 'Teh melati seduh segar, gula asli, es batu kristal', 'Teh melati wangi dingin menyegarkan.');

INSERT INTO \`dining_tables\` (\`table_number\`, \`qr_code_token\`) VALUES
('Meja 01', 'TOKEN_TABLE_01'),
('Meja 02', 'TOKEN_TABLE_02'),
('Meja 03', 'TOKEN_TABLE_03'),
('Meja 04', 'TOKEN_TABLE_04'),
('Meja 05', 'TOKEN_TABLE_05'),
('Meja 06', 'TOKEN_TABLE_06'),
('Meja 07', 'TOKEN_TABLE_07'),
('Meja 08', 'TOKEN_TABLE_08'),
('Meja 09', 'TOKEN_TABLE_09'),
('Meja 10', 'TOKEN_TABLE_10');

INSERT INTO \`settings\` (\`key_name\`, \`key_value\`) VALUES
('store_name', 'Warung Si Bungsu'),
('store_address', 'Gg. Remaja 2 Blok Remaja 2 No.16, RT.6/RW.3, Gedong, Kec. Ps. Rebo, Jakarta Timur 13760'),
('store_phone', '+62 852-1189-4007'),
('store_instagram', '@wrg_sibungsu'),
('open_time', '09:00'),
('close_time', '22:00'),
('total_tables', '10');
`,
    },
    {
      name: 'database.php',
      path: 'config/database.php',
      language: 'php',
      description: 'Koneksi Database PDO Aman dengan Penanganan Error',
      content: `<?php
/**
 * Konfigurasi Database WASIBU (Warung Si Bungsu)
 * File: config/database.php
 */

define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'wasibu_db');
define('DB_PORT', 3306);

function getDBConnection(): PDO {
    static $pdo = null;
    if ($pdo === null) {
        $dsn = "mysql:host=" . DB_HOST . ";port=" . DB_PORT . ";dbname=" . DB_NAME . ";charset=utf8mb4";
        $options = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ];
        try {
            $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
        } catch (PDOException $e) {
            die("Koneksi Database Gagal: " . htmlspecialchars($e->getMessage()));
        }
    }
    return $pdo;
}
`,
    },
    {
      name: 'auth.php',
      path: 'includes/auth.php',
      language: 'php',
      description: 'Manajemen Session, Cek Login & Role-Based Access Control',
      content: `<?php
/**
 * Otentikasi dan Otorisasi Sesi Pengguna
 * File: includes/auth.php
 */

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

function isLoggedIn(): bool {
    return isset($_SESSION['user_id']) && !empty($_SESSION['user_id']);
}

function requireLogin(): void {
    if (!isLoggedIn()) {
        header("Location: /wasibu/login.php?error=unauthorized");
        exit();
    }
}

function requireRole(array $allowedRoles): void {
    requireLogin();
    $currentRole = $_SESSION['user_role'] ?? '';
    if (!in_array($currentRole, $allowedRoles)) {
        header("Location: /wasibu/dashboard/index.php?error=forbidden");
        exit();
    }
}

function getCurrentUser(): ?array {
    if (!isLoggedIn()) return null;
    return [
        'id'       => $_SESSION['user_id'],
        'name'     => $_SESSION['user_name'] ?? 'Pengguna',
        'username' => $_SESSION['user_username'] ?? '',
        'role'     => $_SESSION['user_role'] ?? 'Kasir',
    ];
}
`,
    },
    {
      name: 'index.php (Pesanan Aktif)',
      path: 'pesanan/index.php',
      language: 'php',
      description: 'Halaman Utama Pesanan Aktif (Slide 6)',
      content: `<?php
/**
 * Modul Pesanan Aktif - Warung Si Bungsu
 * File: pesanan/index.php
 */
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../includes/auth.php';
requireLogin();

$pdo = getDBConnection();

// Ambil Statistik Pesanan Aktif
$stats = [
    'total'         => 0,
    'baru'          => 0,
    'diproses'      => 0,
    'siap_disajikan' => 0,
    'selesai'       => 0,
];

$stmt = $pdo->query("SELECT status, COUNT(*) as count FROM orders WHERE DATE(created_at) = CURDATE() GROUP BY status");
while ($row = $stmt->fetch()) {
    if ($row['status'] === 'Baru') $stats['baru'] = $row['count'];
    if ($row['status'] === 'Diproses') $stats['diproses'] = $row['count'];
    if ($row['status'] === 'Siap Disajikan') $stats['siap_disajikan'] = $row['count'];
    if ($row['status'] === 'Selesai') $stats['selesai'] = $row['count'];
}
$stats['total'] = $stats['baru'] + $stats['diproses'] + $stats['siap_disajikan'];

// Filter Status
$filterStatus = $_GET['status'] ?? 'semua';
$query = "SELECT * FROM orders WHERE status != 'Dibatalkan'";
$params = [];

if ($filterStatus !== 'semua' && !empty($filterStatus)) {
    $query .= " AND status = ?";
    $params[] = $filterStatus;
}
$query .= " ORDER BY id DESC LIMIT 50";

$stmt = $pdo->prepare($query);
$stmt->execute($params);
$orders = $stmt->fetchAll();

// Include Layout
$pageTitle = "Pesanan Aktif - Warung Si Bungsu";
include __DIR__ . '/../includes/header.php';
include __DIR__ . '/../includes/sidebar.php';
include __DIR__ . '/../includes/navbar.php';
?>

<main class="content-wrapper p-6 bg-gray-50 flex-1">
  <div class="flex items-center justify-between mb-6">
    <div>
      <h1 class="text-2xl font-bold text-gray-900">Pesanan Aktif</h1>
      <p class="text-xs text-gray-500">Kelola semua pesanan dari kasir, QR Code, dan meja.</p>
    </div>
    <a href="tambah.php" class="btn-primary inline-flex items-center gap-2 px-4 py-2.5 bg-orange-600 text-white font-semibold rounded-xl text-sm shadow-sm hover:bg-orange-700">
      + Pesanan Baru
    </a>
  </div>

  <!-- Stat Cards -->
  <div class="grid grid-cols-5 gap-4 mb-6">
    <div class="card p-4 bg-orange-50/60 border border-orange-200/80 rounded-2xl">
      <span class="text-xs font-semibold text-gray-500">Total Pesanan Aktif</span>
      <h3 class="text-2xl font-bold text-orange-600 mt-1"><?= $stats['total'] ?></h3>
    </div>
    <div class="card p-4 bg-sky-50/60 border border-sky-200/80 rounded-2xl">
      <span class="text-xs font-semibold text-gray-500">Pesanan Baru</span>
      <h3 class="text-2xl font-bold text-sky-600 mt-1"><?= $stats['baru'] ?></h3>
    </div>
    <div class="card p-4 bg-amber-50/60 border border-amber-200/80 rounded-2xl">
      <span class="text-xs font-semibold text-gray-500">Diproses</span>
      <h3 class="text-2xl font-bold text-amber-600 mt-1"><?= $stats['diproses'] ?></h3>
    </div>
    <div class="card p-4 bg-emerald-50/60 border border-emerald-200/80 rounded-2xl">
      <span class="text-xs font-semibold text-gray-500">Siap Disajikan</span>
      <h3 class="text-2xl font-bold text-emerald-600 mt-1"><?= $stats['siap_disajikan'] ?></h3>
    </div>
    <div class="card p-4 bg-rose-50/60 border border-rose-200/80 rounded-2xl">
      <span class="text-xs font-semibold text-gray-500">Selesai Hari Ini</span>
      <h3 class="text-2xl font-bold text-rose-600 mt-1"><?= $stats['selesai'] ?></h3>
    </div>
  </div>

  <!-- Orders Grid & Detail View -->
  <!-- ... Sesuai implementasi lengkap ... -->
</main>

<?php include __DIR__ . '/../includes/footer.php'; ?>
`,
    },
    {
      name: 'update-status.php',
      path: 'pesanan/update-status.php',
      language: 'php',
      description: 'API Endpoint untuk Memperbarui Status Pesanan dengan Transaksi Database',
      content: `<?php
/**
 * Handler Pembaruan Status Pesanan
 * File: pesanan/update-status.php
 */
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../includes/auth.php';
requireLogin();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    die(json_encode(['status' => 'error', 'message' => 'Method not allowed']));
}

$orderId = intval($_POST['order_id'] ?? 0);
$newStatus = trim($_POST['status'] ?? '');
$validStatuses = ['Baru', 'Diproses', 'Siap Disajikan', 'Selesai', 'Dibatalkan'];

if (!$orderId || !in_array($newStatus, $validStatuses)) {
    die(json_encode(['status' => 'error', 'message' => 'Parameter tidak valid']));
}

$pdo = getDBConnection();

try {
    $pdo->beginTransaction();

    $stmt = $pdo->prepare("UPDATE orders SET status = ?, updated_at = NOW() WHERE id = ?");
    $stmt->execute([$newStatus, $orderId]);

    // Jika status Selesai, pastikan status pembayaran juga Lunas jika tunai
    if ($newStatus === 'Selesai') {
        $pdo->prepare("UPDATE orders SET payment_status = 'Lunas' WHERE id = ?")->execute([$orderId]);
    }

    $pdo->commit();
    echo json_encode(['status' => 'success', 'message' => 'Status pesanan berhasil diperbarui']);
} catch (Exception $e) {
    $pdo->rollBack();
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
`,
    },
    {
      name: 'struk.php',
      path: 'pesanan/struk.php',
      language: 'php',
      description: 'Format Cetak Struk Kasir Termal 58mm/80mm Browser-Ready',
      content: `<?php
/**
 * Cetak Struk Kasir Termal Warung Si Bungsu
 * File: pesanan/struk.php
 */
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../includes/auth.php';
requireLogin();

$orderId = intval($_GET['id'] ?? 0);
$pdo = getDBConnection();

$stmt = $pdo->prepare("SELECT o.*, u.name as cashier_name FROM orders o LEFT JOIN users u ON o.user_id = u.id WHERE o.id = ?");
$stmt->execute([$orderId]);
$order = $stmt->fetch();

if (!$order) {
    die("Pesanan tidak ditemukan.");
}

$stmtItems = $pdo->prepare("SELECT * FROM order_items WHERE order_id = ?");
$stmtItems->execute([$orderId]);
$items = $stmtItems->fetchAll();
?>
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>Struk <?= htmlspecialchars($order['order_number']) ?></title>
  <style>
    @media print {
      body { margin: 0; padding: 0; }
      .no-print { display: none; }
    }
    body {
      font-family: 'Courier New', monospace;
      font-size: 11px;
      line-height: 1.4;
      background: #f4f4f4;
      display: flex;
      justify-content: center;
      padding: 20px;
    }
    .receipt {
      background: #fff;
      width: 320px;
      padding: 20px;
      box-shadow: 0 0 10px rgba(0,0,0,0.1);
    }
    .text-center { text-align: center; }
    .text-right { text-align: right; }
    .dashed { border-bottom: 1px dashed #777; margin: 8px 0; }
    .bold { font-weight: bold; }
    .row { display: flex; justify-content: space-between; }
  </style>
</head>
<body onload="window.print()">
  <div class="receipt">
    <div class="text-center">
      <h2 style="margin: 0;">WARUNG SI BUNGSU</h2>
      <p style="margin: 4px 0; font-size: 9px;">Gg. Remaja 2 Blok Remaja 2 No.16, RT.6/RW.3, Gedong, Jakarta Timur</p>
      <p style="margin: 2px 0; font-size: 9px;">WA: +62 852-1189-4007 | IG: @wrg_sibungsu</p>
    </div>
    <div class="dashed"></div>
    <div class="row"><span>No. Pesanan:</span><span class="bold"><?= htmlspecialchars($order['order_number']) ?></span></div>
    <div class="row"><span>Tanggal:</span><span><?= htmlspecialchars($order['created_at']) ?></span></div>
    <div class="row"><span>Kasir:</span><span><?= htmlspecialchars($order['cashier_name'] ?? 'Admin') ?></span></div>
    <div class="row"><span>Pelanggan:</span><span><?= htmlspecialchars($order['customer_name']) ?></span></div>
    <div class="row"><span>Meja:</span><span class="bold"><?= htmlspecialchars($order['table_number']) ?></span></div>
    <div class="row"><span>Metode:</span><span><?= htmlspecialchars($order['payment_method']) ?> (<?= htmlspecialchars($order['payment_status']) ?>)</span></div>
    <div class="dashed"></div>
    <?php foreach ($items as $item): ?>
      <div class="row">
        <span><?= htmlspecialchars($item['product_name']) ?> x<?= $item['qty'] ?></span>
        <span>Rp<?= number_format($item['subtotal'], 0, ',', '.') ?></span>
      </div>
    <?php endforeach; ?>
    <div class="dashed"></div>
    <div class="row"><span>Subtotal:</span><span>Rp<?= number_format($order['subtotal'], 0, ',', '.') ?></span></div>
    <div class="row"><span>Diskon:</span><span>-Rp<?= number_format($order['discount'], 0, ',', '.') ?></span></div>
    <div class="row bold" style="font-size: 13px;"><span>TOTAL:</span><span>Rp<?= number_format($order['total'], 0, ',', '.') ?></span></div>
    <div class="dashed"></div>
    <div class="text-center" style="font-size: 9px; margin-top: 10px;">
      <p>Terima kasih sudah berkunjung!</p>
      <p>Makanan Halal & Higienis</p>
    </div>
  </div>
</body>
</html>
`,
    },
  ];

  if (!isSourceCodeModalOpen) return null;

  const currentFile = files[activeFileIndex];

  const handleCopy = () => {
    navigator.clipboard.writeText(currentFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([currentFile.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = currentFile.name;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl h-[85vh] bg-[#1E1E24] text-gray-200 rounded-2xl shadow-2xl border border-gray-800 flex flex-col overflow-hidden">
        {/* Top modal bar */}
        <div className="px-6 py-4 bg-[#18181D] border-b border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-orange-500/20 text-[#FF5722] flex items-center justify-center">
              <FileCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                Source Code PHP Native & MySQL (XAMPP Package)
              </h3>
              <p className="text-xs text-gray-400">
                Gunakan file ini untuk diletakkan di direktori <code className="text-orange-400">C:\xampp\htdocs\wasibu\</code>
              </p>
            </div>
          </div>
          <button
            onClick={closeSourceCodeModal}
            className="text-gray-400 hover:text-white p-1.5 rounded-lg hover:bg-gray-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content area: File tree on left, Code view on right */}
        <div className="flex-1 flex overflow-hidden">
          {/* File selector sidebar */}
          <div className="w-64 bg-[#141418] border-r border-gray-800 p-3 overflow-y-auto space-y-1">
            <div className="text-[10px] font-bold uppercase tracking-wider text-gray-500 px-3 py-2">
              Daftar Berkas PHP & SQL
            </div>
            {files.map((file, idx) => (
              <button
                key={file.path}
                type="button"
                onClick={() => {
                  setActiveFileIndex(idx);
                  setCopied(false);
                }}
                className={`w-full px-3 py-2.5 rounded-xl text-left text-xs font-mono flex items-center gap-2 transition ${
                  activeFileIndex === idx
                    ? 'bg-[#FF5722] text-white font-semibold shadow-sm'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/60'
                }`}
              >
                {file.name.endsWith('.sql') ? (
                  <Database className="w-3.5 h-3.5 flex-shrink-0" />
                ) : (
                  <FileCode className="w-3.5 h-3.5 flex-shrink-0" />
                )}
                <span className="truncate">{file.name}</span>
              </button>
            ))}

            {/* XAMPP Guide Notice */}
            <div className="mt-6 p-3 rounded-xl bg-gray-900/90 border border-gray-800 text-[11px] text-gray-400 leading-relaxed">
              <span className="font-bold text-orange-400 block mb-1">
                Panduan XAMPP:
              </span>
              1. Jalankan Apache & MySQL di XAMPP Control Panel.<br />
              2. Buka <code className="text-white">localhost/phpmyadmin</code> dan buat DB <code className="text-white">wasibu_db</code>.<br />
              3. Impor <code className="text-white">wasibu_db.sql</code>.<br />
              4. Buka URL: <code className="text-orange-300">localhost/wasibu</code>
            </div>
          </div>

          {/* Code Viewer */}
          <div className="flex-1 flex flex-col bg-[#1A1A20] overflow-hidden">
            {/* File info header */}
            <div className="px-6 py-3 bg-[#16161B] border-b border-gray-800 flex items-center justify-between">
              <div>
                <span className="text-xs font-mono text-orange-400 font-semibold">
                  /{currentFile.path}
                </span>
                <p className="text-[11px] text-gray-400 mt-0.5">{currentFile.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-lg transition"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-green-400" />
                      <span className="text-green-400">Tersalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Salin Kode</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleDownload}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-[#FF5722] hover:bg-[#E64A19] text-white rounded-lg transition"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Unduh File</span>
                </button>
              </div>
            </div>

            {/* Code container */}
            <div className="flex-1 p-5 overflow-auto font-mono text-xs text-gray-300 leading-relaxed bg-[#121216] select-text">
              <pre className="whitespace-pre">{currentFile.content}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
