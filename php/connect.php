<?php 
$conn=mysql_connect("127.0.0.1","root","000000")or die ("连接数据库服务器失败！".mysql_error());
$select =mysql_select_db("tvdoctor",$conn);
mysql_query("set names utf8");

?>

