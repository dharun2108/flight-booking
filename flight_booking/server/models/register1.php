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

// Include database connection and JWT Library
include '../config/db.php';
require '../vendor/autoload.php';
use \Firebase\JWT\JWT;

// Secret Key for JWT
$secret_key = 'dharun';

// Get JSON data from request
$data = json_decode(file_get_contents("php://input"), true);
$name = $data['name'];
$email = $data['email'];
$password = $data['password'];

// Validate data
if (empty($name) || empty($email) || empty($password)) {
    echo json_encode(["status" => "error", "message" => "All fields are required."]);
    exit();
}

// Check if email already exists
$sql = "SELECT * FROM users WHERE email = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    echo json_encode(["status" => "error", "message" => "Email already registered."]);
} else {
    // Hash the password securely
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    // Insert user into database
    $sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("sss", $name, $email, $hashedPassword);

    if ($stmt->execute()) {
        // Generate JWT Token after successful registration
        $issuedAt = time();
        $expirationTime = $issuedAt + 3600;  // Token valid for 1 hour
        $payload = array(
            "iss" => "FlightBookingSite",
            "iat" => $issuedAt,
            "exp" => $expirationTime,
            "user_id" => $conn->insert_id, // Get the last inserted user ID
            "email" => $email
            
        );

        // Create JWT
        $jwt = JWT::encode($payload, $secret_key, 'HS256');

        // Send the token as JSON response
        echo json_encode([
            "status" => "success",
            "message" => "Registration successful.",
            "token" => $jwt,
            "name"=>$name,//send name back to front end
            "email"=>$email 
        ]);
    } else {
        echo json_encode(["status" => "error", "message" => "Registration failed."]);
    }
}

$conn->close();
?>
