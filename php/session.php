<?php 
@session_start();
$username=$_SESSION['username1'];
if (! (isset($_SESSION['username1'])))
{
	echo "ERROR";
}
else{
	echo $username;
}

 
?>
