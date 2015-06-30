<?php
require_once("include/session.php");
require_once("include/jsonDecode.php");
header('Content-Type: application/json');

$results = array();
if (isset($_POST['username']) && isset($_POST['password'])) {
    $username = $_POST['username'];
    $password = $_POST['password'];
    if ($session->login($username, $password) === true) {
        array_push($results, "success");
    } else {
        array_push($results, "fail");
    }
} else {
    array_push($results, "Username or password not provided");
}
echo json_encode($results);
?>
