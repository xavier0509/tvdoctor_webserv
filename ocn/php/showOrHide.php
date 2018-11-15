<?php

    $username=$_GET['adminname'];
    $conn=mysql_connect("127.0.0.1","root","000000")or die ("连接数据库服务器失败！".mysql_error());
    $select =mysql_select_db("tvdoctor",$conn);
	
	$sql="select A.roleId from user_role A inner join user B ON A.userId = B.userId where B.userName ='" . $username . "'";
	$result=mysql_query($sql);
	$list=mysql_fetch_assoc($result);
	$getid=$list['roleId'];
	echo $getid;
	
	 
?>