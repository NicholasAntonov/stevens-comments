<?php
require_once("databaseClassMySQLi.php");
$db = new database();

class Session {
    private $loggedIn = false;
    public $username;
    public $name;
    public $uid;
    private $admin;
    function __construct() {
        session_start();
        session_regenerate_id();
        if (isset($_SESSION['loggedIn']) && isset($_SESSION['username']) && isset($_SESSION['name']) && isset($_SESSION['uid'])) {
            $this->loggedIn = $_SESSION['loggedIn'];
            $this->uid = $_SESSION['uid'];
            $this->username = $_SESSION['username'];
            $this->name = $_SESSION['name'];
            $this->admin = $_SESSION['admin'];
        }
    }
    function checkLoggedIn() {
        return ($this->loggedIn === true);
    }

    function login($username, $password) {
        global $db;
        $username = $db->escape($username);
        $password = $db->escape($password);
        $query = "select u_id, name, admin, password from users where username='".$username."'";
        $db->send_sql($query);
        $row = $db->next_row();
        if ($row === false || empty($row)) {
            $this->logout();
            return false;
        }
        if (password_verify($password, $row['password']) === true) {
            session_regenerate_id(true);
            $_SESSION['username'] = $username;
            $_SESSION['name'] = $row['name'];
            $_SESSION['uid'] = $row['u_id'];
            $_SESSION['loggedIn'] = true;
            $_SESSION['admin'] = $row['admin'];
            $this->loggedIn = true;
            $this->username = $username;
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