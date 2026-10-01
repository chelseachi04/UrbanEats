<?php
/**
 * UrbanEats Phase 8 — DEVIL INCARNATE Comprehensive Hardening Test Suite
 */
require_once __DIR__ . '/config/db.php';
header('Content-Type: application/json');

$pdo = getDBConnection();
$results = [];

function callApi($url, $method = 'GET', $data = null, &$sessId = '') {
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, 'http://localhost/urbaneats-api/api' . $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HEADER, true);

    if (!empty($sessId)) {
        curl_setopt($ch, CURLOPT_COOKIE, "PHPSESSID=" . $sessId);
    }

    if ($method === 'POST') {
        curl_setopt($ch, CURLOPT_POST, true);
        if ($data) curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
        curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
    } elseif ($method === 'PUT') {
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'PUT');
        if ($data) curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
        curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
    }

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $hSize    = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
    curl_close($ch);

    $headerStr = substr($response, 0, $hSize);
    $bodyStr   = substr($response, $hSize);

    if (preg_match_all('/Set-Cookie:\s*PHPSESSID=([^;\r\n]+)/i', $headerStr, $matches)) {
        $sessId = end($matches[1]);
    }

    return [
        'code' => $httpCode,
        'body' => json_decode($bodyStr, true) ?: $bodyStr
    ];
}

$sessRider1  = '';
$sessVendorA = '';
$sessPendingV = '';

// 1. CLEAN MARKETPLACE RESTAURANTS TEST
$resPublicMarket = callApi('/restaurants/index.php', 'GET');
$publicRestCount = count($resPublicMarket['body']['data'] ?? []);

$results['test1_marketplace_cleanliness'] = [
    'passed'           => ($resPublicMarket['code'] === 200 && $publicRestCount === 4),
    'public_count'     => $publicRestCount,
    'restaurant_names' => array_column($resPublicMarket['body']['data'] ?? [], 'name'),
];

// 2. PENDING VENDOR MARKETPLACE ISOLATION TEST
$pendVEmail = 'pending_v8_' . time() . '@urbaneats.com';
$resRegVendor = callApi('/auth/register.php', 'POST', [
    'fullName'       => 'Pending Vendor Phase 8',
    'email'          => $pendVEmail,
    'phone'          => '08011223344',
    'password'       => 'password123',
    'role'           => 'vendor',
    'restaurantName' => 'Unapproved Pending Kitchen'
], $sessPendingV);

$resPublicMarketAfter = callApi('/restaurants/index.php', 'GET');
$publicCountAfter     = count($resPublicMarketAfter['body']['data'] ?? []);

$results['test2_pending_vendor_marketplace_isolation'] = [
    'passed'      => ($resRegVendor['code'] === 201 && $publicCountAfter === 4),
    'before_count' => $publicRestCount,
    'after_count'  => $publicCountAfter,
    'status'       => 'Pending vendor restaurant isolated from public marketplace until Admin approval',
];

// 3. RIDER LOGIN TEST
$resRiderLogin = callApi('/auth/login.php', 'POST', [
    'email'    => 'rider1@urbaneats.com',
    'password' => 'password123'
], $sessRider1);

$results['test3_rider_login'] = [
    'passed'     => ($resRiderLogin['code'] === 200 && ($resRiderLogin['body']['user']['role'] ?? '') === 'rider'),
    'rider_code' => $resRiderLogin['body']['user']['rider_code'] ?? null,
    'status'     => $resRiderLogin['body']['user']['application_status'] ?? null,
];

// 4. FOOD ITEM IMAGE URL PERSISTENCE IN MENU & MARKETPLACE TEST
$resVendorLogin = callApi('/auth/login.php', 'POST', [
    'email'    => 'delta@urbaneats.com',
    'password' => 'password123'
], $sessVendorA);

$resVendorMenu = callApi('/vendor/menu.php', 'GET', null, $sessVendorA);
$menuItems     = $resVendorMenu['body']['data'] ?? [];
$hasImageUrlCol = false;
if (count($menuItems) > 0 && array_key_exists('image_url', $menuItems[0])) {
    $hasImageUrlCol = true;
}

$results['test4_food_image_url_persistence'] = [
    'passed'             => ($resVendorMenu['code'] === 200 && $hasImageUrlCol),
    'image_url_selected' => $hasImageUrlCol,
    'sample_item_name'   => $menuItems[0]['name'] ?? null,
];

// 5. UNAVAILABLE FOOD ITEM MUTED VISIBILITY TEST
callApi('/vendor/menu.php', 'PUT', ['id' => 1, 'is_available' => 0], $sessVendorA);
$resPublicMenu = callApi('/food-items/index.php?restaurant_id=1', 'GET');
$publicItems   = $resPublicMenu['body']['data'] ?? [];
$item1         = null;
foreach ($publicItems as $p) {
    if ((int)$p['id'] === 1) {
        $item1 = $p;
        break;
    }
}
// Restore item 1
callApi('/vendor/menu.php', 'PUT', ['id' => 1, 'is_available' => 1], $sessVendorA);

$results['test5_unavailable_food_visibility'] = [
    'passed'       => ($item1 !== null && $item1['is_available'] === false),
    'item_found'   => ($item1 !== null),
    'is_available' => $item1['is_available'] ?? null,
];

echo json_encode([
    'test_suite'   => 'UrbanEats Phase 8 DEVIL INCARNATE Hardening & Integrity Test Suite',
    'all_passed'   => !in_array(false, array_column($results, 'passed')),
    'test_results' => $results
], JSON_PRETTY_PRINT);
