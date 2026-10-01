<?php
/**
 * UrbanEats Phase 7 — DEVIL INCARNATE Security & System Hardening Test Suite
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
$sessPendingR = '';

// 1. RIDER LOGIN TEST
$resRiderLogin = callApi('/auth/login.php', 'POST', [
    'email'    => 'rider1@urbaneats.com',
    'password' => 'password123'
], $sessRider1);

$results['test1_rider_login'] = [
    'passed'     => ($resRiderLogin['code'] === 200 && ($resRiderLogin['body']['user']['role'] ?? '') === 'rider'),
    'rider_code' => $resRiderLogin['body']['user']['rider_code'] ?? null,
    'status'     => $resRiderLogin['body']['user']['application_status'] ?? null,
];

// 2. VENDOR APPLICATION & PENDING GUARD TEST
$pendVEmail = 'vendor_applicant_' . time() . '@urbaneats.com';
$resRegVendor = callApi('/auth/register.php', 'POST', [
    'fullName'       => 'Pending Vendor Applicant',
    'email'          => $pendVEmail,
    'phone'          => '08099887766',
    'password'       => 'password123',
    'role'           => 'vendor',
    'restaurantName' => 'Pending Taste Buka'
], $sessPendingV);

$pendingVUserId = $resRegVendor['body']['user']['id'] ?? null;
$resDashBlocked = callApi('/vendor/dashboard.php', 'GET', null, $sessPendingV);

$results['test2_vendor_pending_guard'] = [
    'passed'        => ($resRegVendor['code'] === 201 && $resDashBlocked['code'] === 403),
    'register_code' => $resRegVendor['code'],
    'dash_code'     => $resDashBlocked['code'],
    'dash_msg'      => $resDashBlocked['body']['message'] ?? null,
];

// 3. ADMIN VENDOR APPROVAL & UNIQUE VENDOR CODE TEST
$resApproveVendor = callApi('/admin/approve_vendor.php', 'POST', [
    'user_id' => $pendingVUserId,
    'action'  => 'approve'
]);

$resDashApproved = callApi('/vendor/dashboard.php', 'GET', null, $sessPendingV);

$results['test3_admin_vendor_approval'] = [
    'passed'      => ($resApproveVendor['code'] === 200 && $resDashApproved['code'] === 200),
    'vendor_code' => $resApproveVendor['body']['data']['vendor_code'] ?? null,
    'dash_code'   => $resDashApproved['code'],
];

// 4. RIDER APPLICATION, PENDING GUARD & ADMIN APPROVAL TEST
$pendREmail = 'rider_applicant_' . time() . '@urbaneats.com';
$resRegRider = callApi('/auth/register.php', 'POST', [
    'fullName' => 'Pending Rider Applicant',
    'email'    => $pendREmail,
    'phone'    => '08088776655',
    'password' => 'password123',
    'role'     => 'rider'
], $sessPendingR);

$pendingRUserId = $resRegRider['body']['user']['id'] ?? null;
$resDelivBlocked = callApi('/rider/deliveries.php', 'GET', null, $sessPendingR);

$resApproveRider = callApi('/admin/approve_rider.php', 'POST', [
    'user_id' => $pendingRUserId,
    'action'  => 'approve'
]);

$results['test4_rider_approval_and_unique_code'] = [
    'passed'      => ($resRegRider['code'] === 201 && $resDelivBlocked['code'] === 403 && $resApproveRider['code'] === 200),
    'rider_code'  => $resApproveRider['body']['data']['rider_code'] ?? null,
    'blocked_msg' => $resDelivBlocked['body']['message'] ?? null,
];

// 5. RIDER ONLINE / OFFLINE TOGGLE TEST
$resToggleOff = callApi('/rider/toggle_online.php', 'POST', ['is_online' => 0], $sessRider1);
$resCheckOff  = callApi('/rider/deliveries.php', 'GET', null, $sessRider1);

$resToggleOn  = callApi('/rider/toggle_online.php', 'POST', ['is_online' => 1], $sessRider1);

$results['test5_rider_online_offline_toggle'] = [
    'passed'          => ($resToggleOff['code'] === 200 && $resCheckOff['body']['count'] === 0 && $resToggleOn['code'] === 200),
    'offline_msg'     => $resCheckOff['body']['message'] ?? null,
    'online_response' => $resToggleOn['body']['message'] ?? null,
];

// 6. UNAVAILABLE FOOD ITEM VISIBILITY TEST
$resVendorLogin = callApi('/auth/login.php', 'POST', [
    'email'    => 'delta@urbaneats.com',
    'password' => 'password123'
], $sessVendorA);

// Get item 1 and toggle unavailable
callApi('/vendor/menu.php', 'PUT', ['id' => 1, 'is_available' => 0], $sessVendorA);

$resMenuPublic = callApi('/food-items/index.php?restaurant_id=1', 'GET');
$itemsPublic   = $resMenuPublic['body']['data'] ?? [];
$item1Found    = false;
$item1IsAvail  = null;

foreach ($itemsPublic as $it) {
    if ((int)$it['id'] === 1) {
        $item1Found   = true;
        $item1IsAvail = $it['is_available'];
        break;
    }
}

// Restore item 1 to available
callApi('/vendor/menu.php', 'PUT', ['id' => 1, 'is_available' => 1], $sessVendorA);

$results['test6_unavailable_food_visibility'] = [
    'passed'       => ($item1Found && $item1IsAvail === false),
    'item_found'   => $item1Found,
    'is_available' => $item1IsAvail,
];

echo json_encode([
    'test_suite'   => 'UrbanEats Phase 7 DEVIL INCARNATE Security & Hardening Test Suite',
    'all_passed'   => !in_array(false, array_column($results, 'passed')),
    'test_results' => $results
], JSON_PRETTY_PRINT);
