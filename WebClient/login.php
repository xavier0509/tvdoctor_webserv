<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html;charset=utf-8"/>
<title>用户登录</title>
<script language="javascript" src="js/fun1.js"> </script>
</head>

<body bgcolor="#fff">
	<div class="top">
		
	</div>
	<form id="form_zc" name="form_zc" >
	<div class="main">
		UserId&nbsp;&nbsp;<input type="text" style="height:30px;width:400px;border-radius:12px;" id="userid" name="userid"><br/><br/>
		UserName<input type="text" autocomplete="off" style="height:30px;width:400px;border-radius:12px;" id="username" name="username"><br/><br/>
		PassWord<input type="password" style="height:30px;width:400px;border-radius:12px;" id="password" name="password"><br/><br/>
		<input type="reset" name="reset" value="重置" /><input name="zc" type="submit" value="注册" onclick="chkinput()" />
	</div>
</form>


	<div class="bottom"></div>
<br><br>

	<form id="form_login" name="form_login" >
	<div class="main">
		UserName<input autocomplete="off" type="text" style="height:30px;width:400px;border-radius:12px;" id="username1" name="username1"><br/><br/>
		PassWord<input type="password" style="height:30px;width:400px;border-radius:12px;" id="password1" name="password1"><br/><br/>
		<input type="reset" name="reset" value="重置" /><input  type="submit" value="登录" onclick="chkinput1()" />
	</div>
</form>




<table border="1"> 
	<tr>
    	<td height="25" width="70">userid</td><td width="70" align="center">username</td>
    </tr>
    <?php 
	 include("connect.php");
	 $arr=mysql_query("select * from user order by userid");

	 while($result=mysql_fetch_array($arr)){
	?>
    <tr>
    	<td height="25"><?php echo $result['userid'];?>&nbsp;</td>
        <td width="150"><?php echo $result['username'];?>&nbsp;</td>
        
        <td>
			<input type="hidden" name="userid" value="<?php echo $result['userid'];?>" />
			<div align="center">
			<a href="updateinformation.php?userid=<?php echo $result['userid'];?>">编辑</a></div>
			</td>
        
        <td>
        <form id="form1" name="form1" method="post" action="deleteuser.php">
			<input type="hidden" name="id2" value="<?php echo $result['userid'];?>" />
			<div align="center">
				<input name="Submit" type="submit"  value="删除" />
            </form>
				</div>
			</td>
    </tr>
    <?php 
	 }
	?>
    
</table>
</body>

</html>