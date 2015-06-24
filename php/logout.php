<?php
require_once("include/session.php");
header('Content-Type: application/json');
$result = array();
$session->logout();
array_push($result, "success");
echo json_encode($result);
?>
