<?php

    $action = $_GET['action'];

    $conn = mysql_connect("127.0.0.1", "root", "000000") or die ("连接数据库服务器失败！".mysql_error());
    $select = mysql_select_db("tvdoctor", $conn);

    if ('delete' == $action) {
        $id = $_GET['id'];
        delete_user_info($id);

    } else {
        $username = $_GET['username'];
        $passwd = $_GET['passwd'];
        $option = $_GET['option'];
        $truename = $_GET['truename'];
        $department = $_GET['department'];

        if ('add' == $action) {
            add_user_info($username, $passwd, $option, $truename, $department);
        } else if ('modify' == $action) {
            $id = $_GET['id'];
            modify_user_info($id, $username, $passwd, $option);
        } else {
            echo '{"ret": "Error", "data": "1"}';
        }
    }

    function modify_user_info($id, $username, $passwd, $option)
    {
        $update = mysql_query("update user set userName='". $username ."', password='" . $passwd . "' where userId='" . $id . "';");
        $update2 = mysql_query("update user_role set roleId = (select roleId from role where roleName = '" . $option . "') where userId='" . $id . "'");

        if (!$update || !$update2) {
            echo '{"ret": "Error", "data": "2"}';
        } else {
            echo '{"ret":"OK", "data": {"id" : "' . $id . '", "username" : "' . $username  . '", "passwd" : "' . $passwd . '", "option" : "' . $option . '" }}';
        }
    }

    function add_user_info($username, $passwd, $option, $truename, $department)
    {
        $ret = mysql_query("select userId from user where userName = '" . $username . "';");
        if ($ret && mysql_fetch_array($ret)) {
            echo  '{"ret": "ERROR1", "data": "username is exist"}';
        } 
        else {
            $insert = mysql_query("insert into user(userName,password,realName,department) values('". $username . "','" .  $passwd . "','" .  $truename . "','" .  $department . "');");
            if (!$insert) {
                echo '{"ret": "Error", "data": "3"}';
            } else {
                $userId = mysql_insert_id();
                $insert2 = mysql_query("insert into user_role(userId, roleId) values('" . $userId . "', (select roleId from role where roleName = '" . $option . "'));");
                if ($insert2) {
                    //echo "OK" . "new id :" . $userId  . " + " . $username .  " + " . $passwd . " + " . $option;;
                    //echo "{ret:'OK', data: {id : ". $userId . ", username :" . $username  . ", passwd : ". $passwd . ", option : " . $option . " }}";
                    echo '{"ret":"OK", "data": {"id" : "' . $userId . '", "username" : "' . $username  . '", "passwd" : "' . $passwd . '", "option" : "' . $option . '" }}';
                } else {
                    echo '{"ret": "Error", "data": "4"}';
                }
            }
        }
    }

    function delete_user_info($id)
    {
        $delete = mysql_query("delete from user where userId = '". $id . "';");
        // $delete2 = mysql_query("delete from user_role where userId = '". $id  . "';");
        //if (!$delete || !$delete2) {
        if (!$delete) {
            echo '{"ret": "Error", "data": "5"}';
        } else {
          echo '{"ret": "OK", "data": ""}';
        }
    }
?>

