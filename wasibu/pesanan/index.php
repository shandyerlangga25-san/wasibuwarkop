<?php
/**
 * Modul Pesanan Aktif - Warung Si Bungsu
 * File: pesanan/index.php (Sesuai Slide 6, 7, 8, 9, 10)
 */
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../includes/auth.php';
require_once __DIR__ . '/../includes/functions.php';
requireLogin();

$pdo = getDBConnection();

// 1. Ambil Statistik Pesanan Aktif dari Database
$stats = [
    'total'         => 0,
    'baru'          => 0,
    'diproses'      => 0,
    'siap_disajikan' => 0,
    'selesai'       => 0,
];

$stmtStats = $pdo->query("SELECT status, COUNT(*) as cnt FROM orders WHERE status != 'Dibatalkan' GROUP BY status");
while ($row = $stmtStats->fetch()) {
    if ($row['status'] === 'Baru') $stats['baru'] = (int)$row['cnt'];
    if ($row['status'] === 'Diproses') $stats['diproses'] = (int)$row['cnt'];
    if ($row['status'] === 'Siap Disajikan') $stats['siap_disajikan'] = (int)$row['cnt'];
    if ($row['status'] === 'Selesai') $stats['selesai'] = (int)$row['cnt'];
}
$stats['total'] = $stats['baru'] + $stats['diproses'] + $stats['siap_disajikan'];

// 2. Filter Tab Status
$filterStatus = $_GET['status'] ?? 'Semua';
$searchQuery  = trim($_GET['q'] ?? '');
$filterSource = $_GET['source'] ?? 'Semua';

$sql = "SELECT * FROM orders WHERE status != 'Dibatalkan'";
$params = [];

if ($filterStatus !== 'Semua') {
    $sql .= " AND status = ?";
    $params[] = $filterStatus;
}
if ($filterSource !== 'Semua') {
    $sql .= " AND source = ?";
    $params[] = $filterSource;
}
if (!empty($searchQuery)) {
    $sql .= " AND (order_number LIKE ? OR table_number LIKE ? OR customer_name LIKE ?)";
    $like = "%$searchQuery%";
    $params[] = $like; $params[] = $like; $params[] = $like;
}

$sql .= " ORDER BY id DESC";
$stmt = $pdo->prepare($sql);
$stmt->execute($params);
$orders = $stmt->fetchAll();

// 3. Pesanan terpilih untuk panel detail kanan
$selectedOrderId = intval($_GET['id'] ?? ($orders[0]['id'] ?? 0));
$selectedOrder = null;
$selectedItems = [];

if ($selectedOrderId > 0) {
    $stmtDetail = $pdo->prepare("SELECT o.*, u.name as cashier_name FROM orders o LEFT JOIN users u ON o.user_id = u.id WHERE o.id = ?");
    $stmtDetail->execute([$selectedOrderId]);
    $selectedOrder = $stmtDetail->fetch();

    if ($selectedOrder) {
        $stmtItems = $pdo->prepare("SELECT * FROM order_items WHERE order_id = ?");
        $stmtItems->execute([$selectedOrderId]);
        $selectedItems = $stmtItems->fetchAll();
    }
}

// Ambil daftar menu aktif untuk dropdown tambah pesanan baru
$allProducts = $pdo->query("SELECT * FROM products WHERE is_active = 1 AND status = 'Tersedia' ORDER BY name ASC")->fetchAll();

$pageTitle = "Pesanan Aktif - Warung Si Bungsu";
$activeNav = "pesanan";
include __DIR__ . '/../includes/header.php';
include __DIR__ . '/../includes/sidebar.php';
include __DIR__ . '/../includes/navbar.php';
?>

<!-- Header Halaman & Tombol Pesanan Baru (Slide 6) -->
<div class="page-header">
  <div>
    <h1 class="page-title">Pesanan Aktif</h1>
    <p class="page-subtitle">Kelola semua pesanan dari kasir, QR Code, dan meja.</p>
  </div>
  <button type="button" onclick="openModal('modal-tambah-pesanan')" class="btn-primary">
    <span>➕</span>
    <span>Pesanan Baru</span>
  </button>
</div>

