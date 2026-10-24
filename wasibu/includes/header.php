<?php
/**
 * Komponen Header HTML Bersama
 * File: includes/header.php
 */
if (!isset($pageTitle)) {
    $pageTitle = 'WASIBU - Warung Si Bungsu Merchant';
}
?>
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title><?= htmlspecialchars($pageTitle) ?></title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/wasibu/assets/css/style.css">
</head>
<body>
<div class="app-layout">
