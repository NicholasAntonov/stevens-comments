<?php
require_once("include/session.php");
require_once("include/jsonDecode.php");
header('Content-Type: application/json');

$results = array();
if (isset($_POST['email']) && isset($_POST['password'])) {
    $email = $_POST['email'];
    $password = $_POST['password'];
    if ($session->login($email, $password) === true) {
        array_push($results, "success");
    } else {
        array_push($results, "fail");
    }
} else {
    array_push($results, "Email or password not provided");
}
echo json_encode($results);
?>
