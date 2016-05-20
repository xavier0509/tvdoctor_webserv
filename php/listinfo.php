<?php

    $username=$_GET['adminname'];
    $conn=mysql_connect("127.0.0.1","root","000000")or die ("连接数据库服务器失败！".mysql_error());
    $select =mysql_select_db("tvdoctor",$conn);
    
    if($username=='admin'){
        $arr=mysql_query("select A.userId, userName, password, roleName from user A inner join user_role B inner join role C on A.userId = B.userId and B.roleId = C.roleId where B.roleId != 1 order by userId;");
    } else{ 

        $arr=mysql_query("select A.userId, userName, password, roleName from user A inner join user_role B inner join role C on A.userId = B.userId and B.roleId = C.roleId where B.roleId != 1 and B.roleId != 2 order by userId;");
    }

    while($result = mysql_fetch_array($arr)) {

        echo $result['userId'] . "<br />" . $result['userName'] . "<br />" . $result['password'] . "<br />" . $result['roleName'] . "\r\n";
    }
    
?>

