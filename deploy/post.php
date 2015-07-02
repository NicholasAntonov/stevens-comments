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
    if (isset($_GET['top']))
        $query = 'select posts.p_id, users.u_id, for_name, name, post, date, showName, votes, a.value, ownage_id from posts natural join users left join (select value, p_id from post_votes where u_id=\''.$session->uid.'\') a on posts.p_id=a.p_id where hidden=0 order by votes desc limit ' . $start . ', ' . $count;
    else
        $query = 'select posts.p_id, users.u_id, for_name, name, post, date, showName, votes, a.value, ownage_id from posts natural join users left join (select value, p_id from post_votes where u_id=\''.$session->uid.'\') a on posts.p_id=a.p_id where hidden=0 order by date desc limit ' . $start . ', ' . $count;
    $db->send_sql($query);
    while (($row = $db->next_row()) !== false && !empty($row)) {
        if ($row['showName'] == 0)
            $row['name'] = "anon";
        if ($session->checkLoggedIn() === true && $session->uid != $row['u_id'] && !$session->isAdmin())
            $row['u_id'] = -1;
        array_push($results, $row);
    }

if (isset($_GET['comments'])) {
    foreach($results as $key=>$value) {
        $results[$key]['comments'] = array();
        $comments = $db->escape($_GET['comments']);
        $p_id = $value['p_id'];

        $query = 'select name, u_id, p_id, comments.c_id, comment, date, showName, votes, value, ownage_id from comments natural join users left join (select value, c_id from comment_votes where u_id=\'' . $session->uid . '\') a on comments.c_id=a.c_id where p_id=\'' . $p_id . '\' and hidden=0 order by date desc limit 0, ' . $comments;
        $db->send_sql($query);
        while (($comment = $db->next_row()) !== false && !empty($comment)) {
            if ($session->checkLoggedIn() === true && $session->uid != $row['u_id'] && !$session->isAdmin())
                $comment['u_id'] = -1;
            if ($comment['showName'] == 0)
                $comment['name'] = "anon";
            array_push($results[$key]['comments'], $comment);
        }
    }
}

echo json_encode($results);


?>
