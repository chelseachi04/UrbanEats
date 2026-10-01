<?php
require_once __DIR__ . '/config/db.php';
header('Content-Type: text/plain');
$pdo = getDBConnection();
$stmt = $pdo->query('SELECT id, name, image_url, is_available FROM food_items ORDER BY id DESC LIMIT 12');
$rows = $stmt->fetchAll();
foreach ($rows as $r) {
    echo $r['id'] . ' | ' . str_pad($r['name'], 35) . ' | avail=' . $r['is_available'] . ' | img=' . ($r['image_url'] ?: 'NULL') . "\n";
}
