
<?php
/**
 * Komponen Topbar / Navbar Bersama
 * File: includes/navbar.php
 */
require_once __DIR__ . '/auth.php';
$user = getCurrentUser();

// Zona waktu Indonesia Barat
date_default_timezone_set('Asia/Jakarta');
?>
<header class="app-navbar">

  <!-- Search Input Global -->
  <div class="nav-search">
    <span class="search-icon">
      <i data-feather="search"></i>
    </span>

    <form action="/wasibu/pesanan/index.php" method="GET">
      <input
        type="text"
        name="q"
        value="<?= htmlspecialchars($_GET['q'] ?? '', ENT_QUOTES, 'UTF-8') ?>"
        placeholder="Cari nomor pesanan, nomor meja, atau menu..."
      >
    </form>
  </div>

  <!-- Right section: Date, Notification, User -->
  <div class="nav-user">

    <div class="nav-date">
      <span id="realtime-jakarta">
        <?= date('l, d M Y • H:i:s') ?> WIB
      </span>
    </div>

    <div class="user-profile">
      <div style="width: 32px; height: 32px; border-radius: 50%; background: #FF5722; color: #fff; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 13px;">
        <?= htmlspecialchars(strtoupper(substr($user['name'] ?? 'A', 0, 1)), ENT_QUOTES, 'UTF-8') ?>
      </div>

      <span style="font-size: 13px; font-weight: 600;">
        <?= htmlspecialchars($user['name'] ?? 'Admin', ENT_QUOTES, 'UTF-8') ?>
        (<?= htmlspecialchars($user['role'] ?? 'Kasir', ENT_QUOTES, 'UTF-8') ?>)
      </span>
    </div>

  </div>
</header>

<main class="app-content">

<script>
(function () {
    const timeElement = document.getElementById('realtime-jakarta');

    if (!timeElement) return;

    function updateJakartaTime() {
        const now = new Date();

        const date = new Intl.DateTimeFormat('id-ID', {
            timeZone: 'Asia/Jakarta',
            weekday: 'long',
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        }).format(now);

        const time = new Intl.DateTimeFormat('id-ID', {
            timeZone: 'Asia/Jakarta',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        }).format(now);

        timeElement.textContent = date + ' • ' + time + ' WIB';
    }

    updateJakartaTime();
    setInterval(updateJakartaTime, 1000);
})();
</script>
