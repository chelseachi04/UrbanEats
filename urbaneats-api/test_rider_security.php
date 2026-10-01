<?php
/**
 * UrbanEats Phase 6 — Rider System Security & Workflow Automated Test Suite
 */
require_once __DIR__ . '/config/db.php';

header('Content-Type: application/json');

$pdo = getDBConnection();
$results = [];

function apiCall($url, $method = 'GET', $data = null, &$sessId = '') {
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

$sessRider1 = '';
$sessRider2 = '';
$sessVendor = '';
$sessCust   = '';

// 1. RIDER 1 LOGIN
$resRider1Login = apiCall('/auth/login.php', 'POST', [
    'email'    => 'rider1@urbaneats.com',
    'password' => 'password123'
], $sessRider1);

$results['test1_rider1_login'] = [
    'passed'  => ($resRider1Login['code'] === 200 && ($resRider1Login['body']['user']['role'] ?? '') === 'rider'),
    'user_id' => $resRider1Login['body']['user']['id'] ?? null,
    'email'   => $resRider1Login['body']['user']['email'] ?? null,
];

// 2. RIDER 2 LOGIN
$resRider2Login = apiCall('/auth/login.php', 'POST', [
    'email'    => 'rider2@urbaneats.com',
    'password' => 'password123'
], $sessRider2);

$results['test2_rider2_login'] = [
    'passed'  => ($resRider2Login['code'] === 200 && ($resRider2Login['body']['user']['role'] ?? '') === 'rider'),
    'user_id' => $resRider2Login['body']['user']['id'] ?? null,
    'email'   => $resRider2Login['body']['user']['email'] ?? null,
];

// 3. VENDOR LOGIN
$resVendorLogin = apiCall('/auth/login.php', 'POST', [
    'email'    => 'delta@urbaneats.com',
    'password' => 'password123'
], $sessVendor);

// 4. CUSTOMER ORDER CREATION & VENDOR READY MARKS
$custEmail = 'cust_rider_test_' . time() . '@urbaneats.com';
$resCustReg = apiCall('/auth/register.php', 'POST', [
    'fullName' => 'Customer Rider Test',
    'email'    => $custEmail,
    'phone'    => '08099991111',
    'password' => 'password123',
    'role'     => 'customer'
], $sessCust);

// Create address for customer
$resAddr = apiCall('/addresses/index.php', 'POST', [
    'label'          => 'Hostel B',
    'recipient_name' => 'Customer Rider Test',
    'phone'          => '08099991111',
    'address'        => '15 Express Way',
    'area'           => 'Site 2',
    'is_default'     => 1
], $sessCust);

$addressId = $resAddr['body']['data']['id'] ?? null;
$foodStmt  = $pdo->query("SELECT id FROM food_items WHERE restaurant_id = 1 AND is_available = 1 LIMIT 1");
$foodItem  = $foodStmt->fetch();

$targetOrderId = null;
if ($foodItem && $addressId) {
    $resOrder = apiCall('/orders/create.php', 'POST', [
        'delivery_address_id' => $addressId,
        'items'               => [['id' => $foodItem['id'], 'quantity' => 1]]
    ], $sessCust);

    if ($resOrder['code'] === 201) {
        $targetOrderId = (int)$resOrder['body']['data']['order_id'];
    }
}

// Vendor sets order to CONFIRMED -> PROCESSING -> READY_FOR_DELIVERY
apiCall('/vendor/update_order_status.php', 'POST', ['order_id' => $targetOrderId, 'order_status' => 'PROCESSING'], $sessVendor);
$resVendorReady = apiCall('/vendor/update_order_status.php', 'POST', ['order_id' => $targetOrderId, 'order_status' => 'READY_FOR_DELIVERY'], $sessVendor);

$results['test3_order_ready_for_rider'] = [
    'passed'   => ($resVendorReady['code'] === 200 && $targetOrderId !== null),
    'order_id' => $targetOrderId,
];

// 5. ATOMIC ACCEPTANCE TEST — RIDER 1 ACCEPTS, RIDER 2 BLOCKED CONCURRENTLY
$resAcceptRider1 = apiCall('/rider/accept.php', 'POST', ['order_id' => $targetOrderId], $sessRider1);
$resAcceptRider2 = apiCall('/rider/accept.php', 'POST', ['order_id' => $targetOrderId], $sessRider2);

$results['test4_atomic_duplicate_acceptance_block'] = [
    'passed'          => ($resAcceptRider1['code'] === 200 && $resAcceptRider2['code'] === 409),
    'rider1_response' => $resAcceptRider1['body']['message'] ?? null,
    'rider2_response' => $resAcceptRider2['body']['message'] ?? null,
];

// 6. RIDER ISOLATION TEST — RIDER 2 CANNOT UPDATE RIDER 1'S DELIVERY
$resRider2Tamper = apiCall('/rider/update_status.php', 'POST', [
    'order_id' => $targetOrderId,
    'status'   => 'OUT_FOR_DELIVERY'
], $sessRider2);

$results['test5_rider2_tamper_block'] = [
    'passed'   => ($resRider2Tamper['code'] === 404),
    'code'     => $resRider2Tamper['code'],
    'message'  => $resRider2Tamper['body']['message'] ?? null,
];

// 7. RIDER 1 WORKFLOW (PICKED_UP -> OUT_FOR_DELIVERY -> DELIVERED) & CUSTOMER TRACKING SYNC
$resPickup = apiCall('/rider/update_status.php', 'POST', [
    'order_id' => $targetOrderId,
    'status'   => 'PICKED_UP'
], $sessRider1);

$resOutForDel = apiCall('/rider/update_status.php', 'POST', [
    'order_id' => $targetOrderId,
    'status'   => 'OUT_FOR_DELIVERY'
], $sessRider1);

$resCustTrackMid = apiCall('/orders/detail.php?id=' . $targetOrderId, 'GET', null, $sessCust);
$midTrackStatus  = $resCustTrackMid['body']['data']['order_status'] ?? null;

$resDelivered = apiCall('/rider/update_status.php', 'POST', [
    'order_id' => $targetOrderId,
    'status'   => 'DELIVERED'
], $sessRider1);

$resCustTrackFinal = apiCall('/orders/detail.php?id=' . $targetOrderId, 'GET', null, $sessCust);
$finalTrackStatus  = $resCustTrackFinal['body']['data']['order_status'] ?? null;

$results['test6_workflow_and_customer_tracking_sync'] = [
    'passed'             => ($midTrackStatus === 'OUT_FOR_DELIVERY' && $finalTrackStatus === 'DELIVERED'),
    'mid_cust_status'    => $midTrackStatus,
    'final_cust_status'  => $finalTrackStatus,
];

// 8. RIDER HISTORY TEST — COMPLETED DELIVERY APPEARS FOR RIDER 1 ONLY
$resHistory1 = apiCall('/rider/history.php', 'GET', null, $sessRider1);
$resHistory2 = apiCall('/rider/history.php', 'GET', null, $sessRider2);

$history1Ids = array_column($resHistory1['body']['data'] ?? [], 'order_id');
$history2Ids = array_column($resHistory2['body']['data'] ?? [], 'order_id');

$results['test7_rider_history_isolation'] = [
    'passed'         => (in_array($targetOrderId, $history1Ids) && !in_array($targetOrderId, $history2Ids)),
    'rider1_history' => count($history1Ids),
    'rider2_history' => count($history2Ids),
];

echo json_encode([
    'test_suite'   => 'UrbanEats Rider Phase 6 Security & Workflow Automated Test Suite',
    'all_passed'   => !in_array(false, array_column($results, 'passed')),
    'test_results' => $results
], JSON_PRETTY_PRINT);
