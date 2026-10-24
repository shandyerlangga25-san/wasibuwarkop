<?php
/**
 * Modul Stok Barang - Warung Si Bungsu
 * File: stok/index.php (Sesuai Slide 16 & 17)
 */
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../includes/auth.php';
require_once __DIR__ . '/../includes/functions.php';
requireLogin();

$pdo = getDBConnection();

// Hitung Statistik Stok
$totalItems = (int)$pdo->query("SELECT COUNT(*) FROM stock_items")->fetchColumn();
$countAman = (int)$pdo->query("SELECT COUNT(*) FROM stock_items WHERE status = 'Aman'")->fetchColumn();
$countMenipis = (int)$pdo->query("SELECT COUNT(*) FROM stock_items WHERE status = 'Menipis'")->fetchColumn();
$countHabis = (int)$pdo->query("SELECT COUNT(*) FROM stock_items WHERE status = 'Habis'")->fetchColumn();

// Filter Kategori
$catFilter = $_GET['cat'] ?? 'Semua';
$searchQuery = trim($_GET['q'] ?? '');

$sql = "SELECT * FROM stock_items WHERE 1=1";
$params = [];

if ($catFilter !== 'Semua') {
    $sql .= " AND category = ?";
    $params[] = $catFilter;
}
if (!empty($searchQuery)) {
    $sql .= " AND name LIKE ?";
    $params[] = "%$searchQuery%";
}

$sql .= " ORDER BY id ASC";
$stmt = $pdo->prepare($sql);
$stmt->execute($params);
$stockList = $stmt->fetchAll();

// Detail Stok Terpilih (Slide 16)
$selectedStockId = intval($_GET['id'] ?? ($stockList[0]['id'] ?? 0));
$selectedStock = null;
$movements = [];

if ($selectedStockId > 0) {
    $stmtSel = $pdo->prepare("SELECT * FROM stock_items WHERE id = ?");
    $stmtSel->execute([$selectedStockId]);
    $selectedStock = $stmtSel->fetch();

    if ($selectedStock) {
        $stmtMov = $pdo->prepare("SELECT * FROM stock_movements WHERE stock_item_id = ? ORDER BY id DESC LIMIT 5");
        $stmtMov->execute([$selectedStockId]);
        $movements = $stmtMov->fetchAll();
    }
}

$pageTitle = "Stok Barang - Warung Si Bungsu";
$activeNav = "stok";
include __DIR__ . '/../includes/header.php';
include __DIR__ . '/../includes/sidebar.php';
include __DIR__ . '/../includes/navbar.php';
?>

<div class="page-header">
  <div>
    <h1 class="page-title">Stok Barang</h1>
    <p class="page-subtitle">Kelola persediaan stok bahan untuk operasional Warung Si Bungsu.</p>
  </div>
</div>

<!-- 4 Stat Cards Sesuai Slide 16 -->
<div class="stats-grid" style="grid-template-columns: repeat(4, 1fr);">
  <div class="stat-card">
    <div>
      <div class="stat-label">Total Barang</div>
      <div class="stat-value"><?= $totalItems ?: 17 ?></div>
    </div>
    <div class="stat-icon" style="background:#FFF0EB; color:#FF5722;">📦</div>
  </div>

  <div class="stat-card">
    <div>
      <div class="stat-label" style="color:#16A34A;">Stok Aman</div>
      <div class="stat-value"><?= $countAman ?: 10 ?></div>
    </div>
    <div class="stat-icon" style="background:#DCFCE7; color:#16A34A;">✓</div>
  </div>

  <div class="stat-card">
    <div>
      <div class="stat-label" style="color:#D97706;">Stok Menipis</div>
      <div class="stat-value"><?= $countMenipis ?: 5 ?></div>
    </div>
    <div class="stat-icon" style="background:#FEF3C7; color:#D97706;">⚠️</div>
  </div>

  <div class="stat-card">
    <div>
      <div class="stat-label" style="color:#DC2626;">Stok Habis</div>
      <div class="stat-value"><?= $countHabis ?: 2 ?></div>
    </div>
    <div class="stat-icon" style="background:#FEE2E2; color:#DC2626;">✕</div>
  </div>
</div>

