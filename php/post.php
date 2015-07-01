<?php
//get
//post.php?start=0&count=20
//post.php

require_once("include/databaseClassMySQLi.php");
require_once("include/session.php");

header('Content-Type: application/json');

$db = new database();

$results = array();
if (isset($_GET['start']) && isset($_GET['count'])) {
    $start = $db->escape($_GET['start']);
    $count = $db->escape($_GET['count']);
} else {
    $start = 0;
    $count = 20;
}

    //value = whether the use voted 1 or -1 or null
    $query = 'select posts.p_id, users.u_id, for_name, name, post, date, showName, votes, a.value, ownage_id from posts natural join users left join (select value, p_id from post_votes where u_id=\''.$session->uid.'\') a on posts.p_id=a.p_id where hidden=0 order by date desc limit ' . $start . ', ' . $count;
    $db->send_sql($query);
    while (($row = $db->next_row()) !== false && !empty($row)) {
        if ($row['showName'] == 0)
            $row['name'] = "anon";
        if ($session->checkLoggedIn() === true && $session->uid != $row['u_id'] && !$session->isAdmin())
            $row['u_id'] = -1;
        array_push($results, $row);
    }
echo json_encode($results);


?>