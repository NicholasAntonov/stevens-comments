<?php
require_once("include/session.php");
header('Content-Type: application/json');

$results = array();
if ($session->checkLoggedIn() === true) {
    array_push($results, "true");
} else {
    array_push($results, "false");
}
echo json_encode($results);
?>
