<?php
require_once("include/session.php");
header('Content-Type: application/json');

$results = array();

$results['uid'] = $session->uid;
$results['name'] = $session->name;
$results['email'] = $session->email;
$results['admin'] = $session->isAdmin();

echo json_encode($results);
?>
