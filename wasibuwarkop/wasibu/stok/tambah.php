<?php
/**
 * Handler Penambahan Stok
 * File: stok/tambah.php
 */
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../includes/auth.php';
requireLogin();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $pdo = getDBConnection();
    $stockId = intval($_POST['stock_id'] ?? 0);
    $amount = floatval($_POST['amount'] ?? 0);
    $note = trim($_POST['note'] ?? '') ?: 'Penambahan stok rutin';

    if ($stockId > 0 && $amount > 0) {
        try {
            $pdo->beginTransaction();

            $stk = $pdo->prepare("SELECT current_stock, min_stock, unit FROM stock_items WHERE id = ?");
            $stk->execute([$stockId]);
            $item = $stk->fetch();

            if ($item) {
                $newStock = $item['current_stock'] + $amount;
                $status = ($newStock <= 0) ? 'Habis' : (($newStock <= $item['min_stock']) ? 'Menipis' : 'Aman');

                $stmtUp = $pdo->prepare("UPDATE stock_items SET current_stock = ?, status = ?, updated_at = NOW() WHERE id = ?");
                $stmtUp->execute([$newStock, $status, $stockId]);

                $stmtMov = $pdo->prepare("INSERT INTO stock_movements (stock_item_id, type, amount, unit, note, created_at) VALUES (?, 'Barang Masuk', ?, ?, ?, NOW())");
                $stmtMov->execute([$stockId, $amount, $item['unit'], $note]);
            }

            $pdo->commit();
            header("Location: index.php?id=" . $stockId);
            exit();
        } catch (Exception $e) {
            $pdo->rollBack();
            die("Gagal menambah stok: " . htmlspecialchars($e->getMessage()));
        }
    }
}

header("Location: index.php");
exit();
