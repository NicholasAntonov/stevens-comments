<?php
//get
//votePost.php?p_id=1&up
//votePost.php?p_id=1&down

require_once("include/databaseClassMySQLi.php");
require_once("include/session.php");

header('Content-Type: application/json');

$db = new database();

$results = array();

if (isset($_GET['p_id'])) {
    $p_id = $db->escape($_GET['p_id']);
    if (isset($_GET['up'])) {
        $query = 'select value from post_votes where p_id=\''.$p_id.'\' and u_id=\''.$session->uid.'\'';
        $db->send_sql($query);
        $row = $db->next_row();
        if ($row === false || empty($row)) {
            $query = 'insert into post_votes (p_id, u_id, value) values(' . $p_id . ', ' . $session->uid . ', 1)';
            $db->send_sql($query);
            $query = 'update posts set votes = votes + 1 where p_id='.$p_id;
            $db->send_sql($query);
        } else {
            $query = 'update post_votes set value=1 where p_id='.$p_id.' and u_id='.$session->uid;
            $db->send_sql($query);
            $value = $row['value'] ;
            if ($value == -1) {
                $query = 'update posts set votes = votes + 2 where p_id='.$p_id;
                $db->send_sql($query);
            }
        }
    } else if (isset($_GET['down'])) {
        $query = 'select value from post_votes where p_id=\''.$p_id.'\' and u_id=\''.$session->uid.'\'';
        $db->send_sql($query);
        $row = $db->next_row();
        if ($row === false || empty($row)) {
            $query = 'insert into post_votes(p_id, u_id, value) values(' . $p_id . ', ' . $session->uid . ', -1)';
            $db->send_sql($query);
            $query = 'update posts set votes = votes - 1 where p_id='.$p_id;
            $db->send_sql($query);
        } else {
            $query = 'update post_votes set value=-1 where p_id='.$p_id.' and u_id='.$session->uid;
            $db->send_sql($query);
            $value = $row['value'] ;
            if ($value == 1) {
                $query = 'update posts set votes = votes - 2 where p_id='.$p_id;
                $db->send_sql($query);
            }
        }
    }
    array_push($results, "success");
}

echo json_encode($results);

?>