<!-- 5 Kartu Statistik Sesuai Slide 6 -->
<div class="stats-grid" style="grid-template-columns: repeat(5, 1fr);">
  <div class="stat-card" style="border-left: 4px solid #FF5722;">
    <div>
      <div class="stat-label" style="color:#FF5722;">Total Pesanan Aktif</div>
      <div class="stat-value"><?= $stats['total'] ?></div>
    </div>
    <div class="stat-icon" style="background:#FFF0EB; color:#FF5722;">📋</div>
  </div>

  <div class="stat-card" style="border-left: 4px solid #0284C7;">
    <div>
      <div class="stat-label" style="color:#0284C7;">Pesanan Baru</div>
      <div class="stat-value"><?= $stats['baru'] ?></div>
    </div>
    <div class="stat-icon" style="background:#E0F2FE; color:#0284C7;">🆕</div>
  </div>

  <div class="stat-card" style="border-left: 4px solid #D97706;">
    <div>
      <div class="stat-label" style="color:#D97706;">Diproses</div>
      <div class="stat-value"><?= $stats['diproses'] ?></div>
    </div>
    <div class="stat-icon" style="background:#FEF3C7; color:#D97706;">🍳</div>
  </div>

  <div class="stat-card" style="border-left: 4px solid #16A34A;">
    <div>
      <div class="stat-label" style="color:#16A34A;">Siap Disajikan</div>
      <div class="stat-value"><?= $stats['siap_disajikan'] ?></div>
    </div>
    <div class="stat-icon" style="background:#DCFCE7; color:#16A34A;">🛎️</div>
  </div>

  <div class="stat-card" style="border-left: 4px solid #DC2626;">
    <div>
      <div class="stat-label" style="color:#DC2626;">Selesai Belum Bayar</div>
      <div class="stat-value"><?= $stats['selesai'] ?></div>
    </div>
    <div class="stat-icon" style="background:#FEE2E2; color:#DC2626;">🧾</div>
  </div>
</div>

