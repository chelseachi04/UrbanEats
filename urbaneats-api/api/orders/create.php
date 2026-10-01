<?php
/**
 * UrbanEats Orders API — POST /orders/create.php
 *
 * Creates a new pending order for the currently authenticated customer.
 *
 * Method:  POST
 * Auth:    Required — uses $_SESSION['user_id'] from PHP session.
 * Body:    {
 *            "delivery_address_id": <int>,
 *            "items": [ { "id": <int>, "quantity": <int> } ]
 *          }
 *
 * SECURITY:
 *   - Never trusts frontend prices or user_id.
 *   - Fetches actual current prices from MySQL `food_items`.
 *   - Recalculates item subtotals, order subtotal, delivery fee, and grand total server-side.
 *   - Verifies delivery address belongs to the session user.
 *   - Uses PDO transactions.
 */

require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Method Not Allowed']);
    exit;
}

// --- Authentication Guard ---
if (empty($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['status' => 'error', 'message' => 'Authentication required.']);
    exit;
}

$userId = (int) $_SESSION['user_id'];
$body   = json_decode(file_get_contents('php://input'), true);

$addressId = isset($body['delivery_address_id'])
    ? filter_var($body['delivery_address_id'], FILTER_VALIDATE_INT, ['options' => ['min_range' => 1]])
    : false;

$itemsInput = isset($body['items']) && is_array($body['items']) ? $body['items'] : [];

if ($addressId === false || empty($itemsInput)) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Delivery address and non-empty item list are required.']);
    exit;
}

