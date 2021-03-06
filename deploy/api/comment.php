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


if (isset($_POST['comment']) && isset($_POST['p_id']) && $_POST['comment'] != '' && $_POST['p_id'] != '') {
    $p_id = $db->escape($_POST['p_id']);
    if (isset($_POST['showName'])) {
        $showName = $db->escape($_POST['showName']);
        if ($showName === true || $showName === 'true')
            $showName = 1;
        else
          $showName = 0;
    } else {
        $showName = 0;
    }
    if ($session->checkLoggedIn() === true) {
        $db->send_sql("insert into ownage(u_id) values ('$session->uid')");
        $ownage = $db->insert_id();
        date_default_timezone_set('UTC');
        $comment = $db->escape($_POST['comment']);
        $query = "insert into comments(u_id, p_id, comment, showName, ownage_id) values ('$session->uid', '$p_id', '$comment', '$showName', $ownage)";
        $db->send_sql($query);
        array_push($results, "success");
    } else {
        array_push($results, "Please log in");
    }
} else if (isset($_POST['delete']) && $_POST['delete'] != '') {
    $delete = $db->escape($_POST['delete']);
    if ($session->isAdmin())
        $query = 'update comments set hidden=1 where c_id='.$delete;
    else
        $query = 'update comments set hidden=1 where c_id=\''.$delete.'\' and u_id=\''.$session->uid.'\'';
    if ($session->checkLoggedIn() === true) {
        $db->send_sql($query);
        array_push($results, "success");
    } else {
        array_push($results, "Please log in");
    }
} else if (isset($_GET['p_id']) && $_GET['p_id'] != '') {
    $p_id = $db->escape($_GET['p_id']);
    if (isset($_GET['start']) && isset($_GET['count'])) {
        $start = $db->escape($_GET['start']);
        $count = $db->escape($_GET['count']);
        if (!is_numeric($start) || !is_numeric($count)) {
            $start = 0;
            $count = 20;
        }
    } else {
        $start = 0;
        $count = 20;
    }
    //value = whether the use voted 1 or -1 or null
    $query = 'select name, u_id, p_id, comments.c_id, comment, date, showName, votes, value, ownage_id from comments natural join users left join (select value, c_id from comment_votes where u_id=\''.$session->uid.'\') a on comments.c_id=a.c_id where p_id=\'' . $p_id . '\' and hidden=0 order by date desc limit ' . $start . ', ' . $count;
    $db->send_sql($query);
    while (($row = $db->next_row()) !== false && !empty($row)) {
        if (($session->checkLoggedIn() === false) || ($session->checkLoggedIn() === true && $session->uid != $row['u_id'] && !$session->isAdmin()))
            $row['u_id'] = -1;
        if ($row['showName'] == 0 )
            $row['name'] = "anon";
        array_push($results, $row);
    }
}
echo json_encode($results);

?>
