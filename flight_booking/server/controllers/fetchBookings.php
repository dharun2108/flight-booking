<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Credentials: true');

include '../config/db.php';

// Get agent email from request
$data = json_decode(file_get_contents("php://input"), true);
$agentEmail = $data['email'];  // Get logged-in agent's email

if (empty($agentEmail)) {
    echo json_encode(["status" => "error", "message" => "Agent email is required."]);
    exit();
}

// Fetch only bookings associated with the logged-in agent
$sql = "SELECT * FROM bookings WHERE agent_email = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $agentEmail);
$stmt->execute();
$result = $stmt->get_result();

$bookings = [];

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $bookings[] = $row;
    }
    echo json_encode(["status" => "success", "data" => $bookings]);
} else {
    echo json_encode(["status" => "error", "message" => "No bookings found for this agent."]);
}

// Close DB Connection
$conn->close();
?>
