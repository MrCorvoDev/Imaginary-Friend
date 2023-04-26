<?php
$user_id = $_COOKIE['userID'];
var_dump($user_id);
if (empty($user_id)) {
   echo "Error: User ID is empty";
   exit;
}

$api = $_POST["form-api"]["api"];

$servername = $PROCESS_ENV["FTP_HOST"];
$username = $PROCESS_ENV["FTP_USER"];
$password = $PROCESS_ENV["FTP_PASSWORD"];
$dbname = $PROCESS_ENV["FTP_DB_NAME"];

$conn = mysqli_connect($servername, $username, $password, $dbname);

if (!$conn) {
   die("Connection failed: " . mysqli_connect_error());
}

$sql = "INSERT INTO user_api_keys (id, api_key) VALUES ('$user_id', '$api')";

if (mysqli_query($conn, $sql)) {
   echo "New record created successfully";
} else {
   echo "Error: " . $sql . "<br>" . mysqli_error($conn);
}

mysqli_close($conn);
