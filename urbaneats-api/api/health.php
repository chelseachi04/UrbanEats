<?php
require_once __DIR__ . '/../config/cors.php';

echo json_encode([
    'status' => 'success',
    'message' => 'UrbanEats PHP API backend is active and ready.',
    'session_id' => session_id(),
    'timestamp' => date('Y-m-d H:i:s')
]);