<!-- Grid 2 Kolom: Tabel Pesanan (Kiri) & Detail Panel (Kanan) -->
<div style="display: grid; grid-template-columns: 7fr 5fr; gap: 24px; align-items: start;">
  
  <!-- Kolom Kiri: Tabel Daftar Pesanan Aktif -->
  <div class="card-table">
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
      <h3 style="font-size:16px; font-weight:800;">Daftar Pesanan Aktif</h3>
    </div>

    <!-- Filter Status Tabs (Slide 6) -->
    <div style="display:flex; gap:8px; margin-bottom:16px; flex-wrap:wrap;">
      <?php
      $tabs = [
        'Semua' => $stats['total'],
        'Baru' => $stats['baru'],
        'Diproses' => $stats['diproses'],
        'Siap Disajikan' => $stats['siap_disajikan'],
        'Selesai' => $stats['selesai'],
      ];
      foreach ($tabs as $tName => $tCount):
        $isActive = ($filterStatus === $tName);
      ?>
        <a href="?status=<?= urlencode($tName) ?>" 
           style="padding:6px 14px; border-radius:10px; font-size:12px; font-weight:700; text-decoration:none; transition:all 0.15s; <?= $isActive ? 'background:#FF5722; color:#FFF;' : 'background:#F3F4F6; color:#4B5563;' ?>">
          <?= $tName ?> (<?= $tCount ?>)
        </a>
      <?php endforeach; ?>
    </div>

    <!-- Filter Sumber & Tanggal -->
    <div style="display:flex; gap:12px; margin-bottom:14px; font-size:12px;">
      <div style="padding:6px 12px; background:#F9FAFB; border:1px solid #E5E7EB; border-radius:8px; color:#374151; font-weight:600;">
        📅 Hari ini, 21 Okt 2026
      </div>
      <form method="GET" style="display:flex;">
        <input type="hidden" name="status" value="<?= htmlspecialchars($filterStatus) ?>">
        <select name="source" onchange="this.form.submit()" style="padding:6px 12px; background:#F9FAFB; border:1px solid #E5E7EB; border-radius:8px; font-size:12px; font-weight:600; color:#374151; outline:none;">
          <option value="Semua" <?= $filterSource === 'Semua' ? 'selected' : '' ?>>Semua Sumber</option>
          <option value="QR" <?= $filterSource === 'QR' ? 'selected' : '' ?>>Scan QR Meja</option>
          <option value="Kasir" <?= $filterSource === 'Kasir' ? 'selected' : '' ?>>Kasir Manual</option>
        </select>
      </form>
    </div>

    <!-- Tabel Pesanan Aktif -->
    <div style="overflow-x:auto;">
      <table class="table-custom">
        <thead>
          <tr>
            <th>No. Pesanan</th>
            <th>Meja</th>
            <th>Waktu</th>
            <th>Sumber</th>
            <th>Status</th>
            <th>Pembayaran</th>
            <th>Total</th>
            <th style="text-align:center;">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <?php if (empty($orders)): ?>
            <tr>
              <td colspan="8" style="text-align:center; padding:32px; color:#9CA3AF;">Tidak ada pesanan aktif.</td>
            </tr>
          <?php else: ?>
            <?php foreach ($orders as $ord): 
              $isSel = ($selectedOrder && $selectedOrder['id'] == $ord['id']);
              $badgeClass = 'badge-gray';
              if ($ord['status'] === 'Baru') $badgeClass = 'badge-blue';
              if ($ord['status'] === 'Diproses') $badgeClass = 'badge-amber';
              if ($ord['status'] === 'Siap Disajikan') $badgeClass = 'badge-green';
              if ($ord['status'] === 'Selesai') $badgeClass = 'badge-red';
            ?>
              <tr onclick="window.location='?id=<?= $ord['id'] ?>&status=<?= urlencode($filterStatus) ?>'" 
                  style="cursor:pointer; <?= $isSel ? 'background-color:#FFF7ED; font-weight:600;' : '' ?>">
                <td style="font-weight:700; color:#111827;"><?= htmlspecialchars($ord['order_number']) ?></td>
                <td style="color:#FF5722; font-weight:700;"><?= htmlspecialchars($ord['table_number']) ?></td>
                <td style="color:#6B7280; font-size:12px;"><?= date('H:i', strtotime($ord['created_at'])) ?></td>
                <td>
                  <span style="font-size:11px; font-weight:600; color:#4B5563;">
                    <?= $ord['source'] === 'QR' ? '📱 QR' : '🏪 Kasir' ?>
                  </span>
                </td>
                <td><span class="badge <?= $badgeClass ?>"><?= $ord['status'] ?></span></td>
                <td><span class="badge badge-gray"><?= $ord['payment_method'] ?></span></td>
                <td style="font-weight:800; color:#111827;"><?= formatRupiah($ord['total']) ?></td>
                <td style="text-align:center;">
                  <a href="?id=<?= $ord['id'] ?>" style="color:#FF5722; font-size:14px;">➔</a>
                </td>
              </tr>
            <?php endforeach; ?>
          <?php endif; ?>
        </tbody>
      </table>
    </div>

    <!-- Paginasi Slide 6 -->
    <div style="display:flex; justify-content:space-between; align-items:center; margin-top:20px; padding-top:14px; border-top:1px solid #F3F4F6; font-size:12px; color:#6B7280;">
      <span>Menampilkan 1-<?= count($orders) ?> dari <?= $stats['total'] ?> pesanan</span>
      <div style="display:flex; gap:4px;">
        <span style="padding:4px 10px; background:#FF5722; color:#FFF; font-weight:bold; border-radius:6px;">1</span>
      </div>
      <span>10 / halaman</span>
    </div>
  </div>

  <!-- Kolom Kanan: Detail Pesanan Panel (Slide 6) -->
  <div class="card-table">
    <?php if ($selectedOrder): ?>
      <!-- Header Detail -->
      <div style="display:flex; justify-content:space-between; align-items:center; padding-bottom:12px; border-bottom:1px solid #F3F4F6;">
        <div>
          <span style="font-size:11px; color:#9CA3AF; font-weight:600;">No. Pesanan</span>
          <div style="font-size:18px; font-weight:800; color:#111827; display:flex; align-items:center; gap:8px;">
            <?= htmlspecialchars($selectedOrder['order_number']) ?>
            <button type="button" onclick="copyText('<?= $selectedOrder['order_number'] ?>')" style="border:none; background:none; cursor:pointer; color:#9CA3AF;">📋</button>
          </div>
        </div>

        <a href="/wasibu/pesanan/struk.php?id=<?= $selectedOrder['id'] ?>" target="_blank" class="btn-secondary" style="font-size:12px; padding:6px 12px;">
          <span>🖨️</span>
          <span>Cetak Struk</span>
        </a>
      </div>

      <!-- Status Bar Panel -->
      <div style="display:flex; justify-content:space-between; align-items:center; background:#F9FAFB; padding:10px 14px; border-radius:12px; margin:14px 0; font-size:12px;">
        <div>
          <span style="color:#6B7280;">Status Pembayaran:</span>
          <span class="badge badge-green">● <?= $selectedOrder['payment_status'] ?></span>
        </div>
        <div>
          <span style="color:#6B7280;">Status:</span>
          <span class="badge badge-amber"><?= $selectedOrder['status'] ?></span>
        </div>
      </div>

      <!-- Metadata Pelanggan 4 Kotak (Slide 6) -->
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:16px;">
        <div style="background:#F9FAFB; padding:10px; border-radius:10px; border:1px solid #F3F4F6;">
          <div style="font-size:10px; color:#9CA3AF;">Nama Pelanggan</div>
          <div style="font-weight:700; color:#1F2937; margin-top:2px;"><?= htmlspecialchars($selectedOrder['customer_name'] ?: 'Pelanggan Meja') ?></div>
        </div>

        <div style="background:#F9FAFB; padding:10px; border-radius:10px; border:1px solid #F3F4F6;">
          <div style="font-size:10px; color:#9CA3AF;">Meja</div>
          <div style="font-weight:800; color:#FF5722; margin-top:2px;"><?= htmlspecialchars($selectedOrder['table_number']) ?></div>
        </div>

        <div style="background:#F9FAFB; padding:10px; border-radius:10px; border:1px solid #F3F4F6;">
          <div style="font-size:10px; color:#9CA3AF;">Waktu Pesan</div>
          <div style="font-weight:600; color:#374151; margin-top:2px;"><?= formatTanggalIndo($selectedOrder['created_at']) ?></div>
        </div>

        <div style="background:#F9FAFB; padding:10px; border-radius:10px; border:1px solid #F3F4F6;">
          <div style="font-size:10px; color:#9CA3AF;">Sumber Pesanan</div>
          <div style="font-weight:700; color:#1F2937; margin-top:2px;"><?= $selectedOrder['source'] === 'QR' ? 'QR Code (Scan Meja)' : 'Kasir Manual' ?></div>
        </div>
      </div>

      <!-- Rincian Item Pesanan -->
      <div style="margin-bottom:16px;">
        <h4 style="font-size:12px; font-weight:700; color:#111827; margin-bottom:8px;">Item Pesanan</h4>
        <table class="table-custom" style="font-size:12px;">
          <thead>
            <tr>
              <th>No.</th>
              <th>Nama Menu</th>
              <th style="text-align:center;">Qty</th>
              <th style="text-align:right;">Harga</th>
              <th style="text-align:right;">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            <?php foreach ($selectedItems as $idx => $it): ?>
              <tr>
                <td style="color:#9CA3AF;"><?= $idx + 1 ?></td>
                <td style="font-weight:600; color:#111827;"><?= htmlspecialchars($it['product_name']) ?></td>
                <td style="text-align:center; font-weight:700;"><?= $it['qty'] ?></td>
                <td style="text-align:right; color:#6B7280;"><?= formatRupiah($it['price']) ?></td>
                <td style="text-align:right; font-weight:700;"><?= formatRupiah($it['subtotal']) ?></td>
              </tr>
            <?php endforeach; ?>
          </tbody>
        </table>
      </div>

      <!-- Catatan Pesanan -->
      <?php if (!empty($selectedOrder['notes'])): ?>
        <div style="background:#FFFBEB; border:1px solid #FDE68A; padding:10px 14px; border-radius:10px; font-size:12px; margin-bottom:16px;">
          <strong style="color:#B45309; display:block;">Catatan Pesanan:</strong>
          <span style="color:#4B5563; font-style:italic;"><?= htmlspecialchars($selectedOrder['notes']) ?></span>
        </div>
      <?php endif; ?>

      <!-- Informasi Pembayaran (Slide 6) -->
      <div style="border-top:1px solid #F3F4F6; padding-top:14px; font-size:12px; line-height:1.8;">
        <div style="font-weight:700; margin-bottom:6px;">Informasi Pembayaran</div>
        <div style="display:flex; justify-content:space-between; color:#4B5563;">
          <span>Metode Pembayaran</span>
          <span style="font-weight:700; color:#111827;">: <?= $selectedOrder['payment_method'] ?></span>
        </div>
        <div style="display:flex; justify-content:space-between; color:#4B5563;">
          <span>Status Pembayaran</span>
          <span style="color:#16A34A; font-weight:700;">: ● <?= $selectedOrder['payment_status'] ?></span>
        </div>
        <div style="display:flex; justify-content:space-between; color:#4B5563;">
          <span>Referensi</span>
          <span style="font-family:monospace;">: <?= $selectedOrder['reference_no'] ?: '-' ?></span>
        </div>
        <div style="border-top:1px dashed #E5E7EB; margin-top:8px; padding-top:8px;">
          <div style="display:flex; justify-content:space-between; color:#6B7280;">
            <span>Subtotal</span>
            <span><?= formatRupiah($selectedOrder['subtotal']) ?></span>
          </div>
          <div style="display:flex; justify-content:space-between; color:#6B7280;">
            <span>Diskon</span>
            <span>-<?= formatRupiah($selectedOrder['discount']) ?></span>
          </div>
          <div style="display:flex; justify-content:space-between; font-size:16px; font-weight:800; color:#FF5722; margin-top:6px;">
            <span>Total</span>
            <span><?= formatRupiah($selectedOrder['total']) ?></span>
          </div>
        </div>
      </div>

      <!-- Action Buttons Panel Bawah (Slide 6) -->
      <div style="display:flex; justify-content:space-between; align-items:center; gap:8px; margin-top:20px; padding-top:16px; border-top:1px solid #F3F4F6;">
        <button type="button" onclick="if(confirm('Batalkan pesanan ini?')) window.location='update-status.php?action=cancel&id=<?= $selectedOrder['id'] ?>'" class="btn-secondary" style="color:#DC2626; border-color:#FECACA;">
          ✕ Batalkan Pesanan
        </button>

        <button type="button" onclick="openModal('modal-ubah-status')" class="btn-primary">
          <span>▶ Proses Pesanan</span>
        </button>
      </div>

    <?php else: ?>
      <div style="text-align:center; padding:48px 24px; color:#9CA3AF;">
        Pilih pesanan dari daftar di sebelah kiri untuk melihat rincian detail.
      </div>
    <?php endif; ?>
  </div>

