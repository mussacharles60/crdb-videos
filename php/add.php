<?php

  header('Access-Control-Allow-Origin: *'); 
  header('Content-Type: application/json');

  $_POST = json_decode(file_get_contents('php://input'), true);

  $name = isset($_POST['name']) ? $_POST['name'] : "";
  $phone = isset($_POST['phone']) ? $_POST['phone'] : "";
  $email = isset($_POST['email']) ? $_POST['email'] : "";

  if ($name != "" && $email != "" && $phone != "") {
    $servername = "localhost";
    $username = "imccotz_crdb_user";
    $dbname = "imccotz_crdb";
    $user_password = "imperial2021";
    $CRLF = "\n\r";

    // Create connection.
    $conn = mysqli_connect($servername, $username, $user_password, $dbname);
    if (!$conn) {
      $error_messsage = '{"error":{"code":"503","message":"Service Unavailable"}}';
			echo json_format($error_messsage);
      die;
    }

    $con_result = mysqli_select_db($conn, $dbname);

    if (!$con_result) {
      die('{"error":{"code":"503","message":"Service Unavailable"}}');
    }

    $query = "INSERT INTO `video_views` (`name`, `phone_number`, `email`) VALUES ('$name', '$phone', '$email')";
   
    $result = mysqli_query($conn, $query);
    if (!$result) {
      die('{"error":{"code":402,"message":"invalid query"}}');
    }
    else {
      $query_1 = "SELECT `name` FROM `video_views` WHERE `email` = '$email'";
      $result_1 = mysqli_query($conn, $query_1);
      if (!$result) {
        echo '{"error":{"code":402,"message":"invalid query"}}';
      }
      else {
        $name = "";
        $last_name = "";
        $row = mysqli_fetch_assoc($result_1);
        $name = $row['name'];
        if ($name == "") {
          echo '{"error":{"code":404,"message":"Viewer Not Found"}}';
        }
        else {
          echo '{"success":{"code":200,"message":"Data added","name":"'.$name.'"}}';
        }
      }
    }
    mysqli_close($conn);
  }
  else {
    echo '{"error":{"code":"401","message":"Authentication Error"}}';
  }

?>