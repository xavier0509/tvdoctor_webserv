<?php 
 session_start();
    if (! (isset($_SESSION['username1']))){
      echo"<script> window.location.href='index.php';</script>";
    
     }
 ?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>TvDoctor</title>
    <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1">

    <!-- Link Swiper's CSS -->
    <link rel="stylesheet" href="css/swiper.min.css">
    <link rel="stylesheet" type="text/css" href="css/style.css">

     <script language="javascript" src="js/webclient.js" ></script>
    <script type="text/javascript" src="js/jquery-1.7.1.min.js" ></script>
    <script language=javascript src='js/ajaxfileupload.js' charset=\"utf-8\"></script>
    <script language=javascript src='js/logcat.js' charset=\"utf-8\"></script>
    <!-- Demo styles -->
     
</head>
<body>
<div id="box">
  <div id="input_top">
    <div class="menu" id="link">
      <input id="pushid"  autocomplete="off"  placeholder="请输入电视ID">
    &nbsp;<a onClick="disp_prompt()" style="cursor: pointer;">连接TV</a>
    </div>
    <div class="menu" id="break" style="display:none"><a id="breakLine" onClick="disconnect()">断开连接</a></div>
    <div class="menu" id="usermanage"><a href="transfor.php">用户管理</a></div>
    <input type="hidden"  id="pushid">
    <!-- <input type="button" value="确认" onclick="sendrequset()"> -->
    <div  id="span1" style="width:400px"></div>
    
  </div>
  <!-- <div id="infor" style="display:none">
    电视ID号：<input type="text" disabled="true">服务ID号：<input type="text" disabled="true">机芯型号：<input type="text" disabled="true"><br>
    系统版本：<input type="text" disabled="true">设备型号：<input type="text" disabled="true"><input type="button" value="切换设备"> <br>
    
       
  </div> -->
    <!-- Swiper -->
  <div class="swiper-container" style="margin-top:20px">
      <div class="swiper-wrapper">
          <div id="page1" >
            <div id="left">
	      <div id="tvinfo"></div><br/><br/>
              <img src="images/skyworthTV.png" width="100%" height="400">
              <div id="one" >
                  <!-- <a ><img src="http://172.20.115.136/TVDoctor/a.png"  width="100%" height="370" id="tvscrn"/></a> -->
            			<a ><img src="images/screenbg.jpg"  width="100%" height="370" id="tvscrn"/></a>
                		<!-- <a ><img src=""   width="550" height="370"/></a>    -->    	   	
            		
        			<div class="setting"></div>
        		  </div>
            </div>
            <div style="" id="control">
            <div id="mid" style="float:left">
            <div class="controls_ui" style="background:#333;border-radius:10px;">
              <table id="table1">
                <tr><td colspan="3"><div id="light"><div id="light2"></div></td></tr>
                <tr>
                  <td></td><td><button type="button" class="button roundbig" onclick ="keyUp()"><b>∧</b></button></td><td></td>
                </tr>
                <tr>
                  <td><button type="button" class="button roundbig" onclick ="keyLeft()"><b>＜</b></button></td>
                  <td><button type="button" class="button ok" onclick ="keyOk()"><b>OK</b></button></td>
                  <td><button type="button" class="button roundbig" onclick ="keyRight()"><b>＞&nbsp;</b></button></td>
                </tr>
                <tr>
                  <td></td><td><button type="button" class="button roundbig" onclick ="keyDown()"><b>∨</b></button></td><td></td>
                </tr>
                <tr>
                  <td><button type="button" class="button roundbig" style='font-size:10px' onclick ="keyBack()"><b>返回</b></button></td>
                  <td></td>
                  <td><button type="button" class="button roundbig" style='font-size:10px' onclick ="keyMeun()"><b>菜单</b></button></td>
                </tr>
                  <tr>
                      <td></td>
                   <td><button type="button" class="button roundbig" style='font-size:10px' onclick ="keyHome()"><b>主页</b></button></td>
                     <td></td>
                </tr>
                <tr>
                  <td><button type="button" class="button roundbig" style='font-size:15px' onclick ="keyVolumeDown()"><b>-</b></button></td>
                  <td></td>
                  <td><button type="button" class="button roundbig" style='font-size:15px' onclick ="keyVolumeUp()"><b>+</b></button></td>
                </tr>
              </table>
              <span style="color:#fff;margin-left:16px;margin-top:-100px"><font size="3px"><i>SKYWORTH</i></font></span>
            </div>
            </div>
      <div id="right" style="float:left;width:60%">
        <div class="controls_ui2">
          <div class="line1">
            <fieldset>
              <legend>截屏处理</legend>
            <div>
            
          <button type="button" class="button squarebig" id="scrn1" value="1" onclick="scrn('scrn1')"><b>一键截屏</b></button><br>
          <!-- <button type="button" class="button squarebig"  id="scrn2" value="7" onclick="scrn('scrn2')" style="clear:both"><b>每隔7s截一次屏</b></button> -->
          </div><span id="printTime">请输入时间间隔</span>
          <span id="print4to15">请输入4-15之间的时间间隔</span>
          <div style="margin-top:34px;padding-left:-300px">
          <form name="howlong" id="howlong">选择间隔时间开始截屏　
          <span style="position:absolute;border:1px solid #c1c1c1;overflow:hidden;width:88px;height:19px;clip:rect(-1px 90px 90px 70px);"> 
          <select name="aabb" id="aabb" style="width:91px;height:22px;margin:-2px;" 
          onChange="javascript:document.getElementById('ccdd').value=document.getElementById('aabb').options[document.getElementById('aabb').selectedIndex].value;"> 
          <!--下面的option的样式是为了使字体为灰色，只是视觉问题，看起来像是注释一样--> 
          <option value="" style="color:#c2c2c2;">---请选择---</option> 
          <option value="4">4</option> 
          <option value="6">6</option> 
          <option value="8">8</option> 
          <option value="10">10</option>
          <option value="12">12</option>
          <option value="14">14</option> 
          </select> 
          </span> 
          <span style="position:absolute;border-top:1pt solid #c1c1c1;border-left:1pt solid #c1c1c1;border-bottom:1pt solid #c1c1c1;width:70px;height:19px;"> 
          <input type="text"  name="ccdd" id="ccdd" value="6" style="width:70px;height:18px;border:0pt;">
          </span>

          </form></div>
          <div style="margin-top:15px;">
          <button name="ok" class="button squarebig" type="submit"  onclick="startscrn()" style="font-weight:bold;width:120px;"/>开始截屏</button>
          <button type="button" class="button squarebig"  id="stopscrn" value="1"  onclick="stopscrn()" ><b>停止截屏</b></button> 
          </div>
          </fieldset>
        </div>
          <!--button type="button" class="button squarebig" id="scrn2" value="2" onclick="scrn('scrn2')"><b>3秒截屏</b></button><br-->
          <div class="line2">

          <fieldset>
          <legend >日志处理</legend>            
          <button type="button" class="button squarebig" id="logcatButton" value="10" onclick="logcat()" ><b>抓取日志</b></button>
          <button type="button" class="button squarebig" id="logTimeButton" value="10" onclick="logcatTimeButton()" ><b>选择抓取时长</b></button>
          <form name="logTime" id="logTime">
          <span style="position:absolute;border:1px solid #c1c1c1;overflow:hidden;width:68px;height:19px;clip:rect(-1px 70px 70px 50px);"> 
          <select name="ab" id="ab" style="width:71px;height:22px;margin:-2px;" 
          onChange="javascript:document.getElementById('cd').value=document.getElementById('ab').options[document.getElementById('ab').selectedIndex].value;"> 
          <!--下面的option的样式是为了使字体为灰色，只是视觉问题，看起来像是注释一样--> 
          <option value="" style="color:#c2c2c2;">---请选择---</option> 
          <option value="15">15秒</option> 
          <option value="30">30秒</option> 
          <option value="45">45秒</option> 
          <option value="60">1分钟</option>
          <option value="180">3分钟</option>
          <option value="300">5分钟</option> 
          </select> 
          </span> 
          <span style="position:absolute;border-top:1pt solid #c1c1c1;border-left:1pt solid #c1c1c1;border-bottom:1pt solid #c1c1c1;width:50px;height:19px;"> 
          <input type="text"  name="cd" id="cd" value="30" style="width:50px;height:18px;border:0pt;">
          </span>
          </form>
          <button type="button" class="button squarebig"  id="stopButton" value="10" onclick="stoplogcat()" style="display:none"><b>停止抓取日志</b></button><br><br>
          <div id="logLoading" style="display:none;margin-top:0px margin-left:10px">
          <img  src="images/logloading.gif" width="80px";height="80px" style="margin-top:-30px;margin-left:40px">
          <div id ="snatchinfo" style="margin-top:0px;margin-left:80px">正在抓取日志</div>
          </div>
          <div id="achieve" style="margin-top:20px;display:none">正在获取中,请稍后...</div>
          </fieldset>
          </div>
          <div class="line3">

          <fieldset>
          <legend>文件处理</legend>
          <button type="button" class="button squarebig" onclick="down()"><b>文件下载</b></button>
          <button type="button" id="uploadButton" class="button squarebig" onclick="up()"><b>文件上传</b></button><br><br>
          <div id="download" style="clear:both;text-align:left;display:none">
            TV路径<!--<input style="width:60%"  id ="pullfiletvpath" />-->
          <form name="logTime" id="logTime">
          <span style="position:absolute;border:1px solid #c1c1c1;overflow:hidden;width:188px;height:19px;clip:rect(-1px 190px 190px 170px);"> 
          <select name="pullab" id="pullab" style="width:191px;height:22px;margin:-2px;" 
          onChange="javascript:document.getElementById('pullfiletvpath').value=document.getElementById('pullab').options[document.getElementById('pullab').selectedIndex].value;"> 
          <!--下面的option的样式是为了使字体为灰色，只是视觉问题，看起来像是注释一样--> 
          <option value="" style="color:#c2c2c2;">---请选择---</option> 
          <option value="/data/">/data/</option> 
          <option value="/system/vendor/app/">/system/vendor/app/</option> 
          <option value="/system/vendor/lib/">/system/vendor/lib/</option>
	  <option value="/data/screen.png">屏幕图片</option> 
          </select> 
          </span> 
          <span style="position:absolute;border-top:1pt solid #c1c1c1;border-left:1pt solid #c1c1c1;border-bottom:1pt solid #c1c1c1;width:170px;height:19px;"> 
          <input type="text"  name="pullfiletvpath" id="pullfiletvpath" value="/data/" style="width:170px;height:18px;border:0pt;">
          </span>
          </form>
            <br><br>
            <button type="button" class="button squarebig" id ="buttonDown" onclick="downloadfile()">开始下载</button>
          </div>
          <div id="upload" style="clear:both;text-align:left;display:none">                              
          上传文件：<input style="width:60%" type="file" name="upfile" id ="file" /> <br>
          TV路径  <!-- <input style="width:60%" id ="pushfiletvpath" /> -->
          <form name="logTime" id="logTime">
          <span style="position:absolute;border:1px solid #c1c1c1;overflow:hidden;width:188px;height:19px;clip:rect(-1px 190px 190px 170px);"> 
          <select name="pushab" id="pushab" style="width:191px;height:22px;margin:-2px;" 
          onChange="javascript:document.getElementById('pushfiletvpath').value=document.getElementById('pushab').options[document.getElementById('pushab').selectedIndex].value;"> 
          <!--下面的option的样式是为了使字体为灰色，只是视觉问题，看起来像是注释一样--> 
          <option value="" style="color:#c2c2c2;">---请选择---</option> 
          <option value="/data/">/data/</option> 
          <option value="/system/vendor/app/">/system/vendor/app/</option> 
          <option value="/system/vendor/lib/">/system/vendor/lib/</option> 
          </select> 
          </span> 
          <span style="position:absolute;border-top:1pt solid #c1c1c1;border-left:1pt solid #c1c1c1;border-bottom:1pt solid #c1c1c1;width:170px;height:19px;"> 
          <input type="text"  name="pushfiletvpath" id="pushfiletvpath" value="/data/" style="width:170px;height:18px;border:0pt;">
          </span>
          </form><br><br>
          <button type="button" class="button squarebig" id="buttonUpload"  onclick="FileUpload()">开始上传</button> 
          </div>
          </fieldset>
          </div>
  			</div>
  		</div>
      </div>
      <div class="swiper-button-next" id="nextButton1" onclick="page2()"></div>
      
    </div>
    <div  id="cmd" style="display:none">
	<div class="explain">
            <font face="隶书" size="+3"><b>调试窗口<br>操作说明：</b></font><br><hr>
            本页面仿命令提示符（cmd.exe）<br>
            旨在提供给工程师进行调试<br>
            在底端输入所需命令<hr>
            <img src="images/cmd.jpg" style="height:25px;width:25px">为设置按钮<br>
            可进行背景色，字体大小等设置<br><hr>
            <img src="images/change.png" style="height:25px;width:25px">为切换按钮<br>
            可在调试窗口与日志窗口间进行切换

        </div>
        <div id="container"> 
          <div id="title"><img src="images/cmd.jpg" style="height:25px;width:25px;margin:0 0 0 5px" onclick="openwin()"><img src="images/change.png" style="height:25px;width:25px;margin:5px 0 0 5px" onclick="page3()"><span class="setting">调试窗口</div>          
          <div id="divContent" style=" background: #000;"></div>
          <div id="divInput" onfocus="consolefocus()" onblur="newChg()"  onkeydown="return validate(event)" contenteditable="true">
              <!-- <input id="txtCmd" type="text"  onkeydown="return validate(event)"/>
              <input id="btnOK" type="button" value="确定" onclick="handleBtnClick()"/>
              <hr/> --><div id="inputcmd"><font color="#b3b3b3">在此输入命令</font></div>
          </div>
          <div id="dlgTest" class="dialog">
            <div class="dialog-title">设置</div>
            <div class="dialog-content">
                <form>字体大小
                  <span style="position:absolute;border:1px solid #c1c1c1;overflow:hidden;width:68px;height:19px;clip:rect(-1px 70px 70px 50px);"> 
                  <select name="fontsizeab" id="fontsizeab" style="width:71px;height:22px;margin:-2px;" 
                  onChange="javascript:document.getElementById('fontsizecd').value=document.getElementById('fontsizeab').options[document.getElementById('fontsizeab').selectedIndex].value;"> 
                  <!--下面的option的样式是为了使字体为灰色，只是视觉问题，看起来像是注释一样--> 
                  <option value="" style="color:#c2c2c2;">---请选择---</option> 
                  
                  <option value="12px">12px</option> 
                  <option value="14px">14px</option> 
                  <option value="16px">16px</option>
                  <option value="18px">18px</option>
                  <option value="20px">20px</option> 
                  </select> 
                  </span> 
                  <span style="position:absolute;border-top:1pt solid #c1c1c1;border-left:1pt solid #c1c1c1;border-bottom:1pt solid #c1c1c1;width:50px;height:19px;"> 
                  <input type="text"  name="fontsizecd" id="fontsizecd" value="16px" style="width:50px;height:18px;border:0pt;">
                  </span>
                  </form>
    
    <div style="margin-top:34px;">
          <form>字体颜色
                  <span style="position:absolute;border:1px solid #c1c1c1;overflow:hidden;width:68px;height:19px;clip:rect(-1px 70px 70px 50px);"> 
                  <select name="fontcolorab" id="fontcolorab" style="width:71px;height:22px;margin:-2px;" 
                  onChange="javascript:document.getElementById('fontcolorcd').value=document.getElementById('fontcolorab').options[document.getElementById('fontcolorab').selectedIndex].value;"> 
                  <!--下面的option的样式是为了使字体为灰色，只是视觉问题，看起来像是注释一样--> 
                  <option value="" style="color:#c2c2c2;">---请选择---</option> 
                  <option value="white">白色</option> 
                  <option value="red">红色</option> 
                  <option value="#00EE00">绿色</option> 
                  <option value="#0000EE">蓝色</option>
                  <option value="black">黑色</option>
                  
                  </select> 
                  </span> 
                  <span style="position:absolute;border-top:1pt solid #c1c1c1;border-left:1pt solid #c1c1c1;border-bottom:1pt solid #c1c1c1;width:50px;height:19px;"> 
                  <input type="text"  name="fontcolorcd" id="fontcolorcd" value="white" style="width:50px;height:18px;border:0pt;">
                  </span>
                  </form>
    </div>
    <div style="margin-top:34px;">
          <form>背景颜色
                  <span style="position:absolute;border:1px solid #c1c1c1;overflow:hidden;width:68px;height:19px;clip:rect(-1px 70px 70px 50px);"> 
                  <select name="backcolorab" id="backcolorab" style="width:71px;height:22px;margin:-2px;" 
                  onChange="javascript:document.getElementById('backcolorcd').value=document.getElementById('backcolorab').options[document.getElementById('backcolorab').selectedIndex].value;"> 
                  <!--下面的option的样式是为了使字体为灰色，只是视觉问题，看起来像是注释一样--> 
                  <option value="" style="color:#c2c2c2;">---请选择---</option> 
                  <option value="white">白色</option> 
                  <option value="red">红色</option> 
                  <option value="#00EE00">绿色</option> 
                  <option value="#0000EE">蓝色</option>
                  <option value="#000">黑色</option>
                  </select> 
                  </span> 
                  <span style="position:absolute;border-top:1pt solid #c1c1c1;border-left:1pt solid #c1c1c1;border-bottom:1pt solid #c1c1c1;width:50px;height:19px;"> 
                  <input type="text"  name="backcolorcd" id="backcolorcd" value="black" style="width:50px;height:18px;border:0pt;">
                  </span>
                  </form>
                  </div>
                    <br>
                <button onclick="changeStyle()" style="margin-left:40px;">确定</button>
            </div>
        </div> 

        </div>
     <!-- <div class="swiper-button-next" id="nextButton" onclick="page3()"></div>-->
      <div class="swiper-button-prev" id="prevButton"onclick="page1()"></div>
    </div>
    <div  id="logcat" style="display:none">
	<div class="explain">
            <font face="隶书" size="+3"><b>日志窗口<br>操作说明：</b></font><br><hr>
            本页面为日志窗口<br>
            提供给工程师进行日志查看<br>
            在底端输入所需命令<br>
	    输入框中键入Ctrl+C进行暂停<hr>
            <img src="images/cmd.jpg" style="height:25px;width:25px">为设置按钮<br>
            可进行背景色，字体大小等设置<br><hr>
            <img src="images/change.png" style="height:25px;width:25px">为切换按钮<br>
            可在调试窗口与日志窗口间进行切换

        </div>
        <div class="swiper-button-prev" id="prevButton"onclick="page1()"></div>
        <div id="container2"> 
          <div id="title2"><img src="images/cmd.jpg" style="height:25px;width:25px;margin:0 0 0 5px" onclick="openwin2()"><img src="images/change.png" style="height:25px;width:25px;margin:5px 0 0 5px" onclick="page2()"><span class="setting">日志窗口</span></div>          
          <div id="divContent2"></div>
          <div id="divInput2" onfocus="logcatconsolefocus()" onblur="newCh2()"  contenteditable="true">
              <!-- <input id="txtCmd" type="text"  onkeydown="return validate(event)"/>
              <input id="btnOK" type="button" value="确定" onclick="handleBtnClick()"/>
              <hr/> --><div id="inputcmd2"><font color="#b3b3b3">在此输入logcat命令</font></div>
          </div>
          
          <div id="dlgTest2" class="dialog">
            <div class="dialog-title">设置</div>
            <div class="dialog-content">
                <form>字体大小
                  <span style="position:absolute;border:1px solid #c1c1c1;overflow:hidden;width:68px;height:19px;clip:rect(-1px 70px 70px 50px);"> 
                  <select name="fontsizeab2" id="fontsizeab2" style="width:71px;height:22px;margin:-2px;" 
                  onChange="javascript:document.getElementById('fontsizecd2').value=document.getElementById('fontsizeab2').options[document.getElementById('fontsizeab2').selectedIndex].value;"> 
                  <!--下面的option的样式是为了使字体为灰色，只是视觉问题，看起来像是注释一样--> 
                  <option value="" style="color:#c2c2c2;">---请选择---</option> 
                  
                  <option value="12px">12px</option> 
                  <option value="14px">14px</option> 
                  <option value="16px">16px</option>
                  <option value="18px">18px</option>
                  <option value="20px">20px</option> 
                  </select> 
                  </span> 
                  <span style="position:absolute;border-top:1pt solid #c1c1c1;border-left:1pt solid #c1c1c1;border-bottom:1pt solid #c1c1c1;width:50px;height:19px;"> 
                  <input type="text"  name="fontsizecd2" id="fontsizecd2" value="16px" style="width:50px;height:18px;border:0pt;">
                  </span>
                  </form>
    
    <div style="margin-top:34px;">
          <form>字体颜色
                  <span style="position:absolute;border:1px solid #c1c1c1;overflow:hidden;width:68px;height:19px;clip:rect(-1px 70px 70px 50px);"> 
                  <select name="fontcolorab2" id="fontcolorab2" style="width:71px;height:22px;margin:-2px;" 
                  onChange="javascript:document.getElementById('fontcolorcd2').value=document.getElementById('fontcolorab2').options[document.getElementById('fontcolorab2').selectedIndex].value;"> 
                  <!--下面的option的样式是为了使字体为灰色，只是视觉问题，看起来像是注释一样--> 
                  <option value="" style="color:#c2c2c2;">---请选择---</option> 
                  <option value="white">白色</option> 
                  <option value="red">红色</option> 
                  <option value="green">绿色</option> 
                  <option value="blue">蓝色</option>
                  <option value="black">黑色</option>
                  
                  </select> 
                  </span> 
                  <span style="position:absolute;border-top:1pt solid #c1c1c1;border-left:1pt solid #c1c1c1;border-bottom:1pt solid #c1c1c1;width:50px;height:19px;"> 
                  <input type="text"  name="fontcolorcd2" id="fontcolorcd2" value="white" style="width:50px;height:18px;border:0pt;">
                  </span>
                  </form>
    </div>
    <div style="margin-top:34px;">
          <form>背景颜色
                  <span style="position:absolute;border:1px solid #c1c1c1;overflow:hidden;width:68px;height:19px;clip:rect(-1px 70px 70px 50px);"> 
                  <select name="backcolorab2" id="backcolorab2" style="width:71px;height:22px;margin:-2px;" 
                  onChange="javascript:document.getElementById('backcolorcd2').value=document.getElementById('backcolorab2').options[document.getElementById('backcolorab2').selectedIndex].value;"> 
                  <!--下面的option的样式是为了使字体为灰色，只是视觉问题，看起来像是注释一样--> 
                  <option value="" style="color:#c2c2c2;">---请选择---</option> 
                  <option value="white">白色</option> 
                  <option value="red">红色</option> 
                  <option value="green">绿色</option> 
                  <option value="blue">蓝色</option>
                  <option value="#000">黑色</option>
                  </select> 
                  </span> 
                  <span style="position:absolute;border-top:1pt solid #c1c1c1;border-left:1pt solid #c1c1c1;border-bottom:1pt solid #c1c1c1;width:50px;height:19px;"> 
                  <input type="text"  name="backcolorcd2" id="backcolorcd2" value="black" style="width:50px;height:18px;border:0pt;">
                  </span>
                  </form>
    </div>
    <br>
    <button onclick="changeStyle2()" style="margin-left:40px;">确定</button>
            </div>
        </div>
    </div>
    
            </div>  
          
          
        
        </div>
        </div>
        
      
    </div>
          
      </div>
      
      <!-- Add Arrows -->
      
  </div>
    <div id="welcome" >
      <?php
	//$username="222";
      $username=$_SESSION['username1'];
      if($username!=""){
        echo "&nbsp;<font  size='+1'>欢迎".$username."|<a href='logout.php' style='cursor:pointer; color:red'>退出</a><br>";
       // date_default_timezone_set("Asia/ShangHai");
        echo date("Y-m-d H:i");
        }else{
          echo "<span id='dl'><a href='index.php' style='cursor:pointer;)'><font  size='+1'>登录</span></font>";
          }
      include('showOrHidden.php');
      ?>    </div>


    
  </div>
  <!--<script type="text/javascript" src="js/mousewheel.js"></script>-->

    <!-- Swiper JS -->
    


</body>
</html>
