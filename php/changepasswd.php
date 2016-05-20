<?php 
	$conn=mysql_connect("127.0.0.1","root","000000")or die ("连接数据库服务器失败！".mysql_error());
    $select =mysql_select_db("tvdoctor",$conn);
	$username=$_GET['adminname'];
	$oldpw=$_GET['oldpw'];
	$newpw=$_GET['newpw'];
	

    $sql="select password from user where userName='".$username."'";
    $result=mysql_query($sql);
	$list=mysql_fetch_assoc($result);
	$getpw=$list['password'];
	// echo $getpw;
	// echo "admin=".$username;
	if ($getpw==$oldpw) {
		$update=mysql_query("update user set password='".$newpw."'where userName ='".$username."'");
		if ($update) {
			echo "OK";
		}
		else{
			echo "ERROR1";
		}
	}
	else{
		echo "ERROR2";
	}
?>