<?php
require_once("databaseClassMySQLi.php");
$db = new database();

class Session {
    private $loggedIn = false;
    public $email;
    public $name;
    public $uid;
    private $admin;
    function __construct() {
        session_start();
        session_regenerate_id();
        if (isset($_SESSION['loggedIn']) && isset($_SESSION['email']) && isset($_SESSION['name']) && isset($_SESSION['uid'])) {
            $this->loggedIn = $_SESSION['loggedIn'];
            $this->uid = $_SESSION['uid'];
            $this->email = $_SESSION['email'];
            $this->name = $_SESSION['name'];
            $this->admin = $_SESSION['admin'];
        }
    }
    function checkLoggedIn() {
        return ($this->loggedIn === true);
    }

    function login($email, $password) {
        global $db;
        $email = $db->escape($email);
        $password = $db->escape($password);
        $query = "select u_id, name, admin, password from users where email='".$email."'";
        $db->send_sql($query);
        $row = $db->next_row();
        if ($row === false || empty($row)) {
            $this->logout();
            return false;
        }
        if (password_verify($password, $row['password']) === true) {
            session_regenerate_id(true);
            $_SESSION['email'] = $email;
            $_SESSION['name'] = $row['name'];
            $_SESSION['uid'] = $row['u_id'];
            $_SESSION['loggedIn'] = true;
            $_SESSION['admin'] = $row['admin'];
            $this->loggedIn = true;
            $this->email = $email;
            $this->name = $row['name'];
            return true;
        } else {
            $this->logout();
            return false;
        }
    }
    function logout() {
        $this->loggedIn = false;
        session_destroy();
        foreach($_SESSION as $key=>$value) {
            unset($_SESSION[$key]);
        }
    }
    function isAdmin() {
        return ($this->checkLoggedIn() && $this->admin);
    }
};

$session = new Session();
//$session->login('brian', 'test');
//$session->logout();
?>