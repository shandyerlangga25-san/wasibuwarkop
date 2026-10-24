<?php
/**
 * Halaman Login Admin & Kasir - Warung Si Bungsu
 * File: login.php (Sesuai Slide 1, 2, 3)
 */
require_once __DIR__ . '/config/database.php';
require_once __DIR__ . '/includes/auth.php';
require_once __DIR__ . '/includes/functions.php';

if (isLoggedIn()) {
    header("Location: /wasibu/pesanan/index.php");
    exit();
}

$error = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $emailOrUser = trim($_POST['username'] ?? '');
    $password = trim($_POST['password'] ?? '');

    if (empty($emailOrUser) || empty($password)) {
        $error = 'Email/Username dan Password wajib diisi.';
    } else {
        $pdo = getDBConnection();
        $stmt = $pdo->prepare("SELECT * FROM users WHERE (username = ? OR email = ?) AND status = 'active' LIMIT 1");
        $stmt->execute([$emailOrUser, $emailOrUser]);
        $user = $stmt->fetch();

        if ($user && password_verify($password, $user['password'])) {
            // Regenerasi session ID demi keamanan dari serangan session fixation
            session_regenerate_id(true);
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['user_name'] = $user['name'];
            $_SESSION['user_username'] = $user['username'];
            $_SESSION['user_role'] = $user['role'];

            header("Location: /wasibu/pesanan/index.php");
            exit();
        } else {
            $error = 'Email atau password yang Anda masukkan salah.';
        }
    }
}
?>
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Login Admin - Warung Si Bungsu</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    * { margin:0; padding:0; box-sizing:border-box; font-family:'Plus Jakarta Sans', sans-serif; }
    body { background-color: #F8F9FA; display:flex; min-height:100vh; flex-direction:column; justify-content:space-between; }
    .help-btn { position:absolute; top:20px; right:24px; z-index:20; background:#FFF; border:1px solid #E5E7EB; border-radius:20px; padding:6px 14px; font-size:12px; font-weight:600; color:#374151; cursor:pointer; display:flex; align-items:center; gap:6px; }
    .login-container { display:flex; flex:1; }
    .hero-side { flex:1; background:linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.85)), url('https://images.unsplash.com/photo-1541518763669-27fef04b14ea?w=1000&auto=format&fit=crop&q=80') center/cover; padding:48px; color:#FFF; display:flex; flex-direction:column; justify-content:space-between; }
    .form-side { flex:1; display:flex; align-items:center; justify-content:center; padding:32px; background:#F8F9FA; }
    .form-card { width:100%; max-width:440px; background:#FFF; border:1px solid #F3F4F6; border-radius:24px; padding:36px; box-shadow:0 10px 25px -5px rgba(0,0,0,0.05); }
    .brand-header { display:flex; align-items:center; gap:12px; }
    .brand-badge { width:42px; height:42px; border-radius:50%; background:linear-gradient(135deg, #FF7A00, #E64A19); color:#FFF; display:flex; align-items:center; justify-content:center; font-weight:800; font-style:italic; font-size:11px; }
    .feature-item { display:flex; align-items:flex-start; gap:14px; margin-bottom:20px; }
    .feature-icon { width:38px; height:38px; border-radius:50%; background:rgba(255,87,34,0.2); border:1px solid rgba(255,87,34,0.4); display:flex; align-items:center; justify-content:center; color:#FF7A00; font-weight:bold; flex-shrink:0; }
    .lock-icon { width:52px; height:52px; border-radius:18px; background:#FFF0EB; border:1px solid #FFE2D6; color:#FF5722; display:flex; align-items:center; justify-content:center; margin:0 auto 16px; font-size:22px; }
    .form-group { margin-bottom:16px; text-align:left; }
    .form-group label { display:block; font-size:12px; font-weight:600; color:#374151; margin-bottom:6px; }
    .form-control { width:100%; padding:11px 14px; border:1px solid #D1D5DB; border-radius:12px; font-size:13px; outline:none; background:#F9FAFB; }
    .form-control:focus { border-color:#FF5722; background:#FFF; }
    .btn-submit { width:100%; background:linear-gradient(90deg, #FF5722, #E64A19); color:#FFF; border:none; padding:12px; border-radius:12px; font-size:14px; font-weight:700; cursor:pointer; margin-top:8px; box-shadow:0 4px 10px rgba(255,87,34,0.25); display:flex; align-items:center; justify-content:center; gap:8px; }
    .notice-box { background:#FFF0EB; border:1px solid #FFE2D6; border-radius:14px; padding:14px; margin-top:20px; text-align:left; font-size:11px; color:#4B5563; display:flex; gap:10px; }
    .modal-overlay { display:none; position:fixed; inset:0; background:rgba(0,0,0,0.6); z-index:99; align-items:center; justify-content:center; padding:16px; }
    .modal-card { background:#FFF; border-radius:20px; max-width:480px; width:100%; padding:28px; position:relative; }
    @media(max-width:900px){ .hero-side { display:none; } }
  </style>
</head>
<body>

<button class="help-btn" onclick="openModal('modal-help')">
  <span>❓</span>
  <span>Butuh bantuan?</span>
</button>

<div class="login-container">
  <!-- Left Hero Showcase (Slide 1) -->
  <div class="hero-side">
    <div class="brand-header">
      <div class="brand-badge">Si Bungsu</div>
      <div>
        <div style="font-size:10px; font-weight:600; letter-spacing:1px; color:#D1D5DB;">WARUNG</div>
        <div style="font-size:18px; font-weight:800;">Si Bungsu <span style="font-size:13px; font-weight:normal; color:#FFA726;">Merchant</span></div>
      </div>
    </div>

    <div style="max-width:460px; margin: auto 0;">
      <h1 style="font-size:32px; font-weight:800; line-height:1.2; margin-bottom:12px;">
        Selamat Datang <br><span style="color:#FF7A00;">Admin Warung Si Bungsu!</span>
      </h1>
      <p style="font-size:14px; color:#D1D5DB; margin-bottom:32px;">
        Login untuk mengakses dashboard manajemen dan mengelola bisnis Anda.
      </p>

      <div class="feature-item">
        <div class="feature-icon">📈</div>
        <div>
          <div style="font-weight:700; font-size:14px;">Kelola Bisnis</div>
          <div style="font-size:12px; color:#D1D5DB;">Pantau penjualan, produk, dan laporan bisnis secara real-time.</div>
        </div>
      </div>

      <div class="feature-item">
        <div class="feature-icon">📦</div>
        <div>
          <div style="font-weight:700; font-size:14px;">Manajemen Mudah</div>
          <div style="font-size:12px; color:#D1D5DB;">Kelola stok, pesanan, pelanggan, dan karyawan dengan mudah.</div>
        </div>
      </div>

      <div class="feature-item">
        <div class="feature-icon">🛡️</div>
        <div>
          <div style="font-weight:700; font-size:14px;">Keamanan Terjamin</div>
          <div style="font-size:12px; color:#D1D5DB;">Sistem aman dan data bisnis Anda terindungi.</div>
        </div>
      </div>
    </div>

    <div style="font-size:12px; color:#9CA3AF; border-top:1px solid rgba(255,255,255,0.1); padding-top:16px;">
      &copy; 2026 Warung Si Bungsu. All rights reserved.
    </div>
  </div>

  <!-- Right Form Card (Slide 1) -->
  <div class="form-side">
    <div class="form-card text-center">
      <div class="lock-icon">🔒</div>
      <h2 style="font-size:22px; font-weight:800; color:#111827; margin-bottom:4px;">Login Admin</h2>
      <p style="font-size:12px; color:#6B7280; margin-bottom:24px;">Masuk ke akun admin untuk mengakses sistem manajemen Warung Si Bungsu</p>

      <?php if (!empty($error)): ?>
        <div style="background:#FEE2E2; color:#DC2626; padding:10px; border-radius:10px; font-size:12px; margin-bottom:16px; text-align:left;">
          <?= htmlspecialchars($error) ?>
        </div>
      <?php endif; ?>

      <form action="/wasibu/login.php" method="POST">
        <div class="form-group">
          <label>Email / Username</label>
          <input type="text" name="username" class="form-control" placeholder="Masukkan email atau username" value="admin" required>
        </div>

        <div class="form-group">
          <label>Password</label>
          <input type="password" name="password" class="form-control" placeholder="Masukkan password" value="password" required>
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center; font-size:12px; margin-bottom:18px;">
          <label style="display:flex; align-items:center; gap:6px; color:#4B5563; cursor:pointer;">
            <input type="checkbox" name="remember" checked>
            <span>Ingat saya</span>
          </label>
          <a href="javascript:void(0)" onclick="openModal('modal-forgot')" style="color:#FF5722; font-weight:600;">Lupa password?</a>
        </div>

        <button type="submit" class="btn-submit">
          <span>Login</span>
          <span>→</span>
        </button>

        <div style="position:relative; margin:24px 0 16px; text-align:center;">
          <hr style="border:none; border-top:1px solid #E5E7EB;">
          <span style="position:absolute; top:-9px; left:50%; transform:translateX(-50%); background:#FFF; padding:0 10px; font-size:11px; color:#9CA3AF;">atau</span>
        </div>

        <div class="notice-box">
          <span style="font-size:16px; color:#FF5722;">🛡️</span>
          <div>
            <div style="font-weight:700; color:#1F2937;">Bukan admin?</div>
            <div>Halaman ini khusus untuk owner dan karyawan. Silakan hubungi owner untuk mendapatkan akses.</div>
          </div>
        </div>

        <div style="margin-top:20px; font-size:12px;">
          <a href="/wasibu/register.php" style="color:#6B7280;">Belum punya akun? <strong style="color:#FF5722; text-decoration:underline;">Daftar Akun Baru</strong></a>
        </div>
      </form>
    </div>
  </div>
</div>

<!-- MODAL: Pusat Bantuan (Slide 2) -->
<div id="modal-help" class="modal-overlay">
  <div class="modal-card">
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
      <h3 style="font-size:18px; font-weight:800;">Pusat Bantuan</h3>
      <button onclick="closeModal('modal-help')" style="background:none; border:none; font-size:18px; cursor:pointer; color:#9CA3AF;">✕</button>
    </div>
    <p style="font-size:12px; color:#6B7280; margin-bottom:16px;">Ada kendala saat login? Cek solusi di bawah ini.</p>
    <div style="border:1px solid #E5E7EB; border-radius:12px; padding:12px; margin-bottom:10px; font-size:12px;">
      <strong style="display:block; margin-bottom:4px; color:#1F2937;">Lupa Password</strong>
      <p style="color:#4B5563;">Klik "Lupa password?" di halaman login, masukkan email terdaftar, lalu ikuti tautan reset yang dikirim ke email Anda.</p>
    </div>
    <div style="border:1px solid #E5E7EB; border-radius:12px; padding:12px; margin-bottom:10px; font-size:12px;">
      <strong style="color:#1F2937;">Email atau username tidak dikenali</strong>
    </div>
    <div style="border:1px solid #E5E7EB; border-radius:12px; padding:12px; margin-bottom:16px; font-size:12px;">
      <strong style="color:#1F2937;">Saya karyawan, bukan owner</strong>
    </div>
    <div style="text-align:center; padding-top:12px; border-top:1px solid #F3F4F6;">
      <p style="font-size:12px; font-weight:700; margin-bottom:8px;">Masih butuh bantuan? Hubungi kami</p>
      <a href="mailto:bantuan@wasibu.id" class="btn-submit" style="width:100%; text-decoration:none;">✉️ Email Support</a>
      <p style="font-size:11px; color:#9CA3AF; margin-top:8px;">Layanan bantuan: Senin–Sabtu, 08.00–17.00 WIB</p>
    </div>
  </div>
</div>

<!-- MODAL: Lupa Password (Slide 3) -->
<div id="modal-forgot" class="modal-overlay">
  <div class="modal-card text-center">
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
      <h3 style="font-size:18px; font-weight:800;">Lupa Password?</h3>
      <button onclick="closeModal('modal-forgot')" style="background:none; border:none; font-size:18px; cursor:pointer; color:#9CA3AF;">✕</button>
    </div>
    <p style="font-size:12px; color:#6B7280; margin-bottom:20px;">Masukkan email akunmu. Kami akan mengirim tautan untuk mengatur ulang password.</p>
    <form action="/wasibu/forgot-password.php" method="POST">
      <div class="form-group">
        <label>Email</label>
        <input type="email" name="email" class="form-control" placeholder="Masukkan email anda" required>
      </div>
      <button type="submit" class="btn-submit" style="width:100%;">Kirim Petunjuk</button>
      <button type="button" onclick="closeModal('modal-forgot')" class="btn-secondary" style="width:100%; margin-top:8px; justify-content:center;">Kembali ke Halaman login</button>
    </form>
  </div>
</div>

<script src="/wasibu/assets/js/app.js"></script>
</body>
</html>
