
document.write("<script language=javascript src='js/httprequest.js' charset=\"utf-8\"></script>");
document.write("<script language=javascript src='js/crc32.js' charset=\"utf-8\"></script>");
document.write("<script language=javascript src='js/VncDataPackage.js' charset=\"utf-8\"></script>");
document.write("<script language=javascript src='js/jquery-1.7.1.min.js' charset=\"utf-8\"></script>");
document.write("<script language=javascript src='js/ajaxfileupload.js' charset=\"utf-8\"></script>");

var  httpurl = "http://223.202.11.125";
var  host = "ws://223.202.11.125:9000";
var  logcatHost ="ws://223.202.11.125:9005";

var   server_id = 0;
var   tv_id = 0;
var   sourceid =0;
var   telnetStart = false;
var   reciveBuffer ="";
var   isStartTelnetd =false;
var   socket;

var objContent = "";
var objInput = "";
var logcatContent = "";
var logcatInput = "";
var strCmd = "";
var g_isRunningOutput = true;
var g_cmdsIndex = 0;
var arrCmd = [];
var g_timer = null;
var inputcmd = "";
var inputcmd2 = "";

var KEYCODE_HOME =27;//102;
var KEYCODE_MENU =26;//139; 
var KEYCODE_DPAD_UP =21;//103;
var KEYCODE_DPAD_DOWN =22;//108;
var KEYCODE_DPAD_LEFT =23;//105;
var KEYCODE_DPAD_RIGHT =24;//106;
var KEYCODE_DPAD_BACK =25;
var KEYCODE_DPAD_CENTER =19;//28;
var KEYCODE_DPAD_VOLUME_UP =15;
var KEYCODE_DPAD_VOLUME_DOWN =16;

var  subinfo = "";
var  buttonUpload = "";
var  g_isConnectd =false;
var  isStartLogcatSocket = false;
var  isStopScrn = false;//是否已停止截屏

var  interval;
var  loadingTime;
var  downloadfilename = "";
var  controlInterval;

window.onload =  function ()
{
  inputcmd = document.getElementById('inputcmd');
  inputcmd2 = document.getElementById('inputcmd2');
  objContent = document.getElementById("divContent");
  objInput = document.getElementById("divInput"); 
  logcatContent = document.getElementById("divContent2");
  logcatInput = document.getElementById("divInput2");
  subinfo =document.getElementById('span1');
  buttonUpload =document.getElementById('buttonUpload');
  tvinfo = document.getElementById('tvinfo');
 // altRows('inforTable');
}


function   requestConnectTv()
{
  var   result = sendrequset();
}

