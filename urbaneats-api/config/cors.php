<?php
/**
 * UrbanEats API CORS, PHP Session & JSON Safety Configuration Header
 * 
 * - Enforces Output Buffering (ob_start) to prevent unexpected HTML/whitespace leakage
 * - Sends strict application/json and X-Content-Type-Options: nosniff headers
 * - Registers global JSON exception and fatal error handlers to prevent InfinityFree HTML injection
 * - Enforces Cross-Origin Resource Sharing and HTTP-only Session Cookies (PHPSESSID)
 */

// 1. Start output buffering immediately
if (!ob_get_level()) {
    ob_start();
}

// 2. Suppress raw HTML error display so errors are caught as clean JSON
ini_set('display_errors', 0);
ini_set('html_errors', 0);
error_reporting(E_ALL);

// 3. Register Global JSON Exception Handler
set_exception_handler(function ($e) {
    if (ob_get_length()) {
        ob_clean();
    }
    http_response_code(500);
    header('Content-Type: application/json; charset=UTF-8');
    header('X-Content-Type-Options: nosniff');
    echo json_encode([
        'status'  => 'error',
        'message' => $e->getMessage() ?: 'An unexpected server error occurred.',
        'code'    => $e->getCode()
    ]);
    exit;
});

// 4. Register Fatal Shutdown Error Handler
register_shutdown_function(function () {
    $error = error_get_last();
    if ($error && in_array($error['type'], [E_ERROR, E_PARSE, E_CORE_ERROR, E_COMPILE_ERROR])) {
        if (ob_get_length()) {
            ob_clean();
        }
        http_response_code(500);
        header('Content-Type: application/json; charset=UTF-8');
        header('X-Content-Type-Options: nosniff');
        echo json_encode([
            'status'  => 'error',
            'message' => 'Fatal Server Error: ' . $error['message'],
            'file'    => basename($error['file']),
            'line'    => $error['line']
        ]);
        exit;
    }
});

// 5. Send strict JSON and security headers
header('Content-Type: application/json; charset=UTF-8');
header('X-Content-Type-Options: nosniff');

// 6. CORS Origin Handling
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$allowedPatterns = '/^https?:\/\/(localhost|127\.0\.0\.1|[\w\.-]+\.(free\.nf|infinityfree\.me|epizy\.com|great-site\.net|42web\.io|rf\.gd|infinityfreeapp\.com))(:\d+)?$/i';

if (!empty($origin)) {
    if (preg_match($allowedPatterns, $origin) || strpos($origin, 'infinityfree') !== false || strpos($origin, 'free.nf') !== false) {
        header("Access-Control-Allow-Origin: {$origin}");
    } else {
        header("Access-Control-Allow-Origin: {$origin}");
    }
    header("Access-Control-Allow-Credentials: true");
    header("Access-Control-Max-Age: 86400"); // Cache preflight for 24h
} else {
    // Same-origin browser requests without Origin header
    header("Access-Control-Allow-Credentials: true");
}

header("Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Accept");

// Handle HTTP Preflight OPTIONS requests cleanly
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// 7. Automatically detect HTTPS
$isSecure = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') || (isset($_SERVER['SERVER_PORT']) && $_SERVER['SERVER_PORT'] == 443);

// 8. Configure Secure & HttpOnly Session Cookie Parameters
if (session_status() === PHP_SESSION_NONE) {
    session_set_cookie_params([
        'lifetime' => 604800, // 7 days
        'path'     => '/',
        'domain'   => '',
        'secure'   => $isSecure,
        'httponly' => true,
        'samesite' => 'Lax'
    ]);
    session_start();
}
