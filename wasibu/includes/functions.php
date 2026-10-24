<?php
/**
 * Fungsi Pembantu Umum (Helper Functions)
 * File: includes/functions.php
 */

/**
 * Format angka ke format mata uang Rupiah
 */
function formatRupiah($amount): string {
    return 'Rp' . number_format((float)$amount, 0, ',', '.');
}

/**
 * Sanitasi input pengguna untuk mencegah serangan XSS
 */
function cleanInput($data): string {
    return htmlspecialchars(trim((string)$data), ENT_QUOTES, 'UTF-8');
}

/**
 * Format tanggal ke standar Indonesia
 */
function formatTanggalIndo($dateStr): string {
    if (!$dateStr) return '-';
    $time = strtotime($dateStr);
    $bulan = [
        1 => 'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
        'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'
    ];
    $hari = date('d', $time);
    $bln = $bulan[(int)date('m', $time)];
    $thn = date('Y', $time);
    $jam = date('H:i', $time);
    return "$hari $bln $thn $jam";
}

/**
 * Ambil nilai pengaturan dari database
 */
function getSetting(PDO $pdo, string $key, string $default = ''): string {
    $stmt = $pdo->prepare("SELECT key_value FROM settings WHERE key_name = ?");
    $stmt->execute([$key]);
    $res = $stmt->fetchColumn();
    return $res !== false ? (string)$res : $default;
}
