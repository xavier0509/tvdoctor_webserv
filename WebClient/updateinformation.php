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
<script>
	function showdiv() {            
            document.getElementById('bg').style.display ='block';
            document.getElementById('show').style.display ='block';
	    }
       
function hidediv() {
            document.getElementById("bg").style.display ='none';
            document.getElementById("show").style.display ='none';
        }
</script>
<style type="text/css">
        #bg{ display: block;  position: absolute;  top: 0%;  left: 0%;  width: 100%;  height: 100%;  background-color: black;  z-index:1001;  -moz-opacity: 0.7;  opacity:.70;  filter: alpha(opacity=70);}
        #show{display: block;  position: absolute;  top: 25%;  left: 22%;  width: 53%;  height: 49%;  padding: 8px;  border: 8px solid #E8E9F7;  background-color: white;  z-index:1002;  overflow: auto;}
</style>
</head>
<body onload="altRows('inforTable')">

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
                    <a href="usermanagement.php"><i class="icon-font">&#xe003;</i>常用操作</a>
                    <ul class="sub-menu">
                         <li><a href="usermanagement.php"><i class="icon-font">&#xe008;</i>用户管理</a></li>
                        <li><a href="adduser.php"><i class="icon-font">&#xe008;</i>　　用户添加</a></li>
                        <li><a href="changeinformation.php"><i class="icon-font">&#xe008;</i>　　用户修改</a></li>
                        <!-- <li><a href=""><i class="icon-font">&#xe008;</i>　　权限修改</a></li> -->
                        
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
                <h1>用户信息修改</h1>
            </div>
             <div class="result-content">
<table id="inforTable" border="1" class="altrowstable" >
	<tr>
        <th height="25" width="125" align="center">用户名</th><th width="125" align="center">密码</th><th height="25" width="125" align="center">角色</th><th width="125">编辑</th><th width="125">删除</th>
    </tr>
    <tbody id="tablelsw"> 
    <?php 
     include("connect.php");
    // $arr=mysql_query("select * from user order by userId");
	if($username=='admin'){
                $arr=mysql_query("select A.userId, userName, password from user A inner join user_role B on A.userId = B.userId where B.roleId != 1 order by userName;");
        } else{
                $arr=mysql_query("select A.userId, userName, password from user A inner join user_role B on A.userId = B.userId where B.roleId != 1 and B.roleId != 2 order by userName;");
        }
     while($result=mysql_fetch_array($arr)){
	$myid=$result['userId'];
        //alert('$myid');
        $arr2=mysql_query("select roleName from role where roleId=(select roleId from user_role where userId= $myid )");
        $result2 = mysql_fetch_array($arr2);
    ?>
    <tr>
        <td height="25" align="center"><?php echo $result['userName'];?>&nbsp;</td>
        <td width="150" align="center"><?php echo $result['password'];?>&nbsp;</td>
        <td align="center"> <?php echo $result2['roleName'];?>&nbsp;</td>
        <td>
            <input type="hidden" name="userid" value="<?php echo $result['userId'];?>" />
            <div align="center">
            <a href="updateinformation.php?userid=<?php echo $result['userId'];?>"><img src="images/edit.png" width="20px";height="20px"></a></div>
        </td>
        
        <td>
        <form id="form1" name="form1" method="post" action="deleteuser.php">
            <input type="hidden" name="id2" value="<?php echo $result['userId'];?>" />
            <div align="center">
                <input name="Submit" type="submit"  value="删除" />
		<img src="images/delete.png" width="20px" height="20px">
        </form>
            </div>
        </td>
    </tr>
    <?php 
     }
    ?>
</tbody>
</table>
</div>
<span id="spanFirst">首页</span> <span id="spanPre">上一页</span> <span id="spanNext">下一页</span> <span id="spanLast">尾页</span> 第<span id="spanPageNum"></span>页/共<span id="spanTotalPage"></span>页
            
           
        
    <!--/main-->
</div>


<div id="bg"></div>
<div id="show">
  <form name="updateinformation" method="post" action="updateinformation_ok.php">
<table  align="center"> 
            
  <?php 
   include("connect.php");
   $id=$_GET['userid'];
   // echo $id;
   $arr=mysql_query("select * from user where userId='$id'");
   $arr2=mysql_query("select * from user_role where userId='$id'");
  // $arr3=mysql_query("select * from role_permission where userid='$id'");
   // $lis=mysql_num_rows($arr);
   //             echo $lis;            
   $result=mysql_fetch_array($arr);
   $result2=mysql_fetch_array($arr2);
   //$result3=mysql_fetch_array($arr3);

  ?>
        <!-- <tr>
          <td width="78" height="51" valign="bottom" style=" color:#F00">userid：</td>
           <td width="328" valign="bottom">
            <input name="name" type="text" size="40" value="<?php echo $result['userId'];?>"/>
            </td>
        </tr> -->
        <tr>
          <td width="90" height="51" valign="bottom" style=" color:#F00">用户名：</td>
           <td width="328" valign="bottom">
            <input name="name" type="text" size="40" value="<?php echo $result['userName'];?>"/>
            </td>
        </tr>
        <tr>
          <td width="90" height="51" valign="bottom" style=" color:#F00">密码：</td>
           <td width="328" valign="bottom">
            <input name="password" type="text" size="40" value="<?php echo $result['password'];?>"/>
            </td>
        </tr>
        <tr>
          <td width="78" height="51" valign="bottom" style=" color:#F00">角色：</td>
           <td width="328" valign="bottom">
            <select name="roleid">
              <option value="<?php echo $result2['roleId'];?>" size="40" selected="selected"><?php echo $result2['roleId'];?></option>
              <option value="2" id="option1">admin管理员</option>
              <option value="3">engineer工程师</option>
              <option value="4">aftersale售后</option>
            </select>
          
            </td>
        </tr>
     <!--   <tr>
          <td width="78" height="51" valign="bottom" style=" color:#F00">primission：</td>
           <td width="328" valign="bottom">
            <select name="permissionid">
              <option value="level1">最高权限(1级)</option>
              <option value="level2">2级权限</option>
              <option value="level3">3级权限</option>
            </select>
            
            </td>
        </tr> -->
<tr><td></td></tr>
        <tr>
          <td colspan="2" align="center">
            <input id="btnclose" type="button" value="取消" onclick="hidediv();"/>
           <input type="submit" name="Submit" value="保存" />
             <input type="hidden" name="id" value="<?php echo $result['userId'];?>" />
            </td>
            
         </tr>
             
          </table>
      </form>

</div>
<?php 
echo "<script>
function option(){
if('$username'!='admin'){
document.getElementById('option1').style.display='none';}
}</script>";
?>
</body>
<script language="javascript" src="js/page.js"> </script>
</html>
