<?php

//POST
//message.php?to=uid&message=content&showName=1
//message.php?to=uid&message=content

//POST
//delete
//message.php?delete=m_id

//get
//message.php?start=0&count=10
//message.php

require_once("include/session.php");
require_once("include/databaseClassMySQLi.php");

header('Content-Type: application/json');

$db = new database();
$results = array();


if (isset($_POST['message']) && isset($_POST['to'])) {
    if (isset($_POST['showName']))
        $showName = $db->escape($_POST['showName']);
    else
        $showName = 0;
    if ($session->checkLoggedIn() === true) {
        date_default_timezone_set('UTC');
        $message = $db->escape($_POST['message']);
        $to = $db->escape($_POST['to']);
        $query = 'insert into messages(to_uid, from_id, message, date, showName) values (\'' . $to . '\', \'' . $session->uid . '\', \'' . $message . '\', \'' . date("Y-m-d") . '\', \'' . $showName . '\')';
        $db->send_sql($query);
        array_push($results, "success");
    } else {
        array_push($results, "Please log in");
    }
} else if (isset($_POST['delete'])) {
    $delete = $db->escape($_POST['delete']);
    $query = 'delete from messages where m_id='.$delete.' and u_id='.$session->uid;
    if ($session->checkLoggedIn() === true) {
        $db->send_sql($query);
        array_push($results, "success");
    } else {
        array_push($results, "Please log in");
    }
} else {
    if (isset($_GET['start']) && isset($_GET['count'])) {
        $start = $db->escape($_GET['start']);
        $count = $db->escape($_GET['count']);
    } else {
        $start = 0;
        $count = 20;
    }
    if ($session->checkLoggedIn() === true) {
        $query = 'select m_id, name, from_uid, message, date, showName from messages natural join users where to_uid=\'' . $session->uid . '\' order by date desc limit ' . $start . ', ' . $count;
        $db->send_sql($query);
        while (($row = $db->next_row()) !== false && !empty($row)) {
            if ($row['showName'] == 0)
                $row['name'] = "anon";
            array_push($results, $row);
        }
    }
}
echo json_encode($results);

?>
