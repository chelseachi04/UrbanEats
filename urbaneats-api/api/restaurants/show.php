<?php
/**
 * UrbanEats API — GET /restaurants/show.php?id=1
 * Returns a single active & approved restaurant by its numeric database ID.
 *
 * Method:  GET
 * Params:  id (integer, required)
 * Returns: JSON object with restaurant data including logo_url and cover_url
 * Auth:    Public
 */

require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Method Not Allowed']);
    exit;
}

$id = $_GET['id'] ?? null;

if ($id === null || $id === '') {
    http_response_code(400);
    echo json_encode([
        'status'  => 'error',
        'message' => 'Missing required parameter: id'
    ]);
    exit;
}

$id = filter_var($id, FILTER_VALIDATE_INT, ['options' => ['min_range' => 1]]);
if ($id === false) {
    http_response_code(400);
    echo json_encode([
        'status'  => 'error',
        'message' => 'Invalid parameter: id must be a positive integer.'
    ]);
    exit;
}

try {
    $pdo = getDBConnection();

    // Fetch the restaurant by primary key (active & approved vendors only)
    $stmt = $pdo->prepare("
        SELECT
            r.id,
            r.owner_id,
            r.name,
            r.slug,
            r.description,
            r.category,
            r.location,
            r.phone,
            r.logo_image,
            r.cover_image,
            r.logo_url,
            r.cover_url,
            r.opening_hours,
            r.status,
            r.is_active,
            r.created_at,
            r.updated_at,
            u.vendor_code
        FROM restaurants r
        JOIN users u ON r.owner_id = u.id
        WHERE r.id = :id AND r.is_active = 1 AND u.application_status = 'APPROVED'
        LIMIT 1
    ");
    $stmt->execute([':id' => $id]);
    $restaurant = $stmt->fetch();

    if (!$restaurant) {
        http_response_code(404);
        echo json_encode([
            'status'  => 'error',
            'message' => 'Restaurant not found.'
        ]);
        exit;
    }

    $restaurant['id']        = (int) $restaurant['id'];
    $restaurant['owner_id']  = (int) $restaurant['owner_id'];
    $restaurant['is_active'] = (bool) $restaurant['is_active'];

    http_response_code(200);
    echo json_encode([
        'status' => 'success',
        'data'   => $restaurant
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'status'  => 'error',
        'message' => 'Unable to retrieve restaurant. Please try again later.'
    ]);
}
