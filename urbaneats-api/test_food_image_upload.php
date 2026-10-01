<?php
/**
 * Test: food image upload through new create_food_item.php endpoint
 */
require_once __DIR__ . '/config/db.php';
header('Content-Type: application/json');

$results = [];

// 1. Login as delta vendor
$loginRes = file_get_contents('http://localhost/urbaneats-api/api/auth/login.php', false, stream_context_create([
    'http' => [
        'method'  => 'POST',
        'header'  => "Content-Type: application/json\r\n",
        'content' => json_encode(['email' => 'delta@urbaneats.com', 'password' => 'password123']),
    ],
]));

$loginData = json_decode($loginRes, true);
$results['login'] = [
    'passed'  => ($loginData['status'] ?? '') === 'success',
    'role'    => $loginData['user']['role'] ?? null,
    'status'  => $loginData['user']['application_status'] ?? null,
];

// 2. Verify create_food_item.php endpoint exists
$results['endpoint_exists'] = [
    'passed' => file_exists(__DIR__ . '/api/vendor/create_food_item.php'),
];

// 3. Verify update_food_item.php endpoint exists
$results['update_endpoint_exists'] = [
    'passed' => file_exists(__DIR__ . '/api/vendor/update_food_item.php'),
];

// 4. Verify uploads/food directory exists and is writable
$uploadDir = __DIR__ . '/uploads/food/';
$results['upload_dir'] = [
    'exists'   => is_dir($uploadDir),
    'writable' => is_writable($uploadDir),
    'passed'   => is_dir($uploadDir) && is_writable($uploadDir),
];

// 5. Verify food items API returns image_url column
$pdo  = getDBConnection();
$stmt = $pdo->prepare("SELECT id, name, image_url FROM food_items WHERE restaurant_id = 1 LIMIT 3");
$stmt->execute();
$items = $stmt->fetchAll();

$results['food_items_have_image_url'] = [
    'passed'       => count($items) > 0 && array_key_exists('image_url', $items[0]),
    'sample_items' => array_map(fn($i) => ['id' => $i['id'], 'name' => $i['name'], 'image_url' => $i['image_url']], $items),
];

$allPassed = !in_array(false, array_column($results, 'passed'));

echo json_encode([
    'test_suite' => 'UrbanEats Food Image Upload Readiness Test',
    'all_passed' => $allPassed,
    'results'    => $results,
], JSON_PRETTY_PRINT);
