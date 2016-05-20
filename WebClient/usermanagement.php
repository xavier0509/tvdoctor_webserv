<?php 
@session_start();
 if (! (isset($_SESSION['username1']))){
          echo"<script> window.location.href='index.php';</script>";
        
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
<body>

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
            <div class="crumb-list" align="right"><span><?php echo "<font color='#FF0000' size='+1'>欢迎</font>".$username?></span></div>
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
                <h1>系统基本信息</h1>
            </div>
             <div class="result-content">
                <ul class="sys-info-list">
                	<li>
                    	<label class="res-lab">当前用户</label><span class="res-info"><?php $username=$_SESSION['username1'];
						echo $username ?></span>
                    </li>
                    <li>
                        <label class="res-lab">操作权限</label><span class="res-info">超级管理员</span>
                    </li>
                    <li>
                        <label class="res-lab">系统介绍</label><span class="res-info">远程控制是提供给工程师以及售后服务人员使用的一款系统，可实现异地远程控制，排除电视故障，获取日志文件等功能，免除上门维护的繁琐</span>
                    </li>
                    <li>
                        <label class="res-lab">系统版本</label><span class="res-info">v-0.1</span>
                    </li>
                    <li>
                        <label class="res-lab">北京时间</label><span class="res-info"><?php echo date("Y-m-d") ?></span>
                    </li> 
                    <li>
                        <label class="res-lab"></label><span class="res-info"></span>
                    </li>
                    <li>
                        <label class="res-lab"></label><span class="res-info"></span>
                    </li>
                </ul>
            
            </div>
        </div>
       
    </div>
    <!--/main-->
</div>
</body>

</html>
