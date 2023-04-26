<?php
$history_data = file_get_contents("php://input");

$user_id = $_COOKIE['userID'];

$servername = $PROCESS_ENV["FTP_HOST"];
$username = $PROCESS_ENV["FTP_USER"];
$password = $PROCESS_ENV["FTP_PASSWORD"];
$dbname = $PROCESS_ENV["FTP_DB_NAME"];

$conn = mysqli_connect($servername, $username, $password, $dbname);

if (!$conn) {
   die("Connection failed: " . mysqli_connect_error());
}

$sql = "SELECT api_key FROM user_api_keys WHERE id = '$user_id'";
$result = mysqli_query($conn, $sql);

if (mysqli_num_rows($result) > 0) {
   $row = mysqli_fetch_assoc($result);
   $api_key = $row["api_key"];

   $request_body = array(
      "model" => "text-davinci-003",
      "prompt" => $history_data . "\nYou:",
      "max_tokens" => 150,
      "temperature" => $temperature
   );

   $ch = curl_init("https://api.openai.com/v1/completions");
   curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
   curl_setopt($ch, CURLOPT_POST, true);
   curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($request_body));
   curl_setopt($ch, CURLOPT_HTTPHEADER, array(
      "Content-Type: application/json",
      "Authorization: Bearer " . $api_key
   ));
   $response = curl_exec($ch);
   curl_close($ch);

   echo $response;
} else {
   echo "Error: User API key not found";
}

mysqli_close($conn);
