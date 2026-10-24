<?php
/**
 * Modul Laporan & Analitik - Warung Si Bungsu
 * File: laporan/index.php (Sesuai Slide 19)
 */
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../includes/auth.php';
require_once __DIR__ . '/../includes/functions.php';
requireRole(['Admin', 'Owner']);

$pdo = getDBConnection();

$pageTitle = "Laporan Penjualan - Warung Si Bungsu";
$activeNav = "laporan";
include __DIR__ . '/../includes/header.php';
include __DIR__ . '/../includes/sidebar.php';
include __DIR__ . '/../includes/navbar.php';
?>

<div class="page-header">
  <div>
    <h1 class="page-title">Laporan</h1>
    <p class="page-subtitle">Pantau ringkasan penjualan bulanan Warung Si Bungsu.</p>
  </div>
</div>

<!-- 4 Stat Cards Sesuai Slide 19 -->
<div class="stats-grid" style="grid-template-columns: repeat(4, 1fr);">
  <div class="stat-card">
    <div>
      <div class="stat-label">Omset Oktober</div>
      <div class="stat-value" style="font-size:22px; color:#111827;">Rp18.750.000</div>
      <div style="font-size:11px; font-weight:700; color:#16A34A; margin-top:2px;">▲ Naik 10,4% dari September</div>
    </div>
    <div class="stat-icon" style="background:#FFF0EB; color:#FF5722;">📈</div>
  </div>

  <div class="stat-card">
    <div>
      <div class="stat-label">Omset September</div>
      <div class="stat-value" style="font-size:22px; color:#111827;">Rp16.980.000</div>
      <div style="font-size:11px; color:#9CA3AF; margin-top:2px;">Bulan Lalu</div>
    </div>
    <div class="stat-icon" style="background:#FEF3C7; color:#D97706;">📊</div>
  </div>

  <div class="stat-card">
    <div>
      <div class="stat-label">Pesanan Terjual</div>
      <div class="stat-value" style="font-size:22px; color:#111827;">1.248</div>
      <div style="font-size:11px; color:#16A34A; margin-top:2px;">+108 pesanan baru</div>
    </div>
    <div class="stat-icon" style="background:#FEE2E2; color:#DC2626;">📦</div>
  </div>

  <div class="stat-card">
    <div>
      <div class="stat-label">Pelanggan</div>
      <div class="stat-value" style="font-size:22px; color:#111827;">86</div>
      <div style="font-size:11px; color:#0284C7; margin-top:2px;">+8 pelanggan baru</div>
    </div>
    <div class="stat-icon" style="background:#E0F2FE; color:#0284C7;">👥</div>
  </div>
</div>

