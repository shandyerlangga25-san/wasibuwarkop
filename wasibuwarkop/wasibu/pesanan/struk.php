<?php
/**
 * Cetak Struk Kasir Termal 58mm/80mm
 * File: pesanan/struk.php (Sesuai Slide 8)
 */
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../includes/auth.php';
require_once __DIR__ . '/../includes/functions.php';
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

$storeName = getSetting($pdo, 'store_name', 'Warung Si Bungsu');
$storeAddress = getSetting($pdo, 'store_address', 'Gg. Remaja 2 Blok Remaja 2 No.16, RT.6/RW.3, Gedong, Jakarta Timur 13760');
$storePhone = getSetting($pdo, 'store_phone', '+62 852-1189-4007');
$storeIg = getSetting($pdo, 'store_instagram', '@wrg_sibungsu');
?>
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>Struk <?= htmlspecialchars($order['order_number']) ?> - Warung Si Bungsu</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&family=Plus+Jakarta+Sans:wght@600;700&display=swap" rel="stylesheet">
  <style>
    * { margin:0; padding:0; box-sizing:border-box; }
    body { background-color:#F3F4F6; font-family:'JetBrains Mono', 'Courier New', monospace; font-size:11px; color:#1F2937; display:flex; flex-direction:column; align-items:center; padding:30px 16px; }
    .receipt-container { width:320px; background:#FFF; padding:24px; border-radius:12px; box-shadow:0 4px 12px rgba(0,0,0,0.08); border:1px solid #E5E7EB; }
    .text-center { text-align:center; }
    .text-right { text-align:right; }
    .dashed { border-bottom:1px dashed #9CA3AF; margin:10px 0; }
    .bold { font-weight:700; color:#111827; }
    .row { display:flex; justify-content:space-between; margin-bottom:4px; font-size:11px; }
    .actions-bar { width:320px; display:flex; justify-content:space-between; margin-top:16px; }
    .btn { padding:10px 16px; font-size:12px; font-weight:700; border-radius:10px; cursor:pointer; text-decoration:none; display:inline-flex; align-items:center; gap:6px; }
    .btn-print { background:#FF5722; color:#FFF; border:none; }
    .btn-back { background:#E5E7EB; color:#374151; border:none; }
    @media print {
      body { background:#FFF; padding:0; }
      .actions-bar { display:none !important; }
      .receipt-container { box-shadow:none; border:none; width:100%; padding:0; }
    }
  </style>
</head>
<body>

<div class="receipt-container" id="thermal-receipt">
  <!-- Brand Header -->
  <div class="text-center" style="margin-bottom:8px;">
    <div style="font-size:16px; font-weight:800; color:#FF5722;"><?= htmlspecialchars($storeName) ?></div>
    <div style="font-size:9px; color:#4B5563; margin-top:3px; line-height:1.3;"><?= htmlspecialchars($storeAddress) ?></div>
    <div style="font-size:9px; color:#4B5563; margin-top:2px;">Telp: <?= htmlspecialchars($storePhone) ?> | IG: <?= htmlspecialchars($storeIg) ?></div>
  </div>

  <div class="dashed"></div>

  <!-- Order Meta -->
  <div class="row">
    <span style="color:#6B7280;">No. Pesanan</span>
    <span class="bold"><?= htmlspecialchars($order['order_number']) ?></span>
  </div>
  <div class="row">
    <span style="color:#6B7280;">Tanggal</span>
    <span><?= formatTanggalIndo($order['created_at']) ?></span>
  </div>
  <div class="row">
    <span style="color:#6B7280;">Kasir</span>
    <span><?= htmlspecialchars($order['cashier_name'] ?: 'Admin') ?></span>
  </div>
  <div class="row">
    <span style="color:#6B7280;">Pelanggan</span>
    <span><?= htmlspecialchars($order['customer_name'] ?: '-') ?></span>
  </div>
  <div class="row">
    <span style="color:#6B7280;">Meja</span>
    <span class="bold" style="color:#FF5722;"><?= htmlspecialchars($order['table_number']) ?></span>
  </div>
  <div class="row">
    <span style="color:#6B7280;">Metode Bayar</span>
    <span><?= htmlspecialchars($order['payment_method']) ?></span>
  </div>
  <div class="row">
    <span style="color:#6B7280;">Status</span>
    <span class="bold" style="color:#16A34A;"><?= htmlspecialchars($order['payment_status']) ?></span>
  </div>

  <div class="dashed"></div>

  <!-- Items -->
  <div style="margin-bottom:4px;">
    <?php foreach ($items as $idx => $it): ?>
      <div style="margin-bottom:5px;">
        <div class="bold"><?= $idx+1 ?>. <?= htmlspecialchars($it['product_name']) ?></div>
        <div class="row" style="color:#6B7280; padding-left:14px;">
          <span><?= $it['qty'] ?> x <?= formatRupiah($it['price']) ?></span>
          <span class="bold" style="color:#1F2937;"><?= formatRupiah($it['subtotal']) ?></span>
        </div>
      </div>
    <?php endforeach; ?>
  </div>

  <div class="dashed"></div>

  <!-- Calculations -->
  <div class="row">
    <span>Subtotal</span>
    <span><?= formatRupiah($order['subtotal']) ?></span>
  </div>
  <?php if ($order['discount'] > 0): ?>
    <div class="row" style="color:#16A34A;">
      <span>Diskon</span>
      <span>-<?= formatRupiah($order['discount']) ?></span>
    </div>
  <?php endif; ?>
  <div class="row bold" style="font-size:13px; margin-top:4px; padding-top:4px; border-top:1px solid #E5E7EB;">
    <span>TOTAL</span>
    <span style="color:#FF5722;"><?= formatRupiah($order['total']) ?></span>
  </div>

  <?php if ($order['payment_method'] === 'Tunai'): ?>
    <div class="row" style="margin-top:4px;">
      <span>Tunai</span>
      <span><?= formatRupiah($order['cash_received'] ?: $order['total']) ?></span>
    </div>
    <div class="row">
      <span>Kembalian</span>
      <span><?= formatRupiah($order['cash_change'] ?: 0) ?></span>
    </div>
  <?php endif; ?>

  <div class="dashed"></div>

  <!-- Footer -->
  <div class="text-center" style="font-size:9px; color:#6B7280; line-height:1.4;">
    <p style="font-weight:700; color:#111827;">Terima kasih sudah berkunjung</p>
    <p>Makanan Sehat, Halal &amp; Higienis</p>
    <p style="margin-top:6px; letter-spacing:1px;"><?= $order['order_number'] ?>-<?= $order['reference_no'] ?></p>
  </div>
</div>

<div class="actions-bar">
  <a href="index.php" class="btn btn-back">‹ Kembali ke Pesanan</a>
  <button type="button" onclick="window.print()" class="btn btn-print">🖨️ Cetak Struk</button>
</div>

</body>
</html>