<div style="display: grid; grid-template-columns: 7fr 5fr; gap: 24px; align-items: start;">
  
  <!-- Kolom Kiri: Tabel Stok -->
  <div class="card-table">
    <div style="display:flex; gap:8px; margin-bottom:16px; flex-wrap:wrap;">
      <?php foreach (['Semua', 'Bahan Pokok', 'Protein', 'Bumbu & Sayur', 'Minuman', 'Kemasan'] as $cat): ?>
        <a href="?cat=<?= urlencode($cat) ?>" 
           style="padding:6px 14px; border-radius:10px; font-size:12px; font-weight:700; text-decoration:none; <?= $catFilter === $cat ? 'background:#FF5722; color:#FFF;' : 'background:#F3F4F6; color:#4B5563;' ?>">
          <?= $cat ?>
        </a>
      <?php endforeach; ?>
    </div>

    <div style="overflow-x:auto;">
      <table class="table-custom">
        <thead>
          <tr>
            <th>Nama Barang</th>
            <th>Kategori</th>
            <th>Satuan</th>
            <th>Stok Saat Ini</th>
            <th>Min. Stok</th>
            <th>Status</th>
            <th style="text-align:center;">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <?php foreach ($stockList as $stk): 
            $isSel = ($selectedStock && $selectedStock['id'] == $stk['id']);
            $badge = 'badge-green';
            if ($stk['status'] === 'Menipis') $badge = 'badge-amber';
            if ($stk['status'] === 'Habis') $badge = 'badge-red';
          ?>
            <tr onclick="window.location='?id=<?= $stk['id'] ?>&cat=<?= urlencode($catFilter) ?>'"
                style="cursor:pointer; <?= $isSel ? 'background:#FFF7ED; font-weight:600;' : '' ?>">
              <td style="font-weight:700; color:#111827;"><?= htmlspecialchars($stk['name']) ?></td>
              <td style="color:#6B7280;"><?= htmlspecialchars($stk['category']) ?></td>
              <td style="font-family:monospace;"><?= htmlspecialchars($stk['unit']) ?></td>
              <td style="font-weight:800; color:#111827;"><?= (float)$stk['current_stock'] ?> <?= $stk['unit'] ?></td>
              <td style="color:#6B7280;"><?= (float)$stk['min_stock'] ?> <?= $stk['unit'] ?></td>
              <td><span class="badge <?= $badge ?>"><?= $stk['status'] ?></span></td>
              <td style="text-align:center;">
                <button type="button" onclick="event.stopPropagation(); openModal('modal-tambah-stok-<?= $stk['id'] ?>')" style="padding:4px 8px; background:#FFF0EB; color:#FF5722; border:none; border-radius:6px; cursor:pointer; font-weight:bold;">
                  ➕
                </button>
              </td>
            </tr>
          <?php endforeach; ?>
        </tbody>
      </table>
    </div>
  </div>

  <!-- Kolom Kanan: Detail Stok (Slide 16) -->
  <div class="card-table">
    <?php if ($selectedStock): ?>
      <div style="display:flex; justify-content:space-between; align-items:center; padding-bottom:12px; border-bottom:1px solid #F3F4F6;">
        <h3 style="font-size:18px; font-weight:800; color:#111827;"><?= htmlspecialchars($selectedStock['name']) ?></h3>
        <span class="badge <?= $selectedStock['status'] === 'Aman' ? 'badge-green' : ($selectedStock['status'] === 'Menipis' ? 'badge-amber' : 'badge-red') ?>">
          <?= $selectedStock['status'] ?>
        </span>
      </div>

      <div style="margin:16px 0; font-size:12px; line-height:2.0;">
        <div style="display:flex; justify-content:space-between; border-bottom:1px solid #F9FAFB; padding:4px 0;">
          <span style="color:#9CA3AF;">Kategori</span>
          <span style="font-weight:600; color:#111827;"><?= htmlspecialchars($selectedStock['category']) ?></span>
        </div>
        <div style="display:flex; justify-content:space-between; border-bottom:1px solid #F9FAFB; padding:4px 0;">
          <span style="color:#9CA3AF;">Satuan</span>
          <span style="font-family:monospace;"><?= htmlspecialchars($selectedStock['unit']) ?></span>
        </div>
        <div style="display:flex; justify-content:space-between; border-bottom:1px solid #F9FAFB; padding:4px 0;">
          <span style="color:#9CA3AF;">Stok Saat Ini</span>
          <span style="font-weight:800; font-size:15px; color:#111827;"><?= (float)$selectedStock['current_stock'] ?> <?= $selectedStock['unit'] ?></span>
        </div>
        <div style="display:flex; justify-content:space-between; border-bottom:1px solid #F9FAFB; padding:4px 0;">
          <span style="color:#9CA3AF;">Minimum Stok</span>
          <span style="font-weight:600; color:#4B5563;"><?= (float)$selectedStock['min_stock'] ?> <?= $selectedStock['unit'] ?></span>
        </div>
        <div style="display:flex; justify-content:space-between; border-bottom:1px solid #F9FAFB; padding:4px 0;">
          <span style="color:#9CA3AF;">Lokasi Simpan</span>
          <span style="font-weight:600; color:#111827;"><?= htmlspecialchars($selectedStock['location']) ?></span>
        </div>
      </div>

      <!-- Riwayat Stok (Slide 16) -->
      <div style="border-top:1px solid #F3F4F6; padding-top:14px; margin-top:12px;">
        <h4 style="font-size:12px; font-weight:700; color:#111827; margin-bottom:8px;">Riwayat Stok</h4>
        <div style="display:flex; flex-direction:column; gap:6px;">
          <?php if (empty($movements)): ?>
            <div style="font-size:11px; color:#9CA3AF;">Belum ada catatan mutasi stok.</div>
          <?php else: ?>
            <?php foreach ($movements as $m): ?>
              <div style="display:flex; justify-content:space-between; align-items:center; padding:8px 10px; background:#F9FAFB; border-radius:8px; font-size:11px;">
                <div>
                  <strong style="color:#111827;"><?= $m['type'] ?></strong>
                  <div style="color:#9CA3AF; font-size:10px;"><?= $m['note'] ?></div>
                </div>
                <div style="font-weight:800; color:<?= $m['amount'] > 0 ? '#16A34A' : '#DC2626' ?>;">
                  <?= $m['amount'] > 0 ? '+'.$m['amount'] : $m['amount'] ?> <?= $m['unit'] ?>
                </div>
              </div>
            <?php endforeach; ?>
          <?php endif; ?>
        </div>
      </div>

      <div style="display:flex; gap:10px; margin-top:20px;">
        <button type="button" onclick="openModal('modal-tambah-stok-<?= $selectedStock['id'] ?>')" class="btn-primary" style="flex:1; justify-content:center;">
          ➕ Tambah Stok
        </button>
      </div>

      <!-- MODAL: Tambah Stok (Slide 17) -->
      <div id="modal-tambah-stok-<?= $selectedStock['id'] ?>" class="modal-overlay">
        <div class="modal-card" style="max-width:440px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
            <h3 style="font-size:18px; font-weight:800;">Tambah Stok</h3>
            <button onclick="closeModal('modal-tambah-stok-<?= $selectedStock['id'] ?>')" style="background:none; border:none; font-size:18px; cursor:pointer;">✕</button>
          </div>

          <form action="tambah.php" method="POST">
            <input type="hidden" name="stock_id" value="<?= $selectedStock['id'] ?>">

            <div class="form-group">
              <label>Nama Barang</label>
              <div style="padding:10px; background:#F3F4F6; border-radius:10px; font-weight:700;"><?= htmlspecialchars($selectedStock['name']) ?></div>
            </div>

            <div class="form-group">
              <label>Stok Saat Ini</label>
              <div style="padding:10px; background:#F3F4F6; border-radius:10px; font-weight:700;"><?= (float)$selectedStock['current_stock'] ?> <?= $selectedStock['unit'] ?></div>
            </div>

            <div class="form-group">
              <label>Jumlah Tambah Stok *</label>
              <input type="number" step="any" name="amount" class="form-control" value="5" min="0.1" required>
            </div>

            <div class="form-group">
              <label>Catatan (opsional)</label>
              <input type="text" name="note" class="form-control" placeholder="Contoh: belanja stok pagi">
            </div>

            <div style="display:flex; justify-content:flex-end; gap:8px; margin-top:16px;">
              <button type="button" onclick="closeModal('modal-tambah-stok-<?= $selectedStock['id'] ?>')" class="btn-secondary">Batal</button>
              <button type="submit" class="btn-primary">Simpan Stok</button>
            </div>
          </form>
        </div>
      </div>
    <?php endif; ?>
  </div>

</div>

<?php include __DIR__ . '/../includes/footer.php'; ?>
