<?php
/**
 * Komponen Sidebar Navigasi Gelap Bersama
 * File: includes/sidebar.php
 */
require_once __DIR__ . '/auth.php';
$currentUser = getCurrentUser();
$activeNav = $activeNav ?? 'pesanan';
?>
<aside class="app-sidebar">
  <div>
    <!-- Logo Brand Warung Si Bungsu -->
    <div class="sidebar-brand">
      <div class="brand-badge">Si Bungsu</div>
      <div class="brand-text">
        <span class="sup">WARUNG</span>
        <span class="sub">Si Bungsu</span>
      </div>
    </div>

    <!-- Navigasi Menu Sesuai Prototype -->
    <nav class="sidebar-nav">
      <a href="/wasibu/pesanan/index.php" class="nav-link <?= $activeNav === 'pesanan' ? 'active' : '' ?>">
        <span>📋</span>
        <span>Pesanan Aktif</span>
      </a>

      <a href="/wasibu/riwayat/index.php" class="nav-link <?= $activeNav === 'riwayat' ? 'active' : '' ?>">
        <span>🕒</span>
        <span>Riwayat Pesanan</span>
      </a>

      <a href="/wasibu/produk/index.php" class="nav-link <?= $activeNav === 'produk' ? 'active' : '' ?>">
        <span>🍴</span>
        <span>Menu &amp; Produk</span>
      </a>

      <a href="/wasibu/stok/index.php" class="nav-link <?= $activeNav === 'stok' ? 'active' : '' ?>">
        <span>📦</span>
        <span>Stok Barang</span>
      </a>

      <a href="/wasibu/pelanggan/index.php" class="nav-link <?= $activeNav === 'pelanggan' ? 'active' : '' ?>">
        <span>👥</span>
        <span>Pelanggan</span>
      </a>

      <?php if (in_array($currentUser['role'] ?? '', ['Admin', 'Owner'])): ?>
        <a href="/wasibu/laporan/index.php" class="nav-link <?= $activeNav === 'laporan' ? 'active' : '' ?>">
          <span>📊</span>
          <span>Laporan</span>
        </a>

        <a href="/wasibu/pengaturan/index.php" class="nav-link <?= $activeNav === 'pengaturan' ? 'active' : '' ?>">
          <span>⚙️</span>
          <span>Pengaturan</span>
        </a>
      <?php endif; ?>
    </nav>
  </div>

  <!-- Logout Tombol Sesuai Slide 21 -->
  <div class="sidebar-footer">
    <a href="/wasibu/logout.php" onclick="return confirm('Anda akan keluar dari sistem kasir Warung Si Bungsu. Pastikan seluruh perubahan sudah tersimpan. Apakah Anda yakin ingin keluar?');" class="btn-logout">
      <span>🚪</span>
      <span>Logout</span>
    </a>
  </div>
</aside>
<div class="app-main">
