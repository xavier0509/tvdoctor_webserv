<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>无标题文档</title>
</head>

<body>
<?php
include("connect.php");		
if(isset($_POST['id2']) and isset($_POST['Submit']) and $_POST['Submit']=="删除"){	
	$delete=mysql_query("delete from user where userId='".$_POST['id2']."'");
	$delete2=mysql_query("delete from user_role where userId='".$_POST['id2']."'");
	//$delete3=mysql_query("delete from role_permission where userid='".$_POST['id2']."'");

	if($delete){
		echo  "<script> alert('删除成功!'); window.location.href='usermanagement.php'</script>";
	}else{
		echo  "<script> alert('删除失败!'); window.location.href='usermanagement.php'</script>";
	}
}
?>
</body>
</html>
