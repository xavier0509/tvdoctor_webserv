<?php 
	@session_start();
	 if(!(isset($_SESSION["username1"]))){
	 	echo"<script>window.localtion.href='index.php'</script>";	
	 	}
include("connect.php");
$user=$_SESSION['username1'];
//$user="222";
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
if($getid2=="3"){
echo
	"<script>document.getElementById('usermanage').style.display='none';</script>";
	}
elseif ($getid2=="4") {
	echo"<script>document.getElementById('usermanage').style.display='none';</script>";
	echo"<script>document.getElementById('uploadButton').style.display='none';</script>";
	echo"<script>document.getElementById('nextButton1').style.display='none';</script>";
	echo"<script>document.getElementById('prevButton1').style.display='none';</script>";
}
?>
<meta http-equiv="Content-Type" content="text/html;charset=utf-8"/>
