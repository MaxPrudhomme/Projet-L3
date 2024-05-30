<?php

// MySQL database connection information
$host = "localhost"; // MySQL server address
$user = "root"; // MySQL username
$password = ""; // MySQL password
$database = "projet_l3"; // MySQL database name

// Database connection
$conn = new mysqli($host, $user, $password, $database);

// Checking the connection
if ($conn->connect_error) {
    die("Database connection error : " . $conn->connect_error);
}

// Checking the query method
if ($_SERVER["REQUEST_METHOD"] == "POST") {

    // Recovery of data sent by the client
    $ID = $_POST['ID'];
    $startDate = $_POST['startDate'];
    $endDate = $_POST['endDate'];
    $summary = $_POST['summary'];
    $description = $_POST['description'];
    $location = $_POST['location'];
    $IDcourse = $_POST['IDcourse'];

    // Preparing sql query
    $sql = "UPDATE calendrier SET startDate = ?, endDate = ?, summary = ?, description = ?, location = ?, IDcourse = ? WHERE ID = ?;";
    $stmt = $conn->prepare($sql);

    // Check if query preparation was successful
    if ($stmt === false) {
        die("Failed to prepare statement: " . $conn->error);
    }

    // Bind settings
    $stmt->bind_param("iisssss", $startDate, $endDate, $summary, $description, $location, $IDcourse, $ID);

    // Checking query success
    if ($stmt->execute() === TRUE) {
        echo "Data modified successfully.";
    } else {
        echo "Error inserting data : " . $stmt->error;
    }
} else {
    echo "Invalid query method.";
}

// Closing statement
$stmt->close();

// Closing the database connection
$conn->close();

?>