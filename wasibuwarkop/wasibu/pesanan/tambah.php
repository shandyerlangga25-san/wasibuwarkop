<?php
/**
 * Handler Pembuatan Pesanan Baru
 * File: pesanan/tambah.php
 */
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../includes/auth.php';
requireLogin();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header("Location: index.php");
    exit();
}

$pdo = getDBConnection();

$tableNumber = trim($_POST['table_number'] ?? 'Meja 01');
$customerName = trim($_POST['customer_name'] ?? 'Pelanggan Meja');
$notes = trim($_POST['notes'] ?? '');
$menuId = intval($_POST['menu_id'] ?? 0);
$qty = max(1, intval($_POST['qty'] ?? 1));
$paymentMethod = trim($_POST['payment_method'] ?? 'Tunai');

// Ambil data menu
$stmtMenu = $pdo->prepare("SELECT * FROM products WHERE id = ?");
$stmtMenu->execute([$menuId]);
$menu = $stmtMenu->fetch();

if (!$menu) {
    die("Menu tidak ditemukan.");
}

$subtotal = $menu['price'] * $qty;
$total = $subtotal;
$user = getCurrentUser();

// Generate No. Pesanan (#SB-YYYYMMDD-XXX)
$today = date('Ymd');
$countStmt = $pdo->query("SELECT COUNT(*) FROM orders WHERE DATE(created_at) = CURDATE()");
$seq = (int)$countStmt->fetchColumn() + 1;
$orderNumber = sprintf("#SB-%s-%03d", $today, $seq);
$refNo = "TRX-" . substr(time(), -6);

try {
    $pdo->beginTransaction();

    $stmtInsert = $pdo->prepare("INSERT INTO orders 
        (order_number, table_number, customer_name, user_id, source, status, payment_status, payment_method, reference_no, notes, subtotal, discount, tax, total, created_at)
        VALUES (?, ?, ?, ?, 'Kasir', 'Baru', 'Lunas', ?, ?, ?, ?, 0.00, 0.00, ?, NOW())");
    $stmtInsert->execute([
        $orderNumber,
        $tableNumber,
        $customerName ?: 'Pelanggan Meja',
        $user['id'],
        $paymentMethod,
        $refNo,
        $notes,
        $subtotal,
        $total
    ]);
    $orderId = $pdo->lastInsertId();

    // Masukkan ke order_items
    $stmtItem = $pdo->prepare("INSERT INTO order_items (order_id, product_id, product_name, price, qty, subtotal) VALUES (?, ?, ?, ?, ?, ?)");
    $stmtItem->execute([
        $orderId,
        $menu['id'],
        $menu['name'],
        $menu['price'],
        $qty,
        $subtotal
    ]);

    $pdo->commit();
    header("Location: struk.php?id=" . $orderId . "&new=1");
    exit();
} catch (Exception $e) {
    $pdo->rollBack();
    die("Gagal membuat pesanan: " . htmlspecialchars($e->getMessage()));
}
