<?php

//POST
//also add for_name=steve to the end
//userPost.php?post=postcontent&showName=1
//userPost.php?post=postcontent

//POST
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


if (isset($_POST['post']) && isset($_POST['for_name']) && $_POST['post'] != '') {
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
        $post = $db->escape($_POST['post']);
        $for_name = $db->escape($_POST['for_name']);
        $query = 'insert into posts(u_id, post, showName, ownage_id, for_name) values (\'' . $session->uid . '\', \'' . $post . '\',  \'' . $showName . '\', \''.$ownage.'\', \''.$for_name.'\')';
        $db->send_sql($query);
        array_push($results, "success");
    } else {
        array_push($results, "Please log in");
    }
} else if (isset($_POST['delete']) && $_POST['delete'] != '') {
    $delete = $db->escape($_POST['delete']);
    if ($session->isAdmin())
        $query = 'update posts set hidden=1 where p_id=\''.$delete.'\'';
    else
        $query = 'update posts set hidden=1 where p_id=\''.$delete.'\' and u_id=\''.$session->uid.'\'';
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
        $query = 'select p_id, name, u_id, post, date, showName from posts natural join users where u_id=\'' . $session->uid . '\' and hidden=0 order by date desc limit ' . $start . ', ' . $count;
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
