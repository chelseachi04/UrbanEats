<?php
/**
 * UrbanEats Phase 4 Upgrade: Order Archiving Migration Runner
 * Runs 005_order_archiving.sql against urbaneats_db.
 */

require_once __DIR__ . '/config/db.php';

$migrationFile = __DIR__ . '/migrations/005_order_archiving.sql';

if (!file_exists($migrationFile)) {
    die("ERROR: Migration file not found: $migrationFile\n");
}

$pdo = getDBConnection();

$sql = file_get_contents($migrationFile);
$lines = explode("\n", $sql);
$cleanedLines = array_filter($lines, function($line) {
    $trimmed = trim($line);
    return !empty($trimmed) && !str_starts_with($trimmed, '--');
});
$sql = implode("\n", $cleanedLines);

$statements = array_filter(
    array_map('trim', explode(';', $sql)),
    fn($s) => !empty($s)
);

$successCount = 0;
$errors = [];

foreach ($statements as $statement) {
    try {
        $pdo->exec($statement);
        $successCount++;
    } catch (PDOException $e) {
        // If column already exists error, ignore gracefully
        if (str_contains($e->getMessage(), "Duplicate column name") || str_contains($e->getMessage(), "already exists")) {
            $successCount++;
        } else {
            $errors[] = [
                'statement' => substr($statement, 0, 80) . '...',
                'error'     => $e->getMessage()
            ];
        }
    }
}

header('Content-Type: application/json');
echo json_encode([
    'status'         => empty($errors) ? 'success' : 'partial',
    'statements_run' => $successCount,
    'errors'         => $errors,
    'message'        => empty($errors)
        ? 'Migration 005 (order_archiving) completed successfully.'
        : 'Migration completed with some errors.'
], JSON_PRETTY_PRINT);
