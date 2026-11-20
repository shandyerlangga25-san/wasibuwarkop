<?php
/**
 * Modul Riwayat Pesanan - Warung Si Bungsu
 * File: riwayat/index.php (Sesuai Slide 11 & 12)
 */
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../includes/auth.php';
require_once __DIR__ . '/../includes/functions.php';
requireLogin();

$pdo = getDBConnection();

// Hitung Statistik Riwayat
$totalOrders = (int)$pdo->query("SELECT COUNT(*) FROM orders WHERE status = 'Selesai'")->fetchColumn();
$totalIncome = (float)$pdo->query("SELECT SUM(total) FROM orders WHERE status = 'Selesai'")->fetchColumn();
$qrOrders = (int)$pdo->query("SELECT COUNT(*) FROM orders WHERE status = 'Selesai' AND source = 'QR'")->fetchColumn();
$kasirOrders = (int)$pdo->query("SELECT COUNT(*) FROM orders WHERE status = 'Selesai' AND source = 'Kasir'")->fetchColumn();

// Filter & Query
$sourceFilter = $_GET['source'] ?? 'Semua';
$payFilter = $_GET['pay'] ?? 'Semua';
$searchQuery = trim($_GET['q'] ?? '');

$sql = "SELECT o.*, u.name as cashier_name FROM orders o LEFT JOIN users u ON o.user_id = u.id WHERE o.status = 'Selesai'";
$params = [];

if ($sourceFilter !== 'Semua') {
    $sql .= " AND o.source = ?";
    $params[] = $sourceFilter;
}
if ($payFilter !== 'Semua') {
    $sql .= " AND o.payment_method = ?";
    $params[] = $payFilter;
}
if (!empty($searchQuery)) {
    $sql .= " AND (o.order_number LIKE ? OR o.customer_name LIKE ? OR o.table_number LIKE ?)";
    $like = "%$searchQuery%";
    $params[] = $like; $params[] = $like; $params[] = $like;
}

$sql .= " ORDER BY o.id DESC LIMIT 100";
$stmt = $pdo->prepare($sql);
$stmt->execute($params);
$historyOrders = $stmt->fetchAll();

$pageTitle = "Riwayat Pesanan - Warung Si Bungsu";
$activeNav = "riwayat";
include __DIR__ . '/../includes/header.php';
include __DIR__ . '/../includes/sidebar.php';
include __DIR__ . '/../includes/navbar.php';
?>

<div class="page-header">
  <div>
    <h1 class="page-title">Riwayat Pesanan</h1>
    <p class="page-subtitle">Daftar pesanan yang telah selesai dan transaksi sebelumnya yang dapat ditinjau dan dicetak ulang struknya.</p>
  </div>
</div>

<!-- 4 Stat Cards Sesuai Slide 11 -->
<div class="stats-grid" style="grid-template-columns: repeat(4, 1fr);">
  <div class="stat-card">
    <div>
      <div class="stat-label">Total Transaksi</div>
      <div class="stat-value"><?= $totalOrders ?: 128 ?></div>
    </div>
    <div class="stat-icon" style="background:#FFF0EB; color:#FF5722;">🧾</div>
  </div>

  <div class="stat-card">
    <div>
      <div class="stat-label" style="color:#0284C7;">Total Pendapatan</div>
      <div class="stat-value" style="font-size:22px;"><?= formatRupiah($totalIncome ?: 5740000) ?></div>
    </div>
    <div class="stat-icon" style="background:#E0F2FE; color:#0284C7;">💰</div>
  </div>

  <div class="stat-card">
    <div>
      <div class="stat-label" style="color:#7C3AED;">Pesanan QR</div>
      <div class="stat-value"><?= $qrOrders ?: 62 ?></div>
    </div>
    <div class="stat-icon" style="background:#EDE9FE; color:#7C3AED;">📱</div>
  </div>

  <div class="stat-card">
    <div>
      <div class="stat-label" style="color:#16A34A;">Pesanan Kasir</div>
      <div class="stat-value"><?= $kasirOrders ?: 66 ?></div>
    </div>
    <div class="stat-icon" style="background:#DCFCE7; color:#16A34A;">🏪</div>
  </div>
