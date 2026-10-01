<?php
/**
 * UrbanEats Admin API — GET /admin/finance.php
 * Returns platform financial metrics: platform commission overview, vendor payouts, and earnings.
 *
 * Method: GET
 */

require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Method Not Allowed']);
    exit;
}

if (empty($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['status' => 'error', 'message' => 'Authentication required.']);
    exit;
}

$pdo = getDBConnection();
$callerStmt = $pdo->prepare("SELECT role FROM users WHERE id = :id LIMIT 1");
$callerStmt->execute([':id' => (int)$_SESSION['user_id']]);
$callerRow = $callerStmt->fetch();

if (!$callerRow || $callerRow['role'] !== 'admin') {
    http_response_code(403);
    echo json_encode(['status' => 'error', 'message' => 'Admin access required.']);
    exit;
}

$COMMISSION_RATE = 0.10; // 10% platform commission rate

// Overall Financial Totals
$totals = $pdo->query("
    SELECT
        COALESCE(SUM(total_amount), 0) AS total_gmv,
        COALESCE(SUM(subtotal), 0)     AS total_subtotal,
        COALESCE(SUM(delivery_fee), 0) AS total_delivery_fees,
        COUNT(*) AS total_transactions
    FROM orders
    WHERE payment_status = 'PAID'
")->fetch();

$grossGMV         = (float)$totals['total_gmv'];
$grossSubtotal    = (float)$totals['total_subtotal'];
$totalDeliveryFees = (float)$totals['total_delivery_fees'];
$commissionEarned = round($grossSubtotal * $COMMISSION_RATE, 2);
$netVendorPayouts = round($grossSubtotal - $commissionEarned, 2);

// Vendor Payouts Breakdown
$vendorPayouts = $pdo->query("
    SELECT
        r.id AS restaurant_id, r.name AS restaurant_name, u.full_name AS vendor_name, u.vendor_code,
        COUNT(o.id) AS paid_orders_count,
        COALESCE(SUM(o.subtotal), 0) AS vendor_subtotal,
        COALESCE(SUM(o.total_amount), 0) AS vendor_gross_sales
    FROM restaurants r
    JOIN users u ON r.owner_id = u.id
    LEFT JOIN orders o ON o.restaurant_id = r.id AND o.payment_status = 'PAID'
    GROUP BY r.id
    ORDER BY vendor_gross_sales DESC
")->fetchAll();

foreach ($vendorPayouts as &$vp) {
    $vp['restaurant_id']      = (int)$vp['restaurant_id'];
    $vp['paid_orders_count'] = (int)$vp['paid_orders_count'];
    $vp['vendor_subtotal']   = (float)$vp['vendor_subtotal'];
    $vp['vendor_gross_sales']= (float)$vp['vendor_gross_sales'];
    $vp['commission_fee']    = round($vp['vendor_subtotal'] * $COMMISSION_RATE, 2);
    $vp['net_payout']        = round($vp['vendor_subtotal'] - $vp['commission_fee'], 2);
}

echo json_encode([
    'status' => 'success',
    'data'   => [
        'overview' => [
            'gross_gmv'          => $grossGMV,
            'gross_subtotal'     => $grossSubtotal,
            'total_delivery_fees'=> $totalDeliveryFees,
            'commission_rate'    => '10%',
            'commission_earned'  => $commissionEarned,
            'net_vendor_payouts' => $netVendorPayouts,
            'paid_order_count'   => (int)$totals['total_transactions']
        ],
        'vendor_payouts' => $vendorPayouts
    ]
]);
