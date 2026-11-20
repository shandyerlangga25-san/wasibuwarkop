<?php
/**
 * Halaman Reset Password - Warung Si Bungsu
 * File: reset-password.php (Sesuai Slide 4)
 */
require_once __DIR__ . '/config/database.php';
require_once __DIR__ . '/includes/auth.php';

$msg = '';
$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $pass = trim($_POST['password'] ?? '');
    $confirm = trim($_POST['confirm_password'] ?? '');

    if (empty($pass) || empty($confirm)) {
        $error = 'Harap isi password baru dan konfirmasi password.';
    } elseif (strlen($pass) < 8) {
        $error = 'Password minimal 8 karakter.';
    } elseif ($pass !== $confirm) {
        $error = 'Konfirmasi password tidak cocok.';
    } else {
        $msg = 'Password Anda telah berhasil diatur ulang! Silakan login.';
    }
}
?>
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>Reset Password - Warung Si Bungsu</title>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/wasibu/assets/css/style.css">
  <style>
    body { background-color: #F8F9FA; display:flex; min-height:100vh; flex-direction:column; justify-content:space-between; }
    .top-bar { height:64px; background:#FF5722; width:100%; }
    .center-box { display:flex; flex:1; align-items:center; justify-content:center; padding:20px; }
    .card { width:100%; max-width:480px; background:#FFF; border-radius:24px; padding:40px; box-shadow:0 10px 25px -5px rgba(0,0,0,0.05); text-align:center; }
    .form-group { margin-bottom:16px; text-align:left; }
    .form-group label { display:block; font-size:12px; font-weight:700; margin-bottom:6px; color:#374151; }
  </style>
</head>
<body>

<div class="top-bar"></div>

<div class="center-box">
  <div class="card">
    <h1 style="font-size:26px; font-weight:800; color:#111827; margin-bottom:6px;">Reset Password</h1>
    <p style="font-size:13px; color:#6B7280; margin-bottom:24px;">Masukan Password baru anda :</p>

    <?php if (!empty($error)): ?>
      <div style="background:#FEE2E2; color:#DC2626; padding:10px; border-radius:10px; font-size:12px; margin-bottom:16px; text-align:left;">
        <?= htmlspecialchars($error) ?>
      </div>
    <?php endif; ?>

    <?php if (!empty($msg)): ?>
      <div style="background:#DCFCE7; color:#16A34A; padding:14px; border-radius:12px; font-size:13px; font-weight:700; margin-bottom:16px;">
        ✓ <?= htmlspecialchars($msg) ?>
      </div>
      <a href="login.php" class="btn-primary" style="width:100%; justify-content:center; text-decoration:none;">Kembali ke Halaman Login</a>
    <?php else: ?>
      <form action="reset-password.php" method="POST">
        <div class="form-group">
          <label>Password</label>
          <input type="password" name="password" class="form-control" placeholder="Masukan Password Baru" required>
        </div>

        <div class="form-group">
          <label>Konfirmasi Password</label>
          <input type="password" name="confirm_password" class="form-control" placeholder="Masukan Konfirmasi Password Baru" required>
        </div>

        <button type="submit" class="btn-primary" style="width:100%; justify-content:center; padding:13px; margin-top:8px;">
          Reset Password
        </button>
      </form>
    <?php endif; ?>
  </div>
</div>

<footer style="text-align:center; padding:20px; font-size:11px; color:#9CA3AF;">
  &copy; 2026 Warung Si Bungsu. All rights reserved.
</footer>

</body>
</html>
