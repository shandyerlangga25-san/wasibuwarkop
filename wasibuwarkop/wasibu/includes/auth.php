<?php
/**
 * Otentikasi dan Otorisasi Sesi Pengguna
 * File: includes/auth.php
 */

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

/**
 * Cek apakah user telah login
 */
function isLoggedIn(): bool {
    return isset($_SESSION['user_id']) && !empty($_SESSION['user_id']);
}

/**
 * Proteksi halaman - wajib login
 */
function requireLogin(): void {
    if (!isLoggedIn()) {
        header("Location: /wasibu/login.php?error=unauthorized");
        exit();
    }
}

/**
 * Proteksi hak akses role (Admin, Owner, Kasir)
 */
function requireRole(array $allowedRoles): void {
    requireLogin();
    $currentRole = $_SESSION['user_role'] ?? '';
    if (!in_array($currentRole, $allowedRoles)) {
        header("Location: /wasibu/pesanan/index.php?error=forbidden");
        exit();
    }
}

/**
 * Dapatkan data user yang sedang login
 */
function getCurrentUser(): ?array {
    if (!isLoggedIn()) return null;
    return [
        'id'       => $_SESSION['user_id'],
        'name'     => $_SESSION['user_name'] ?? 'Pengguna',
        'username' => $_SESSION['user_username'] ?? '',
        'role'     => $_SESSION['user_role'] ?? 'Kasir',
    ];
}
