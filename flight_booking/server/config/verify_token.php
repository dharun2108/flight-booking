<?php
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Credentials: true');

require '../vendor/autoload.php';
use \Firebase\JWT\JWT;
use \Firebase\JWT\Key;
$secret_key = 'dharun';
$headers = apache_request_headers();

if (isset($headers['Authorization'])) {
    $token = str_replace('Bearer ', '', $headers['Authorization']);

    try {
        $decoded = JWT::decode($token, new Key($secret_key, 'HS256'));
        echo json_encode(array(
            "status" => "success",
            "data" => $decoded
        ));
    } catch (Exception $e) {
        echo json_encode(array(
            "status" => "error",
            "message" => "Unauthorized"
        ));
    }
} else {
    echo json_encode(array(
        "status" => "error",
        "message" => "Token not provided"
    ));
}

?>
