<?php
/**
 * Gerbang Utama (Entry Point)
 * File: index.php
 */
require_once __DIR__ . '/includes/auth.php';

if (isLoggedIn()) {
    header("Location: /wasibu/pesanan/index.php");
    exit();
} else {
    header("Location: /wasibu/login.php");
    exit();
}
