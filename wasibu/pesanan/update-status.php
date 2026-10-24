<?php
/**
 * Handler Pembaruan Status Pesanan
 * File: pesanan/update-status.php
 */
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../includes/auth.php';
requireLogin();

$pdo = getDBConnection();

// Jika aksi cancel
if (isset($_GET['action']) && $_GET['action'] === 'cancel') {
    $orderId = intval($_GET['id'] ?? 0);
    if ($orderId > 0) {
        $stmt = $pdo->prepare("UPDATE orders SET status = 'Dibatalkan', updated_at = NOW() WHERE id = ?");
        $stmt->execute([$orderId]);
    }
    header("Location: index.php?msg=cancelled");
    exit();
}

// Update status dari modal
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $orderId = intval($_POST['order_id'] ?? 0);
    $status = trim($_POST['status'] ?? '');
    $valid = ['Baru', 'Diproses', 'Siap Disajikan', 'Selesai'];

    if ($orderId > 0 && in_array($status, $valid)) {
        try {
            $pdo->beginTransaction();
            $stmt = $pdo->prepare("UPDATE orders SET status = ?, updated_at = NOW() WHERE id = ?");
            $stmt->execute([$status, $orderId]);

            if ($status === 'Selesai') {
                $pdo->prepare("UPDATE orders SET payment_status = 'Lunas' WHERE id = ?")->execute([$orderId]);
            }

            $pdo->commit();
            header("Location: index.php?id=" . $orderId . "&msg=updated");
            exit();
        } catch (Exception $e) {
            $pdo->rollBack();
            die("Gagal memperbarui status: " . htmlspecialchars($e->getMessage()));
        }
    }
}

header("Location: index.php");
exit();
