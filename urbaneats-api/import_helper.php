<?php
/**
 * UrbanEats — Production Database Import Helper
 *
 * This script is designed to run directly on the InfinityFree server (or via HTTP/CLI)
 * to import the exported database schema and seed data into `if0_42575351_urbaneats`.
 *
 * SECURITY: Delete this file from your live server immediately after successful execution!
 */

// Basic error reporting
error_reporting(E_ALL);
ini_set('display_errors', '1');
set_time_limit(300);

// InfinityFree Database Credentials
$dbHost = 'sql107.infinityfree.com';
$dbPort = '3306';
$dbName = 'if0_42575351_urbaneats';
$dbUser = 'if0_42575351';
$dbPass = 'Chelsea2026';

// Allow override if run locally for testing with ?local=1
if (isset($_GET['local']) && $_GET['local'] === '1') {
    $dbHost = '127.0.0.1';
    $dbName = 'urbaneats_db';
    $dbUser = 'root';
    $dbPass = '';
}

header('Content-Type: text/html; charset=utf-8');
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>UrbanEats — Database Import Helper</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0f172a; color: #f8fafc; padding: 2rem; }
        .card { max-width: 800px; margin: 0 auto; background: #1e293b; border-radius: 12px; padding: 2rem; box-shadow: 0 4px 20px rgba(0,0,0,0.4); }
        h1 { color: #f97316; margin-top: 0; }
        .log-box { background: #0b0f19; border: 1px solid #334155; border-radius: 8px; padding: 1rem; font-family: monospace; font-size: 0.9rem; max-height: 400px; overflow-y: auto; white-space: pre-wrap; color: #38bdf8; }
        .success { color: #4ade80; font-weight: bold; }
        .error { color: #f87171; font-weight: bold; }
        .warning { background: #7c2d12; color: #fed7aa; padding: 0.75rem 1rem; border-radius: 6px; margin: 1rem 0; }
    </style>
</head>
<body>
<div class="card">
    <h1>UrbanEats Database Importer</h1>
    <p>Target Database: <strong><?= htmlspecialchars($dbName) ?></strong> on <strong><?= htmlspecialchars($dbHost) ?></strong></p>

    <div class="warning">
        ⚠️ <strong>Security Notice:</strong> Please remove this <code>import_helper.php</code> file and <code>export.sql</code> from your public server once import is completed!
    </div>

    <div class="log-box">
<?php
$sqlFile = __DIR__ . '/export.sql';
if (!file_exists($sqlFile)) {
    $sqlFile = __DIR__ . '/../export.sql';
}

if (!file_exists($sqlFile)) {
    echo "<span class='error'>[ERROR] export.sql file not found in " . htmlspecialchars(__DIR__) . "</span>\n";
    echo "Please upload export.sql into the same directory as import_helper.php and refresh this page.\n";
    echo "</div></div></body></html>";
    exit;
}

echo "[INFO] Found export.sql (" . number_format(filesize($sqlFile)) . " bytes)\n";
echo "[INFO] Connecting to MySQL server {$dbHost}:{$dbPort}...\n";

try {
    $dsn = "mysql:host={$dbHost};port={$dbPort};dbname={$dbName};charset=utf8mb4";
    $pdo = new PDO($dsn, $dbUser, $dbPass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4"
    ]);
    echo "<span class='success'>[SUCCESS] Connected to database '{$dbName}'!</span>\n\n";

    echo "[INFO] Reading and sanitizing SQL script...\n";
    $lines = file($sqlFile);
    $cleanedSql = '';

    foreach ($lines as $line) {
        $trimmed = trim($line);
        // Skip comment lines and database creation lines
        if (strpos($trimmed, '--') === 0 || strpos($trimmed, '/*') === 0 || strpos($trimmed, '#') === 0) {
            continue;
        }
        if (stripos($trimmed, 'CREATE DATABASE') === 0 || stripos($trimmed, 'USE `') === 0 || stripos($trimmed, 'USE urbaneats') === 0) {
            continue;
        }
        $cleanedSql .= $line;
    }

    // Disable foreign keys during import
    $pdo->exec("SET FOREIGN_KEY_CHECKS = 0;");

    // Execute multi-query batch
    echo "[INFO] Executing schema creation and data insertion...\n";
    $pdo->exec($cleanedSql);

    $pdo->exec("SET FOREIGN_KEY_CHECKS = 1;");

    echo "<span class='success'>[SUCCESS] SQL script execution completed!</span>\n\n";

    // Verification queries
    echo "── Verification Summary ──────────────────────────\n";
    $tables = ['users', 'restaurants', 'food_categories', 'food_items', 'orders', 'favorites', 'notifications'];
    foreach ($tables as $table) {
        try {
            $stmt = $pdo->query("SELECT COUNT(*) AS count FROM `{$table}`");
            $res = $stmt->fetch();
            echo sprintf("  • %-20s : %s rows\n", $table, $res['count']);
        } catch (Exception $e) {
            echo sprintf("  • %-20s : Table not found / query failed\n", $table);
        }
    }
    echo "──────────────────────────────────────────────────\n";
    echo "\n<span class='success'>🎉 DATABASE IMPORT COMPLETED SUCCESSFULLY!</span>\n";

} catch (PDOException $e) {
    echo "<span class='error'>[FATAL ERROR] Connection or Query Failed: " . htmlspecialchars($e->getMessage()) . "</span>\n";
}
?>
    </div>
</div>
</body>
</html>
