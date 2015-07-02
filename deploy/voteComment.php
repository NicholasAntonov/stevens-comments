<?php
//voteComment.php?c_id=1&up
//voteComment.php?c_id=1&down

require_once("include/databaseClassMySQLi.php");
require_once("include/session.php");

header('Content-Type: application/json');

$db = new database();

$results = array();

if (isset($_POST['c_id'])) {
    $c_id = $db->escape($_POST['c_id']);
    if (isset($_POST['up'])) {
        $query = 'select value from comment_votes where c_id=\''.$c_id.'\' and u_id=\''.$session->uid.'\'';
        $db->send_sql($query);
        $row = $db->next_row();
        if ($row === false || empty($row)) {
            $query = 'insert into comment_votes(c_id, u_id, value) values(' . $c_id . ', ' . $session->uid . ', 1)';
            $db->send_sql($query);
            $query = 'update comments set votes = votes + 1 where c_id='.$c_id;
            $db->send_sql($query);
        } else {
            $query = 'update comment_votes set value=1 where c_id='.$c_id.' and u_id='.$session->uid;
            $db->send_sql($query);
            $value = $row['value'] ;
            if ($value == -1) {
                $query = 'update comments set votes = votes + 2 where c_id='.$c_id;
                $db->send_sql($query);
            }
        }
    } else if (isset($_POST['down'])) {
        $query = 'select value from comment_votes where c_id=\''.$c_id.'\' and u_id=\''.$session->uid.'\'';
        $db->send_sql($query);
        $row = $db->next_row();
        if ($row === false || empty($row)) {
            $query = 'insert into comment_votes(c_id, u_id, value) values(' . $c_id . ', ' . $session->uid . ', -1)';
            $db->send_sql($query);
            $query = 'update comments set votes = votes - 1 where c_id='.$c_id;
            $db->send_sql($query);
        } else {
            $query = 'update comment_votes set value=-1 where c_id='.$c_id.' and u_id='.$session->uid;
            $db->send_sql($query);
            $value = $row['value'] ;
            if ($value == 1) {
                $query = 'update comments set votes = votes - 2 where c_id='.$c_id;
                $db->send_sql($query);
            }
        }
    }
    array_push($results, "success");
} else if (isset($_POST['delete'])) {
    $query = 'select value from comment_votes where c_id=\''.$delete.'\' and u_id=\''.$session->uid.'\'';
    $db->send_sql($query);
    $row = $db->next_row();
    if ($row != false && !empty($row)) {
      $delete = $db->escape($_POST['delete']);
      $query = 'delete from comment_votes where where c_id=\''.$delete.'\' and u_id=\''.$session->uid;
      $db->send_sql($query);
      $query = "update comments set votes = votes-1 where c_id=$delete";
      $db->send_sql($query);
    }
}

echo json_encode($results);

?>