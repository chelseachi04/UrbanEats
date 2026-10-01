<?php
/**
 * UrbanEats API — GET /restaurants/index.php
 * Returns active & approved restaurants from the MySQL restaurants table.
 *
 * Method:  GET
 * Returns: JSON array of restaurant objects with logo_url and cover_url included.
 * Auth:    Public
 */

require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Method Not Allowed']);
    exit;
}

try {
    $pdo = getDBConnection();

    // Fetch all active & approved restaurants
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
        WHERE r.is_active = 1
          AND u.application_status = 'APPROVED'
        ORDER BY r.id ASC
    ");
    $stmt->execute();
    $restaurants = $stmt->fetchAll();

    foreach ($restaurants as &$r) {
        $r['id']        = (int) $r['id'];
        $r['owner_id']  = (int) $r['owner_id'];
        $r['is_active'] = (bool) $r['is_active'];
    }
    unset($r);

    http_response_code(200);
    echo json_encode([
        'status' => 'success',
        'count'  => count($restaurants),
        'data'   => $restaurants
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'status'  => 'error',
        'message' => 'Unable to retrieve restaurants. Please try again later.'
    ]);
}
