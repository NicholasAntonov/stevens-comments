<?php
require_once('include/databaseClassMySQLi.php');
$db = new database();
header('Content-Type: application/json');
$result = array();
if( isset($_GET['name']) &&
    isset($_GET['username']) &&
    isset($_GET['password']) &&
    isset($_GET['cpassword']) &&
    isset($_GET['email']) ) {
    $name = htmlentities($_GET['name']);
    $username = htmlentities($_GET['username']);
    $password = ($_GET['password']);
    $cpassword = ($_GET['cpassword']);
    $email = htmlentities($_GET['email']);
    if (!preg_match("/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/", $password))
        array_push($result, "Password must contain a lower case letter, upper case letter, and number");
    else if ($password != $cpassword)
        array_push($result, "Passwords don't match");
    else {
        $query = 'select name from users where name=\''.$name.'\'';
        $db->send_sql($query);
        $row = $db->next_row();
        if ($row === false || empty($row))
            array_push($result, "Username is already taken");
        if (count($reuslt) == 0) {
            $query = 'insert into users(username, name, password, email) values (\''.$username.'\', \''.$name.'\', \''.password_hash($password, PASSWORD_DEFAULT).'\', \''.$email.'\')';
            $db->send_sql($query);
            array_push($result, "Success");
        }
    }
} else {
    array_push($result, "Missing a field");
}

echo json_encode($result);

?>
