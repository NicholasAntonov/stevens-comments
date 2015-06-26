<?php

//put
//userPost.php?post=postcontent&showName=1
//userPost.php?post=postcontent

//delete
//userPost.php?delete=p_id

//get
//userPost.php?start=0&count=10
//userPost.php

require_once("include/session.php");
require_once("include/databaseClassMySQLi.php");

header('Content-Type: application/json');

$db = new database();
$results = array();


if (isset($_GET['post'])) {
    if (isset($_GET['showName']))
        $showName = $db->escape($_GET['showName']);
    else
        $showName = 0;
    if ($session->checkLoggedIn() === true) {
        date_default_timezone_set('UTC');
        $post = $db->escape($_GET['post']);
        $query = 'insert into posts(u_id, post, date, showName) values (\'' . $session->uid . '\', \'' . $post . '\', \'' . date("Y-m-d") . '\', \'' . $showName . '\')';
        $db->send_sql($query);
        array_push($results, "success");
    } else {
        array_push($results, "Please log in");
    }
} else if (isset($_GET['delete'])) {
    $delete = $db->escape($_GET['delete']);
    $query = 'delete from posts where p_id='.$delete.' and u_id='.$session->uid;
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
        $query = 'select p_id, name, u_id, post, date, showName from posts natural join users where u_id=\'' . $session->uid . '\' order by date desc limit ' . $start . ', ' . $count;
        $db->send_sql($query);
        while (($row = $db->next_row()) !== false && !empty($row)) {
            array_push($results, $row);
            if ($row['showName'] == 0)
                $row['name'] = "anon";
        }
    }
}
echo json_encode($results);

?>
