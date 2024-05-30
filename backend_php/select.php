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
    $startdate = $_POST['startdate'];
    $enddate = $_POST['enddate'];
    $IDs = $_POST['IDs'];
    
    // Preparing sql query
    $invalues = implode(',', array_fill(0, count($IDs), '?'));
    $sql = "SELECT * FROM calendrier WHERE startDate >= ? AND endDate < ? AND IDcourse IN ($invalues)";
    $stmt = $conn->prepare($sql);
    
    // Check if query preparation was successful
    if ($stmt === false) {
        die("Failed to prepare statement: " . $conn->error);
    }

    // Preparing the settings
    $types = str_repeat('s', count($IDs));
    $types = 'ii' . $types;
    $params = array_merge([$types, $startdate, $enddate], $IDs);
    
    // Bind settings
    $stmt->bind_param(...$params);

    // Run query
    $stmt->execute();

    // Link results dynamically
    $stmt->store_result();
    $variables = [];
    $data = [];
    $meta = $stmt->result_metadata();
    while ($field = $meta->fetch_field()) {
        $variables[] = &$data[$field->name];
    }
    call_user_func_array([$stmt, 'bind_result'], $variables);

    // Get the results in a table
    $rows = [];
    while ($stmt->fetch()) {
        $row = [];
        foreach ($data as $key => $val) {
            $row[$key] = $val;
        }
        $rows[] = $row;
    }
    echo json_encode($rows);
} else {
    echo "Invalid query method.";
}

// Closing statement
$stmt->close();

// Closing the database connection
$conn->close();

?>