function connect()
{
	try
	{
	//	OutputLog('why:'+socket.readyState);
		socket = new WebSocket(host);
		OutputLog('Socket Status: '+socket.readyState);
		socket.onopen = function()
		{

			sourceid = Math.random()*1000+"1"; 
      sourceid =crc32_hash(sourceid);       
      OutputLog("sourceid ="+sourceid);
      setTargetAndSource(sourceid,0x00000000);
      setCommandId(CMD_REG_PC,0);//向服务器注册 
      var msg1 = $('#pushid').val();
      var msg = msg1.toLocaleUpperCase();
      setStringParam(msg);/*"c539a58d1c092d0cb90317fd8cc64a97"*/
      socket.send(assemblingProtocol());
		}
		socket.onmessage = function(msg)
		{
			var str = "";
			str = msg.data;
			var   len = str.size;
      OutputLog("message len="+len);
      var reader = new FileReader();
      reader.readAsBinaryString(str);
    	reader.onload = function()
		  {
         var   text =reader.result;
         var  packpagelen =(text.charCodeAt(0) << 24 ) | (text.charCodeAt(1) <<16  ) | (text.charCodeAt(2) << 8) |text.charCodeAt(3);
     	    OutputLog("len ="+len+", packpagelen ="+packpagelen);	
         if (packpagelen >= len )
         {
           var  buffer = text.substr(4,(packpagelen-4));
           decodeProtocol(buffer);
 
          if (CMD_TELLME_SRV_ID ==getCommand()) 
          {          
            server_id = getBuferParam();
            OutputLog("server  id ="+server_id);
          } 
          else if (CMD_TELLME_TV_ID == getCommand()) 
          {//解决有可能收不到TVid的时候 还继续在发命令
             g_isConnectd = true;
             clearInterval(interval);
             subinfo.innerHTML="连接成功";
             controlInterval =  setInterval("controling()",800);
             tv_id = getBuferParam();
             OutputLog("TV  id ="+tv_id);
	     getTvinfo();
          }
          else if (CMD_USER_REFUSED ==  getCommand())
          {
          	//用户拒绝请求
            subinfo.innerHTML="<font color='red'>用户已拒绝接受请求！</font>";
            disconnect();
          }
          else if (CMD_TELNET_DATA == getCommand())
          {
         		var  data = getBuferParam();
          	if (!telnetStart)
          	{
  			        var index = text.indexOf('#');    //text.indexOf('\r\r\n');     
  			        if (index >= 0)
                {
                  telnetStart =true;  
                  strCmd = data;//text;
                //  arrCmd.push(data);
                  exeCmd();
                  setInnerText(objInput, "");
                } 
                else
                {


                }
          	}
          	else   
            {
                strCmd = data;
                //arrCmd.push(data);
                exeCmd();
                setInnerText(objInput, "");
            }     
             	 
          }
          else if (RET_SNATCH_LOG == getCommand()) 
          {
            var   result = getBuferParam();
            OutputLog("snatch  log  status ="+result);
            if (result != 0) 
            {
              OutputLog("setTimeout============");
              document.getElementById('achieve').innerHTML = "日志文件获取失败!";
              var  t1 =setTimeout(showlogcatResultInfo,3000);                  
            }
          }
          else if (CMD_NOTIFY_DOWNLOADLOGFILE == getCommand())//下载日志文件
          {
            document.getElementById('achieve').innerHTML = "";
            var   url = getBuferParam();
            url = url.replace(/\//g,"@");
            OutputLog("download  logcat  file ="+url);

            window.open(httpurl+"/downloaddeal.php?filepath="+url+"&filename="); 
          }
          else if (CMD_NOTIFY_DOWNLOADFILE == getCommand() ) //下载普通文件
          {
            var   url = getBuferParam();
            url = url.replace(/\//g,"@");
            OutputLog("download  file ="+url);
            window.open(httpurl+"/downloaddeal.php?filepath="+url+"&filename="+downloadfilename); 
          }
          else if (CMD_ANOTHER_PC_CTRL == getCommand()) //新PC登录，通知旧PC退出
          {
           	g_isConnectd =false;
		 subinfo.innerHTML="<font color='red'>用户接受新PC连接，您被迫下线</font>";
          }
          else if (CMD_NOTIFY_SHOWPHOTO == getCommand())  //显示截取的图片
          {
            if (loadingTime != undefined)
            {
              clearTimeout(loadingTime);
            }
            if (isStopScrn)
            {
               OutputLog(" isStopScrn is  stop");
              return ;
            }
            var   url = getBuferParam();
		        OutputLog("photo path="+url);
            url =url.replace("/usr/share/nginx/html",httpurl);///var/www/
            OutputLog("photo path= ="+url);
            document.getElementById('tvscrn').src =url;
          }
          else if (CMD_NOTIFY_TV_OFFLINE == getCommand())  //tv已和服务器断开
          {	
		g_isConnectd =false;
            	document.getElementById('link').style.display="block";
            	document.getElementById('break').style.display="none";
		clearInterval(controlInterval);
		document.getElementById('tvscrn').src="images/screenbg.jpg";
		subinfo.innerHTML="<font color='red'>远程TV主动断开控制！</font>";
		tvinfo.innerHTML="";
          }
          else if(RET_REMOTE_PUSH_FILE == getCommand()) //文件是否上传成功
          {
              var   result = getBuferParam();
              if ( result  == 0 ) //成功
              {
                buttonUpload.innerHTML = "上传到TV成功";
              } 
              else if (-1 == result)//权限错误
              {
                buttonUpload.innerHTML = "上传到TV失败，权限不够";
              }
              else if (-2 == result) //空间不足
              {
                buttonUpload.innerHTML = "上传到TV失败，空间不足";
              }
              else// (-3 == result) //其他错误
              {
                buttonUpload.innerHTML = "上传到TV失败,错误码是"+result;
              }
	      setTimeout("buttonUpload.innerHTML='开始上传'",1000);
          }
          else if (RET_REMOTE_PULL_FILE == getCommand()) 
          {
             var   result = getBuferParam();
             if (0 == result )
             {
              document.getElementById('buttonDown').innerHTML ="请求完成";
	      setTimeout("document.getElementById('buttonDown').innerHTML ='下载'",1000);
             }
             else
             {
              document.getElementById('buttonDown').innerHTML ="您要下载的文件出错了,错误码是："+result;
             }
          }
          else if (RET_LOGCAT_START_SNATCH == getCommand()) 
          {
              var   result = getBuferParam();//连接是否OK
              OutputLog("TV  connnect logcat  status="+result);
          }
	  else if(RET_GET_TV_INFO == getCommand())
          {
              var result = getBuferParam();
              OutputLog("TV info:"+result);
              var node = JSON.parse(result);
	if(node.model!=""){
              var model = node.model;}
	else{var model="暂时无法获取到该信息";}
	if(node.type!=""){
              var type = node.type;}
	else{var type="暂时无法获取到该信息"; }
	if(node.version!=""){
              var version = node.version;}
	else{var version="暂时无法获取到该信息";}
	if(node.size!=""){
              var size = node.size;}
	else{var size="暂时无法获取到该信息";}
	      tvinfo.innerHTML="<font face='隶书' size='+2'>本机信息：</font><br/>机芯："+model+";机型:"+type+";版本:"+version+";屏幕尺寸:"+size; 
          }
          else 
          {

          }
         } 
         else 
         {

         }
		  
		      }     							
		}

	socket.onclose = function()
	{
   // g_isConnectd =false;
   // isStartLogcatSocket =false;
   // subinfo.innerHTML = "<font color='red'>PC与和服务器断开链接！</font>";
	clearInterval(controlInterval);
	clearInterval(interval);
	subinfo.innerHTML = "<font color='red'>WebSocket与服务器断开！</font>"
	document.getElementById('tvscrn').src="images/screenbg.jpg";
	document.getElementById('link').style.display="block";
	tvinfo.innerHTML="";
            document.getElementById('break').style.display="none";
		OutputLog('Socket Status111111: '+socket.readyState+' (Closed)');
	}	
	 socket.onerror =function(event)
   {
      g_isConnectd =false;
      isStartLogcatSocket =false;
      subinfo.innerHTML = "<font color='red'>WebSocket连接出错！</font>";
      OutputLog('WebSocket Status:: Error was reported');
   }		
			
	} 
	catch(exception)
	{
    g_isConnectd =false;
    isStartLogcatSocket =false;
		OutputLog('Error'+exception);
	}			
}


function  showlogcatResultInfo()
{
  OutputLog("===============");
  document.getElementById('achieve').innerHTML = "";
}
function disconnect()
{
  $("#break").toggle();
  $("#link").toggle();
   clearInterval(controlInterval);
   clearInterval(interval);
   document.getElementById('tvscrn').src="images/screenbg.jpg";
   document.getElementById('upload').style.display="none";
   document.getElementById('download').style.display="none";
   tvinfo.innerHTML="";
   g_isConnectd = false;
   isStartLogcatSocket =false;
   isStartTelnetd = false;
   if (logcatsocket !=undefined) 
    {
      logcatsocket.close();
    }
   socket.onerror=null;
   socket.onclose=null; 
   socket.close();
   subinfo.innerHTML = "<font color='red'>PC主动断开远程控制！</font>";
 // setTargetAndSource(sourceid,tv_id); //主动与服务器断开链接
 // setCommandId(CMD_PC_NEED_EXIT,0);
  //socket.send(assemblingProtocol());

}

//解决需要右键才能获取cmd输入框的bug
function consolefocus()
{
	inputcmd.style.display="none";
	if (!isStartTelnetd)
	{
		isStartTelnetd = true;
    setTargetAndSource(sourceid,tv_id);
    setCommandId(CMD_START_TELNETD,0);
    socket.send(assemblingProtocol());
	}
  //objInput.focus();
}

function newChg()
{
  inputcmd.style.display="block";
}
function newCh2()
{
  inputcmd2.style.display="block";
}
//---------------------------cmd窗口----------------------------
//--------------------------------------------------------------
function exeCmd()
{
  if(g_isRunningOutput)
  {
    println(strCmd);//"skyworth:#" + 
  }
}

function println(str) 
{
    var objDIV = document.createElement("div");
    if (objDIV.innerText != null)
        objDIV.innerText = str;
    else
        objDIV.textContent = str;
    objContent.appendChild(objDIV);
    objContent.scrollTop = objContent.scrollHeight;
}

function validate(e)
{
    var theEvent = window.event || e;
    var keycode=theEvent.which;
    if(keycode == "13") //回车
    {
        g_isRunningOutput = true;
       var  data= getInnerText(objInput);
        data = trim(data);
       if (/*(data.length == 6) && */(data.substr(0,6) == "logcat")) 
        {
          //alert("请输入过滤条件,如logcat |grep ***");
          //alert("如果想输入logcat请切换到日志窗口");
          strCmd = "如果想输入logcat请切换到日志窗口";
         // arrCmd.push(strCmd);
          exeCmd();
          setInnerText(objInput, "");
          return ;
        }
    
        if (data.length == 0)
        {
            if (!isStartTelnetd)
            {
              isStartTelnetd = true;
              setTargetAndSource(sourceid,tv_id);
              setCommandId(CMD_START_TELNETD,0);
              socket.send(assemblingProtocol());
            }
            else
                return;
        }
       arrCmd.push(data);
       // strCmd = data;  
        //exeCmd();
      data +="\r\n";      
      
		  setTargetAndSource(sourceid,tv_id);//发送telnet命令
      setCommandId(CMD_TELNET_DATA,0);
      setStringParam(data);
      socket.send(assemblingProtocol());	
      setInnerText(objInput, "");
      return false;
    }
    else if(keycode == "38" || keycode == "40") //上下键
    {
        var len = parseInt(arrCmd.length);
        if(g_cmdsIndex < len)
        {
            setInnerText(objInput, "");
            setInnerText(objInput, arrCmd[g_cmdsIndex]);
            g_cmdsIndex++;
        }
        else
        {
            g_cmdsIndex = 0;
        }

    }
    else if (theEvent.ctrlKey && keycode=="67") //ctrl+C   "67"
    {
          strCmd = "终端已停止输入,按回车键重新获取终端输入";
         // arrCmd.push(strCmd);
          exeCmd();
          setInnerText(objInput, "");
          setTargetAndSource(sourceid,tv_id);
          setCommandId(CMD_STOP_TELNETD,0);
          socket.send(assemblingProtocol());
          isStartTelnetd = false;
    };
}

function getInnerText(element) 
{
    return (typeof element.value == "string") ? element.value : element.innerText;
}

function setInnerText(element, text) 
{
  if (typeof element.textContent == "string") 
  {
    element.textContent = text;
  } 
  else
 {
    element.innerText = text;
  }
}
//setInnerText(objInput, "");

function OutputLog(msg)
{
	 console.log(msg);
}
function trim(str)
{
   str = str.replace(/^(\s|\u00A0)+/,'');
   var len = str.length -1;
   for (var i = len; i >= 0;  i--) 
   {
    if(/\S/.test(str.charAt(i)))
    {   
    str = str.substring(0,i+1);
    break;
     }
   }
   return str;
}


//------------------------------截屏----------------------
//--------------------------------------------------------
function scrn(x)
{

  if (!g_isConnectd)
   {
     subinfo.innerHTML="<font color='red'>请连接TV后操作</font>";
     return ;
   }
   isStopScrn = false;
   if (loadingTime  != undefined) 
   {
    clearTimeout(loadingTime);
   }  
   loadingTime =setTimeout("hiddenLoading()",60000);
	 document.getElementById('tvscrn').src="images/loading.gif";
   setTargetAndSource(sourceid,tv_id);
   var  tag =Math.random()*10;
  if ("scrn2"  == x) 
  {
    setCommandId(CMD_PRINTE_CONTINUE_SCREEN,tag);
    var time = document.getElementById('ccdd').value;
    OutputLog("scrn   time ="+time);
    setIntegerParam(time);
  }
  else if ("scrn1" == x) 
  { 
   setCommandId(CMD_PRINTE_SCREEN,tag);   
  }
  socket.send(assemblingProtocol());
}

function hiddenLoading()
{
  document.getElementById('tvscrn').src="images/fail.jpg";
  setTimeout("document.getElementById('tvscrn').src='images/screenbg.jpg'",3000)
}

function stopscrn()
{
    isStopScrn = true;
    document.getElementById('tvscrn').src="images/screenbg.jpg";
    setTargetAndSource(sourceid,tv_id);
    setCommandId(CMD_STOP_SCREEN,0);
    socket.send(assemblingProtocol());
}

function getTvinfo(){
   setTargetAndSource(sourceid,tv_id);
   setCommandId(CMD_GET_TV_INFO,0);
   socket.send(assemblingProtocol())
}

function logcat()
{
   if (!g_isConnectd) 
    {
      subinfo.innerHTML="<font color='red'>请连接TV后操作</font>";
      return ;
    };
    $("#logcatButton").toggle();
    $("#stopButton").toggle();
    $("#logLoading").toggle();
    $("#logTimeButton").toggle();
    $("#logTime").toggle();
    document.getElementById('achieve').style.display="none";
    setTargetAndSource(sourceid,tv_id);
    setCommandId(CMD_START_SNATCH_LOG,0);
   // setCommandId(CMD_SNATCH_LOG,0);
   // setIntegerParam(50);//抓取的时间s
    socket.send(assemblingProtocol());
  }

function hiddenloadingLogcat()
{
   $("#logLoading").toggle();
   $("#logcatButton").toggle();
   $("#logTimeButton").toggle();
   $("#logTime").toggle();
}

function logcatTimeButton()
{
   if (!g_isConnectd) 
    {
      subinfo.innerHTML="<font color='red'>请连接TV后操作</font>";
      return ;
    };
    $("#logcatButton").toggle();
    //$("#stopButton").toggle();
    $("#logLoading").toggle();
    $("#logTimeButton").toggle();
    $("#logTime").toggle();
   //  $("#stopButton").toggle();
   // document.getElementById('stopButton').style.display='none';
    var  time =document.getElementById('cd').value;
    OutputLog("select time ="+time);
    document.getElementById('achieve').style.display="none";
    setTimeout(hiddenloadingLogcat,time*1000);
    
    setTargetAndSource(sourceid,tv_id);
    setCommandId(CMD_SNATCH_LOG,0);
 
    setIntegerParam(time);//抓取的时间s
    socket.send(assemblingProtocol());
}

function stoplogcat()
{
    $("#logcatButton").toggle();
    $("#stopButton").toggle();
    $("#logLoading").toggle();
    $("#logTimeButton").toggle();
    $("#logTime").toggle();
    document.getElementById('achieve').style.display="block";
    setTargetAndSource(sourceid,tv_id);
    setCommandId(CMD_STOP_SNATCH_LOG,0);
    socket.send(assemblingProtocol());
}

 function keyBack()
 {
    if (!g_isConnectd)
   {
     subinfo.innerHTML="<font color='red'>请连接TV后操作</font>";
     return ;
   }
    document.getElementById('light').style.background="red";
    setTimeout("$('#light').toggle()",70);
    setTimeout("$('#light').toggle();document.getElementById('light').style.background='#660000';",80);
    setTargetAndSource(sourceid,tv_id);
    setCommandId( CMD_SEND_VIRKEY,0);
    setIntegerParam(KEYCODE_DPAD_BACK);//键值码   keycode
    socket.send(assemblingProtocol());
 }

  function keyHome()
  {
    if (!g_isConnectd)
   {
     subinfo.innerHTML="<font color='red'>请连接TV后操作</font>";
     return ;
   }
    document.getElementById('light').style.background="red";
    setTimeout("$('#light').toggle()",70);
    setTimeout("$('#light').toggle();document.getElementById('light').style.background='#660000';",80);
    setTargetAndSource(sourceid,tv_id);
    setCommandId( CMD_SEND_VIRKEY,0);
    setIntegerParam(KEYCODE_HOME);//键值码   keycode
    socket.send(assemblingProtocol());
  }

  function keyMeun()
  {
    if (!g_isConnectd)
   {
     subinfo.innerHTML="<font color='red'>请连接TV后操作</font>";
     return ;
   }
    document.getElementById('light').style.background="red";
    setTimeout("$('#light').toggle()",70);
    setTimeout("$('#light').toggle();document.getElementById('light').style.background='#660000';",80);
    setTargetAndSource(sourceid,tv_id);
    setCommandId( CMD_SEND_VIRKEY,0);
    setIntegerParam(KEYCODE_MENU);//键值码   keycode
    socket.send(assemblingProtocol());
  }

  function keyDown()
  {
    if (!g_isConnectd)
   {
     subinfo.innerHTML="<font color='red'>请连接TV后操作</font>";
     return ;
   }
    document.getElementById('light').style.background="red";
    setTimeout("$('#light').toggle()",70);
    setTimeout("$('#light').toggle();document.getElementById('light').style.background='#660000';",80);
    setTargetAndSource(sourceid,tv_id);
    setCommandId( CMD_SEND_VIRKEY,0);
    setIntegerParam(KEYCODE_DPAD_DOWN);//键值码   keycode
    socket.send(assemblingProtocol());
  }

  function keyRight()
  {
    if (!g_isConnectd)
   {
     subinfo.innerHTML="<font color='red'>请连接TV后操作</font>";
     return ;
   }
    document.getElementById('light').style.background="red";
    setTimeout("$('#light').toggle()",70);
    setTimeout("$('#light').toggle();document.getElementById('light').style.background='#660000';",80);
    setTargetAndSource(sourceid,tv_id);
    setCommandId( CMD_SEND_VIRKEY,0);
    setIntegerParam(KEYCODE_DPAD_RIGHT);//键值码   keycode
    socket.send(assemblingProtocol());
  }

  function keyOk()
  {
    if (!g_isConnectd)
   {
     subinfo.innerHTML="<font color='red'>请连接TV后操作</font>";
     return ;
   }
    document.getElementById('light').style.background="red";
    setTimeout("$('#light').toggle()",70);
    setTimeout("$('#light').toggle();document.getElementById('light').style.background='#660000';",80);
    setTargetAndSource(sourceid,tv_id);
    setCommandId( CMD_SEND_VIRKEY,0);
    setIntegerParam(KEYCODE_DPAD_CENTER);//键值码   keycode
    socket.send(assemblingProtocol());
  }

  function keyLeft()
  {
    if (!g_isConnectd)
   {
     subinfo.innerHTML="<font color='red'>请连接TV后操作</font>";
     return ;
   }
    document.getElementById('light').style.background="red";
    setTimeout("$('#light').toggle()",70);
    setTimeout("$('#light').toggle();document.getElementById('light').style.background='#660000';",80);
    setTargetAndSource(sourceid,tv_id);
    setCommandId( CMD_SEND_VIRKEY,0);
    setIntegerParam(KEYCODE_DPAD_LEFT);//键值码   keycode
    socket.send(assemblingProtocol());
  }

  function  keyUp()
  {
    if (!g_isConnectd)
   {
     subinfo.innerHTML="<font color='red'>请连接TV后操作</font>";
     return ;
   }
    document.getElementById('light').style.background="red";
    setTimeout("$('#light').toggle()",70);
    setTimeout("$('#light').toggle();document.getElementById('light').style.background='#660000';",80);
    setTargetAndSource(sourceid,tv_id);
    setCommandId( CMD_SEND_VIRKEY,0);
    setIntegerParam(KEYCODE_DPAD_UP);//键值码   keycode
    socket.send(assemblingProtocol());
  }

function  keyVolumeDown()
{
    if (!g_isConnectd)
   {
     subinfo.innerHTML="<font color='red'>请连接TV后操作</font>";
     return ;
   }
    document.getElementById('light').style.background="red";
    setTimeout("$('#light').toggle()",70);
    setTimeout("$('#light').toggle();document.getElementById('light').style.background='#660000';",80);
    setTargetAndSource(sourceid,tv_id);
    setCommandId( CMD_SEND_VIRKEY,0);
    setIntegerParam(KEYCODE_DPAD_VOLUME_DOWN);//键值码   keycode
    socket.send(assemblingProtocol());
}

function keyVolumeUp()
{
    if (!g_isConnectd)
   {
     subinfo.innerHTML="<font color='red'>请连接TV后操作</font>";
     return ;
   }
    document.getElementById('light').style.background="red";
    setTimeout("$('#light').toggle()",70);
    setTimeout("$('#light').toggle();document.getElementById('light').style.background='#660000';",80);
    setTargetAndSource(sourceid,tv_id);
    setCommandId( CMD_SEND_VIRKEY,0);
    setIntegerParam(KEYCODE_DPAD_VOLUME_UP);//键值码   keycode
    socket.send(assemblingProtocol());
}

function downloadfile()
{
   if (!g_isConnectd)
   {
     document.getElementById('buttonDown').innerHTML ="请先连上TV";
     return ;
   }
   var  path = document.getElementById('pullfiletvpath').value;
   var   dd =  path.substr((path.lastIndexOf('/')),path.length) ;
   OutputLog("dd="+dd);
   if ( dd== '/') 
   {
      document.getElementById('buttonDown').innerHTML ="请输入要下载的文件名称";
      return ;
   }
   downloadfilename =path.substr((path.lastIndexOf('/')+1),path.length) ;
   OutputLog("TV path ="+path);
   document.getElementById('buttonDown').innerHTML ="正在请求中";
   setTargetAndSource(sourceid,tv_id);
   setCommandId( CMD_REMOTE_PULL_FILE,0);  
   setStringParam(path);
   socket.send(assemblingProtocol());
}


function disp_prompt()
{
  var pushid2 = document.getElementById("pushid").value;
  var pushid = pushid2.toLocaleUpperCase();
  if(pushid!=""&&pushid!=null)
  {   
     // subinfo.innerHTML="正在连接中";
   clearInterval(interval);
   interval=setInterval("linking()",800);      
    sendrequset();
  //document.getElementById("span1").style.display="block";
  }
  else
  {
     subinfo.innerHTML="<font color='red'>请输入电视ID</font>";
     //setTimeout("document.getElementById('span1').style.display='none'",3000);

  // alert("服务ID为空，请重新输入");
  }
}

var push_flag=0;
var push_value=["",".","..","..."];
function linking()
{
  subinfo.innerHTML="正在连接中"+push_value[push_flag];
  if((push_flag+1)<push_value.length)
  {
    push_flag++
  }
  else
  {
    push_flag=0;
  }
}
var c_flag=0;
var c_value=["",".","..","..."];
function controling()
{
  clearInterval(interval);
  subinfo.innerHTML="正在远程控制TV"+c_value[c_flag];
  if((c_flag+1)<c_value.length)
  {
    c_flag++
  }
  else
  {
    c_flag=0;
  }
}

function down()
{
  if (!g_isConnectd) 
    {
      subinfo.innerHTML="<font color='red'>请连接TV后操作</font>";
      return ;
    };
  
  document.getElementById('upload').style.display="none";
  $("#download").toggle();
  
}

function up()
{
  if (!g_isConnectd) 
    {
      subinfo.innerHTML="<font color='red'>请连接TV后操作</font>";
      return ;
    };
  document.getElementById('download').style.display="none";
  $("#upload").toggle();
}

function page1()
{
  document.getElementById('page1').style.display="block";
  document.getElementById('cmd').style.display="none";
  document.getElementById('logcat').style.display="none";
}

function page2()
{
  document.getElementById('page1').style.display="none";
  document.getElementById('cmd').style.display="block";
  document.getElementById('logcat').style.display="none";
}

function page3()
{
  document.getElementById('page1').style.display="none";
  document.getElementById('cmd').style.display="none";
  document.getElementById('logcat').style.display="block";
}

function chkinput()
{
    var form=document.getElementById("form_zc");

   // if(form.userid.value=="")
   // {
   //     alert("请输入用ID");      
   //   return(false);
   // }
   if(form.username.value=="")
    {
        alert("请输入用户名");
      
      return(false);
   }
  else if(form.password.value=="")
  {
      alert("请输入密码！");    
      return(false);
  } 
  else 
  {      
   get_form();
  }       
    function get_form()
    {    
    //alert("b");
    form_zc.action="doRegister.php";
    form_zc.method="get";
    form_zc.submit();
    //alert("a");     
    }
}

function chkinput1()
{
  
  var form=document.getElementById("form_login");
  if(form.username1.value=="")
  {
     alert("请输入用户名");      
      return(false);
  }
  else if(form.password1.value=="")
  {
      alert("请输入密码！");      
      return(false);
  }   
   else
   {      
   get_form();
  } 
      
      function get_form(){    
      //alert("b");
      form_login.action="doLogin.php";
      form_login.method="get";
      form_login.submit();
      //alert("a");     
      }
}

function FileUpload()
{
   if (!g_isConnectd)
   {
     buttonUpload.innerHTML ="请先连上TV";
     return ;
   }

    var name =document.getElementById('file').value;
    if (name.length == 0) 
    {
       buttonUpload.innerHTML = "请选择要上传的文件！";
       return  ;
    }
    var tvpath =document.getElementById('pushfiletvpath').value;
    if (tvpath.length == 0) 
    {
       buttonUpload.innerHTML = "请选择要上传到TV的路径！";
       return  ;
    }

    name = name.substring((name.lastIndexOf('\\')+1),name.length);//取上传的文件名
    OutputLog("uploadfile ===========file name="+name);

   $.ajaxFileUpload (
   {
     url:'doajaxfileupload.php', //你处理上传文件的服务端
     type:'post',
     secureuri:false, 
     fileElementId:'file',//与页面处理代码中file相对应的ID值
     dataType: 'json', //返回数据类型:text，xml，json，html,scritp,jsonp五种
    success: function (data,status) 
    {
      OutputLog("uploadfile after===========data.file_result=" + data.file_result);
      if (typeof (data.file_result) != 'undefined')
      {    
        if (data.file_result == 'ok') 
         {               
            OutputLog("uploadfile upload ok===========data.file_path=" + data.file_path + ", data.file_size = " + data.file_size);
          
           if(tvpath.substr((tvpath.length -1),1) != '/')
            {
            	tvpath+='\/';
            }
           // var  vvname =data.file_path.substring((data.file_path.indexOf('_')+1),data.file_path.length);
             tvpath +=name;
            var  array ={"server-url":data.file_path,"tv-path":tvpath,"file-size":data.file_size};
            var  jsstring =JSON.stringify(array);
            OutputLog("encode json ="+jsstring); 
            setTargetAndSource(sourceid,tv_id);
            setCommandId(CMD_REMOTE_PUSH_FILE,0);
            setKeyValueParam(jsstring);
            buttonUpload.innerHTML = "上传到服务器成功";
            socket.send(assemblingProtocol());
         }
         else
         {  //上传失败
           buttonUpload.innerHTML = "上传到服务器失败";
           OutputLog("uploadfile upload error===========data.file_error = "+ data.file_error + ", data.file_path = " + data.file_path);
         }  
       }
  },
   error: function(data, status, e)
   { 
     OutputLog("uploadfile upload error===========e"+e);
     //上传失败
     buttonUpload.innerHTML = "上传到服务器失败,错误码是:"+e;
     OutputLog("uploadfile upload error===========data.file_error="+data.file_error+"data.file_path="+data.file_path);
     // alert(e);
    }

 });
  buttonUpload.innerHTML = "正在上传中";

}

function hidden()
{
  document.getElementById('printTime').style.display='none';
  document.getElementById('print4to15').style.display='none'
}

function startscrn()
{
  if (!g_isConnectd) 
    {
      subinfo.innerHTML="<font color='red'>请连接TV后操作</font>";
      return ;
    };
  var howlong=document.getElementById('ccdd').value;
  var time=parseInt(howlong);
  //alert(time);
  if (howlong=="") {
    document.getElementById('printTime').style.display="block";
    document.getElementById('print4to15').style.display="none";
    setTimeout("hidden()",4000);
  }
  else
  {
    if (time>3 && time<16) 
    {
      document.getElementById('printTime').style.display="none";
      document.getElementById('print4to15').style.display="none";
      scrn('scrn2');
    }
    else
    {
      document.getElementById('print4to15').style.display="block";
      document.getElementById('printTime').style.display="none";
      setTimeout("hidden()",4000);
   }
  }
}

function openwin(){
  //window.open("settingpage.php","newwindow","height=180, width=175, toolbar=no,menubar=no, scrollbars=no, resizable=no, location=no, status=no")
  document.getElementById('dlgTest').style.display="block";
}
function openwin2(){
  //window.open("settingpage.php","newwindow","height=180, width=175, toolbar=no,menubar=no, scrollbars=no, resizable=no, location=no, status=no")
  document.getElementById('dlgTest2').style.display="block";
}

function changeStyle(){
  var fontSize = document.getElementById('fontsizecd').value;
  //alert(fontSize);
  var fontColor = document.getElementById('fontcolorcd').value;
  var backColor = document.getElementById('backcolorcd').value;
  //alert(backColor);
  document.getElementById('divContent').style.color=fontColor;
  document.getElementById('divContent').style.background=backColor;
   document.getElementById('divContent').style.fontSize=fontSize;
  // alert(fontsize);
  document.getElementById('dlgTest').style.display="none";
}
function changeStyle2(){
  var fontSize = document.getElementById('fontsizecd2').value;
  //alert(fontSize);
  var fontColor = document.getElementById('fontcolorcd2').value;
  var backColor = document.getElementById('backcolorcd2').value;
  //alert(backColor);
  document.getElementById('divContent2').style.color=fontColor;
  document.getElementById('divContent2').style.background=backColor;
   document.getElementById('divContent2').style.fontSize=fontSize;
  // alert(fontsize);
  document.getElementById('dlgTest2').style.display="none";
}

var Dragging=function(validateHandler){ //参数为验证点击区域是否为可移动区域，如果是返回欲移动元素，负责返回null
                var draggingObj=null; //dragging Dialog
                var diffX=0;
                var diffY=0;
                
                function mouseHandler(e){
                    switch(e.type){
                        case 'mousedown':
                            draggingObj=validateHandler(e);//验证是否为可点击移动区域
                            if(draggingObj!=null){
                                diffX=e.clientX-draggingObj.offsetLeft;
                                diffY=e.clientY-draggingObj.offsetTop;
                            }
                            break;
                        
                        case 'mousemove':
                            if(draggingObj){
                                draggingObj.style.left=(e.clientX-diffX)+'px';
                                draggingObj.style.top=(e.clientY-diffY)+'px';
                            }
                            break;
                        
                        case 'mouseup':
                            draggingObj =null;
                            diffX=0;
                            diffY=0;
                            break;
                    }
                };
                
                return {
                    enable:function(){
                        document.addEventListener('mousedown',mouseHandler);
                        document.addEventListener('mousemove',mouseHandler);
                        document.addEventListener('mouseup',mouseHandler);
                    },
                    disable:function(){
                        document.removeEventListener('mousedown',mouseHandler);
                        document.removeEventListener('mousemove',mouseHandler);
                        document.removeEventListener('mouseup',mouseHandler);
                    }
                }
            }

            function getDraggingDialog(e){
                var target=e.target;
                while(target && target.className.indexOf('dialog-title')==-1){
                    target=target.offsetParent;
                }
                if(target!=null){
                    return target.offsetParent;
                }else{
                    return null;
                }
            }
            
            Dragging(getDraggingDialog).enable();
function altRows(id){
    if(document.getElementsByTagName){  
        
        var table = document.getElementById(id);  
        var rows = table.getElementsByTagName("tr"); 
         
        for(i = 0; i < rows.length; i++){          
            if(i % 2 == 0){
                rows[i].className = "evenrowcolor";
            }else{
                rows[i].className = "oddrowcolor";
            }      
        }
    }
	option();
}

