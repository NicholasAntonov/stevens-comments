<?php

//post
//comment.php?p_id=1&comment=content&showName=1
//comment.php?p_id=1&comment=content

//get
//userPost.php?post=p_id=1
//userPost.php?post=p_id=1&start=0&count=1

require_once("include/session.php");
require_once("include/databaseClassMySQLi.php");

header('Content-Type: application/json');

$db = new database();
$results = array();


if (isset($_POST['comment']) && isset($_POST['p_id'])) {
    $p_id = $db->escape($_POST['p_id']);
    if (isset($_POST['showName']))
        $showName = $db->escape($_POST['showName']);
    else
        $showName = 0;
    if ($session->checkLoggedIn() === true) {
        date_default_timezone_set('UTC');
        $comment = $db->escape($_POST['comment']);
        $query = 'insert into comments(u_id, p_id, comment, date, showName) values (\'' . $session->uid . '\', \'' . $p_id . '\', \'' . $comment . '\', \'' . date("Y-m-d") . '\', \'' . $showName . '\')';
        $db->send_sql($query);
        array_push($results, "success");
    } else {
        array_push($results, "Please log in");
    }
} else if (isset($_POST['delete'])) {
    $delete = $db->escape($_POST['delete']);
    $query = 'delete from comments where c_id='.$delete.' and u_id='.$session->uid;
    if ($session->checkLoggedIn() === true) {
        $db->send_sql($query);
        array_push($results, "success");
    } else {
        array_push($results, "Please log in");
    }
} else if (isset($_GET['p_id'])) {
    $p_id = $db->escape($_GET['p_id']);
    if (isset($_GET['start']) && isset($_GET['count'])) {
        $start = $db->escape($_GET['start']);
        $count = $db->escape($_GET['count']);
    } else {
        $start = 0;
        $count = 20;
    }
    //value = whether the use voted 1 or -1 or null
    $query = 'select name, u_id, p_id, comments.c_id, comment, date, showName, votes, value from comments natural join users left join (select value, c_id from comment_votes where u_id=\''.$session->uid.'\') a on comments.c_id=a.c_id where p_id=\'' . $p_id . '\' order by date desc limit ' . $start . ', ' . $count;
    $db->send_sql($query);
    while (($row = $db->next_row()) !== false && !empty($row)) {
        if ($session->checkLoggedIn() === true && $session->uid != $row['u_id'] && !$session->isAdmin())
            $row['u_id'] = -1;
        if ($row['showName'] == 0 )
            $row['name'] = "anon";
        array_push($results, $row);
    }
}
echo json_encode($results);

?>
