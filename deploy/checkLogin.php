<?php
require_once("include/session.php");
header('Content-Type: application/json');

if ($session->checkLoggedIn() === true) {
    echo '"true"';
} else {
    http_response_code(401);
    echo '"false"';
}
?>
