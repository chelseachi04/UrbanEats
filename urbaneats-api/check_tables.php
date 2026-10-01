<?php
require_once __DIR__ . '/config/db.php';
$pdo = getDBConnection();
$tables = $pdo->query('SHOW TABLES')->fetchAll(PDO::FETCH_COLUMN);
echo implode(', ', $tables);
