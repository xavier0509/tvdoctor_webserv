<?php 
@session_start();
$conn = mysqli_connect("223.202.11.125","root","000000")or die ("连接数据库服务器失败！".mysqli_error());
$select = mysqli_select_db("tvdoctor",$conn);

$user = $_GET['username1'];
$pw = $_GET['password1'];
$sql = "select password from user where userName='" . $user . "'";
$result = mysqli_query($sql);
$list = mysqli_fetch_assoc($result);
$getpw = $list['password'];
//$getname=$list['userName'];
//$getlevel=$list[level];
if ($user != "" && $pw != ""){
	if ($getpw == $pw){
		$_SESSION['username1'] = $user;
		echo "OK";
	}
	elseif ($list == "") {
		# code...
		echo "ERR_NOUSER";
	}
	elseif ($getpw != $pw) {
		# code...
		echo "ERR_PWDERR";
	}

}

?>
