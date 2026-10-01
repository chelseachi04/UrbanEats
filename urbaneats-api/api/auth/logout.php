<?php
/**
 * UrbanEats Logout Endpoint
 * POST /api/auth/logout.php
 */

require_once __DIR__ . '/../../config/cors.php';

$_SESSION = array();

if (ini_get("session.use_cookies")) {
    $params = session_get_cookie_params();
    setcookie(
        session_name(),
        '',
        time() - 42000,
        $params["path"],
        $params["domain"],
        $params["secure"],
        $params["httponly"]
    );
}

session_destroy();

http_response_code(200);
echo json_encode([
    'status'  => 'success',
    'message' => 'Logged out successfully.'
]);
