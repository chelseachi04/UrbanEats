<?php
/**
 * UrbanEats Addresses API — GET/POST /addresses/index.php
 *
 * GET  → Returns all saved delivery addresses for the currently authenticated customer.
 * POST → Creates a new saved delivery address for the currently authenticated customer.
 *
 * Method:  GET | POST
 * Auth:    Required — uses $_SESSION['user_id'] from PHP session.
 *          Unauthenticated requests are rejected with HTTP 401.
 *
 * SECURITY:
 *   - Never trusts a frontend-supplied user_id.
 *   - Uses $_SESSION['user_id'] exclusively to identify the caller.
 *   - Uses PDO prepared statements throughout.
 */

require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/db.php';

// --- Authentication Guard ---
if (empty($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['status' => 'error', 'message' => 'Authentication required.']);
    exit;
}

$userId = (int) $_SESSION['user_id'];
$method = $_SERVER['REQUEST_METHOD'];

try {
    $pdo = getDBConnection();

    // ── GET: Fetch all addresses for the authenticated user ──────────────────
    if ($method === 'GET') {
        $stmt = $pdo->prepare("
            SELECT
                id,
                user_id,
                label,
                recipient_name,
                phone,
                address,
                area,
                city,
                state,
                is_default,
                created_at,
                updated_at
            FROM user_addresses
            WHERE user_id = :user_id
            ORDER BY is_default DESC, created_at DESC
        ");
        $stmt->execute([':user_id' => $userId]);
        $rows = $stmt->fetchAll();

        foreach ($rows as &$row) {
            $row['id']         = (int) $row['id'];
            $row['user_id']    = (int) $row['user_id'];
            $row['is_default'] = (bool) $row['is_default'];
        }
        unset($row);

        http_response_code(200);
        echo json_encode([
            'status' => 'success',
            'count'  => count($rows),
            'data'   => $rows,
        ]);
        exit;
    }

    // ── POST: Create a new address for the authenticated user ────────────────
    if ($method === 'POST') {
        $body = json_decode(file_get_contents('php://input'), true);

        $label         = isset($body['label'])          ? trim((string)$body['label'])          : 'Home';
        $recipientName = isset($body['recipient_name']) ? trim((string)$body['recipient_name']) : '';
        $phone         = isset($body['phone'])          ? trim((string)$body['phone'])          : '';
        $address       = isset($body['address'])        ? trim((string)$body['address'])        : '';
        $area          = isset($body['area'])           ? trim((string)$body['area'])           : 'Abraka';
        $city          = isset($body['city'])           ? trim((string)$body['city'])           : 'Abraka';
        $state         = isset($body['state'])          ? trim((string)$body['state'])          : 'Delta State';
        $isDefault     = !empty($body['is_default']) ? 1 : 0;

        // Validation
        if (empty($recipientName) || empty($phone) || empty($address)) {
            http_response_code(400);
            echo json_encode([
                'status'  => 'error',
                'message' => 'Recipient name, phone number, and address are required.',
            ]);
            exit;
        }

        // Check if user has no existing addresses; if first address, set as default automatically
        $countStmt = $pdo->prepare("SELECT COUNT(*) FROM user_addresses WHERE user_id = :user_id");
        $countStmt->execute([':user_id' => $userId]);
        $existingCount = (int) $countStmt->fetchColumn();

        if ($existingCount === 0) {
            $isDefault = 1;
        }

        // If setting as default, clear default flag from other addresses of this user
        if ($isDefault === 1) {
            $clearStmt = $pdo->prepare("UPDATE user_addresses SET is_default = 0 WHERE user_id = :user_id");
            $clearStmt->execute([':user_id' => $userId]);
        }

        $insertStmt = $pdo->prepare("
            INSERT INTO user_addresses (
                user_id, label, recipient_name, phone, address, area, city, state, is_default
            ) VALUES (
                :user_id, :label, :recipient_name, :phone, :address, :area, :city, :state, :is_default
            )
        ");
        $insertStmt->execute([
            ':user_id'        => $userId,
            ':label'          => $label ?: 'Home',
            ':recipient_name' => $recipientName,
            ':phone'          => $phone,
            ':address'        => $address,
            ':area'           => $area ?: 'Abraka',
            ':city'           => $city ?: 'Abraka',
            ':state'          => $state ?: 'Delta State',
            ':is_default'     => $isDefault,
        ]);

        $newId = (int) $pdo->lastInsertId();

        // Fetch inserted record
        $fetchStmt = $pdo->prepare("SELECT * FROM user_addresses WHERE id = :id AND user_id = :user_id LIMIT 1");
        $fetchStmt->execute([':id' => $newId, ':user_id' => $userId]);
        $newAddress = $fetchStmt->fetch();
        if ($newAddress) {
            $newAddress['id']         = (int) $newAddress['id'];
            $newAddress['user_id']    = (int) $newAddress['user_id'];
            $newAddress['is_default'] = (bool) $newAddress['is_default'];
        }

        http_response_code(201);
        echo json_encode([
            'status'  => 'success',
            'message' => 'Delivery address created successfully.',
            'data'    => $newAddress,
        ]);
        exit;
    }

    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Method Not Allowed']);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Unable to process address request. Please try again.']);
}
