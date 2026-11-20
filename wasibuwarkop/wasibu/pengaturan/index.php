<?php
/**
 * Modul Pengaturan Usaha - Warung Si Bungsu
 * File: pengaturan/index.php (Sesuai Slide 20)
 */
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../includes/auth.php';
require_once __DIR__ . '/../includes/functions.php';
requireRole(['Admin', 'Owner']);

$pdo = getDBConnection();

$msg = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $storeName = trim($_POST['store_name'] ?? '');
    $address = trim($_POST['store_address'] ?? '');
    $phone = trim($_POST['store_phone'] ?? '');
    $instagram = trim($_POST['store_instagram'] ?? '');
    $openTime = trim($_POST['open_time'] ?? '');
    $closeTime = trim($_POST['close_time'] ?? '');

    $settingsToUpdate = [
        'store_name' => $storeName,
        'store_address' => $address,
        'store_phone' => $phone,
        'store_instagram' => $instagram,
        'open_time' => $openTime,
        'close_time' => $closeTime,
    ];

    foreach ($settingsToUpdate as $k => $v) {
        $stmt = $pdo->prepare("INSERT INTO settings (key_name, key_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE key_value = ?");
        $stmt->execute([$k, $v, $v]);
    }
    $msg = 'Pengaturan berhasil disimpan!';
}

$storeName = getSetting($pdo, 'store_name', 'Warung Si Bungsu');
$storeAddress = getSetting($pdo, 'store_address', 'Gg. Remaja 2 Blok Remaja 2 No.16, RT.6/RW.3, Gedong, Kec. Ps. Rebo, Jakarta Timur 13760');
$storePhone = getSetting($pdo, 'store_phone', '+62 852-1189-4007');
$storeIg = getSetting($pdo, 'store_instagram', '@wrg_sibungsu');
$openTime = getSetting($pdo, 'open_time', '09:00');
$closeTime = getSetting($pdo, 'close_time', '22:00');

$users = $pdo->query("SELECT * FROM users ORDER BY id ASC")->fetchAll();

$pageTitle = "Pengaturan - Warung Si Bungsu";
$activeNav = "pengaturan";
include __DIR__ . '/../includes/header.php';
include __DIR__ . '/../includes/sidebar.php';
include __DIR__ . '/../includes/navbar.php';
?>

<div class="page-header">
  <div>
    <h1 class="page-title">Pengaturan</h1>
    <p class="page-subtitle">Atur informasi warung dan kebutuhan operasional sistem kasir.</p>
  </div>
</div>

<?php if (!empty($msg)): ?>
  <div style="background:#DCFCE7; color:#16A34A; padding:12px; border-radius:12px; margin-bottom:16px; font-weight:700; font-size:13px;">
    ✓ <?= htmlspecialchars($msg) ?>
  </div>
<?php endif; ?>

