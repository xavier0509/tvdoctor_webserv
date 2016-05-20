<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>无标题文档</title>
</head>

<body>
</body>
</html>
<?php
include("connect.php");				//包含conn.php文件
if(isset($_POST['id']) and isset($_POST['Submit']) and $_POST['Submit']=="保存"){
	$update=mysql_query("update user set userName='".$_POST['name']."',password='".$_POST['password']."' where userId='".$_POST['id']."'");
	$update2=mysql_query("update user_role set roleId='".$_POST['roleid']."' where userId='".$_POST['id']."'");
//	$update3=mysql_query("update role_permission set permissionid='".$_POST['permissionid']."' where userid='".$_POST['id']."'");
	if($update&&$update2){
		echo  "<script> alert('修改成功!'); window.location.href='changeinformation.php'</script>";
	}else{
		echo  "<script> alert('修改失败!'); window.location.href='changeinformation.php'</script>";
	}
}
?>
