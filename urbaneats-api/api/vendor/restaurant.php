<?php
/**
 * UrbanEats Vendor API — GET, POST, PUT, PATCH /vendor/restaurant.php
 *
 * Retrieves and updates the authenticated vendor's restaurant profile.
 * Supports status toggling (OPEN/CLOSED) via PATCH or POST.
 *
 * Method:  GET | POST | PUT | PATCH
 * Auth:    Required — uses $_SESSION['user_id'] from PHP session.
 *
 * SECURITY:
 *   - Verifies vendor ownership (WHERE owner_id = $_SESSION['user_id']).
 *   - Never trusts frontend vendor_id or user_id.
 */

require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/db.php';

// --- Authentication & Vendor Guard ---
if (empty($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['status' => 'error', 'message' => 'Authentication required. Please log in as a vendor.']);
    exit;
}

$userId = (int) $_SESSION['user_id'];
$pdo    = getDBConnection();

// Fetch authenticated user to verify role
$userStmt = $pdo->prepare("SELECT role FROM users WHERE id = :id LIMIT 1");
$userStmt->execute([':id' => $userId]);
$userRec = $userStmt->fetch();

if (!$userRec || strtolower($userRec['role']) !== 'vendor') {
    http_response_code(403);
    echo json_encode(['status' => 'error', 'message' => 'Access denied. Vendor account required.']);
    exit;
}

// ── Helper: Fetch Vendor Restaurant Row ──────────────────────────────────────
function getVendorRestaurant($pdo, $userId) {
    $stmt = $pdo->prepare("SELECT * FROM restaurants WHERE owner_id = :owner_id LIMIT 1");
    $stmt->execute([':owner_id' => $userId]);
    $restaurant = $stmt->fetch();
    if ($restaurant) {
        $restaurant['id']        = (int) $restaurant['id'];
        $restaurant['owner_id']  = (int) $restaurant['owner_id'];
        $restaurant['is_active'] = (int) $restaurant['is_active'];
    }
    return $restaurant;
}

// ── GET: Return vendor's restaurant ─────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $restaurant = getVendorRestaurant($pdo, $userId);

    if (!$restaurant) {
        http_response_code(404);
        echo json_encode(['status' => 'error', 'message' => 'No restaurant linked to this vendor account.']);
        exit;
    }

    http_response_code(200);
    echo json_encode([
        'status' => 'success',
        'data'   => $restaurant,
    ]);
    exit;
}

// ── PATCH or Status-Only Update ─────────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'PATCH') {
    $rawInput = file_get_contents('php://input');
    $body     = json_decode($rawInput, true) ?? [];
    $status   = isset($body['status']) && in_array(strtolower($body['status']), ['open', 'closed', 'temporarily_closed'])
        ? strtolower($body['status']) : null;

    if ($status === null) {
        http_response_code(400);
        echo json_encode([
            'status'  => 'error',
            'message' => 'Invalid or missing status value. Must be "open" or "closed".',
            'received' => $body
        ]);
        exit;
    }

    try {
        $patchStmt = $pdo->prepare("UPDATE restaurants SET status = :status, updated_at = NOW() WHERE owner_id = :owner_id");
        $patchStmt->execute([':status' => $status, ':owner_id' => $userId]);

        $updated = getVendorRestaurant($pdo, $userId);

        http_response_code(200);
        echo json_encode([
            'status'  => 'success',
            'message' => "Store status updated to '{$status}'.",
            'data'    => $updated,
        ]);
        exit;
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Database error updating status: ' . $e->getMessage()]);
        exit;
    }
}

// ── POST/PUT: Update vendor's restaurant profile or status ───────────────────
if ($_SERVER['REQUEST_METHOD'] === 'POST' || $_SERVER['REQUEST_METHOD'] === 'PUT') {
    $rawInput = file_get_contents('php://input');
    $body     = json_decode($rawInput, true) ?? [];

    // Check if this is a status-only update payload
    $hasStatusOnly = isset($body['status']) && (!isset($body['name']) || trim((string)$body['name']) === '');
    if ($hasStatusOnly || (isset($body['action']) && $body['action'] === 'toggle_status')) {
        $status = isset($body['status']) && in_array(strtolower($body['status']), ['open', 'closed', 'temporarily_closed'])
            ? strtolower($body['status']) : 'open';

        try {
            $stmt = $pdo->prepare("UPDATE restaurants SET status = :status, updated_at = NOW() WHERE owner_id = :owner_id");
            $stmt->execute([':status' => $status, ':owner_id' => $userId]);

            $updated = getVendorRestaurant($pdo, $userId);

            http_response_code(200);
            echo json_encode([
                'status'  => 'success',
                'message' => "Store status updated to '{$status}'.",
                'data'    => $updated,
            ]);
            exit;
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()]);
            exit;
        }
    }

    // Full profile update
    $name         = isset($body['name'])          ? trim((string)$body['name']) : '';
    $description  = isset($body['description'])   ? trim((string)$body['description']) : '';
    $category     = isset($body['category'])      ? trim((string)$body['category']) : 'General';
    $location     = isset($body['location'])      ? trim((string)$body['location']) : 'Abraka, Delta State';
    $phone        = isset($body['phone'])         ? trim((string)$body['phone']) : '';
    $openingHours = isset($body['opening_hours']) ? trim((string)$body['opening_hours']) : '8:00 AM - 10:00 PM';
    $status       = isset($body['status']) && in_array(strtolower($body['status']), ['open', 'closed', 'temporarily_closed'])
        ? strtolower($body['status']) : 'open';

    if (empty($name) || strlen($name) < 2) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Please provide a valid restaurant name (at least 2 characters).']);
        exit;
    }

    try {
        $updateStmt = $pdo->prepare("
            UPDATE restaurants
            SET
                name          = :name,
                description   = :description,
                category      = :category,
                location      = :location,
                phone         = :phone,
                opening_hours = :opening_hours,
                status        = :status,
                updated_at    = NOW()
            WHERE owner_id = :owner_id
        ");

        $updateStmt->execute([
            ':name'          => $name,
            ':description'   => $description,
            ':category'      => $category,
            ':location'      => $location,
            ':phone'         => $phone,
            ':opening_hours' => $openingHours,
            ':status'        => $status,
            ':owner_id'      => $userId,
        ]);

        $updated = getVendorRestaurant($pdo, $userId);

        http_response_code(200);
        echo json_encode([
            'status'  => 'success',
            'message' => 'Restaurant details updated successfully.',
            'data'    => $updated,
        ]);
        exit;
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()]);
        exit;
    }
}

http_response_code(405);
echo json_encode(['status' => 'error', 'message' => 'Method Not Allowed']);
