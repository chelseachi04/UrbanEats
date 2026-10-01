<?php
/**
 * UrbanEats Backend Database Connection Configuration
 * Supports automatic environment switching (Local XAMPP vs InfinityFree Live)
 */

// Detect environment: local development (XAMPP/localhost) vs InfinityFree production
$host = $_SERVER['HTTP_HOST'] ?? $_SERVER['SERVER_NAME'] ?? '';
$isLocal = (
    strpos($host, 'localhost') !== false ||
    strpos($host, '127.0.0.1') !== false ||
    strpos($host, '192.168.') !== false ||
    strpos($host, '10.') !== false ||
    strpos($host, '::1') !== false ||
    (php_sapi_name() === 'cli' && empty(getenv('INFINITYFREE_ENV')))
);

if ($isLocal) {
    // Local Development Environment (XAMPP)
    defined('DB_HOST') or define('DB_HOST', '127.0.0.1');
    defined('DB_PORT') or define('DB_PORT', '3306');
    defined('DB_NAME') or define('DB_NAME', 'urbaneats_db');
    defined('DB_USER') or define('DB_USER', 'root');
    defined('DB_PASS') or define('DB_PASS', '');
} else {
    // InfinityFree Production Environment
    defined('DB_HOST') or define('DB_HOST', 'sql307.infinityfree.com');
    defined('DB_PORT') or define('DB_PORT', '3306');
    defined('DB_NAME') or define('DB_NAME', 'if0_43024188_urbaneats');
    defined('DB_USER') or define('DB_USER', 'if0_43024188');
    defined('DB_PASS') or define('DB_PASS', 'urbaneats123');
}

/**
 * Returns a PDO Database Connection Instance
 * @return PDO
 */
function getDBConnection() {
    static $pdo = null;

    if ($pdo === null) {
        $dsn = "mysql:host=" . DB_HOST . ";port=" . DB_PORT . ";dbname=" . DB_NAME . ";charset=utf8mb4";
        
        $options = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
            PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4"
        ];

        try {
            $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
        } catch (PDOException $e) {
            if (ob_get_length()) {
                ob_clean();
            }
            http_response_code(500);
            header('Content-Type: application/json; charset=UTF-8');
            header('X-Content-Type-Options: nosniff');
            echo json_encode([
                'status'  => 'error',
                'message' => 'Database connection failed: ' . $e->getMessage()
            ]);
            exit;
        }
    }

    return $pdo;
}