</div>

<!-- MODAL: Tambah Pesanan Baru (Slide 7) -->
<div id="modal-tambah-pesanan" class="modal-overlay">
  <div class="modal-card" style="max-width: 640px; max-height: 90vh; overflow-y:auto;">
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
      <div>
        <h3 style="font-size:18px; font-weight:800; color:#111827;">Tambah Pesanan Baru</h3>
        <p style="font-size:12px; color:#6B7280;">Buat pesanan manual dari kasir untuk pelanggan di meja.</p>
      </div>
      <button onclick="closeModal('modal-tambah-pesanan')" style="background:none; border:none; font-size:20px; cursor:pointer; color:#9CA3AF;">✕</button>
    </div>

    <form action="tambah.php" method="POST">
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:12px;">
        <div class="form-group">
          <label>Sumber Pesanan</label>
          <div style="padding:10px 14px; background:#F3F4F6; border-radius:10px; font-size:13px; font-weight:700;">🏪 Kasir</div>
        </div>
        <div class="form-group">
          <label>Nomor Pesanan</label>
          <div style="padding:10px 14px; background:#F3F4F6; border-radius:10px; font-size:13px; color:#9CA3AF; font-style:italic;">Otomatis saat disimpan</div>
        </div>
      </div>

      <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:12px;">
        <div class="form-group">
          <label>Pilih Meja</label>
          <select name="table_number" class="form-control" required>
            <?php for ($i=1; $i<=10; $i++): $tbl = sprintf("Meja %02d", $i); ?>
              <option value="<?= $tbl ?>"><?= $tbl ?></option>
            <?php endfor; ?>
          </select>
        </div>
        <div class="form-group">
          <label>Nama Pelanggan (Opsional)</label>
          <input type="text" name="customer_name" class="form-control" placeholder="Contoh: Andi Pratama">
        </div>
      </div>

      <div class="form-group">
        <label>Catatan (Opsional)</label>
        <input type="text" name="notes" class="form-control" placeholder="Contoh: Tanpa cabe, mohon cepat ya">
      </div>

      <!-- Pilih Menu -->
      <div class="form-group" style="border-top:1px solid #F3F4F6; padding-top:14px;">
        <label style="font-weight:700;">Pilih Menu Utama</label>
        <select name="menu_id" class="form-control" required>
          <?php foreach ($allProducts as $p): ?>
            <option value="<?= $p['id'] ?>"><?= htmlspecialchars($p['name']) ?> - <?= formatRupiah($p['price']) ?></option>
          <?php endforeach; ?>
        </select>
      </div>

      <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:16px;">
        <div class="form-group">
          <label>Kuantitas (Qty)</label>
          <input type="number" name="qty" class="form-control" value="1" min="1" max="50" required>
        </div>
        <div class="form-group">
          <label>Metode Pembayaran</label>
          <select name="payment_method" class="form-control">
            <option value="Tunai">💵 Tunai</option>
            <option value="QRIS">📱 QRIS</option>
            <option value="Debit/Kartu">💳 Debit/Kartu</option>
            <option value="E-Wallet">👛 E-Wallet</option>
          </select>
        </div>
      </div>

      <div style="display:flex; justify-content:flex-end; gap:10px; padding-top:14px; border-top:1px solid #F3F4F6;">
        <button type="button" onclick="closeModal('modal-tambah-pesanan')" class="btn-secondary">✕ Batal</button>
        <button type="submit" class="btn-primary">▶ Buat Pesanan</button>
      </div>
    </form>
  </div>
