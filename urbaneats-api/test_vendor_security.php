<?php
/**
 * UrbanEats Vendor Portal Phase 5 — Automated Security & End-to-End Test Suite
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

$sessA    = '';
$sessB    = '';
$sessCust = '';

// 1. VENDOR A LOGIN
$resLoginA = callApi('/auth/login.php', 'POST', [
    'email'    => 'delta@urbaneats.com',
    'password' => 'password123'
], $sessA);

$results['test1_vendorA_login'] = [
    'passed'  => ($resLoginA['code'] === 200 && ($resLoginA['body']['user']['role'] ?? '') === 'vendor'),
    'user_id' => $resLoginA['body']['user']['id'] ?? null,
    'email'   => $resLoginA['body']['user']['email'] ?? null,
    'role'    => $resLoginA['body']['user']['role'] ?? null,
];

// 2. VENDOR A DASHBOARD (Delta Food Palace)
$resDashA = callApi('/vendor/dashboard.php', 'GET', null, $sessA);
$results['test2_vendorA_dashboard'] = [
    'passed'     => ($resDashA['code'] === 200 && ($resDashA['body']['data']['restaurant']['name'] ?? '') === 'Delta Food Palace'),
    'restaurant' => $resDashA['body']['data']['restaurant']['name'] ?? null,
    'metrics'    => $resDashA['body']['data']['metrics'] ?? null,
];

// 3. VENDOR B LOGIN
$resLoginB = callApi('/auth/login.php', 'POST', [
    'email'    => 'mayor@urbaneats.com',
    'password' => 'password123'
], $sessB);

$results['test3_vendorB_login'] = [
    'passed'  => ($resLoginB['code'] === 200 && ($resLoginB['body']['user']['role'] ?? '') === 'vendor'),
    'user_id' => $resLoginB['body']['user']['id'] ?? null,
    'email'   => $resLoginB['body']['user']['email'] ?? null,
];

// 4. VENDOR B DASHBOARD (Mayor Breakfast)
$resDashB = callApi('/vendor/dashboard.php', 'GET', null, $sessB);
$results['test4_vendorB_dashboard'] = [
    'passed'     => ($resDashB['code'] === 200 && ($resDashB['body']['data']['restaurant']['name'] ?? '') === 'Mayor Breakfast'),
    'restaurant' => $resDashB['body']['data']['restaurant']['name'] ?? null,
];

// 5. CUSTOMER REGISTRATION & ORDER PLACEMENT
$custEmail = 'customer_v5_' . time() . '@urbaneats.com';
$resRegCust = callApi('/auth/register.php', 'POST', [
    'fullName' => 'Test Customer V5',
    'email'    => $custEmail,
    'phone'    => '08099990000',
    'password' => 'password123',
    'role'     => 'customer'
], $sessCust);

$foodStmt = $pdo->prepare("SELECT id, name, price FROM food_items WHERE restaurant_id = 1 AND is_available = 1 LIMIT 1");
$foodStmt->execute();
$foodItem = $foodStmt->fetch();

$placedOrderId = null;
if ($foodItem && $resRegCust['code'] === 201) {
    $resOrder = callApi('/orders/create.php', 'POST', [
        'restaurant_id'   => 1,
        'recipient_name'  => 'Test Customer V5',
        'recipient_phone' => '08099990000',
        'delivery_address'=> '12 Campus Way',
        'delivery_area'   => 'Site 3',
        'items'           => [
            [
                'food_item_id' => $foodItem['id'],
                'quantity'     => 2
            ]
        ]
    ], $sessCust);

    if ($resOrder['code'] === 201) {
        $placedOrderId = (int)$resOrder['body']['data']['order_id'];
    }
}

$results['test5_order_placement'] = [
    'passed'   => ($placedOrderId !== null),
    'order_id' => $placedOrderId,
];

// 6. VENDOR A VIEWS ORDER DETAILS
$resVendorDetail = callApi('/vendor/order_detail.php?id=' . $placedOrderId, 'GET', null, $sessA);
$results['test6_vendorA_order_detail'] = [
    'passed' => ($resVendorDetail['code'] === 200 && (int)($resVendorDetail['body']['data']['id'] ?? 0) === $placedOrderId),
    'order'  => [
        'id'           => $resVendorDetail['body']['data']['id'] ?? null,
        'order_number' => $resVendorDetail['body']['data']['order_number'] ?? null,
        'recipient'    => $resVendorDetail['body']['data']['recipient_name'] ?? null,
        'total'        => $resVendorDetail['body']['data']['total_amount'] ?? null,
    ],
];

// 7. SECURITY ISOLATION — VENDOR B BLOCKED FROM VENDOR A'S ORDER
$resVendorBDetail = callApi('/vendor/order_detail.php?id=' . $placedOrderId, 'GET', null, $sessB);
$results['test7_vendorB_cross_access_block'] = [
    'passed'   => ($resVendorBDetail['code'] === 404),
    'code'     => $resVendorBDetail['code'],
    'message'  => $resVendorBDetail['body']['message'] ?? null,
];

// 8. VENDOR A STATUS UPDATE (CONFIRMED -> PROCESSING -> READY_FOR_DELIVERY) & CUSTOMER SYNC
$resUpdate1 = callApi('/vendor/update_order_status.php', 'POST', [
    'order_id'     => $placedOrderId,
    'order_status' => 'PROCESSING'
], $sessA);

$resUpdate2 = callApi('/vendor/update_order_status.php', 'POST', [
    'order_id'     => $placedOrderId,
    'order_status' => 'READY_FOR_DELIVERY'
], $sessA);

$resCustomerView = callApi('/orders/detail.php?id=' . $placedOrderId, 'GET', null, $sessCust);
$syncedStatus    = $resCustomerView['body']['data']['order_status'] ?? null;

$results['test8_status_sync'] = [
    'passed'          => ($resUpdate2['code'] === 200 && $syncedStatus === 'READY_FOR_DELIVERY'),
    'vendor_response' => $resUpdate2['body']['message'] ?? null,
    'customer_status' => $syncedStatus,
];

// 9. PAYMENT STATUS PROTECTION TEST
$resTamper = callApi('/vendor/update_order_status.php', 'POST', [
    'order_id'       => $placedOrderId,
    'order_status'   => 'DELIVERED',
    'payment_status' => 'PAID' // Malicious payment injection attempt
], $sessA);

$resCheckOrder = callApi('/vendor/order_detail.php?id=' . $placedOrderId, 'GET', null, $sessA);
$actualPayStatus = $resCheckOrder['body']['data']['payment_status'] ?? null;

$results['test9_payment_protection'] = [
    'passed'         => ($actualPayStatus === 'PENDING'),
    'payment_status' => $actualPayStatus,
];

echo json_encode([
    'test_suite'   => 'UrbanEats Vendor Phase 5 Security & Workflow Verification',
    'all_passed'   => !in_array(false, array_column($results, 'passed')),
    'test_results' => $results
], JSON_PRETTY_PRINT);
