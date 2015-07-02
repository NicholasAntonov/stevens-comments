<?php
require_once('include/databaseClassMySQLi.php');
require_once("include/session.php");

$db = new database();
header('Content-Type: application/json');
$result = array();
if (isset($_POST['name']) &&
    isset($_POST['password']) &&
    isset($_POST['email'])
) {
    $name = $db->escape($_POST['name']);
    $password = $db->escape($_POST['password']);
    $email = $db->escape($_POST['email']);
    $query = 'select email from users where email=\'' . $email . '\'';
    $db->send_sql($query);
    $row = $db->next_row();
    if (!($row === false || empty($row)))
        array_push($result, "Email is already taken");
    else if (count($result) == 0) {
        $query = 'insert into users(name, password, email) values (\'' . $name . '\', \'' . password_hash($password, PASSWORD_DEFAULT) . '\', \'' . $email . '\')';
        $db->send_sql($query);
        array_push($result, "Success");
        $session->login($email, $password);
    }
} else {
    array_push($result, "Missing a field");
}

echo json_encode($result);

?>
