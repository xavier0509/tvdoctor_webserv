<?php 
@session_start();
 if (! (isset($_SESSION['username1']))){
          echo"<script>window.location.href='index.php';</script>";
        
      }
 $username=$_SESSION['username1'];
// echo "<script> alert($user)</script>";
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html;charset=utf-8"/>
<title>用户管理</title>
<script language="javascript" src="js/webclient.js"> </script>
<link rel="stylesheet" type="text/css" href="css/common.css">
</head>
<body onload="option()">

<div class="topbar-wrap white">
    <div class="topbar-inner clearfix">
        <div class="topbar-logo-wrap clearfix">
           
            <ul class="navbar-list clearfix">
                
                <li><a class="on" href="usermanagement.php">首页</a></li>
                
            </ul>
        </div>
        <div class="top-info-wrap">
            <ul class="top-info-list clearfix">   
	            <li><a href='inputService.php' style='cursor:pointer;'>返回</a></li>           
                <li><a href='logout.php' style='cursor:pointer;'>退出</a></li>
            </ul>
        </div>
    </div>
</div>
<div class="container clearfix">
    <div class="sidebar-wrap">
        <div class="sidebar-title">
            <h1>菜单</h1>
        </div>
        <div class="sidebar-content">
            <ul class="sidebar-list">
                <li>
                    <a href="#"><i class="icon-font">&#xe003;</i>常用操作</a>
                    <ul class="sub-menu">
                         <li><a href=""><i class="icon-font">&#xe008;</i>用户管理</a></li>
                        <li><a href="adduser.php"><i class="icon-font">&#xe008;</i>　　用户添加</a></li>
                        <li><a href="changeinformation.php"><i class="icon-font">&#xe008;</i>　　用户修改</a></li>
                        
                        
                    </ul>
                </li>
                
            </ul>
        </div>
    </div>
    <!--/sidebar-->
    <div class="main-wrap">
        <div class="crumb-wrap">
            <div class="crumb-list" align="right"><span><?php echo "<font color='#FF0000' size='+1'>欢迎</font>".$username ?></span></div>
        </div>
        <div class="result-wrap">
            <div class="result-title">
                <h1>快捷操作</h1>
            </div>
            <div class="result-content">
                <div class="short-wrap">
                    <!-- <a href="accountmanagement.php"><i class="icon-font">&#xe001;</i>修改密码</a>
                    <a href="insertgas.php"><i class="icon-font">&#xe005;</i>用户注册</a>
                    <a href="insertinformation.php"><i class="icon-font">&#xe048;</i>发布信息</a> -->
                </div>
            </div>
        </div>
        <div class="result-wrap">
            <div class="result-title">
                <h1>用户添加</h1>
            </div>
             <div class="result-content">
                <form id="form_zc" name="form_zc" >
					<div class="main">
					<!--	<i class="red">*</i>UserId　　<input type="text" autocomplete="off" style="height:30px;width:400px;border-radius:6px;" id="userid" name="userid">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;     
-->                    
						<i class="red">*</i>UserName<input type="text" autocomplete="off" style="height:30px;width:400px;border-radius:6px;" id="username" name="username"><br/><br/>
                    <!--    <i class="red">*</i>Permission<select id="permission" name="permission" style="height:30px;width:400px;border-radius:6px;">
                                                        <option value="level1">最高权限(1级)</option>
                                                        <option value="level2" selected="selected">2级权限</option>
                                                        <option value="level3">3级权限</option>
                                                        </select><br/><br/>-->
						<i class="red">*</i>PassWord&nbsp;<input type="password" style="height:30px;width:400px;border-radius:6px;" id="password" name="password"><br/><br/>
<i class="red">*</i>Role　　　<select id="role" name="role" style="height:30px;width:400px;border-radius:6px;">
                                                        <option value="2" id = "option1">admin管理员</option>
                                                        <option value="3" selected="selected">engineer工程师</option>
                                                        <option value="4">aftersale售后</option>
                                                        </select><br/><br/>
						<input type="reset" name="reset" value="重置" />&nbsp;&nbsp;&nbsp;<input name="zc" type="submit" value="注册" onclick="chkinput()" />
					</div>
				</form>
            
            </div>
        </div>
       
    </div>
    <!--/main-->
</div>
<?php 
echo "<script>
function option(){
if('$username'!='admin'){
document.getElementById('option1').style.display='none';}
}</script>";
?>
</body>

</html>
