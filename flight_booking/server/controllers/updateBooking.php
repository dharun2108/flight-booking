<?php
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Credentials: true');

require '../config/db.php';
$data = json_decode(file_get_contents("php://input"), true);

$id = $data['id'];
$origin = $data['origin'];
$destination = $data['destination'];
$date = $data['date'];
$passengerName = $data['passengerName'];
$age = $data['age'];
$gender = $data['gender'];
$seatPreference = $data['seatPreference'];

$query = "UPDATE bookings SET origin=?, destination=?, date=?, passengerName=?, age=?, gender=?, seatPreference=? WHERE id=?";
$stmt = $conn->prepare($query);
$stmt->bind_param("ssssissi", $origin, $destination, $date, $passengerName, $age, $gender, $seatPreference, $id);

if ($stmt->execute()) {
    echo json_encode(["status" => "success"]);
} else {
    echo json_encode(["status" => "error", "message" => "Failed to update booking"]);
}
?>