try {
    $pdo = getDBConnection();

    // 1. Verify delivery address belongs to this authenticated user
    $addrStmt = $pdo->prepare("
        SELECT id, recipient_name, phone, address, area, city, state
        FROM user_addresses
        WHERE id = :id AND user_id = :user_id
        LIMIT 1
    ");
    $addrStmt->execute([':id' => $addressId, ':user_id' => $userId]);
    $addressRecord = $addrStmt->fetch();

    if (!$addressRecord) {
        http_response_code(404);
        echo json_encode(['status' => 'error', 'message' => 'Selected delivery address not found or access denied.']);
        exit;
    }

    // 2. Parse & sanitize item IDs and quantities
    $qtyMap = [];
    foreach ($itemsInput as $rawItem) {
        $itemId = isset($rawItem['id']) ? (int) $rawItem['id'] : 0;
        $qty    = isset($rawItem['quantity']) ? (int) $rawItem['quantity'] : 0;
        if ($itemId > 0 && $qty > 0) {
            $qtyMap[$itemId] = ($qtyMap[$itemId] ?? 0) + $qty;
        }
    }

    if (empty($qtyMap)) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'No valid food items provided.']);
        exit;
    }

    // 3. Fetch authoritative food item records from MySQL
    $itemIds = array_keys($qtyMap);
    $inClause = implode(',', array_fill(0, count($itemIds), '?'));

    $sql = "
        SELECT
            fi.id,
            fi.name,
            fi.slug,
            fi.price,
            fi.is_available,
            fi.restaurant_id,
            r.name AS restaurant_name,
            fc.name AS category_name
        FROM food_items fi
        INNER JOIN restaurants r ON fi.restaurant_id = r.id
        LEFT JOIN food_categories fc ON fi.category_id = fc.id
        WHERE fi.id IN ($inClause)
    ";

    $foodStmt = $pdo->prepare($sql);
    $foodStmt->execute($itemIds);
    $foodRecords = $foodStmt->fetchAll();

    if (count($foodRecords) !== count($itemIds)) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'One or more selected food items are unavailable.']);
        exit;
    }

    // Verify all items belong to the SAME restaurant
    $restaurantId   = (int) $foodRecords[0]['restaurant_id'];
    $restaurantName = $foodRecords[0]['restaurant_name'];

    foreach ($foodRecords as $fr) {
        if ((int)$fr['restaurant_id'] !== $restaurantId) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'Cart contains items from multiple restaurants. All items must be from the same restaurant.']);
            exit;
        }
    }

    // 4. Calculate subtotal & delivery fee server-side
    $subtotal = 0.0;
    $preparedItems = [];

    foreach ($foodRecords as $fr) {
        $fid = (int) $fr['id'];
        $qty = $qtyMap[$fid];
        $unitPrice = (float) $fr['price'];
        $itemSubtotal = $unitPrice * $qty;
        $subtotal += $itemSubtotal;

        $preparedItems[] = [
            'food_item_id'  => $fid,
            'food_name'     => $fr['name'],
            'food_slug'     => $fr['slug'],
            'category_name' => $fr['category_name'],
            'quantity'      => $qty,
            'unit_price'    => $unitPrice,
            'subtotal'      => $itemSubtotal,
        ];
    }

    $deliveryFee = 500.00; // Flat local Abraka delivery fee
    $totalAmount = $subtotal + $deliveryFee;

    // 5. Generate unique Order Number (Format: UE-YYYYMMDD-XXXX)
    $datePart = date('Ymd');
    $orderNumber = '';
    do {
        $randPart = str_pad(rand(100, 9999), 4, '0', STR_PAD_LEFT);
        $candidate = "UE-{$datePart}-{$randPart}";

        $chk = $pdo->prepare("SELECT id FROM orders WHERE order_number = :num LIMIT 1");
        $chk->execute([':num' => $candidate]);
        if (!$chk->fetch()) {
            $orderNumber = $candidate;
        }
    } while (empty($orderNumber));

    // 6. Begin PDO Transaction
    $pdo->beginTransaction();

    $insertOrder = $pdo->prepare("
        INSERT INTO orders (
            order_number, user_id, restaurant_id, restaurant_name,
            delivery_address_id, recipient_name, recipient_phone,
            delivery_address, delivery_area, delivery_city, delivery_state,
            subtotal, delivery_fee, total_amount,
            order_status, payment_status, payment_method
        ) VALUES (
            :order_number, :user_id, :restaurant_id, :restaurant_name,
            :delivery_address_id, :recipient_name, :recipient_phone,
            :delivery_address, :delivery_area, :delivery_city, :delivery_state,
            :subtotal, :delivery_fee, :total_amount,
            'PENDING_PAYMENT', 'PENDING', 'FLUTTERWAVE'
        )
    ");

    $insertOrder->execute([
        ':order_number'        => $orderNumber,
        ':user_id'             => $userId,
        ':restaurant_id'       => $restaurantId,
        ':restaurant_name'     => $restaurantName,
        ':delivery_address_id' => $addressRecord['id'],
        ':recipient_name'      => $addressRecord['recipient_name'],
        ':recipient_phone'     => $addressRecord['phone'],
        ':delivery_address'    => $addressRecord['address'],
        ':delivery_area'       => $addressRecord['area'],
        ':delivery_city'       => $addressRecord['city'],
        ':delivery_state'      => $addressRecord['state'],
        ':subtotal'            => $subtotal,
        ':delivery_fee'        => $deliveryFee,
        ':total_amount'        => $totalAmount,
    ]);

    $orderId = (int) $pdo->lastInsertId();

    // 7. Insert Order Items (Immutable Snapshots)
    $insertItem = $pdo->prepare("
        INSERT INTO order_items (
            order_id, food_item_id, food_name, food_slug, category_name, quantity, unit_price, subtotal
        ) VALUES (
            :order_id, :food_item_id, :food_name, :food_slug, :category_name, :quantity, :unit_price, :subtotal
        )
    ");

    foreach ($preparedItems as $pi) {
        $insertItem->execute([
            ':order_id'     => $orderId,
            ':food_item_id' => $pi['food_item_id'],
            ':food_name'    => $pi['food_name'],
            ':food_slug'    => $pi['food_slug'],
            ':category_name'=> $pi['category_name'],
            ':quantity'     => $pi['quantity'],
            ':unit_price'   => $pi['unit_price'],
            ':subtotal'     => $pi['subtotal'],
        ]);
    }

    // 8. Create Transaction Reference
    $txRef = "UE-TX-" . $orderId . "-" . time();

    $insertPayment = $pdo->prepare("
        INSERT INTO payments (order_id, user_id, tx_ref, amount, currency, status)
        VALUES (:order_id, :user_id, :tx_ref, :amount, 'NGN', 'PENDING')
    ");
    $insertPayment->execute([
        ':order_id' => $orderId,
        ':user_id'  => $userId,
        ':tx_ref'   => $txRef,
        ':amount'   => $totalAmount,
    ]);

    $pdo->commit();

    http_response_code(201);
    echo json_encode([
        'status'  => 'success',
        'message' => 'Order created successfully. Ready for payment.',
        'data'    => [
            'order_id'        => $orderId,
            'order_number'    => $orderNumber,
            'tx_ref'          => $txRef,
            'restaurant_name' => $restaurantName,
            'recipient_name'  => $addressRecord['recipient_name'],
            'recipient_phone' => $addressRecord['phone'],
            'subtotal'        => $subtotal,
            'delivery_fee'    => $deliveryFee,
            'total_amount'    => $totalAmount,
            'item_count'      => count($preparedItems),
        ],
    ]);

} catch (PDOException $e) {
    if ($pdo && $pdo->inTransaction()) {
        $pdo->rollBack();
    }
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Unable to create order. Please try again.']);
}
