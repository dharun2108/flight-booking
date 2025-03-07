<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Allow requests from Vite's default port (5173)
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Credentials: true');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

include '../config/db.php';
require '../vendor/autoload.php';
use \Firebase\JWT\JWT;

$secret_key = 'dharun';

// Get JSON data from request
$data = json_decode(file_get_contents("php://input"), true);
$email = $data['email'];
$password = $data['password'];

// Validate data
if (empty($email) || empty($password)) {
    echo json_encode(["status" => "error", "message" => "All fields are required."]);
    exit();
}

// Check if user exists with the provided email
$sql = "SELECT * FROM users WHERE email = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $user = $result->fetch_assoc();
    // Verify password
    if (password_verify($password, $user['password'])) {
        // echo json_encode(["status" => "success", "email" => $user['email']]);
        // Password is correct, generate JWT token
        $issuedAt = time();
        $expirationTime = $issuedAt + 3600;  // Token valid for 1 hour
        $payload = array(
            "iss" => "FlightBookingSite",
            "iat" => $issuedAt,
            "exp" => $expirationTime,
            "user_id" => $user['id'],
            "email" => $user['email'],
            
        );

        
        // Create JWT
        $jwt = JWT::encode($payload, $secret_key, 'HS256');

        // Send the token as JSON response
        echo json_encode([
            "status" => "success",
            "email" => $user['email'],
            "message" => "Login successful.",
            "token" => $jwt
        ]);
    } else {
        echo json_encode(["status" => "error", "message" => "Invalid password."]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "User not found."]);
}

$conn->close();
?>
