<?php
require_once("include/session.php");
header('Content-Type: application/json');

if ($session->checkLoggedIn() === true) {
    echo '"true"';
} else {
    echo '"false"';
}
?>
