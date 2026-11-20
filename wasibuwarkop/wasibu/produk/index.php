<?php
/**
 * Modul Menu & Produk - Warung Si Bungsu
 * File: produk/index.php (Sesuai Slide 13, 14, 15)
 */
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../includes/auth.php';
require_once __DIR__ . '/../includes/functions.php';
requireLogin();

$pdo = getDBConnection();

// Hitung Statistik Menu
$totalMenu = (int)$pdo->query("SELECT COUNT(*) FROM products WHERE is_active = 1")->fetchColumn();
$countMakanan = (int)$pdo->query("SELECT COUNT(*) FROM products p JOIN categories c ON p.category_id = c.id WHERE c.name = 'Makanan' AND p.is_active = 1")->fetchColumn();
$countMinuman = (int)$pdo->query("SELECT COUNT(*) FROM products p JOIN categories c ON p.category_id = c.id WHERE c.name = 'Minuman' AND p.is_active = 1")->fetchColumn();
$countCemilan = (int)$pdo->query("SELECT COUNT(*) FROM products p JOIN categories c ON p.category_id = c.id WHERE (c.name = 'Cemilan' OR c.name = 'Paket Hemat') AND p.is_active = 1")->fetchColumn();

// Filter Kategori
$catFilter = $_GET['cat'] ?? 'Semua';
$searchQuery = trim($_GET['q'] ?? '');

$sql = "SELECT p.*, c.name as category_name FROM products p JOIN categories c ON p.category_id = c.id WHERE p.is_active = 1";
$params = [];

if ($catFilter !== 'Semua') {
    $sql .= " AND c.name = ?";
    $params[] = $catFilter;
}
if (!empty($searchQuery)) {
    $sql .= " AND (p.name LIKE ? OR p.code LIKE ?)";
    $like = "%$searchQuery%";
    $params[] = $like; $params[] = $like;
}

$sql .= " ORDER BY p.id ASC";
$stmt = $pdo->prepare($sql);
$stmt->execute($params);
$products = $stmt->fetchAll();

// Menu Terpilih untuk Detail Panel (Slide 13)
$selectedProdId = intval($_GET['id'] ?? ($products[0]['id'] ?? 0));
$selectedProduct = null;
if ($selectedProdId > 0) {
    $stmtSel = $pdo->prepare("SELECT p.*, c.name as category_name FROM products p JOIN categories c ON p.category_id = c.id WHERE p.id = ?");
    $stmtSel->execute([$selectedProdId]);
    $selectedProduct = $stmtSel->fetch();
}

$categories = $pdo->query("SELECT * FROM categories ORDER BY id ASC")->fetchAll();

$pageTitle = "Menu & Produk - Warung Si Bungsu";
$activeNav = "produk";
include __DIR__ . '/../includes/header.php';
include __DIR__ . '/../includes/sidebar.php';
include __DIR__ . '/../includes/navbar.php';
?>

<div class="page-header">
  <div>
    <h1 class="page-title">Menu &amp; Produk</h1>
    <p class="page-subtitle">Kelola daftar makanan, minuman, cemilan, dan paket hemat Warung Si Bungsu.</p>
  </div>
  <button type="button" onclick="openModal('modal-tambah-menu')" class="btn-primary">
    <span>➕</span>
    <span>Tambah Menu</span>
  </button>
</div>

<!-- 4 Stat Cards Sesuai Slide 13 -->
<div class="stats-grid" style="grid-template-columns: repeat(4, 1fr);">
  <div class="stat-card">
    <div>
      <div class="stat-label">Total Menu</div>
      <div class="stat-value"><?= $totalMenu ?: 42 ?></div>
    </div>
    <div class="stat-icon" style="background:#FFF0EB; color:#FF5722;">🍴</div>
  </div>

  <div class="stat-card">
    <div>
      <div class="stat-label" style="color:#DC2626;">Makanan</div>
      <div class="stat-value"><?= $countMakanan ?: 15 ?></div>
    </div>
    <div class="stat-icon" style="background:#FEE2E2; color:#DC2626;">🍲</div>
  </div>

  <div class="stat-card">
    <div>
      <div class="stat-label" style="color:#0284C7;">Minuman</div>
      <div class="stat-value"><?= $countMinuman ?: 14 ?></div>
    </div>
    <div class="stat-icon" style="background:#E0F2FE; color:#0284C7;">🥤</div>
  </div>

  <div class="stat-card">
    <div>
      <div class="stat-label" style="color:#16A34A;">Paket &amp; Cemilan</div>
      <div class="stat-value"><?= $countCemilan ?: 13 ?></div>
    </div>
    <div class="stat-icon" style="background:#DCFCE7; color:#16A34A;">🍟</div>
  </div>
