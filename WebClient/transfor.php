<?php 
	session_start();
	// if(!(isset($_SESSION["username1"]))){
	// 	echo"<script>alert('请先进行登录！！');window.localtion.href='index.php'</script>";	
	// 	}
include("connect.php");
$user=$_SESSION['username1'];

$sql="select userId from user where userName='$user'";
$result=mysql_query($sql);
$list=mysql_fetch_assoc($result);
$getid=$list['userId'];
// echo "$getid";
$sql2="select roleId from user_role where userId='$getid'"; 
$result2=mysql_query($sql2);
$list2=mysql_fetch_assoc($result2);
$getid2=$list2['roleId'];
// echo "$getid2";
if($getid2=="1"||$getid2=="2"){
echo"<meta http-equiv='refresh' content='0;url=usermanagement.php'/>";}
else{
	echo "<script>alert('当前权限无法进行操作，请联系管理员授予权限')</script>";
	echo"<meta http-equiv='refresh' content='0;url=inputService.php'/>";
}
?>
<meta http-equiv="Content-Type" content="text/html;charset=utf-8"/>
