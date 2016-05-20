<?php 
include("connect.php");
$user=$_GET['username'];
$pw=$_GET['password'];
//$id=$_GET['userid'];
$role=$_GET['role'];
//$permission=$_GET['permission'];
// $card=$_GET['idcard'];
$sql="select * from user where username='$user'";
$result=mysql_query($sql);
$list=mysql_num_rows($result);
$getuname=$list['username'];
//$getuserid=$list['userid'];

if($user!=""){
	echo $list;
	
if($list>0){
	echo "<script>alert('抱歉，您的用户名已被使用，请重新输入')</script>";
	echo"<meta http-equiv='refresh' content='0;url=adduser.php'/>";
	}
	else{
	  $insert=mysql_query("insert into user(userName,password) values('".$_GET['username']."','".$_GET['password']."')");
	  $insert2=mysql_query("insert into user_role(roleId) values('$role')");
	  //$insert3=mysql_query("insert into role_permission(userid,roleid,permissionid) values('$id','$role','$permission')");
	  if($insert){
	  echo "<script>alert('恭喜，注册成功!')</script>";
	  echo"<meta http-equiv='refresh' content='0;url=adduser.php'/>";
		}
	  else{echo "<script>alert('抱歉，您所填写的用户ID重复，注册失败')</script>";
	  echo"<meta http-equiv='refresh' content='0;url=adduser.php'/>";}
	}
		
}

?>
<meta charset="utf-8">
