<?php 
@session_start();
$conn = mysql_connect("127.0.0.1","root","000000")or die ("连接数据库服务器失败！".mysql_error());
$select = mysql_select_db("tvdoctor",$conn);

$user = $_GET['username1'];
$pw = $_GET['password1'];
$sql = "select password from user where userName='" . $user . "'";
$result = mysql_query($sql);
$list = mysql_fetch_assoc($result);
$getpw = $list['password'];
//$getname=$list['userName'];
//$getlevel=$list[level];
if ($user != "" && $pw != ""){
	if ($getpw == $pw && $user == "admin"){
		$_SESSION['username1'] = $user;
		echo "OK";
	}
	elseif ($list == "") {
		# code...
		echo "ERR_NOUSER";
	}
	elseif ($user != "admin") {
		# code...
		echo "ERR_NOUSER";
	}
	elseif ($getpw != $pw) {
		# code...
		echo "ERR_PWDERR";
	}

}

?>
