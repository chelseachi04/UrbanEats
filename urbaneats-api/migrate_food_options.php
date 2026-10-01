<?php
/**
 * UrbanEats Migration Runner — Add option_groups to food_items
 */

require_once __DIR__ . '/config/db.php';

$pdo = getDBConnection();

try {
    // Check if column exists
    $check = $pdo->query("SHOW COLUMNS FROM food_items LIKE 'option_groups'")->fetch();
    if (!$check) {
        $pdo->exec("ALTER TABLE food_items ADD COLUMN option_groups LONGTEXT DEFAULT NULL AFTER image_url");
        echo json_encode([
            'status' => 'success',
            'message' => 'Successfully added option_groups column to food_items table.'
        ]);
    } else {
        echo json_encode([
            'status' => 'success',
            'message' => 'Column option_groups already exists in food_items table.'
        ]);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Migration failed: ' . $e->getMessage()
    ]);
}