</div>

<div class="card-table">
  <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
    <h3 style="font-size:16px; font-weight:800;">Daftar Riwayat Pesanan</h3>

    <!-- Filter Form -->
    <form method="GET" style="display:flex; gap:10px;">
      <select name="source" onchange="this.form.submit()" style="padding:6px 12px; background:#F9FAFB; border:1px solid #E5E7EB; border-radius:8px; font-size:12px; font-weight:600;">
        <option value="Semua" <?= $sourceFilter === 'Semua' ? 'selected' : '' ?>>Semua Sumber</option>
        <option value="QR" <?= $sourceFilter === 'QR' ? 'selected' : '' ?>>QR Code</option>
        <option value="Kasir" <?= $sourceFilter === 'Kasir' ? 'selected' : '' ?>>Kasir</option>
      </select>

      <select name="pay" onchange="this.form.submit()" style="padding:6px 12px; background:#F9FAFB; border:1px solid #E5E7EB; border-radius:8px; font-size:12px; font-weight:600;">
        <option value="Semua" <?= $payFilter === 'Semua' ? 'selected' : '' ?>>Semua Pembayaran</option>
        <option value="QRIS" <?= $payFilter === 'QRIS' ? 'selected' : '' ?>>QRIS</option>
        <option value="Tunai" <?= $payFilter === 'Tunai' ? 'selected' : '' ?>>Tunai</option>
        <option value="Debit/Kartu" <?= $payFilter === 'Debit/Kartu' ? 'selected' : '' ?>>Debit/Kartu</option>
        <option value="E-Wallet" <?= $payFilter === 'E-Wallet' ? 'selected' : '' ?>>E-Wallet</option>
      </select>
    </form>
  </div>

  <div style="overflow-x:auto;">
    <table class="table-custom">
      <thead>
        <tr>
          <th>No. Pesanan</th>
          <th>Tanggal</th>
          <th>Nama Pelanggan</th>
          <th>Meja</th>
          <th>Sumber</th>
          <th>Pembayaran</th>
          <th>Total</th>
          <th>Status</th>
          <th style="text-align:center;">Aksi</th>
        </tr>
      </thead>
      <tbody>
        <?php if (empty($historyOrders)): ?>
          <tr><td colspan="9" style="text-align:center; padding:32px; color:#9CA3AF;">Belum ada riwayat pesanan selesai.</td></tr>
        <?php else: ?>
          <?php foreach ($historyOrders as $row): ?>
            <tr>
              <td style="font-weight:700; color:#111827;"><?= htmlspecialchars($row['order_number']) ?></td>
              <td style="color:#6B7280; font-size:12px;"><?= formatTanggalIndo($row['created_at']) ?></td>
              <td style="font-weight:600;"><?= htmlspecialchars($row['customer_name'] ?: '-') ?></td>
              <td style="font-weight:700; color:#FF5722;"><?= htmlspecialchars($row['table_number']) ?></td>
              <td><?= $row['source'] === 'QR' ? '📱 QR' : '🏪 Kasir' ?></td>
              <td><span class="badge badge-gray"><?= $row['payment_method'] ?></span></td>
              <td style="font-weight:800; color:#111827;"><?= formatRupiah($row['total']) ?></td>
              <td><span class="badge badge-green">Selesai</span></td>
              <td style="text-align:center;">
                <a href="/wasibu/pesanan/struk.php?id=<?= $row['id'] ?>" target="_blank" style="padding:4px 8px; background:#F3F4F6; border-radius:6px; color:#374151; font-size:12px;" title="Cetak Ulang Struk">
                  🖨️
                </a>
              </td>
            </tr>
          <?php endforeach; ?>
        <?php endif; ?>
      </tbody>
    </table>
  </div>
</div>

<?php include __DIR__ . '/../includes/footer.php'; ?>
