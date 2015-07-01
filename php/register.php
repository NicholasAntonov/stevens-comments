<?php
require_once('include/databaseClassMySQLi.php');
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
    $query = 'select name from users where name=\'' . $name . '\'';
    $db->send_sql($query);
    $row = $db->next_row();
    if ($row === false || empty($row))
        array_push($result, "Username is already taken");
    if (count($reuslt) == 0) {
        $query = 'insert into users(name, password, email) values (\'' . $name . '\', \'' . password_hash($password, PASSWORD_DEFAULT) . '\', \'' . $email . '\')';
        $db->send_sql($query);
        array_push($result, "Success");
    }
} else {
    array_push($result, "Missing a field");
}

echo json_encode($result);

?>
