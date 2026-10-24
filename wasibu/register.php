<?php
/**
 * Halaman Registrasi Merchant - Warung Si Bungsu
 * File: register.php (Sesuai Slide 5)
 */
require_once __DIR__ . '/config/database.php';
require_once __DIR__ . '/includes/auth.php';

$error = '';
$success = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = trim($_POST['name'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $password = trim($_POST['password'] ?? '');
    $confirmPassword = trim($_POST['confirm_password'] ?? '');

    if (empty($name) || empty($email) || empty($password)) {
        $error = 'Semua kolom wajib diisi.';
    } elseif (strlen($password) < 8) {
        $error = 'Password minimal 8 karakter.';
    } elseif ($password !== $confirmPassword) {
        $error = 'Konfirmasi password tidak cocok.';
    } else {
        $pdo = getDBConnection();
        $check = $pdo->prepare("SELECT id FROM users WHERE email = ? LIMIT 1");
        $check->execute([$email]);
        if ($check->fetch()) {
            $error = 'Email ini sudah terdaftar.';
        } else {
            $hash = password_hash($password, PASSWORD_BCRYPT);
            $username = explode('@', $email)[0];
            $stmt = $pdo->prepare("INSERT INTO users (name, username, email, password, role) VALUES (?, ?, ?, ?, 'Kasir')");
            $stmt->execute([$name, $username, $email, $hash]);
            $success = 'Akun berhasil dibuat! Silakan login.';
        }
    }
}
?>
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>Buat Akun Baru - Warung Si Bungsu</title>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/wasibu/assets/css/style.css">
  <style>
    body { background-color: #F8F9FA; display:flex; min-height:100vh; flex-direction:column; justify-content:center; align-items:center; padding:20px; }
    .reg-card { width:100%; max-width:440px; background:#FFF; border-radius:24px; padding:36px; box-shadow:0 10px 25px -5px rgba(0,0,0,0.05); border:1px solid #F3F4F6; }
    .form-group { margin-bottom:14px; text-align:left; }
    .form-group label { display:block; font-size:12px; font-weight:700; color:#374151; margin-bottom:4px; }
  </style>
</head>
<body>

<div class="reg-card">
  <div style="width:52px; height:52px; border-radius:18px; background:#FFF0EB; border:1px solid #FFE2D6; color:#FF5722; display:flex; align-items:center; justify-content:center; margin:0 auto 16px; font-size:22px;">
    👤
  </div>
  <h2 style="font-size:22px; font-weight:800; text-align:center; margin-bottom:16px;">Buat Akun Baru</h2>

  <?php if (!empty($error)): ?>
    <div style="background:#FEE2E2; color:#DC2626; padding:10px; border-radius:10px; font-size:12px; margin-bottom:14px;">
      <?= htmlspecialchars($error) ?>
    </div>
  <?php endif; ?>

  <?php if (!empty($success)): ?>
    <div style="background:#DCFCE7; color:#16A34A; padding:10px; border-radius:10px; font-size:12px; margin-bottom:14px;">
      <?= htmlspecialchars($success) ?>
    </div>
  <?php endif; ?>

  <form action="register.php" method="POST">
    <div class="form-group">
      <label>Nama Lengkap</label>
      <input type="text" name="name" class="form-control" placeholder="Masukkan nama lengkap" required>
    </div>

    <div class="form-group">
      <label>Email</label>
      <input type="email" name="email" class="form-control" placeholder="Masukkan email anda" required>
    </div>

    <div class="form-group">
      <label>Password (min. 8 karakter)</label>
      <input type="password" name="password" class="form-control" placeholder="Minimal 8 karakter" required>
    </div>

    <div class="form-group">
      <label>Konfirmasi Password</label>
      <input type="password" name="confirm_password" class="form-control" placeholder="Ulangi password" required>
    </div>

    <button type="submit" class="btn-primary" style="width:100%; justify-content:center; margin-top:8px;">
      Daftar
    </button>

    <div style="text-align:center; margin-top:20px; font-size:12px;">
      <a href="login.php" style="color:#6B7280;">Sudah punya akun? <strong style="color:#FF5722;">Login di sini</strong></a>
    </div>
  </form>
</div>

</body>
</html>
