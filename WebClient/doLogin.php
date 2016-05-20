<?php 
@session_start();
include("connect.php");
$user=$_GET['username1'];
$pw=$_GET['password1'];
$sql="select password from user where userName='$user'";
$result=mysql_query($sql);
$list=mysql_fetch_assoc($result);
$getpw=$list['password'];
//$getname=$list['userName'];
//$getlevel=$list[level];

if($user!=""&&$pw!=""){
	if($getpw==$pw){
		
		$_SESSION['username1']=$user;
		echo"<meta http-equiv='refresh' content='0;url=inputService.php'/>";

	}
		else{
			echo "<script>alert('抱歉，您所输入的用户名或密码错误！请重新输入')</script>";
			echo"<meta http-equiv='refresh' content='0;url=index.php'/>";
			}
}

?>
