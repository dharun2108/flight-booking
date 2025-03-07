<?php

// Connect to MySQL Database
$servername = "localhost";
$username = "dharun";
$password = "Dharun!123"; // Use your MySQL password
$dbname = "flight_booking";

$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

?>
