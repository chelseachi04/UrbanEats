<?php
/**
 * UrbanEats Favorites Migration Runner
 * Runs 002_favorites.sql to create the user favorites table.
 * Safe to run multiple times (CREATE TABLE IF NOT EXISTS).
 *
 * SECURITY: Remove or restrict this file after migration is applied in production.
 */

require_once __DIR__ . '/config/db.php';

$migrationFile = __DIR__ . '/migrations/002_favorites.sql';

if (!file_exists($migrationFile)) {
    die("ERROR: Migration file not found: $migrationFile\n");
}

$pdo = getDBConnection();

$sql   = file_get_contents($migrationFile);
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
            'statement' => substr($statement, 0, 120) . '...',
            'error'     => $e->getMessage()
        ];
    }
}

header('Content-Type: application/json');
echo json_encode([
    'status'         => empty($errors) ? 'success' : 'partial',
    'migration'      => '002_favorites.sql',
    'statements_run' => $successCount,
    'errors'         => $errors,
    'message'        => empty($errors)
        ? 'Migration 002 (favorites table) completed successfully.'
        : 'Migration completed with some errors.',
], JSON_PRETTY_PRINT);
