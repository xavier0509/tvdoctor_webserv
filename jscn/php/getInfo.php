<?php

    $action = $_GET['action'];

    $conn = mysql_connect("127.0.0.1", "root", "000000") or die ("连接数据库服务器失败！".mysql_error());
    $select = mysql_select_db("tvdoctor", $conn);

    if ('permissions' == $action) {
        $username = $_GET['username'];
        get_user_permissions($username);

    } else {
        echo '{"ret": "Error", "data": "1"}';
    }

    function get_user_permissions($username)
    {
        $ret = mysql_query("select roleId from user A inner join user_role B on A.userId = B.userId where userName = '" . $username . "';");
        if (!$ret) {
            echo '{"ret": "Error", "data": "2"}';
        } else {
            $result = mysql_fetch_array($ret);
            echo '{"ret": "OK", "data": {"permissions" : "' . $result['roleId'] . '"}}';
        }
    }
?>

