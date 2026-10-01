<?php
require_once __DIR__ . '/config/db.php';
header('Content-Type: application/json');
$pdo = getDBConnection();

$stmt = $pdo->query("SELECT id, owner_id, name, slug, status, is_active FROM restaurants");
$restaurants = $stmt->fetchAll();

echo json_encode($restaurants, JSON_PRETTY_PRINT);