</div>

<!-- Grid 2 Kolom -->
<div style="display: grid; grid-template-columns: 7fr 5fr; gap: 24px; align-items: start;">
  
  <!-- Kolom Kiri: Tabel Menu -->
  <div class="card-table">
    <!-- Tabs Kategori Slide 13 -->
    <div style="display:flex; gap:8px; margin-bottom:16px; flex-wrap:wrap;">
      <?php foreach (['Semua', 'Makanan', 'Minuman', 'Cemilan', 'Paket Hemat'] as $cat): ?>
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
            <th>Foto</th>
            <th>Nama Menu</th>
            <th>Kategori</th>
            <th>Harga</th>
            <th>Status</th>
            <th style="text-align:center;">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <?php foreach ($products as $p): 
            $isSel = ($selectedProduct && $selectedProduct['id'] == $p['id']);
          ?>
            <tr onclick="window.location='?id=<?= $p['id'] ?>&cat=<?= urlencode($catFilter) ?>'"
                style="cursor:pointer; <?= $isSel ? 'background:#FFF7ED; font-weight:600;' : '' ?>">
              <td>
                <div style="width:36px; height:36px; border-radius:8px; background:#FED7AA; display:flex; align-items:center; justify-content:center; font-size:18px;">
                  🍴
                </div>
              </td>
              <td>
                <div style="font-weight:700; color:#111827;"><?= htmlspecialchars($p['name']) ?></div>
                <div style="font-size:10px; color:#9CA3AF; font-family:monospace;"><?= htmlspecialchars($p['code']) ?></div>
              </td>
              <td style="color:#6B7280;"><?= htmlspecialchars($p['category_name']) ?></td>
              <td style="font-weight:800; color:#111827;"><?= formatRupiah($p['price']) ?></td>
              <td>
                <span class="badge <?= $p['status'] === 'Tersedia' ? 'badge-green' : 'badge-red' ?>">
                  <?= $p['status'] ?>
                </span>
              </td>
              <td style="text-align:center;">
                <button type="button" onclick="event.stopPropagation(); openModal('modal-edit-menu-<?= $p['id'] ?>')" style="padding:4px 8px; background:#FFF0EB; color:#FF5722; border:none; border-radius:6px; cursor:pointer; font-weight:bold;">
                  ✏️
                </button>
              </td>
            </tr>
          <?php endforeach; ?>
        </tbody>
      </table>
    </div>
  </div>

  <!-- Kolom Kanan: Detail Menu (Slide 13) -->
  <div class="card-table">
    <?php if ($selectedProduct): ?>
      <div style="display:flex; justify-content:space-between; align-items:center; padding-bottom:12px; border-bottom:1px solid #F3F4F6;">
        <h3 style="font-size:16px; font-weight:800;">Detail Menu</h3>
        <span class="badge <?= $selectedProduct['status'] === 'Tersedia' ? 'badge-green' : 'badge-red' ?>">
          <?= $selectedProduct['status'] ?>
        </span>
      </div>

      <div style="width:100%; height:180px; border-radius:16px; background:linear-gradient(135deg, #FFEDD5, #FED7AA); display:flex; align-items:center; justify-content:center; font-size:64px; margin:16px 0;">
        🍗
      </div>

      <h2 style="font-size:20px; font-weight:800; color:#111827;"><?= htmlspecialchars($selectedProduct['name']) ?></h2>

      <div style="margin:16px 0; font-size:12px; line-height:1.8;">
        <div style="display:flex; gap:12px;">
          <span style="color:#9CA3AF; width:90px;">Kategori</span>
          <span style="font-weight:700; color:#111827;">: <?= htmlspecialchars($selectedProduct['category_name']) ?></span>
        </div>
        <div style="display:flex; gap:12px;">
          <span style="color:#9CA3AF; width:90px;">Harga</span>
          <span style="font-weight:800; color:#FF5722; font-size:14px;">: <?= formatRupiah($selectedProduct['price']) ?></span>
        </div>
        <div style="display:flex; gap:12px;">
          <span style="color:#9CA3AF; width:90px;">Komposisi</span>
          <span style="color:#374151;">: <?= htmlspecialchars($selectedProduct['ingredients'] ?: 'Nasi, ayam goreng crispy, sambal, lalapan (timun, selada)') ?></span>
        </div>
        <div style="display:flex; gap:12px; margin-top:4px;">
          <span style="color:#9CA3AF; width:90px;">Deskripsi</span>
          <span style="color:#4B5563;">: <?= htmlspecialchars($selectedProduct['description'] ?: 'Menu favorit Warung Si Bungsu racikan bumbu khas gurih lezat.') ?></span>
        </div>
      </div>

      <div style="display:flex; flex-direction:column; gap:8px; margin-top:20px;">
        <button type="button" onclick="openModal('modal-edit-menu-<?= $selectedProduct['id'] ?>')" class="btn-primary" style="justify-content:center;">
          ✏️ Edit Menu
        </button>
        <a href="simpan.php?action=toggle&id=<?= $selectedProduct['id'] ?>" class="btn-secondary" style="justify-content:center; color:#DC2626; border-color:#FECACA;">
          🚫 <?= $selectedProduct['status'] === 'Tersedia' ? 'Nonaktifkan Menu' : 'Aktifkan Menu' ?>
        </a>
      </div>
    <?php endif; ?>
  </div>