<!-- Grid Grafik dan Ringkasan Oktober 2026 (Slide 19) -->
<div style="display: grid; grid-template-columns: 8fr 4fr; gap: 24px; margin-bottom: 24px;">
  
  <!-- Grafik Tren Omset -->
  <div class="card-table">
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
      <h3 style="font-size:16px; font-weight:800;">Tren Omset Bulanan</h3>
      <span style="font-size:12px; color:#9CA3AF;">Juli 2026 – Oktober 2026</span>
    </div>

    <!-- Responsive SVG Chart Slide 19 -->
    <div style="width:100%; height:240px;">
      <svg style="width:100%; height:100%;" viewBox="0 0 500 200">
        <defs>
          <linearGradient id="chartGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#FF5722" stop-opacity="0.35" />
            <stop offset="100%" stop-color="#FF5722" stop-opacity="0.0" />
          </linearGradient>
        </defs>

        <line x1="40" y1="30" x2="480" y2="30" stroke="#E5E7EB" stroke-dasharray="3 3" />
        <line x1="40" y1="75" x2="480" y2="75" stroke="#E5E7EB" stroke-dasharray="3 3" />
        <line x1="40" y1="120" x2="480" y2="120" stroke="#E5E7EB" stroke-dasharray="3 3" />
        <line x1="40" y1="165" x2="480" y2="165" stroke="#D1D5DB" />

        <text x="35" y="34" font-size="9" fill="#9CA3AF" text-anchor="end">Rp25jt</text>
        <text x="35" y="79" font-size="9" fill="#9CA3AF" text-anchor="end">Rp18jt</text>
        <text x="35" y="124" font-size="9" fill="#9CA3AF" text-anchor="end">Rp12jt</text>
        <text x="35" y="169" font-size="9" fill="#9CA3AF" text-anchor="end">Rp0</text>

        <path d="M 90 115 L 210 98 L 330 84 L 450 70 L 450 165 L 90 165 Z" fill="url(#chartGrad)" />
        <path d="M 90 115 L 210 98 L 330 84 L 450 70" fill="none" stroke="#FF5722" stroke-width="3.5" />

        <circle cx="90" cy="115" r="5" fill="#FF5722" stroke="#FFF" stroke-width="2" />
        <text x="90" y="180" font-size="10" fill="#6B7280" text-anchor="middle">Jul 2026</text>

        <circle cx="210" cy="98" r="5" fill="#FF5722" stroke="#FFF" stroke-width="2" />
        <text x="210" y="180" font-size="10" fill="#6B7280" text-anchor="middle">Agu 2026</text>

        <circle cx="330" cy="84" r="5" fill="#FF5722" stroke="#FFF" stroke-width="2" />
        <text x="330" y="180" font-size="10" fill="#6B7280" text-anchor="middle">Sep 2026</text>

        <circle cx="450" cy="70" r="6" fill="#FF5722" stroke="#FFF" stroke-width="3" />
        <text x="450" y="180" font-size="10" fill="#FF5722" text-anchor="middle" font-weight="bold">Okt 2026</text>
      </svg>
    </div>
  </div>

  <!-- Ringkasan Oktober 2026 (Slide 19) -->
  <div class="card-table" style="display:flex; flex-direction:column; justify-content:space-between;">
    <h3 style="font-size:16px; font-weight:800; padding-bottom:12px; border-bottom:1px solid #F3F4F6;">Ringkasan Oktober 2026</h3>
    
    <div style="display:flex; flex-direction:column; gap:16px; margin:16px 0; font-size:13px;">
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <span style="color:#6B7280;">🧾 Total transaksi</span>
        <span style="font-weight:800; color:#111827;">542</span>
      </div>
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <span style="color:#6B7280;">🍗 Menu terlaris</span>
        <span style="font-weight:700; color:#111827;">Ayam Geprek</span>
      </div>
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <span style="color:#6B7280;">💳 Pembayaran terbanyak</span>
        <span style="font-weight:700; color:#111827;">QRIS</span>
      </div>
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <span style="color:#6B7280;">📈 Perubahan omset</span>
        <span style="font-weight:800; color:#16A34A;">+10,4%</span>
      </div>
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <span style="color:#6B7280;">📅 Hari teramai</span>
        <span style="font-weight:700; color:#111827;">Sabtu</span>
      </div>
    </div>

    <div style="background:#FFF0EB; border:1px solid #FFE2D6; padding:12px; border-radius:12px; font-size:11px; color:#4B5563;">
      💡 Pertumbuhan omset didorong peningkatan pesanan QR meja di akhir pekan.
    </div>
  </div>
</div>

<!-- Tabel Laporan Bulanan (Slide 19) -->
<div class="card-table">
  <h3 style="font-size:16px; font-weight:800; margin-bottom:16px;">Laporan Bulanan</h3>
  <table class="table-custom">
    <thead>
      <tr>
        <th>Bulan</th>
        <th>Omset</th>
        <th>Pesanan</th>
        <th>Pelanggan</th>
        <th style="text-align:center;">Tren</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td style="font-weight:700;">Juli 2026</td>
        <td style="font-weight:800;">Rp13.400.000</td>
        <td>921</td>
        <td>63</td>
        <td style="text-align:center;"><span class="badge badge-gray">Stabil</span></td>
      </tr>
      <tr>
        <td style="font-weight:700;">Agustus 2026</td>
        <td style="font-weight:800;">Rp15.200.000</td>
        <td>1.034</td>
        <td>70</td>
        <td style="text-align:center;"><span class="badge badge-green">Naik</span></td>
      </tr>
      <tr>
        <td style="font-weight:700;">September 2026</td>
        <td style="font-weight:800;">Rp16.980.000</td>
        <td>1.140</td>
        <td>78</td>
        <td style="text-align:center;"><span class="badge badge-green">Naik</span></td>
      </tr>
      <tr>
        <td style="font-weight:800; color:#FF5722;">Oktober 2026</td>
        <td style="font-weight:800; color:#FF5722;">Rp18.750.000</td>
        <td style="font-weight:700;">1.248</td>
        <td style="font-weight:700;">86</td>
        <td style="text-align:center;"><span class="badge badge-green">Naik</span></td>
      </tr>
    </tbody>
  </table>
</div>

<?php include __DIR__ . '/../includes/footer.php'; ?>