</div>

<!-- MODAL: Ubah Status Pesanan (Slide 9) -->
<?php if ($selectedOrder): ?>
<div id="modal-ubah-status" class="modal-overlay">
  <div class="modal-card" style="max-width: 480px;">
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
      <div>
        <h3 style="font-size:18px; font-weight:800;">Ubah Status Pesanan</h3>
        <p style="font-size:12px; color:#6B7280;">Perbarui status pesanan untuk order ini.</p>
      </div>
      <button onclick="closeModal('modal-ubah-status')" style="background:none; border:none; font-size:18px; cursor:pointer; color:#9CA3AF;">✕</button>
    </div>

    <form action="update-status.php" method="POST">
      <input type="hidden" name="order_id" value="<?= $selectedOrder['id'] ?>">

      <div style="background:#F9FAFB; padding:10px; border-radius:10px; margin-bottom:14px; font-size:12px; display:flex; justify-content:space-between;">
        <span>Order: <strong><?= $selectedOrder['order_number'] ?></strong></span>
        <span>Meja: <strong style="color:#FF5722;"><?= $selectedOrder['table_number'] ?></strong></span>
      </div>

      <div style="margin-bottom:16px;">
        <?php
        $statusOpts = [
          'Baru' => 'Pesanan baru diterima',
          'Diproses' => 'Sedang disiapkan di dapur',
          'Siap Disajikan' => 'Pesanan sudah siap',
          'Selesai' => 'Pesanan telah disajikan',
        ];
        foreach ($statusOpts as $sKey => $sDesc):
          $isCur = ($selectedOrder['status'] === $sKey);
        ?>
          <label style="display:flex; align-items:center; gap:12px; padding:10px 14px; border:1px solid <?= $isCur ? '#FF5722' : '#E5E7EB' ?>; border-radius:12px; margin-bottom:8px; cursor:pointer; background:<?= $isCur ? '#FFF0EB' : '#FFF' ?>;">
            <input type="radio" name="status" value="<?= $sKey ?>" <?= $isCur ? 'checked' : '' ?>>
            <div>
              <div style="font-weight:700; font-size:13px; color:#111827;"><?= $sKey ?></div>
              <div style="font-size:11px; color:#6B7280;"><?= $sDesc ?></div>
            </div>
          </label>
        <?php endforeach; ?>
      </div>

      <div style="background:#FEF3C7; color:#92400E; padding:10px 14px; border-radius:10px; font-size:12px; margin-bottom:16px;">
        ⏱️ Berdasarkan item pesanan, estimasi waktu: <strong>12 – 15 menit</strong>
      </div>

      <div style="display:flex; justify-content:flex-end; gap:8px;">
        <button type="button" onclick="closeModal('modal-ubah-status')" class="btn-secondary">Batal</button>
        <button type="submit" class="btn-primary">Simpan Status</button>
      </div>
    </form>
  </div>
</div>
<?php endif; ?>

<?php include __DIR__ . '/../includes/footer.php'; ?>