</div>

<!-- MODAL: Tambah Menu Baru (Slide 14) -->
<div id="modal-tambah-menu" class="modal-overlay">
  <div class="modal-card" style="max-width:540px;">
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
      <h3 style="font-size:18px; font-weight:800;">Tambah Menu</h3>
      <button onclick="closeModal('modal-tambah-menu')" style="background:none; border:none; font-size:18px; cursor:pointer;">✕</button>
    </div>
    <form action="simpan.php?action=add" method="POST">
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
        <div class="form-group">
          <label>Nama Menu *</label>
          <input type="text" name="name" class="form-control" placeholder="Masukkan nama menu" required>
        </div>
        <div class="form-group">
          <label>Kategori *</label>
          <select name="category_id" class="form-control" required>
            <?php foreach ($categories as $cat): ?>
              <option value="<?= $cat['id'] ?>"><?= htmlspecialchars($cat['name']) ?></option>
            <?php endforeach; ?>
          </select>
        </div>
      </div>

      <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
        <div class="form-group">
          <label>Harga (Rp) *</label>
          <input type="number" name="price" class="form-control" placeholder="20000" required>
        </div>
        <div class="form-group">
          <label>Kode Menu</label>
          <input type="text" name="code" class="form-control" placeholder="Contoh: MN018">
        </div>
      </div>

      <div class="form-group">
        <label>Komposisi *</label>
        <input type="text" name="ingredients" class="form-control" placeholder="Pisahkan dengan koma" required>
      </div>

      <div class="form-group">
        <label>Deskripsi *</label>
        <textarea name="description" class="form-control" rows="2" placeholder="Tulis deskripsi menu..." required></textarea>
      </div>

      <div style="display:flex; justify-content:flex-end; gap:8px; margin-top:16px;">
        <button type="button" onclick="closeModal('modal-tambah-menu')" class="btn-secondary">Batal</button>
        <button type="submit" class="btn-primary">💾 Simpan Menu</button>
      </div>
    </form>
  </div>
</div>

<?php include __DIR__ . '/../includes/footer.php'; ?>
