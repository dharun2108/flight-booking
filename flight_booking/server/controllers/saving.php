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
$passengers = $data['passengers']; // Array of passenger details
$agentEmail = $data['agentEmail']; // Agent's email

// Validate data
if (empty($origin) || empty($destination) || empty($date) || empty($passengerCount) || empty($passengers) || empty($agentEmail)) {
    echo json_encode(["status" => "error", "message" => "All fields are required."]);
    exit();
}

// Convert passengers array to JSON
$passengerJSON = json_encode($passengers);

// Check if a booking for the same origin, destination, date, and agent_email exists
$sql = "SELECT * FROM gbookings WHERE origin = ? AND destination = ? AND date = ? AND agent_email = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ssss", $origin, $destination, $date, $agentEmail);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    // Booking already exists, update the existing passenger list
    $row = $result->fetch_assoc();
    $existingPassengers = json_decode($row['passengerDetails'], true);
    
    // Merge new passengers with existing ones
    $mergedPassengers = array_merge($existingPassengers, $passengers);
    $mergedPassengerJSON = json_encode($mergedPassengers);
    
    // Update the existing record
    $updateSQL = "UPDATE gbookings SET passengerDetails = ?, passengerCount = passengerCount + ? WHERE id = ?";
    $updateStmt = $conn->prepare($updateSQL);
    $updateStmt->bind_param("sii", $mergedPassengerJSON, $passengerCount, $row['id']);

    if ($updateStmt->execute()) {
        echo json_encode(["status" => "success", "message" => "Booking updated successfully!"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Failed to update booking."]);
    }
} else {
    // No existing booking, insert a new one
    $insertSQL = "INSERT INTO gbookings (origin, destination, date, passengerCount, passengerDetails, agent_email) 
                  VALUES (?, ?, ?, ?, ?, ?)";
    $insertStmt = $conn->prepare($insertSQL);
    $insertStmt->bind_param("sssiss", $origin, $destination, $date, $passengerCount, $passengerJSON, $agentEmail);

    if ($insertStmt->execute()) {
        echo json_encode(["status" => "success", "message" => "New booking saved successfully!"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Failed to save booking."]);
    }
}

$conn->close();
?>
