<?php
/**
 * Handler Simpan & Ubah Menu Produk
 * File: produk/simpan.php
 */
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../includes/auth.php';
require_once __DIR__ . '/../includes/functions.php';
requireLogin();

$pdo = getDBConnection();
$action = $_GET['action'] ?? '';

if ($action === 'toggle') {
    $id = intval($_GET['id'] ?? 0);
    if ($id > 0) {
        $cur = $pdo->prepare("SELECT status FROM products WHERE id = ?");
        $cur->execute([$id]);
        $status = $cur->fetchColumn();
        $next = ($status === 'Tersedia') ? 'Habis' : 'Tersedia';
        $pdo->prepare("UPDATE products SET status = ? WHERE id = ?")->execute([$next, $id]);
    }
    header("Location: index.php?id=" . $id);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && $action === 'add') {
    $name = trim($_POST['name'] ?? '');
    $categoryId = intval($_POST['category_id'] ?? 1);
    $price = floatval($_POST['price'] ?? 0);
    $code = trim($_POST['code'] ?? '') ?: 'MN' . rand(100, 999);
    $ingredients = trim($_POST['ingredients'] ?? '');
    $description = trim($_POST['description'] ?? '');

    if (!empty($name) && $price > 0) {
        $stmt = $pdo->prepare("INSERT INTO products (code, category_id, name, price, status, prep_time, ingredients, description) VALUES (?, ?, ?, ?, 'Tersedia', '10-15 menit', ?, ?)");
        $stmt->execute([$code, $categoryId, $name, $price, $ingredients, $description]);
    }
    header("Location: index.php");
    exit();
}

header("Location: index.php");
exit();
