<?php
/**
 * UrbanEats Addresses API — POST/PUT /addresses/update.php
 *
 * Updates an existing delivery address for the currently authenticated customer.
 *
 * Method:  PUT | POST
 * Auth:    Required — uses $_SESSION['user_id'] from PHP session.
 * Body:    { "id": <int>, "label": <string>, "recipient_name": <string>, "phone": <string>, "address": <string>, ... }
 *
 * SECURITY:
 *   - Ensures address belongs to the authenticated user (WHERE id = :id AND user_id = :user_id).
 *   - Prevents cross-user modification.
 *   - Uses PDO prepared statements.
 */

require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'PUT' && $_SERVER['REQUEST_METHOD'] !== 'POST') {
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
$body = json_decode(file_get_contents('php://input'), true);

$addressId     = isset($body['id']) ? filter_var($body['id'], FILTER_VALIDATE_INT, ['options' => ['min_range' => 1]]) : false;
$label         = isset($body['label'])          ? trim((string)$body['label'])          : 'Home';
$recipientName = isset($body['recipient_name']) ? trim((string)$body['recipient_name']) : '';
$phone         = isset($body['phone'])          ? trim((string)$body['phone'])          : '';
$address       = isset($body['address'])        ? trim((string)$body['address'])        : '';
$area          = isset($body['area'])           ? trim((string)$body['area'])           : 'Abraka';
$city          = isset($body['city'])           ? trim((string)$body['city'])           : 'Abraka';
$state         = isset($body['state'])          ? trim((string)$body['state'])          : 'Delta State';
$isDefault     = !empty($body['is_default']) ? 1 : 0;

if ($addressId === false) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Valid address ID is required.']);
    exit;
}

if (empty($recipientName) || empty($phone) || empty($address)) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Recipient name, phone number, and address are required.']);
    exit;
}

try {
    $pdo = getDBConnection();

    // Verify address exists and belongs to the authenticated user
    $checkStmt = $pdo->prepare("SELECT id FROM user_addresses WHERE id = :id AND user_id = :user_id LIMIT 1");
    $checkStmt->execute([':id' => $addressId, ':user_id' => $userId]);
    if (!$checkStmt->fetch()) {
        http_response_code(404);
        echo json_encode(['status' => 'error', 'message' => 'Address not found or access denied.']);
        exit;
    }

    // If setting as default, clear default flag from other addresses of this user
    if ($isDefault === 1) {
        $clearStmt = $pdo->prepare("UPDATE user_addresses SET is_default = 0 WHERE user_id = :user_id");
        $clearStmt->execute([':user_id' => $userId]);
    }

    $updateStmt = $pdo->prepare("
        UPDATE user_addresses
        SET
            label          = :label,
            recipient_name = :recipient_name,
            phone          = :phone,
            address        = :address,
            area           = :area,
            city           = :city,
            state          = :state,
            is_default     = :is_default
        WHERE id = :id AND user_id = :user_id
    ");

    $updateStmt->execute([
        ':label'          => $label ?: 'Home',
        ':recipient_name' => $recipientName,
        ':phone'          => $phone,
        ':address'        => $address,
        ':area'           => $area ?: 'Abraka',
        ':city'           => $city ?: 'Abraka',
        ':state'          => $state ?: 'Delta State',
        ':is_default'     => $isDefault,
        ':id'             => $addressId,
        ':user_id'        => $userId,
    ]);

    // Fetch updated record
    $fetchStmt = $pdo->prepare("SELECT * FROM user_addresses WHERE id = :id AND user_id = :user_id LIMIT 1");
    $fetchStmt->execute([':id' => $addressId, ':user_id' => $userId]);
    $updatedAddress = $fetchStmt->fetch();
    if ($updatedAddress) {
        $updatedAddress['id']         = (int) $updatedAddress['id'];
        $updatedAddress['user_id']    = (int) $updatedAddress['user_id'];
        $updatedAddress['is_default'] = (bool) $updatedAddress['is_default'];
    }

    http_response_code(200);
    echo json_encode([
        'status'  => 'success',
        'message' => 'Address updated successfully.',
        'data'    => $updatedAddress,
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Unable to update address. Please try again.']);
}
