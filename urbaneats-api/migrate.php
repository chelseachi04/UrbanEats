<?php
/**
 * UrbanEats Phase 2B-1: Migration Runner
 * Runs 001_restaurant_menu_foundation.sql against urbaneats_db.
 * Safe to run multiple times (uses CREATE TABLE IF NOT EXISTS, INSERT IGNORE).
 *
 * Usage: php migrate.php (from CLI) or visit via browser if XAMPP is running.
 * SECURITY: This file should NOT be publicly accessible in production.
 */

require_once __DIR__ . '/config/db.php';

$migrationFile = __DIR__ . '/migrations/001_restaurant_menu_foundation.sql';

if (!file_exists($migrationFile)) {
    die("ERROR: Migration file not found: $migrationFile\n");
}

$pdo = getDBConnection();

// Read and split SQL by semicolons, skip empty statements
$sql = file_get_contents($migrationFile);
// Remove comment lines for cleaner execution
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
        $errors[] = [
            'statement' => substr($statement, 0, 80) . '...',
            'error'     => $e->getMessage()
        ];
    }
}

header('Content-Type: application/json');
echo json_encode([
    'status'         => empty($errors) ? 'success' : 'partial',
    'statements_run' => $successCount,
    'errors'         => $errors,
    'message'        => empty($errors)
        ? 'Migration 001 completed successfully.'
        : 'Migration completed with some errors.'
], JSON_PRETTY_PRINT);
