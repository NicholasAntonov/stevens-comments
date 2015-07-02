<?php

//GET
//message.php?to=uid&message=content&showName=1
//message.php?to=uid&message=content

//GET
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
        $db->send_sql("insert into ownage(u_id) values ('$session->uid')");
        $ownage = $db->insert_id();
        date_default_timezone_set('UTC');
        $message = $db->escape($_POST['message']);
        $to = $db->escape($_POST['to']);
        $query = 'insert into messages(to_ownage, ownage_id, message, date, showName) values (\'' . $to . '\', \'' . $ownage . '\', \'' . $message . '\', \'' . date("Y-m-d") . '\', \'' . $showName . '\')';
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
        $query = "select message, messages.ownage_id, date, name, showName from messages join (select ownage_id, u_id from ownage) a on messages.to_ownage=a.ownage_id natural join users where u_id=".$session->uid." order by date desc limit $start, $count";
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
