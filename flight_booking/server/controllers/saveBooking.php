<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

include '../config/db.php';

// Get JSON data from request
$data = json_decode(file_get_contents("php://input"), true);

$origin = $data['origin'];
$destination = $data['destination'];
$date = $data['date'];
$passengerCount = $data['passengerCount'];
$passengers = $data['passengers'];  // This is an array of passenger details
$agentEmail = $data['agentEmail'];   // Get the logged-in user's email

// Validate data
if (empty($origin) || empty($destination) || empty($date) || empty($passengerCount) || empty($passengers) || empty($agentEmail)) {
    echo json_encode(["status" => "error", "message" => "All fields are required."]);
    exit();
}

// Verify if the email exists in the users table
$userCheckSQL = "SELECT email FROM users WHERE email = ?";
$userStmt = $conn->prepare($userCheckSQL);
$userStmt->bind_param("s", $agentEmail);
$userStmt->execute();
$userResult = $userStmt->get_result();

if ($userResult->num_rows === 0) {
    echo json_encode(["status" => "error", "message" => "Unauthorized agent. Email not found."]);
    exit();
}

// Insert each passenger's details in separate rows
$success = true;
foreach ($passengers as $passenger) {
    $name = $passenger['name'];
    $age = $passenger['age'];
    $gender = $passenger['gender'];
    $seatPreference = $passenger['seatPreference'];

    $sql = "INSERT INTO bookings (origin, destination, date, passengerCount, passengerName, age, gender, seatPreference, agent_email) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("sssisssss", $origin, $destination, $date, $passengerCount, $name, $age, $gender, $seatPreference, $agentEmail);
    if (!$stmt) {
        die("SQL Error: " . $conn->error);
    }

    if (!$stmt->execute()) {
        $success = false;
        break;
    }
}

if ($success) {
    echo json_encode(["status" => "success", "message" => "Booking saved successfully!"]);
} else {
    echo json_encode(["status" => "error", "message" => "Failed to save booking."]);
}

$conn->close();
?>
