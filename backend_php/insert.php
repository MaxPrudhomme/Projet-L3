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
    $IDs = $_POST['IDs'];
    $startDates = $_POST['startDates'];
    $endDates = $_POST['endDates'];
    $summarys = $_POST['summarys'];
    $descriptions = $_POST['descriptions'];
    $locations = $_POST['locations'];
    $IDscourse = $_POST['IDscourse'];
    
    // Preparing sql query
    $values = implode(',', array_fill(0, count($IDs), '(?,?,?,?,?,?,?)'));
    $sql = "INSERT INTO calendrier VALUES $values;";
    $stmt = $conn->prepare($sql);

    // Check if query preparation was successful
    if ($stmt === false) {
        die("Failed to prepare statement: " . $conn->error);
    }

    // Preparing the settings
    $types = str_repeat('siissss', count($IDs));
    $params = [];
    for ($i = 0; $i < count($IDs); $i++) {
        array_push($params, $IDs[$i]);
        array_push($params, $startDates[$i]);
        array_push($params, $endDates[$i]);
        array_push($params, $summarys[$i]);
        array_push($params, $descriptions[$i]);
        array_push($params, $locations[$i]);
        array_push($params, $IDscourse[$i]);
    }
    $params = array_merge([$types], $params);

    // Bind settings
    $stmt->bind_param(...$params);
    
    // Checking query success
    if ($stmt->execute() === TRUE) {
        echo "Data inserted successfully.";
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