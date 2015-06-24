<?php
//get
//post.php?start=0&count=20
//post.php

require_once("include/databaseClassMySQLi.php");

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

    $query = 'select id, name, u_id, post, date, showName from posts natural join users order by date desc limit ' . $start . ', ' . $count;
    $db->send_sql($query);
    while (($row = $db->next_row()) !== false && !empty($row)) {
        if ($row['showName'] == 0)
            $row['name'] = "anon";
        array_push($results, $row);
    }
echo json_encode($results);


?>