<form action="index.php" method="POST">
  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px;">
    
    <!-- Kolom Kiri: Informasi Warung, Metode Pembayaran, Printer Struk (Slide 20) -->
    <div style="display:flex; flex-direction:column; gap:20px;">
      
      <!-- Informasi Warung -->
      <div class="card-table">
        <h3 style="font-size:15px; font-weight:800; margin-bottom:4px;">🏠 Informasi Warung</h3>
        <p style="font-size:11px; color:#9CA3AF; margin-bottom:14px;">Data utama warung Anda yang akan ditampilkan di sistem &amp; struk.</p>

        <div class="form-group">
          <label>Nama Warung</label>
          <input type="text" name="store_name" value="<?= htmlspecialchars($storeName) ?>" class="form-control" required>
        </div>

        <div class="form-group">
          <label>Alamat</label>
          <textarea name="store_address" class="form-control" rows="3" required><?= htmlspecialchars($storeAddress) ?></textarea>
        </div>

        <div class="form-group">
          <label>Telepon</label>
          <input type="text" name="store_phone" value="<?= htmlspecialchars($storePhone) ?>" class="form-control" required>
        </div>

        <div class="form-group">
          <label>Instagram</label>
          <input type="text" name="store_instagram" value="<?= htmlspecialchars($storeIg) ?>" class="form-control" required>
        </div>
      </div>

      <!-- Metode Pembayaran -->
      <div class="card-table">
        <h3 style="font-size:15px; font-weight:800; margin-bottom:4px;">💳 Metode Pembayaran</h3>
        <p style="font-size:11px; color:#9CA3AF; margin-bottom:14px;">Pilih metode pembayaran yang tersedia di warung Anda.</p>
        <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:8px;">
          <label style="padding:10px; border:1px solid #FF5722; background:#FFF0EB; border-radius:10px; font-size:12px; font-weight:700; text-align:center; cursor:pointer;">
            <input type="checkbox" checked disabled> Tunai
          </label>
          <label style="padding:10px; border:1px solid #FF5722; background:#FFF0EB; border-radius:10px; font-size:12px; font-weight:700; text-align:center; cursor:pointer;">
            <input type="checkbox" checked disabled> QRIS
          </label>
          <label style="padding:10px; border:1px solid #FF5722; background:#FFF0EB; border-radius:10px; font-size:12px; font-weight:700; text-align:center; cursor:pointer;">
            <input type="checkbox" checked disabled> Debit
          </label>
          <label style="padding:10px; border:1px solid #FF5722; background:#FFF0EB; border-radius:10px; font-size:12px; font-weight:700; text-align:center; cursor:pointer;">
            <input type="checkbox" checked disabled> E-Wallet
          </label>
        </div>
      </div>

      <!-- Printer Struk -->
      <div class="card-table">
        <h3 style="font-size:15px; font-weight:800; margin-bottom:4px;">🖨️ Printer Struk</h3>
        <p style="font-size:11px; color:#9CA3AF; margin-bottom:14px;">Atur printer untuk mencetak struk kasir.</p>
        <div style="display:flex; justify-content:space-between; align-items:center; background:#F9FAFB; padding:12px; border-radius:12px;">
          <div>
            <div style="font-weight:700;">Printer Kasir 58mm/80mm</div>
            <div style="font-size:11px; color:#16A34A; font-weight:bold;">● Terhubung</div>
          </div>
          <a href="/wasibu/pesanan/struk.php?id=1" target="_blank" class="btn-secondary" style="font-size:12px;">
            🖨️ Uji Cetak
          </a>
        </div>
      </div>

    </div>

    <!-- Kolom Kanan: Akun Pengguna, Meja & QR Code, Jam Operasional (Slide 20) -->
    <div style="display:flex; flex-direction:column; gap:20px;">
      
      <!-- Akun Pengguna -->
      <div class="card-table">
        <h3 style="font-size:15px; font-weight:800; margin-bottom:4px;">👥 Akun Pengguna</h3>
        <p style="font-size:11px; color:#9CA3AF; margin-bottom:14px;">Kelola akun pengguna yang dapat mengakses sistem kasir.</p>
        <table class="table-custom" style="font-size:12px;">
          <thead>
            <tr>
              <th>Nama</th>
              <th>Username</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            <?php foreach ($users as $u): ?>
              <tr>
                <td style="font-weight:700;"><?= htmlspecialchars($u['name']) ?></td>
                <td style="font-family:monospace;"><?= htmlspecialchars($u['username']) ?></td>
                <td><span class="badge <?= $u['role'] === 'Admin' ? 'badge-amber' : 'badge-blue' ?>"><?= $u['role'] ?></span></td>
              </tr>
            <?php endforeach; ?>
          </tbody>
        </table>
      </div>

      <!-- Meja & QR Code (Slide 20) -->
      <div class="card-table">
        <h3 style="font-size:15px; font-weight:800; margin-bottom:4px;">📱 Meja &amp; QR Code</h3>
        <p style="font-size:11px; color:#9CA3AF; margin-bottom:14px;">Atur jumlah meja dan kelola QR Code untuk pemesanan.</p>
        <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:12px; align-items:center;">
          <div style="background:#F9FAFB; padding:12px; border-radius:12px; text-align:center;">
            <div style="font-size:10px; color:#9CA3AF;">Total meja</div>
            <div style="font-size:22px; font-weight:800; color:#111827;">10</div>
          </div>
          <div style="background:#F9FAFB; padding:12px; border-radius:12px; text-align:center;">
            <div style="font-size:10px; color:#9CA3AF;">QR aktif</div>
            <div style="font-size:22px; font-weight:800; color:#111827;">10</div>
          </div>
          <button type="button" onclick="alert('Kode QR Meja 01 s/d Meja 10 siap dicetak untuk dipasang di meja pelanggan.')" class="btn-primary" style="height:100%; justify-content:center;">
            📱 Lihat QR
          </button>
        </div>
      </div>

      <!-- Jam Operasional -->
      <div class="card-table">
        <h3 style="font-size:15px; font-weight:800; margin-bottom:4px;">⏰ Jam Operasional</h3>
        <p style="font-size:11px; color:#9CA3AF; margin-bottom:14px;">Atur jam buka dan tutup warung Anda.</p>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
          <div class="form-group">
            <label>Jam Buka</label>
            <input type="text" name="open_time" value="<?= htmlspecialchars($openTime) ?>" class="form-control" required>
          </div>
          <div class="form-group">
            <label>Jam Tutup</label>
            <input type="text" name="close_time" value="<?= htmlspecialchars($closeTime) ?>" class="form-control" required>
          </div>
        </div>
      </div>

    </div>

  </div>

  <div style="display:flex; justify-content:flex-end; gap:12px; margin-top:24px;">
    <button type="reset" class="btn-secondary">Batal</button>
    <button type="submit" class="btn-primary">💾 Simpan Pengaturan</button>
  </div>
</form>

<?php include __DIR__ . '/../includes/footer.php'; ?>
