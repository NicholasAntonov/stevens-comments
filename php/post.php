<?php
require_once("include/databaseClassMySQLi.php");

header('Content-Type: application/json');

$db = new database();

getAllPosts(0, 10);

function getAllPosts($start, $count) {
    global $db;
    $start = $db->escape($start);
    $count = $db->escape($count);
    $query = 'select id, name, u_id, post, date, showName from posts natural join users limit '.$start.', '.$count;
    $db->send_sql($query);
    $results = array();
    while (($row = $db->next_row()) !== false && !empty($row)) {
        if ($row['showName'] == 0)
            $row['name'] = "anon";
        array_push($results, $row);
    }
    echo json_encode($results);
}

function getUserPosts($u_id, $start, $count)  {
    global $db;
    $u_id = $db->escape($u_id);
    $start = $db->escape($start);
    $count = $db->escape($count);
    $query = 'select id, name, u_id, post, date, showName from posts natural join users where u_id=\''.$u_id.'\' limit '.$start.', '.$count;
    $db->send_sql($query);
}

?>